import { PrismaService } from '@/database/prisma/prisma.service'
import { Author } from '../graphql/models/author'
import {
  IAuthorsRepository,
  SearchParams,
  SearchResult,
} from '../interfaces/authors.repository'
import { ICreatreAuthor } from '../interfaces/create-author'
import { NotFoundError } from '@/shared/errors/not-found-error'

export class AuthorsRepository implements IAuthorsRepository {
  sortableFields: string[] = ['name', 'email', 'createdAt']

  constructor(private readonly prisma: PrismaService) {}

  async create(data: ICreatreAuthor): Promise<Author> {
    const author = await this.prisma.author.create({
      data,
    })

    return author
  }

  async update(author: Author): Promise<Author> {
    await this.get(author.id)
    const updated = await this.prisma.author.update({
      where: { id: author.id },
      data: author,
    })

    return updated
  }

  async delete(id: string): Promise<Author> {
    const author = await this.get(id)
    await this.prisma.author.delete({
      where: { id },
    })

    return author
  }

  async findById(id: string): Promise<Author> {
    return await this.get(id)
  }

  async findByEmail(email: string): Promise<Author | null> {
    return this.prisma.author.findUnique({
      where: { email },
    })
  }

  async search(search: SearchParams): Promise<SearchResult> {
    const { page = 1, perPage = 15, filter, sort, sortDir } = search
    const sortable = this.sortableFields?.includes(sort!) || false
    const orderByField = sortable ? sort : 'createdAt'
    const orderByDir = sortable ? sortDir : 'desc'

    const count = await this.prisma.author.count({
      ...(filter && {
        where: {
          OR: [
            { name: { contains: filter, mode: 'insensitive' } },
            { email: { contains: filter, mode: 'insensitive' } },
          ],
        },
      }),
    })

    const authors = await this.prisma.author.findMany({
      ...(filter && {
        where: {
          OR: [
            { name: { contains: filter, mode: 'insensitive' } },
            { email: { contains: filter, mode: 'insensitive' } },
          ],
        },
      }),
      orderBy: {
        [orderByField!]: orderByDir,
      },
      skip: page > 0 ? (page - 1) * perPage : 1,
      take: perPage > 0 ? perPage : 15,
    })

    return {
      rows: authors,
      currentPage: page,
      perPage,
      lastPage: Math.ceil(count / perPage),
      total: count,
    }
  }

  async get(id: string): Promise<Author> {
    const author = await this.prisma.author.findUnique({
      where: { id },
    })

    if (!author) {
      throw new NotFoundError(`Author not found using ID ${id}`)
    }

    return author
  }
}
