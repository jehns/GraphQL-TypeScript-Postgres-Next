# starter for:
  - React
  - TypeScript
  - GraphQL
  - Apollo
  - Node.js
  - PostgreSQL
  - MikroORM
  - Redis
  - Next.js
  - TypeGraphQL
  - Chakra


# Mikro-ORM:
  ## migration cli
    - npx mikro-orm migration:create   # Create new migration with current schema diff
    - npx mikro-orm migration:up       # Migrate up to the latest version
    - npx mikro-orm migration:down     # Migrate one step down
    - npx mikro-orm migration:list     # List all executed migrations
    - npx mikro-orm migration:pending  # List all pending migrations

# GraphQL
  ## Type-GraphQL -> Mikro-ORM
    - entities are not graphql types. type-graphql can turn entitiies into types with the decorators: @ObjectType() and @Field().
    - @Field() can be omitted or commented out to hide a db column fro mthe graphql schema.

# Type-GraphQL
  ## Notes
    - uses capitalized types (as opposed to lowercase in TypeScript)
