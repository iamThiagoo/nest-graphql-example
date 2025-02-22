import { BadRequestError } from '@/shared/errors/bad-request-error'
import { Author } from '../graphql/models/author'
import { ConflictError } from '@/shared/errors/conflict-error'
import { AuthorsRepository } from '../repositories/authors.repository'
import { AuthorOutput } from '../dto/author.output'

export namespace UpdateAuthorUsecase {
  export type Input = Partial<Author>

  export type Output = AuthorOutput

  export class Usecase {
    constructor(private authorsRepository: AuthorsRepository) {}

    async execute(input: Input): Promise<Output> {
      if (!input?.id) {
        throw new BadRequestError('Id not provided')
      }
      const author = await this.authorsRepository.findById(input.id)

      if (input.email) {
        const emailExists = await this.authorsRepository.findByEmail(
          input.email,
        )
        if (emailExists && emailExists.id !== input.id) {
          throw new ConflictError('Email address used by other author')
        }
        author.email = input.email
      }

      if (input.name) {
        author.name = input.name
      }

      return author
    }
  }
}
