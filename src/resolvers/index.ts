import { userResolvers } from "./userResolvers";
import { IResolverMap } from "./types/resolvertypes";

export const resolvers: IResolverMap = {
    Query: {
        ...userResolvers.Query,
    },
    Mutation: {
        ...userResolvers.Mutation,
    }
}