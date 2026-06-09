import { baseApi } from "@/redux/api/base-api"

export interface DynamicContent {
  id: string
  key: string
  group: string
  type: string
  name: string
  description?: string
  value: any
  imageId?: string
  image?: string
  url?: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export const dynamicContentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDynamicContentsMap: builder.query<Record<string, DynamicContent>, string | void>({
      query: (group) => {
        return {
          url: `/dynamic-content/map${group ? `?group=${group}` : ""}`,
        }
      },
      providesTags: ["DynamicContent"],
      transformResponse: (response: any) => response?.data || response,
    }),
    upsertDynamicContent: builder.mutation<DynamicContent, Partial<DynamicContent>>({
      query: (data) => ({
        url: "/dynamic-content/upsert",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["DynamicContent"],
    }),
  }),
})

export const {
  useGetDynamicContentsMapQuery,
  useUpsertDynamicContentMutation,
} = dynamicContentApi
