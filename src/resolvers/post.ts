import { MyContext } from '../types';
import { Resolver, Query, Ctx, Arg, Int, Mutation } from "type-graphql";
import { Post } from "../entities/Post";


// type-graphql can infer type through typescript type. both types shown here for clarity. May need to add both in some circumstances.
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

  @Mutation(() => Post)
  async createPost(
    @Arg('title', () => String) title: string,
    @Ctx() ctx: MyContext
    ): Promise<Post> {
      const post = ctx.em.create(Post, {title})
      await ctx.em.persistAndFlush(post)
      return post
  }

  @Mutation(() => Post, {nullable: true})
  async updatePost(
    @Arg('id', () => Int) id: number,
    @Arg("title", () => String, {nullable: true}) title: string, // to create with a nullable field => { nullable: true }
    @Ctx() ctx: MyContext
    ): Promise<Post | null> {
      const post = await ctx.em.findOne(Post, {id})
      if (!post) {
        return null
      }
      if (typeof title !== 'undefined') {
        post.title = title
        await ctx.em.persistAndFlush(post)
      }
      return post
  }

  @Mutation(() => Boolean)
  async deletePost(
    @Arg('id', () => Int) id: number,
    @Ctx() ctx: MyContext
    ): Promise<boolean> {
      try {
        // need to refactor -- does not error if post does not exist
        await ctx.em.nativeDelete(Post, { id });
        return true;
      } catch (error) {
        return false
      }
  }
}
