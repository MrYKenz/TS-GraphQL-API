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
- nodemailer: to email users confirmation message with validation link made using key stored in redis
- express-session: to create user sessions and cookies for login
- connect-redis: to store session data from express-session
- axios: is installed for testing but not as a dev dependancy in case it's needed for full app

### :memo: Tasks:
- ~~using *import * as* to avoid JS module no default import error~~ (or set tsconfig "allowSyntheticDefaultImports": true)
- ~~include test folder in tsconfig file~~
- optional: use tslint-config-prettier and tslint config file
- Start redis server up before starting app in (linux or WSL) with:
```
    redis-server
```
- when typedefs schema is changed run gql2ts script with: 
```
    npm create-types
```
- run jest test scripts (npx jest --verbose) with:
```
    npm test
```
- if tests have been run already clear the users table in the database so that the test users are not present in the table (causing the username is unique validation to trigger) by running the following command in the SQL Shell or in psql (with user postgres found in the ormconfig file):
```sql
    \c database
    delete from users;
``` 
- ~~backend validation for register and login in utils~~
- authentication middleware
- tests for validation of register and login routes / resolvers
- front end to-do list:
    - validate email and password for register & login on frontend
    - handle error stings returned from resolvers e.g. user already exists
