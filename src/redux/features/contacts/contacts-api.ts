import { baseApi } from "../../api/base-api"

export const contactsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getContacts: builder.query<any, Record<string, any>>({
      query: (params) => ({
        url: "/contact",
        method: "GET",
        params,
      }),
      providesTags: ["Contacts"],
    }),
    updateContactStatus: builder.mutation<any, { id: string; status: string }>({
      query: ({ id, status }) => ({
        url: `/contact/${id}`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: ["Contacts"],
    }),
    deleteContact: builder.mutation<any, string>({
      query: (id) => ({
        url: `/contact/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Contacts"],
    }),
  }),
})

export const { 
  useGetContactsQuery, 
  useUpdateContactStatusMutation,
  useDeleteContactMutation
} = contactsApi
