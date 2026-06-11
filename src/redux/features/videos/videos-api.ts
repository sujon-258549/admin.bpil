import { baseApi } from "@/redux/api/base-api"
import type { ApiResponse, PaginatedResponse } from "@/types/common"
import { toPaginated } from "@/redux/api/response-helpers"
import type { Video, VideoListParams, VideoPayload } from "./types"

export const videosApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    listVideos: builder.query<
      PaginatedResponse<Video>,
      VideoListParams | void
    >({
      query: (params) => ({ url: "/video", params: (params as Record<string, any>) ?? undefined }),
      transformResponse: (raw: any) => toPaginated<Video>(raw),
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({
                type: "Video" as const,
                id,
              })),
              { type: "Video", id: "LIST" },
            ]
          : [{ type: "Video", id: "LIST" }],
    }),

    getVideo: builder.query<ApiResponse<Video>, string>({
      query: (id) => `/video/${id}`,
      providesTags: (_r, _e, id) => [{ type: "Video", id }],
    }),

    createVideo: builder.mutation<ApiResponse<Video>, VideoPayload>({
      query: (body) => ({ url: "/video", method: "POST", body }),
      invalidatesTags: [{ type: "Video", id: "LIST" }],
    }),

    updateVideo: builder.mutation<
      ApiResponse<Video>,
      { id: string; data: Partial<VideoPayload> }
    >({
      query: ({ id, data }) => ({
        url: `/video/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (_r, _e, { id }) => [
        { type: "Video", id },
        { type: "Video", id: "LIST" },
      ],
    }),

    deleteVideo: builder.mutation<ApiResponse<unknown>, string>({
      query: (id) => ({ url: `/video/${id}`, method: "DELETE" }),
      invalidatesTags: [{ type: "Video", id: "LIST" }],
    }),

    toggleVideoStatus: builder.mutation<ApiResponse<Video>, string>({
      query: (id) => ({ url: `/video/${id}/status`, method: "PATCH" }),
      invalidatesTags: (_r, _e, id) => [
        { type: "Video", id },
        { type: "Video", id: "LIST" },
      ],
    }),
  }),
  overrideExisting: false,
})

export const {
  useListVideosQuery,
  useGetVideoQuery,
  useCreateVideoMutation,
  useUpdateVideoMutation,
  useDeleteVideoMutation,
  useToggleVideoStatusMutation,
} = videosApi
