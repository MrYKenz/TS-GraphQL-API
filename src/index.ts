import "reflect-metadata";
import { GraphQLServer } from 'graphql-yoga';
import { importSchema } from 'graphql-import';
import { createConnection } from 'typeorm';

import { resolvers } from "./resolvers"

const typeDefs = importSchema(`${__dirname}/typedefs.graphql`);

const server = new GraphQLServer({ typeDefs, resolvers });

// start server after connected to PSQL
createConnection().then(()=> {
    console.log("Connected to DB");
    server.start(() => console.log('Server running on localhost:4000'));
});
