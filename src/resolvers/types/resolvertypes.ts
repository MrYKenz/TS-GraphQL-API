import { Redis } from "ioredis";

export interface Session {
    userId?: string;
}

export type IResolver = (
    parent: any, 
    args: any, 
    context: { 
        redis: Redis;
        url: string;
        session: Session;
    }, 
    info: any
) => any;

export type GraphQLMiddleware = (
    resolver: IResolver,
    parent: any, 
    args: any, 
    context: { 
        redis: Redis;
        url: string;
        session: Session;
    }, 
    info: any
) => any;

export interface IResolverMap {
    [key: string]: {
        [key: string]: IResolver;
    };
}
