import { userResolvers } from "./userResolvers";
import { IResolver } from "./types/resolvertypes";

export const resolvers: IResolver = {
    Query: {
        ...userResolvers.Query,
    },
    Mutation: {
        ...userResolvers.Mutation,
    }
}