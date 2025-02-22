import { PrismaService } from '@/database/prisma/prisma.service'
import { Module } from '@nestjs/common'
import { PostsRepository } from './repositories/posts.repository'
import { AuthorsRepository } from '@/authors/repositories/authors.repository'
import { CreatePostUseCase } from './use-cases/create-post.usecase'
import { GetPostUseCase } from './use-cases/get-post.usecase'
import { PublishPostUseCase } from './use-cases/publish-post.usecase'
import { UnpublishPostUseCase } from './use-cases/unpublish.usecase'
import { GetAuthorUseCase } from '@/authors/use-cases/get-author.usecase'
import { PostsResolver } from './graphql/resolvers/posts.resolver'
import { DatabaseModule } from '@/database/database.module'

@Module({
  imports: [DatabaseModule],
  providers: [
    PostsResolver,
    {
      provide: 'PrismaService',
      useClass: PrismaService,
    },
    {
      provide: 'PostsRepository',
      useFactory: (prismaService: PrismaService) => {
        return new PostsRepository(prismaService)
      },
      inject: ['PrismaService'],
    },
    {
      provide: 'AuthorsRepository',
      useFactory: (prismaService: PrismaService) => {
        return new AuthorsRepository(prismaService)
      },
      inject: ['PrismaService'],
    },
    {
      provide: CreatePostUseCase.UseCase,
      useFactory: (
        postsRepository: PostsRepository,
        authorsRepository: AuthorsRepository,
      ) => {
        return new CreatePostUseCase.UseCase(postsRepository, authorsRepository)
      },
      inject: ['PostsRepository', 'AuthorsRepository'],
    },
    {
      provide: GetPostUseCase.UseCase,
      useFactory: (postsRepository: PostsRepository) => {
        return new GetPostUseCase.UseCase(postsRepository)
      },
      inject: ['PostsRepository'],
    },
    {
      provide: PublishPostUseCase.UseCase,
      useFactory: (postsRepository: PostsRepository) => {
        return new PublishPostUseCase.UseCase(postsRepository)
      },
      inject: ['PostsRepository'],
    },
    {
      provide: UnpublishPostUseCase.UseCase,
      useFactory: (postsRepository: PostsRepository) => {
        return new UnpublishPostUseCase.UseCase(postsRepository)
      },
      inject: ['PostsRepository'],
    },
    {
      provide: GetAuthorUseCase.Usecase,
      useFactory: (authorsRepository: AuthorsRepository) => {
        return new GetAuthorUseCase.Usecase(authorsRepository)
      },
      inject: ['AuthorsRepository'],
    },
  ],
})
export class PostsModule {}
