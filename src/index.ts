import { MikroORM } from "@mikro-orm/core"

import { __prod__ } from './constants';
import microConfig from './mikro-orm.config'
// import { Post } from './entities/Post';

const main = async () => {
  try {
    const orm = await MikroORM.init(microConfig);
    orm.getMigrator().up();
    // const post = orm.em.create(Post, {title: 'first post'});
    // await orm.em.persistAndFlush(post);

    // const posts = await orm.em.find(Post, {})
    // console.log(posts)
  } catch (error) {
    console.log("Error setting up database: ", error)
  }
}

main()
