export interface Blog {
  id: string
  title: string
  slug: string
  content?: string
  description?: string
  excerpt?: string
  coverImage?: string
  tags: string[]
  category?: string[]
  authorId?: string
  authorName?: string
  authorImage?: string
  isPublished: boolean
  publishedAt?: string
  createdAt: string
  updatedAt: string
}

export interface BlogPayload {
  title: string
  content?: string
  description?: string
  excerpt?: string
  coverImage?: string
  tags?: string[]
  category?: string[]
  isPublished?: boolean
}

export interface BlogListParams {
  page?: number
  limit?: number
  searchTerm?: string
}
