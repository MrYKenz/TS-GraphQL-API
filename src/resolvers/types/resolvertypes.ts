import { Redis } from "ioredis";

export interface IResolver {
    [key: string]: {
        [key: string]: (
            parent: any, 
            args: any, 
            context: { redis: Redis, url: string }, 
            info: any
        ) => any;
    };
}