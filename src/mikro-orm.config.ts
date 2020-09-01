import path from "path";

import { Post } from "./entities/Post";
import { __prod__ } from "./constants";
import { MikroORM } from "@mikro-orm/core";

export default {
  migrations: {
    path: path.join(__dirname, "./migrations"), // path to the folder with migrations
    pattern: /^[\w-]+\d+\.[tj]s$/,
  },
  entities: [Post],
  dbName: 'lireddit',
  // user: 'stuartjehn',
  // password: '12345',
  debug: !__prod__,
  type: 'postgresql',
} as Parameters<typeof MikroORM.init>[0];
