import * as bcrypt from "bcryptjs";

import { IResolver } from "./types/resolvertypes";
import { User } from "../entity/User";

export const userResolvers: IResolver = {
    Query: {
      hello: (_, { name }: GQL.IHelloOnQueryArguments) => `Hello ${name || 'World'}`,
    },
    Mutation: {
      register: async (_, { email, password }: GQL.IRegisterOnMutationArguments) => {
        const hashedPassword = await bcrypt.hash(password, 10);
        const userCreated = User.create({
          email,
          password: hashedPassword
        });
        // result of saved User object once stored in the DB
        const res: User = await userCreated.save();
        
        return `user created ${res.id} ${res.email}`;
      },
    }
  }