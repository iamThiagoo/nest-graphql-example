import { Test, TestingModule } from "@nestjs/testing"
import { PrismaClient } from "@prisma/client"
import { execSync } from "child_process"
import { AuthorsRepository } from "@/authors/repositories/authors.repository"
import { AuthorDataBuilder } from "@/authors/helpers/author-data-builder"
import { GetAuthorUseCase } from "../get-author"
import { NotFoundError } from "@/shared/errors/not-found-error"

describe("GetAuthorUseCase Integration Test", () => {
  let module: TestingModule
  let repository: AuthorsRepository
  let usecase: GetAuthorUseCase.Usecase
  const prisma = new PrismaClient()

  jest.setTimeout(60000);

  beforeAll(async () => {
    execSync("npm run prisma:migrate-test")
    await prisma.$connect()
    module = await Test.createTestingModule({}).compile()
    repository = new AuthorsRepository(prisma as any)
    usecase = new GetAuthorUseCase.Usecase(repository)
  })

  beforeEach(async () => {
    await prisma.author.deleteMany()
  })

  afterAll(async () => {
    await module.close()
  })

  test('should throws an error when the id is not found', async () => {
    await expect(() =>
      usecase.execute({ id: '796c5a25-1d3b-4228-9a75-06f416c6e218' }),
    ).rejects.toBeInstanceOf(NotFoundError)
  })

  test('should be able to get author by id', async () => {
    const data = AuthorDataBuilder({})
    const author = await prisma.author.create({ data })
    const result = await usecase.execute({ id: author.id })
    expect(result).toStrictEqual(author)
  })
})
