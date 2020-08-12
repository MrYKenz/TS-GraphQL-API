import * as bcrypt from "bcryptjs";

import { IResolverMap } from "./types/resolvertypes";
import { User } from "../entity/User";
import { confirmEmailLink } from "../utils/approvalLink";
import { sendEmail } from "../utils/sendEmail";
import { validateRegister, validateLogin } from "../utils/validation";

export const userResolvers: IResolverMap = {
    Query: {
      authStatus: async (_, __, {session}) => {
          try {
            const user = await User.findOne({ where: { id: session.userId }});
            if (user) return `Hello ${user.email}!`;
            else return `You are not logged in`;
          } catch (err) {
              return err + " - error finding user";
          }
        }
    },

    Mutation: {
      register: async (_, 
        { email, password }: GQL.IRegisterOnMutationArguments,
        { redis, url }
        ) => {
          const validationFailed = validateRegister(email, password);
          if (validationFailed) throw new Error(validationFailed);

          // check if user already exists with same email
          const userExists = await User.findOne({ 
            where: { email },
            select: ["id"] // SQL search optimisation
          });
          if (userExists) return `User already exists ${userExists.email}`

          // create user obj and store in DB
          const userCreated = User.create({ email, password });
          const newUser: User = await userCreated.save();

          // verify user email with confirmation email
          const link = await confirmEmailLink(url, newUser.id, redis);
          const confirmEmail = await sendEmail(newUser.email, link);
          console.log(link, confirmEmail);
          return `User created ${newUser.id} ${newUser.email}`;
      },

      login: async (_, 
        { email, password }: GQL.ILoginOnMutationArguments,
        { session }
        ) => {
          const validationFailed = validateLogin(email, password);
          if (validationFailed) throw new Error(validationFailed);

          const user = await User.findOne({ 
            where: { email }
          });

          if (!user) return `User ${email} does not exist!`; 
          const checkPassword = await bcrypt.compare(password, user.password);
          if (!checkPassword) return "Password incorrect!";
          if (!user.approved) return `Email ${email} not verified, check your inbox!`;
          
          session.userId = user.id;

          return `Login Successful!`
        }
    }
  }