import { Test, TestingModule } from '@nestjs/testing'
import { PrismaClient } from '@prisma/client'
import { execSync } from 'node:child_process'
import { NotFoundError } from '@/shared/errors/not-found-error'
import { AuthorsRepository } from '@/authors/repositories/authors.repository'
import { DeleteAuthorUseCase } from '../delete-author.usecase'
import { AuthorDataBuilder } from '@/authors/helpers/author-data-builder'

describe('DeleteAuthorUseCase Integration Tests', () => {
  let module: TestingModule
  let repository: AuthorsRepository
  let usecase: DeleteAuthorUseCase.Usecase
  const prisma = new PrismaClient()

  jest.setTimeout(60000);

  beforeAll(async () => {
    execSync('npm run prisma:migrate-test')
    await prisma.$connect()
    module = await Test.createTestingModule({}).compile()
    repository = new AuthorsRepository(prisma as any)
    usecase = new DeleteAuthorUseCase.Usecase(repository)
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

  test('should delete a author', async () => {
    const data = AuthorDataBuilder({})
    const author = await prisma.author.create({ data })

    const result = await usecase.execute({ id: author.id })
    expect(result).toStrictEqual(author)

    const authors = await prisma.author.findMany()
    expect(authors).toHaveLength(0)
  })
})
