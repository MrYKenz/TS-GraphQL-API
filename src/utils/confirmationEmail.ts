import { v4 } from "uuid";
import { Redis } from "ioredis";

export const confirmEmailLink = async (
    url: string, 
    userID: string,
    redis: Redis
    ) => {
        // unique redis key to store the userID
        const key = v4();
        // expire after 24 hrs by mult 60 secs
        await redis.set(key, userID, "ex", 60*60*24);
        return `${url}/verification/${key}`;
    };