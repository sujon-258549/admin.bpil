import { baseApi } from "@/redux/api/base-api"
import type { ApiResponse, PaginatedResponse } from "@/types/common"
import { toPaginated } from "@/redux/api/response-helpers"
import type { Blog, BlogListParams, BlogPayload } from "./types"

export const blogsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    listBlogs: builder.query<PaginatedResponse<Blog>, BlogListParams | void>({
      query: (params) => ({ url: "/blog", params: params ? (params as Record<string, any>) : undefined }),
      transformResponse: (raw: any) => toPaginated<Blog>(raw),
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({
                type: "Blog" as const,
                id,
              })),
              { type: "Blog", id: "LIST" },
            ]
          : [{ type: "Blog", id: "LIST" }],
    }),

    getBlog: builder.query<ApiResponse<Blog>, string>({
      query: (id) => `/blog/${id}`,
      providesTags: (_r, _e, id) => [{ type: "Blog", id }],
    }),

    createBlog: builder.mutation<ApiResponse<Blog>, BlogPayload>({
      query: (body) => ({ url: "/blog", method: "POST", body }),
      invalidatesTags: [{ type: "Blog", id: "LIST" }],
    }),

    updateBlog: builder.mutation<
      ApiResponse<Blog>,
      { id: string; data: Partial<BlogPayload> }
    >({
      query: ({ id, data }) => ({
        url: `/blog/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (_r, _e, { id }) => [
        { type: "Blog", id },
        { type: "Blog", id: "LIST" },
      ],
    }),

    deleteBlog: builder.mutation<ApiResponse<unknown>, string>({
      query: (id) => ({ url: `/blog/${id}`, method: "DELETE" }),
      invalidatesTags: [{ type: "Blog", id: "LIST" }],
    }),

    toggleBlogStatus: builder.mutation<ApiResponse<Blog>, string>({
      query: (id) => ({ url: `/blog/${id}/status`, method: "PATCH" }),
      invalidatesTags: (_r, _e, id) => [
        { type: "Blog", id },
        { type: "Blog", id: "LIST" },
      ],
    }),
  }),
  overrideExisting: false,
})

export const {
  useListBlogsQuery,
  useGetBlogQuery,
  useCreateBlogMutation,
  useUpdateBlogMutation,
  useDeleteBlogMutation,
  useToggleBlogStatusMutation,
} = blogsApi
