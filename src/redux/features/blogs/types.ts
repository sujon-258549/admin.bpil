export interface Blog {
  id: string
  title: string
  slug: string
  content?: string
  description?: string
  excerpt?: string
  coverImageId?: string
  thumbnailId?: string
  thumbnail?: {
    id: string
    url: string
    name?: string
  }
  coverImage?: {
    id: string
    url: string
    name?: string
  }
  tags: string[]
  category?: string[]
  authorId?: string
  author?: {
    id: string
    email?: string
    mobile?: string
    profile?: {
      name?: string
    }
  }
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
  coverImageId?: string
  thumbnailId?: string
  tags?: string[]
  category?: string[]
  isPublished?: boolean
}

export interface BlogListParams {
  page?: number
  limit?: number
  searchTerm?: string
}
