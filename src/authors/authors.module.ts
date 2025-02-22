import { Module } from '@nestjs/common'
import { AuthorsResolver } from './graphql/resolvers/authors.resolver'
import { DatabaseModule } from '@/database/database.module'
import { PrismaService } from '@/database/prisma/prisma.service'
import { AuthorsRepository } from './repositories/authors.repository'
import { ListAuthorsUseCase } from './use-cases/list-author.usecase'
import { GetAuthorUseCase } from './use-cases/get-author.usecase'
import { CreateAuthorUseCase } from './use-cases/create-author.usecase'
import { UpdateAuthorUseCase } from './use-cases/update-author.usecase'
import { DeleteAuthorUseCase } from './use-cases/delete-author.usecase'

@Module({
  imports: [DatabaseModule],
  providers: [
    AuthorsResolver,
    {
      provide: 'PrismaService',
      useClass: PrismaService,
    },
    {
      provide: 'AuthorsRepository',
      useFactory: (prisma: PrismaService) => {
        return new AuthorsRepository(prisma)
      },
      inject: ['PrismaService'],
    },
    {
      provide: ListAuthorsUseCase.Usecase,
      useFactory: (authorsRepository: AuthorsRepository) => {
        return new ListAuthorsUseCase.Usecase(authorsRepository)
      },
      inject: ['AuthorsRepository'],
    },
    {
      provide: GetAuthorUseCase.Usecase,
      useFactory: (authorsRepository: AuthorsRepository) => {
        return new GetAuthorUseCase.Usecase(authorsRepository)
      },
      inject: ['AuthorsRepository'],
    },
    {
      provide: CreateAuthorUseCase.UseCase,
      useFactory: (authorsRepository: AuthorsRepository) => {
        return new CreateAuthorUseCase.UseCase(authorsRepository)
      },
      inject: ['AuthorsRepository'],
    },
    {
      provide: UpdateAuthorUseCase.Usecase,
      useFactory: (authorsRepository: AuthorsRepository) => {
        return new UpdateAuthorUseCase.Usecase(authorsRepository)
      },
      inject: ['AuthorsRepository'],
    },
    {
      provide: DeleteAuthorUseCase.Usecase,
      useFactory: (authorsRepository: AuthorsRepository) => {
        return new DeleteAuthorUseCase.Usecase(authorsRepository)
      },
      inject: ['AuthorsRepository'],
    },
  ],
})
export class AuthorsModule {}
