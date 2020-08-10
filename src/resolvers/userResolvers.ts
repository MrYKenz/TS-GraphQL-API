import * as bcrypt from "bcryptjs";

import { IResolver } from "./types/resolvertypes";
import { User } from "../entity/User";
import { confirmEmailLink } from "../utils/approvalLink";
import { sendEmail } from "../utils/sendEmail";

export const userResolvers: IResolver = {
    Query: {
      userInfo: async (_, __, {session}) => {
        try {
          const user = await User.findOne({ where: { id: session.userId }});
          if (user) return `Hello ${user}!`;
          else return `Error: no user with ${session.userId} found!`;
        } catch (err) {
            return err;
        }
      }
    },
    Mutation: {
      register: async (_, 
        { email, password }: GQL.IRegisterOnMutationArguments,
        { redis, url }
        ) => {
        // check if user already exists with same email
        const userExists = await User.findOne({ 
          where: { email },
          select: ["id"] // SQL search optimisation
        });
        if (userExists) return `User already exists ${userExists.email}`
        const userCreated = User.create({
          email,
          password,
        });
        // save user in DB and get result to return in GQL
        const newUser: User = await userCreated.save();
        // verify user email with confirmation email
        const link = await confirmEmailLink(url, newUser.id, redis);
        const confirmEmail = await sendEmail(newUser.email, link);
        console.log(link, confirmEmail)
        return `User created ${newUser.id} ${newUser.email}`;
      },
      login: async (_, 
        { email, password }: GQL.ILoginOnMutationArguments,
        { session }
        ) => {
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