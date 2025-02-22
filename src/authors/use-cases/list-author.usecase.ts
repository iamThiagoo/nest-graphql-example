import { SearchInput } from "@/shared/dto/search-input"
import { AuthorsRepository } from "../repositories/authors.repository"
import { PaginationOutput } from "@/shared/dto/pagination-output"
import { AuthorOutput } from "../dto/author.output"

export namespace ListAuthorsUseCase {
  export type Input = SearchInput

  export type Output = PaginationOutput<AuthorOutput>

  export class Usecase {
    constructor(private authorsRepository: AuthorsRepository) {}

    async execute(input: Input): Promise<Output> {
      const searchResult = await this.authorsRepository.search(input)
      return searchResult
    }
  }
}
