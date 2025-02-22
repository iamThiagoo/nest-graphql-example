export type PaginationOutput<Item = any> = {
  rows: Item[]
  total: number
  currentPage: number
  perPage: number
  lastPage: number
}
