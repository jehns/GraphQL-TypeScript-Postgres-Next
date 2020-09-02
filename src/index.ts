import "reflect-metadata";
import { MikroORM } from "@mikro-orm/core";
import express from 'express';
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { __prod__ } from './constants';
import microConfig from './mikro-orm.config';
import { HelloResolver } from "./resolvers/hello"
import { PostResolver } from "./resolvers/post";


const main = async () => {
  try {
    const orm = await MikroORM.init(microConfig);
    await orm.getMigrator().up();

    const app = express();

    const apolloServer = new ApolloServer({
      schema: await buildSchema({
        resolvers: [HelloResolver, PostResolver],
        validate: false,
      }),
      context: () => ({ em: orm.em }) // how graphql resolvers will access the orm. can also access req/res from express.
    })

    apolloServer.applyMiddleware({ app })

    app.listen(4000, () => {
      console.log(`server running on port 4000`)
    })

  } catch (error) {
    console.log("Error setting up database: ", error)
  }
}

main()
