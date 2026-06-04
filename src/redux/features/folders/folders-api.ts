import { baseApi } from "@/redux/api/base-api"
import type { ApiResponse, PaginatedResponse } from "@/types/common"
import { toPaginated } from "@/redux/api/response-helpers"
import type { Folder, FolderListParams, FolderPayload } from "./types"

export const foldersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    listFolders: builder.query<
      PaginatedResponse<Folder> & { data: { folders: Folder[]; images: any[] } },
      FolderListParams | void
    >({
      query: (params) => ({ url: "/folders", params: params as Record<string, any> ?? undefined }),
      transformResponse: (raw: any) => ({
        ...toPaginated<Folder>(raw),
        data: raw.data, // Preserve the custom nested shape { folders, images }
      }),
      providesTags: (result) =>
        result?.data?.folders
          ? [
              ...result.data.folders.map(({ id }) => ({
                type: "Folder" as const,
                id,
              })),
              { type: "Folder", id: "LIST" },
            ]
          : [{ type: "Folder", id: "LIST" }],
    }),

    getFolder: builder.query<ApiResponse<Folder>, string>({
      query: (id) => `/folders/${id}`,
      providesTags: (_r, _e, id) => [
        { type: "Folder", id },
        { type: "Folder", id: "LIST" }
      ],
    }),

    createFolder: builder.mutation<ApiResponse<Folder>, FolderPayload>({
      query: (body) => ({ url: "/folders", method: "POST", body }),
      invalidatesTags: [{ type: "Folder", id: "LIST" }],
    }),

    updateFolder: builder.mutation<
      ApiResponse<Folder>,
      { id: string; data: Partial<FolderPayload> }
    >({
      query: ({ id, data }) => ({
        url: `/folders/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (_r, _e, { id }) => [
        { type: "Folder", id },
        { type: "Folder", id: "LIST" },
      ],
    }),

    deleteFolder: builder.mutation<ApiResponse<unknown>, string>({
      query: (id) => ({ url: `/folders/${id}`, method: "DELETE" }),
      invalidatesTags: [{ type: "Folder", id: "LIST" }],
    }),
  }),
  overrideExisting: false,
})

export const {
  useListFoldersQuery,
  useGetFolderQuery,
  useCreateFolderMutation,
  useUpdateFolderMutation,
  useDeleteFolderMutation,
} = foldersApi
