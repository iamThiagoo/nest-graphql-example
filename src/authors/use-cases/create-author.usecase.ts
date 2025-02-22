import { BadRequestError } from "@/shared/errors/bad-request-error";
import { AuthorsRepository } from "../repositories/authors.repository";
import { ConflictError } from "@/shared/errors/conflict-error";
import { AuthorOutput } from "../dto/author.output";

export namespace CreateAuthorUseCase {
  type Input = {
    name: string;
    email: string;
  }

  export type Output = AuthorOutput

  export class UseCase {
    constructor(private readonly authorRepository: AuthorsRepository) {}

    async execute(input: Input) : Promise<Output> {
      const { name, email } = input;

      if (!email || !name) {
        throw new BadRequestError('Input data not provided');
      }

      const emailExists = await this.authorRepository.findByEmail(email);

      if (emailExists) {
        throw new ConflictError('Email already exists');
      }

      const author = await this.authorRepository.create(input);
      return author;
    }
  }
}

