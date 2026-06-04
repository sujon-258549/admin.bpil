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
      query: (params) => ({ url: "/folder", params: (params as Record<string, any>) ?? undefined }),
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
      query: (id) => `/folder/${id}`,
      providesTags: (_r, _e, id) => [
        { type: "Folder", id },
        { type: "Folder", id: "LIST" }
      ],
    }),

    createFolder: builder.mutation<ApiResponse<Folder>, FolderPayload>({
      query: (body) => ({ url: "/folder", method: "POST", body }),
      invalidatesTags: [{ type: "Folder", id: "LIST" }],
    }),

    updateFolder: builder.mutation<
      ApiResponse<Folder>,
      { id: string; data: Partial<FolderPayload> }
    >({
      query: ({ id, data }) => ({
        url: `/folder/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (_r, _e, { id }) => [
        { type: "Folder", id },
        { type: "Folder", id: "LIST" },
      ],
    }),

    deleteFolder: builder.mutation<ApiResponse<unknown>, string>({
      query: (id) => ({ url: `/folder/${id}`, method: "DELETE" }),
      invalidatesTags: [{ type: "Folder", id: "LIST" }],
    }),

    uploadImage: builder.mutation<ApiResponse<any>, FormData>({
      query: (body) => ({
        url: "/folder/upload",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Folder", id: "LIST" }],
    }),

    updateImage: builder.mutation<
      ApiResponse<any>,
      { id: string; data: { name: string } }
    >({
      query: ({ id, data }) => ({
        url: `/folder/image/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: [{ type: "Folder", id: "LIST" }],
    }),

    deleteImage: builder.mutation<ApiResponse<unknown>, string>({
      query: (id) => ({ url: `/folder/image/${id}`, method: "DELETE" }),
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
  useUploadImageMutation,
  useUpdateImageMutation,
  useDeleteImageMutation,
} = foldersApi
