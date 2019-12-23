# TSNode GRAPHQL API

TSNode GraphQL API made using Graphql Yoga with Apollo Server over Express and TypeORM with a PostgreSQL Database.

## Modules/Dependencies:
- TypeORM for Postgres DB with TSNode (for TypeScript)
- GraphQL Yoga - Apollo Server/Express (API Middleware)
- GraphQL Import - statically import GQL Schema files at build time (must be .graphql)
- gql2ts - to create TS types from GraphQL Schema
- uuid/v4 - version 4 to create unique IDs as strings

### Tasks:
using *import * as* to avoid JS module import error (no default import) or set tsconfig "allowSyntheticDefaultImports": true
use tslint-config-prettier?? tslint config file??