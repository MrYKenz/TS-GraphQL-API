import * as bcrypt from "bcryptjs";

import { IResolver } from "./types/resolvertypes";
import { User } from "../entity/User";
import { confirmEmailLink } from "../utils/approvalLink";
import { sendEmail } from "../utils/sendEmail";
import { validateRegister, validateLogin } from "../utils/validation";

export const userResolvers: IResolver = {
    Query: {
      authStatus: async (_, __, {session}) => {
          try {
            const user = await User.findOne({ where: { id: session.userId }});
            if (user) return `Hello ${user.email}!`;
            else return `You are not logged in`;
          } catch (err) {
              return "Error: " + err;
          }
        }
    },

    Mutation: {
      register: async (_, 
        { email, password }: GQL.IRegisterOnMutationArguments,
        { redis, url }
        ) => {
          const validationFailed = validateRegister(email, password);
          if (validationFailed) return "Error: " + validationFailed;

          // check if user already exists with same email
          const userExists = await User.findOne({ 
            where: { email },
            select: ["id"] // SQL search optimisation
          });
          if (userExists) return `Error: User already exists ${email}`

          // create user obj and store in DB
          const userCreated = User.create({ email, password });
          const newUser: User = await userCreated.save();

          // verify user email with confirmation email
          const link = await confirmEmailLink(url, newUser.id, redis);
          const confirmEmail = await sendEmail(newUser.email, link);
          console.log(link, confirmEmail);
          return `Created user ${newUser.email} Successfully`;
      },

      login: async (_, 
        { email, password }: GQL.ILoginOnMutationArguments,
        { session }
        ) => {
          const validationFailed = validateLogin(email, password);
          if (validationFailed) return "Error: " + validationFailed;

          const user = await User.findOne({ 
            where: { email }
          });

          if (!user) return `Error: User ${email} does not exist!`; 
          const checkPassword = await bcrypt.compare(password, user.password);
          if (!checkPassword) return "Error: Password incorrect!";
          if (!user.approved) return `Error: Email ${email} not verified, check your inbox!`;
          
          session.userId = user.id;

          return `Logged in ${user.email} Successfully!`
        }
    }
  }