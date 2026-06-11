export type GalleryItem = {
  id: string
  alt: string
  category: string | null
  imageId: string
  image?: {
    id: string
    url: string
    name: string
  }
  isActive: boolean
  createdAt: string
  updatedAt: string
}
