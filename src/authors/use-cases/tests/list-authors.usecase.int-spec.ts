import { AuthorsRepository } from '@/authors/repositories/authors.repository'
import { Test, TestingModule } from '@nestjs/testing'
import { PrismaClient } from '@prisma/client'
import { execSync } from 'node:child_process'
import { ListAuthorsUseCase } from '../list-author.usecase'
import { AuthorDataBuilder } from '@/authors/helpers/author-data-builder'

describe('ListAuthorsUsecase Integration Tests', () => {
  let module: TestingModule
  let repository: AuthorsRepository
  let usecase: ListAuthorsUseCase.Usecase
  const prisma = new PrismaClient()

  jest.setTimeout(60000);

  beforeAll(async () => {
    execSync("npm run prisma:migrate-test")
    await prisma.$connect()
    module = await Test.createTestingModule({}).compile()
    repository = new AuthorsRepository(prisma as any)
    usecase = new ListAuthorsUseCase.Usecase(repository)
  })

  beforeEach(async () => {
    await prisma.author.deleteMany()
  })

  afterAll(async () => {
    await module.close()
  })

  test('should only apply pagination when the parameters are null', async () => {
    const createdAt = new Date()
    const data = [] as any
    const arrange = Array(3).fill(AuthorDataBuilder({}))
    arrange.forEach((element, index) => {
      const timestamp = createdAt.getTime() + index
      data.push({
        ...element,
        email: `a${index}@a.com`,
        createdAt: new Date(timestamp),
      })
    })

    await prisma.author.createMany({ data })
    const result = await usecase.execute({})

    expect(result).toMatchObject({
      rows: data.reverse(),
      total: 3,
      currentPage: 1,
      perPage: 15,
      lastPage: 1,
    })
  })

  test('should apply pagination, filter and ordering', async () => {
    const createdAt = new Date()
    const data = [] as any
    const arrange = ['test', 'a', 'TEST', 'b', 'Test']
    arrange.forEach((element, index) => {
      const timestamp = createdAt.getTime() + index
      data.push({
        ...AuthorDataBuilder({ name: element }),
        email: `author${index}@a.com`,
        createdAt: new Date(timestamp),
      })
    })

    await prisma.author.createMany({ data })
    const result1 = await usecase.execute({
      page: 1,
      perPage: 2,
      sort: 'name',
      sortDir: 'asc',
      filter: 'TEST',
    })

    expect(result1).toMatchObject({
      rows: [data[0], data[4]],
      total: 3,
      currentPage: 1,
      perPage: 2,
      lastPage: 2,
    })

    const result2 = await usecase.execute({
      page: 2,
      perPage: 2,
      sort: 'name',
      sortDir: 'asc',
      filter: 'TEST',
    })

    expect(result2).toMatchObject({
      rows: [data[2]],
      total: 3,
      currentPage: 2,
      perPage: 2,
      lastPage: 2,
    })
  })
})
