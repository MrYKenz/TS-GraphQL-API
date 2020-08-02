# TSNode GRAPHQL API <img src="https://user-images.githubusercontent.com/841294/53402609-b97a2180-39ba-11e9-8100-812bab86357c.png" height="50" /> <img src="https://github.com/graphql/graphql-spec/blob/master/resources/GraphQL%20Logo.svg" height="50" /> <img src="https://raw.githubusercontent.com/remojansen/logo.ts/master/ts.png" height="50" />

TSNode GraphQL API made using Graphql Yoga with Apollo Server over Express and TypeORM with a PostgreSQL Database.

## :floppy_disk: Modules/Dependencies:
- TypeORM for Postgres DB with TSNode (for TypeScript)
- GraphQL Yoga: Apollo Server/Express (API Middleware)
- GraphQL Import: statically import GQL Schema files at build time (must be .graphql)
- gql2ts: to create TS types from GraphQL Schema
- uuid: uuid/v4 to create unique ids as string
- jest & ts-jest: installed as dev dependancy to run tests in "./tests/"
- grapql-request: installed as dev dependancy for testing queries and mutations against endpoint using jest
- ioredis: instead of using JWTs the prefered method to validate the user's email address was by comparing a session id (uuid) stored in redis by creating a temporary link using seperate Express Endpoint
- sparkpost: to email users confirmation message with validation link made using key stored in redis
- axios: is installed for testing but not as devDependancy incase its needed for full app

### :memo: Tasks:
- ~~using *import * as* to avoid JS module no default import error~~ (or set tsconfig "allowSyntheticDefaultImports": true)
- use tslint-config-prettier?? tslint config file??
- ~~include test folder in tsconfig file~~
- when typedefs schema changed run gql2ts script: 
```
    npm create-types
```
- clear users table in database so username is unique before testing with npm test (npx jest) run in SQL Shell (psql) with user postgres:
```sql
    \c database
    delete from users;
``` 
- validate email and password on frontend & handle error stings returned from resolvers e.g. user already exists
- Backend Validation for email and password
- Authentication using JWT:
    - add jwt.sign to register resolver and Auth Util to decode JWT from context 
    - add it to protected routes - query/mutation resolvers
    - add to server.ts GraphQLServer contextCallback request.headers.param to context return object
- Start redis server in linux with:
```bash
    redis-server
```