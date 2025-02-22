import { AuthorOutput } from "@/authors/dto/author.output"
import { AuthorsRepository } from "@/authors/repositories/authors.repository"

export namespace DeleteAuthorUsecase {
  export type Input = {
    id: string
  }

  export type Output = AuthorOutput

  export class Usecase {
    constructor(private authorsRepository: AuthorsRepository) {}

    async execute(input: Input): Promise<Output> {
      const { id } = input
      const author = await this.authorsRepository.delete(id)
      return author
    }
  }
}
