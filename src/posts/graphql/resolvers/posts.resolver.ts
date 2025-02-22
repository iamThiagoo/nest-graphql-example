import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql'
import { Post } from '../models/post'
import { Inject } from '@nestjs/common'
import { CreatePostUseCase } from '@/posts/use-cases/create-post.usecase'
import { CreatePostInput } from '../inputs/create-post.input'
import { GetAuthorUseCase } from '@/authors/use-cases/get-author.usecase'
import { GetPostUseCase } from '@/posts/use-cases/get-post.usecase'
import { PostIdArgs } from '../args/post-id.args'
import { PublishPostUseCase } from '@/posts/use-cases/publish-post.usecase'
import { UnpublishPostUseCase } from '@/posts/use-cases/unpublish.usecase'

@Resolver(() => Post)
export class PostsResolver {
  @Inject(CreatePostUseCase.UseCase)
  private createPostUseCase: CreatePostUseCase.UseCase

  @Inject(GetAuthorUseCase.Usecase)
  private getAuthorUseCase: GetAuthorUseCase.Usecase

  @Inject(GetPostUseCase.UseCase)
  private getPostUseCase: GetPostUseCase.UseCase

  @Inject(PublishPostUseCase.UseCase)
  private publishPostUseCase: PublishPostUseCase.UseCase

  @Inject(UnpublishPostUseCase.UseCase)
  private unpublishPostUseCase: UnpublishPostUseCase.UseCase

  @Query(() => Post)
  async getPostById(@Args() { id }: PostIdArgs) {
    return this.getPostUseCase.execute({ id })
  }

  @Mutation(() => Post)
  async createPost(@Args('data') data: CreatePostInput) {
    return this.createPostUseCase.execute(data)
  }

  @Mutation(() => Post)
  async publishPost(@Args() { id }: PostIdArgs) {
    return this.publishPostUseCase.execute({ id })
  }

  @Mutation(() => Post)
  async unpublishPost(@Args() { id }: PostIdArgs) {
    return this.unpublishPostUseCase.execute({ id })
  }

  @ResolveField()
  author(@Parent() post: Post) {
    return this.getAuthorUseCase.execute({ id: post.authorId })
  }
}
