import { IResolver } from "./types/resolvertypes";

export const resolvers: IResolver = {
    Query: {
      hello: (_, { name }: GQL.IHelloOnQueryArguments) => `Hello ${name || 'World'}`,
    },
    Mutation: {
      register: (_, { email, password }: GQL.IRegisterOnMutationArguments) => {email + password},
    }
  }