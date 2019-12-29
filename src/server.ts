import "reflect-metadata";
import { GraphQLServer } from 'graphql-yoga';
import { createConnection } from 'typeorm';
import { importSchema } from 'graphql-import';
import * as Redis from 'ioredis';
import "dotenv/config";

const typeDefs = importSchema(`${__dirname}/typedefs.graphql`);
import { resolvers } from "./resolvers";
import { User } from "./entity/User";
const redis = new Redis(); // connect to redis

// GQL endpoint created with yoga using contextCallback 
// to pass redis and request obj for server/host url
const server = new GraphQLServer({ typeDefs, resolvers, 
    context: ({request}) => ({ redis, 
        url: request.protocol + '://' 
        + request.get('host')})
});

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
