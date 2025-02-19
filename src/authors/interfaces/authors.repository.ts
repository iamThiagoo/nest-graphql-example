import { Author } from '../graphql/models/author'
import { ICreatreAuthor } from './create-author'

export interface SearchParams {
  page?: number
  perPage?: number
  filter?: string
  sort?: string
  sortDir?: 'asc' | 'desc'
}

export interface SearchResult {
  rows: Author[]
  currentPage: number
  perPage: number
  lastPage: number
  total: number
}

export interface IAuthorsRepository {
  sortableFields: string[]

  create(data: ICreatreAuthor): Promise<Author>
  update(author: Author): Promise<Author>
  delete(id: string): Promise<Author>
  findById(id: string): Promise<Author>
  findByEmail(email: string): Promise<Author | null>
  search(search: SearchParams): Promise<SearchResult>
  get(id: string): Promise<Author>
}
