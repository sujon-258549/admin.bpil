export interface Folder {
  id: string
  name: string
  slug: string
  parentId: string | null
  status: boolean
  zoomFolderId: number | null
  createdAt: string
  updatedAt: string
  children?: Folder[]
  images?: any[]
}

export interface FolderPayload {
  name: string
  parentId?: string | null
  status?: boolean
}

export interface FolderListParams {
  parentId?: string
  searchTerm?: string
  page?: number
  limit?: number
  sortBy?: string
  sortOrder?: "asc" | "desc"
}
