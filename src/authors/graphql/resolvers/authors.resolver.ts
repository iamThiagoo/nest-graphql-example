import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { Author } from '../models/author'
import { Inject } from '@nestjs/common'
import { ListAuthorsUseCase } from '@/authors/use-cases/list-author.usecase'
import { SearchParamsArgs } from '../args/search-params.args'
import { SearchAuthorsResult } from '../models/search-authors-result'
import { CreateAuthorUseCase } from '@/authors/use-cases/create-author.usecase'
import { CreateAuthorInput } from '../inputs/create-author.input'
import { GetAuthorUseCase } from '@/authors/use-cases/get-author.usecase'
import { AuthorIdArgs } from '../args/author-id.args'
import { UpdateAuthorInput } from '../inputs/update-author.input'
import { UpdateAuthorUseCase } from '@/authors/use-cases/update-author.usecase'
import { DeleteAuthorUseCase } from '@/authors/use-cases/delete-author.usecase'

@Resolver(() => Author)
export class AuthorsResolver {
  @Inject(ListAuthorsUseCase.Usecase)
  private listAuthorsUseCase: ListAuthorsUseCase.Usecase

  @Inject(CreateAuthorUseCase.UseCase)
  private createAuthorUseCase: CreateAuthorUseCase.UseCase

  @Inject(GetAuthorUseCase.Usecase)
  private getAuthorUseCase: GetAuthorUseCase.Usecase

  @Inject(UpdateAuthorUseCase.Usecase)
  private updateAuthorUseCase: GetAuthorUseCase.Usecase

  @Inject(DeleteAuthorUseCase.Usecase)
  private deleteAuthorUseCase: GetAuthorUseCase.Usecase

  @Query(() => SearchAuthorsResult)
  async authors(
    @Args() { page, perPage, sort, sortDir, filter }: SearchParamsArgs,
  ) {
    return this.listAuthorsUseCase.execute({
      page,
      perPage,
      sort,
      sortDir,
      filter,
    })
  }

  @Query(() => Author)
  async getAuthorById(@Args() { id }: AuthorIdArgs) {
    return this.getAuthorUseCase.execute({ id })
  }

  @Mutation(() => Author)
  async createAuthor(@Args('data') data: CreateAuthorInput) {
    return this.createAuthorUseCase.execute(data)
  }

  @Mutation(() => Author)
  async updateAuthor(
    @Args() { id }: AuthorIdArgs,
    @Args('data') data: UpdateAuthorInput,
  ) {
    return this.updateAuthorUseCase.execute({ id, ...data })
  }

  @Mutation(() => Author)
  async deleteAuthorById(@Args() { id }: AuthorIdArgs) {
    return this.deleteAuthorUseCase.execute({ id })
  }
}
