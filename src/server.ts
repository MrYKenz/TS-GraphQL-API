import "reflect-metadata";
import { GraphQLServer } from "graphql-yoga";
import { createConnection } from "typeorm";
import { importSchema } from "graphql-import";
import * as session from "express-session";
import * as Redis from "ioredis";
import * as connectRedis from "connect-redis";
import * as dotenv from "dotenv"; dotenv.config();

const RedisStore = connectRedis(session);

const typeDefs = importSchema(`${__dirname}/typedefs.graphql`);
import { resolvers } from "./resolvers";
import { User } from "./entity/User";

const redis = new Redis({port: 6379}); // connect to redis (needs port for connect-redis session store)

// GQL endpoint created with yoga using contextCallback 
// to pass redis and request obj for server/host url
const server = new GraphQLServer({ typeDefs, resolvers, 
    context: ({request}) => ({ 
        redis, 
        url: request.protocol + "://" + request.get("host"),
        session: request.session
    }),
});

// cookies for authentication using express-session
server.express.use(
    session({
        store: new RedisStore({ client: redis }),
        name: "_id",
        secret: process.env.C_KEY || "secret",
        resave: false,
        saveUninitialized: false,
        cookie: {
            httpOnly: true,
            // only work on https (port 443) in production
            secure: process.env.NODE_ENV === "production",
            maxAge: 1000 * 60 * 60 * 24 * 14 // 2 weeks
        }
    })
);

// cors - if needed?

// express endpoint for confirmEmailLink sent to user
server.express.get("/verification/:key", 
    async (req, res) => {
        const key = req.params.key;
        const userID = await redis.get(key);
        userID && await User.update({id: userID}, {approved: true});
        await redis.del(key)
        res.send("approved") // change to redirect
});

// start server after connected to PSQL
createConnection().then(()=> {
    console.log("Connected to DB");
    server.start(() => 
    console.log('Server running on localhost:4000'));
});
