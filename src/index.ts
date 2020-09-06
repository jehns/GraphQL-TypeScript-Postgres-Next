import { MyContext } from './types';
import "reflect-metadata";
import { MikroORM } from "@mikro-orm/core";
import express from 'express';
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { __prod__ } from './constants';
import microConfig from './mikro-orm.config';
import { HelloResolver } from "./resolvers/hello"
import { PostResolver } from "./resolvers/post";
import { UserResolver } from "./resolvers/user";
import redis from 'redis';
import session from 'express-session';
import connectRedis from 'connect-redis'


const main = async () => {
  try {
    const orm = await MikroORM.init(microConfig);
    await orm.getMigrator().up();

    const app = express();

    const RedisStore = connectRedis(session)
    const redisClient = redis.createClient()
    app.use(
      session({
        name: 'qid',
        store: new RedisStore({
          client: redisClient,
          disableTouch: true // for resaving and resetting TTL
         }),
        cookie: {
          maxAge: 1000 * 60 * 60 * 24 * 365 * 10, // 10 years
          httpOnly: true,
          secure: __prod__, // cookie only works in https
          sameSite: 'lax'
        },
        secret: '12345', // change to env var
        resave: false,
        saveUninitialized: false
      })
    )

    const apolloServer = new ApolloServer({
      schema: await buildSchema({
        resolvers: [HelloResolver, PostResolver, UserResolver],
        validate: false,
      }),
      context: ({req, res}): MyContext => ({ em: orm.em, req, res }) // how graphql resolvers will access the orm. can also access req/res from express.
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
