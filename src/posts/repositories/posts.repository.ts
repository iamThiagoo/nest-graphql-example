import { PrismaService } from '@/database/prisma/prisma.service'
import { Post } from '../graphql/models/post'
import { IPostsRepository } from '../interfaces/posts.interface'
import { NotFoundError } from '@/shared/errors/not-found-error'

export class PostsRepository implements IPostsRepository {

  constructor(private prismaService: PrismaService) {}

  async create(data: Omit<Post, 'id' | 'createdAt' | 'author'>): Promise<Post> {
    const post = await this.prismaService.post.create({ data })
    return post
  }

  async update(postParam: Post): Promise<Post> {
    await this.get(postParam.id)
    const post = await this.prismaService.post.update({
      data: postParam as any,
      where: {
        id: postParam.id,
      },
    })
    return post
  }

  async findById(id: string): Promise<Post> {
    return this.get(id)
  }

  async findBySlug(slug: string): Promise<Post> {
    const post = await this.prismaService.post.findUnique({
      where: { slug },
    })
    if (!post) {
      throw new NotFoundError(`Post not found using slug ${slug}`)
    }
    return post
  }

  async get(id: string): Promise<Post> {
    const post = await this.prismaService.post.findUnique({
      where: { id },
    })
    if (!post) {
      throw new NotFoundError(`Post not found using ID ${id}`)
    }
    return post
  }
}
