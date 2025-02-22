import { AuthorOutput } from '../dto/author.output'
import { AuthorsRepository } from '../repositories/authors.repository'

export namespace GetAuthorUseCase {
  export type Input = {
    id: string
  }

  export type Output = AuthorOutput

  export class Usecase {
    constructor(private authorsRepository: AuthorsRepository) {}

    async execute(input: Input): Promise<Output> {
      const { id } = input
      const author = await this.authorsRepository.findById(id)
      return author
    }
  }
}
