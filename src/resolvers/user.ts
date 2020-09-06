import { MyContext } from './../types';
import { Resolver, Mutation, Arg, InputType, Field, Ctx, ObjectType, Query } from "type-graphql";
import { User } from '../entities/User';
import argon2 from 'argon2'


@InputType()
class UsernamePasswordInput {
  @Field()
  username: string
  @Field()
  password: string
}

@ObjectType()
class FieldError {
  @Field()
  field: string
  @Field()
  message: string
}

// type for return user or error
@ObjectType()
class UserResponse {
  @Field(() => [FieldError], {nullable: true})
  errors?: FieldError[];

  @Field(() => User, {nullable: true})
  user?: User;
}


@Resolver()
export class UserResolver {
  // TODO: add UserResponse -> validation (use validation library) and errors for register.
  @Mutation(() => User)
  async register(
    @Arg('options') options: UsernamePasswordInput,
    @Ctx() ctx: MyContext
  ) {
    const hashedPassword = await argon2.hash(options.password)
    const user = ctx.em.create(User, {username: options.username, password: hashedPassword})
    await ctx.em.persistAndFlush(user)
    ctx.req.session.userId = user.id // create session
    return user
  }

  @Query(() => User, {nullable: true})
  async me(
    @Ctx() ctx: MyContext
  ) {
    // not logged in
    if (!ctx.req.session.userId) {
      return null
    }
    const user = await ctx.em.findOne(User, {id: ctx.req.session.userId})
    return user
  }


  @Mutation(() => UserResponse)
  async login(
    @Arg('options') options: UsernamePasswordInput,
    @Ctx() ctx: MyContext
  ): Promise<UserResponse> {
    const user = await ctx.em.findOne(User, {username: options.username})
    if (!user) {
      return {
        errors: [{
          field: 'username',
          message: 'could not find user.'
        }]
      }
    }
    const valid = await argon2.verify(user.password, options.password)
    if (!valid) {
      return {
        errors: [{
          field: 'password',
          message: 'Incorrect password.'
        }]
      }
    }

    ctx.req.session.userId = user.id

    return {
      user
    }
  }
}
