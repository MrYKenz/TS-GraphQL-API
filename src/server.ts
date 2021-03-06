import "reflect-metadata";
import { GraphQLServer } from "graphql-yoga";
import { createConnection } from "typeorm";
import { importSchema } from "graphql-import";
import helmet from "helmet";
import session from "express-session";
import Redis from "ioredis";
import connectRedis from "connect-redis";
import dotenv from "dotenv"; dotenv.config();

const RedisStore = connectRedis(session);

const typeDefs = importSchema(`${__dirname}/typedefs.graphql`);
import { resolvers } from "./resolvers";
import { User } from "./entity/User";
import { authMiddleware } from "./utils/authMiddleware";

const redis = new Redis({port: 6379}); // connect to redis (needs port for connect-redis session store)

const protectedRoutes = {
    Query: {
      authStatus: authMiddleware,
    },
}
// GQL endpoint created with yoga using contextCallback
const server = new GraphQLServer({ 
    typeDefs, 
    resolvers,
    middlewares: [protectedRoutes],
    context: ({request}) => ({ 
        redis, 
        url: request.protocol + "://" + request.get("host"),
        session: request.session,
        auth: request.headers.authorization
    }),
});

server.express.use(helmet());
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

const corsOptions = {
    credentials: true,
    origin: process.env.FRONT_END || "*",
  }

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
    server.start({cors: corsOptions, port: 4000}, () => 
    console.log('Server running on localhost:4000'));
});
