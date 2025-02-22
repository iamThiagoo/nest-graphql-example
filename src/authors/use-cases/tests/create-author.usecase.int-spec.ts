import { Test, TestingModule } from "@nestjs/testing"
import { PrismaClient } from "@prisma/client"
import { execSync } from "child_process"
import { AuthorDataBuilder } from "../../helpers/author-data-builder"
import { AuthorsRepository } from "../../repositories/authors.repository"
import { CreateAuthorUseCase } from "../create-author.usecase"
import { BadRequestError } from "@/shared/errors/bad-request-error"
import { ConflictError } from "@/shared/errors/conflict-error"

describe("CreateAuthorUseCase Integration Test", () => {
  let module: TestingModule
  let repository: AuthorsRepository
  let usecase: CreateAuthorUseCase.UseCase
  const prisma = new PrismaClient()

  jest.setTimeout(60000);

  beforeAll(async () => {
    execSync("npm run prisma:migrate-test")
    await prisma.$connect()
    module = await Test.createTestingModule({}).compile()
    repository = new AuthorsRepository(prisma as any)
    usecase = new CreateAuthorUseCase.UseCase(repository)
  })

  beforeEach(async () => {
    await prisma.author.deleteMany()
  })

  afterAll(async () => {
    await module.close()
  })

  test('should create a author', async () => {
    const data = AuthorDataBuilder({})
    const author = await usecase.execute(data)
    expect(author.id).toBeDefined()
    expect(author.createdAt).toBeInstanceOf(Date)
    expect(author).toMatchObject(data)
  })

  test('should not be able to create with same email twice', async () => {
    const data = AuthorDataBuilder({ email: 'a@a.com' })
    await usecase.execute(data)

    await expect(() => usecase.execute(data)).rejects.toBeInstanceOf(
      ConflictError,
    )
  })

  test('should throws error when name not provided', async () => {
    const data = AuthorDataBuilder({})
    // @ts-ignore
    data.name = null
    await expect(() => usecase.execute(data)).rejects.toBeInstanceOf(
      BadRequestError,
    )
  })

  test('should throws error when email not provided', async () => {
    const data = AuthorDataBuilder({})
    // @ts-ignore
    data.email = null
    await expect(() => usecase.execute(data)).rejects.toBeInstanceOf(
      BadRequestError,
    )
  })
})
