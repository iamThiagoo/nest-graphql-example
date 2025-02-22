import { PostOutput } from '../dto/post-output'
import { PostsRepository } from '../repositories/posts.repository'

export namespace PublishPostUseCase {
  export type Input = {
    id: string
  }

  export type Output = PostOutput

  export class UseCase {
    constructor(private postsRepository: PostsRepository) {}

    async execute(input: Input): Promise<Output> {
      const post = await this.postsRepository.findById(input.id)

      post.published = true

      const postUpdated = await this.postsRepository.update(post)
      return postUpdated as PostOutput
    }
  }
}
