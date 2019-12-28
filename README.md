# TSNode GRAPHQL API

TSNode GraphQL API made using Graphql Yoga with Apollo Server over Express and TypeORM with a PostgreSQL Database.

## Modules/Dependencies:
- TypeORM for Postgres DB with TSNode (for TypeScript)
- GraphQL Yoga: Apollo Server/Express (API Middleware)
- GraphQL Import: statically import GQL Schema files at build time (must be .graphql)
- gql2ts: to create TS types from GraphQL Schema
- uuid: uuid/v4 to create unique ids as string
- jest & ts-jest: installed as dev dependancy to run tests in "./tests/"
- grapql-request: installed as dev dependancy for testing queries and mutations against endpoint using jest
- ioredis: instead of using a JWT validate email address by comparing to a session token stored in redis and uses seperate Express Endpoint
- axios: is installed for testing but not as devDependancy incase its needed for full app

### Tasks:
- using *import * as* to avoid JS module no default import error (or set tsconfig "allowSyntheticDefaultImports": true)
- use tslint-config-prettier?? tslint config file??
- include test folder in tsconfig file?
- when typedefs schema changed run gql2ts script: 
```
    npm create-types
```
- clear users table in database so username is unique before testing with npm test (npx jest) run in psql:
```sql
    \c database
    delete from users;
``` 
- validate email and password on frontend & handle user already exists string