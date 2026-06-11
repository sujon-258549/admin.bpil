import { baseApi } from "@/redux/api/base-api"
import type { PaginatedResponse, ApiResponse } from "@/types/common"
import { toPaginated } from "@/redux/api/response-helpers"
import type { GalleryItem } from "./types"



export const galleryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getGalleries: builder.query<
      PaginatedResponse<GalleryItem>,
      { page?: number; limit?: number; searchTerm?: string } | void
    >({
      query: (params) => ({ url: "/gallery", params: (params as Record<string, any>) ?? undefined }),
      transformResponse: (raw: any) => toPaginated<GalleryItem>(raw),
      providesTags: () => [{ type: "Gallery", id: "LIST" }],
    }),

    getGalleryById: builder.query<ApiResponse<GalleryItem>, string>({
      query: (id) => ({
        url: `/gallery/${id}`,
        method: "GET",
      }),
      providesTags: (_result, _error, id) => [{ type: "Gallery", id }],
    }),

    createGallery: builder.mutation<ApiResponse<GalleryItem>, Partial<GalleryItem>>({
      query: (data) => ({
        url: "/gallery",
        method: "POST",
        body: data,
      }),
      invalidatesTags: [{ type: "Gallery", id: "LIST" }],
    }),

    updateGallery: builder.mutation<
      ApiResponse<GalleryItem>,
      { id: string; data: Partial<GalleryItem> }
    >({
      query: ({ id, data }) => ({
        url: `/gallery/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Gallery", id },
        { type: "Gallery", id: "LIST" },
      ],
    }),

    deleteGallery: builder.mutation<ApiResponse<unknown>, string>({
      query: (id) => ({
        url: `/gallery/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Gallery", id: "LIST" }],
    }),

    toggleGalleryStatus: builder.mutation<ApiResponse<GalleryItem>, string>({
      query: (id) => ({
        url: `/gallery/${id}/status`,
        method: "PATCH",
      }),
      invalidatesTags: (_result, _error, id) => [{ type: "Gallery", id }, { type: "Gallery", id: "LIST" }],
    }),
  }),
})

export const {
  useGetGalleriesQuery,
  useGetGalleryByIdQuery,
  useCreateGalleryMutation,
  useUpdateGalleryMutation,
  useDeleteGalleryMutation,
  useToggleGalleryStatusMutation,
} = galleryApi
