import { PostOutput } from '../dto/post-output'
import { BadRequestError } from '@/shared/errors/bad-request-error'
import slugify from 'slugify'
import { ConflictError } from '@/shared/errors/conflict-error'
import { PostsRepository } from '../repositories/posts.repository'
import { AuthorsRepository } from '@/authors/repositories/authors.repository'

export namespace CreatePostUseCase {
  export type Input = {
    title: string
    content: string
    authorId: string
  }

  export type Output = PostOutput

  export class UseCase {
    constructor(
      private postsRepository: PostsRepository,
      private authorsRepository: AuthorsRepository,
    ) {}

    async execute(input: Input): Promise<Output> {
      const { authorId, content, title } = input
      if (!authorId || !content || !title) {
        throw new BadRequestError('Input data not provided')
      }
      await this.authorsRepository.get(authorId)

      const slug = slugify(title, { lower: true })
      const slugExists = await this.postsRepository.findBySlug(slug)
      if (slugExists) {
        throw new ConflictError('Title used by other post')
      }

      const post = await this.postsRepository.create({
        ...input,
        published: false,
        slug,
      })

      return post as PostOutput
    }
  }
}
