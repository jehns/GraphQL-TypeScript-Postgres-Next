import { MyContext } from '../types';
import { Resolver, Query, Ctx, Arg, Int } from "type-graphql";
import { Post } from "../entities/Post";

// typescript type and type-graphql type must both be set.

@Resolver()
export class PostResolver {
  @Query(() => [Post])
  posts(@Ctx() ctx: MyContext): Promise<Post[]> {
    return ctx.em.find(Post, {});
  }

  @Query(() => Post, { nullable: true })
  post(
    @Arg('id', () => Int) id: number,
    @Ctx() ctx: MyContext
    ): Promise<Post | null> {
    return ctx.em.findOne(Post, { id });
  }

}
