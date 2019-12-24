import "reflect-metadata";
import { GraphQLServer } from 'graphql-yoga';
import { createConnection } from 'typeorm';
import { importSchema } from 'graphql-import';

const typeDefs = importSchema(`${__dirname}/typedefs.graphql`);
import { resolvers } from "./resolvers"

const server = new GraphQLServer({ typeDefs, resolvers });

// start server after connected to PSQL
createConnection().then(()=> {
    console.log("Connected to DB");
    server.start(() => console.log('Server running on localhost:4000'));
});
