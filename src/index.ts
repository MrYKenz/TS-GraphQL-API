import "reflect-metadata";
import { GraphQLServer } from 'graphql-yoga';
import { importSchema } from 'graphql-import';
import { createConnection } from 'typeorm';
import { resolvers } from "./resolvers/resolver"

const typeDefs = importSchema(`${__dirname}/typedefs.graphql`);

const server = new GraphQLServer({ typeDefs, resolvers });

createConnection().then(()=> console.log("connected to DB"));
server.start(() => console.log('Server is running on localhost:4000'));
