import { baseApi } from "../../api/base-api"

export const notificationsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getNotifications: builder.query<any, Record<string, any>>({
      query: (params) => ({
        url: "/notification",
        method: "GET",
        params,
      }),
      providesTags: ["Notifications"],
    }),
    markAllAsRead: builder.mutation<any, void>({
      query: () => ({
        url: "/notification/mark-as-read",
        method: "PATCH",
      }),
      invalidatesTags: ["Notifications"],
    }),
    markAsRead: builder.mutation<any, string>({
      query: (id) => ({
        url: `/notification/${id}`,
        method: "PATCH",
        body: { isRead: true },
      }),
      invalidatesTags: ["Notifications"],
    }),
    createNotification: builder.mutation<any, any>({
      query: (body) => ({
        url: "/notification",
        method: "POST",
        body,
      }),
      // Assuming socket will invalidate, but doing it manually too just in case
      invalidatesTags: ["Notifications"],
    }),
  }),
})

export const { 
  useGetNotificationsQuery, 
  useMarkAllAsReadMutation,
  useMarkAsReadMutation,
  useCreateNotificationMutation
} = notificationsApi
