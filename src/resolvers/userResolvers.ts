import * as bcrypt from "bcryptjs";

import { IResolver } from "./types/resolvertypes";
import { User } from "../entity/User";
import { confirmEmailLink } from "../utils/confirmationEmail";

export const userResolvers: IResolver = {
    Query: {
      hello: (_, { name }: GQL.IHelloOnQueryArguments) => `Hello ${name || 'World'}`,
    },
    Mutation: {
      register: async (_, 
        { email, password }: GQL.IRegisterOnMutationArguments,
        { redis, url }) => {
        // check if user already exists with same email
        const userExists: User | undefined = await User.findOne({ 
          where: { email },
          select: ["id"] // SQL search optimisation
        });
        if (userExists) return `user already exists ${userExists.email}`
        // create user with hashed password
        const hashedPassword = await bcrypt.hash(password, 10);
        const userCreated = User.create({
          email,
          password: hashedPassword
        });
        // save user in DB and get result to return in GQL
        const newUser: User = await userCreated.save();
        // verify user email with confirmationEmail
        const link = await confirmEmailLink(url, newUser.id, redis);
        
        return `user created ${newUser.id} ${newUser.email}`;
      },
    }
  }