export interface Video {
  id: string;
  title: string;
  category?: string;
  duration?: string;
  posterId?: string;
  posterAlt?: string;
  youtubeId: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  poster?: {
    id: string;
    url: string;
  };
}

export interface VideoListParams {
  page?: number;
  limit?: number;
  searchTerm?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  category?: string;
}

export interface VideoPayload {
  title: string;
  category?: string;
  duration?: string;
  posterId?: string;
  posterAlt?: string;
  youtubeId: string;
  isActive?: boolean;
}
