import { Test, TestingModule } from '@nestjs/testing'
import { PrismaClient } from '@prisma/client'
import { execSync } from 'node:child_process'
import { BadRequestError } from '@/shared/errors/bad-request-error'
import { ConflictError } from '@/shared/errors/conflict-error'
import { AuthorsRepository } from '@/authors/repositories/authors.repository'
import { UpdateAuthorUsecase } from '../update-author.usecase'
import { AuthorDataBuilder } from '@/authors/helpers/author-data-builder'

describe('UpdateAuthorUsecase Integration Tests', () => {
  let module: TestingModule
  let repository: AuthorsRepository
  let usecase: UpdateAuthorUsecase.Usecase
  const prisma = new PrismaClient()

  jest.setTimeout(60000);

  beforeAll(async () => {
    execSync('npm run prisma:migrate-test')
    await prisma.$connect()
    module = await Test.createTestingModule({}).compile()
    repository = new AuthorsRepository(prisma as any)
    usecase = new UpdateAuthorUsecase.Usecase(repository)
  })

  beforeEach(async () => {
    await prisma.author.deleteMany()
  })

  afterAll(async () => {
    await module.close()
  })

  test('should throws an error when the id is not provided', async () => {
    const data: any = {
      id: null,
    }
    await expect(() => usecase.execute(data)).rejects.toBeInstanceOf(
      BadRequestError,
    )
  })

  test('should throws an error when provided email is duplicated', async () => {
    const data = AuthorDataBuilder({ email: 'a@a.com' })
    await prisma.author.create({ data })
    const secondAuthor = await prisma.author.create({
      data: AuthorDataBuilder({}),
    })

    secondAuthor.email = 'a@a.com'
    await expect(() => usecase.execute(secondAuthor)).rejects.toBeInstanceOf(
      ConflictError,
    )
  })

  test('should be able to update author', async () => {
    const data = AuthorDataBuilder({})
    const author = await prisma.author.create({ data })

    const result = await usecase.execute({
      ...author,
      name: 'Name updated',
      email: 'a@a.com',
    })
    expect(result.name).toEqual('Name updated')
    expect(result.email).toEqual('a@a.com')
  })
})
