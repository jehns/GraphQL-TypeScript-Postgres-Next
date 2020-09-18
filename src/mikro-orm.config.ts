import path from "path";

import { __prod__ } from "./constants";
import { MikroORM } from "@mikro-orm/core";
import { Post } from "./entities/Post";
import { User } from "./entities/User";


export default {
  migrations: {
    path: path.join(__dirname, "./migrations"), // path to the folder with migrations
    pattern: /^[\w-]+\d+\.[tj]s$/,
  },
  entities: [Post, User],
  dbName: 'lireddit',
  // user: 'stuartjehn',
  // password: '12345',
  debug: !__prod__,
  type: 'postgresql',
} as Parameters<typeof MikroORM.init>[0];
