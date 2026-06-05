import { baseApi } from "@/redux/api/base-api"
import { normalizeUser } from "@/lib/normalize-user"
import { toPaginated } from "@/redux/api/response-helpers"
import type { ApiResponse, PaginatedResponse } from "@/types/common"
import type { User } from "@/types/user"
import type {
  ChangePasswordPayload,
  CreateEmployeePayload,
  EmployeeRow,
  ListUsersParams,
  UpdateUserPayload,
  VerifyOtpPayload,
} from "./types"

// Flatten the nested user-with-relations payload into the row shape the
// employee list table renders.
const flattenEmployee = (raw: any): EmployeeRow => {
  const u = normalizeUser(raw)
  return {
    ...u,
    // Always try to get the URL from the profilePhoto object
    avatar:
      (raw?.profile?.profilePhoto as { url?: string })?.url ??
      (typeof raw?.profile?.profilePhoto === "string" ? raw?.profile?.profilePhoto : undefined) ??
      raw?.profile?.photo ??
      u.avatar,
    mobile: raw?.mobile ?? null,
    isActive: raw?.isActive ?? true,
    isBlocked: raw?.isBlocked ?? false,
    isDeleted: raw?.isDeleted ?? false,
    departmentName: raw?.department?.name ?? null,
    designationName: raw?.designation?.name ?? null,
    gender: raw?.profile?.gender ?? null,
    bloodGroup: raw?.profile?.bloodGroup ?? null,
    dob: raw?.profile?.dob ?? null,
    nid: raw?.profile?.nid ?? null,
    photoId: raw?.profile?.photoId ?? null,
    experience: raw?.workInfo?.experience ?? null,
    workType: raw?.workInfo?.workType ?? null,
    workStartTime: raw?.workInfo?.workStartTime ?? null,
    workTimeLimit: raw?.workInfo?.workTimeLimit ?? null,
    availableTime: raw?.workInfo?.availableTime ?? null,
    branchId: raw?.branchId ?? null,
    branchName: raw?.branch?.name ?? null,
    roleId: raw?.roleId ?? raw?.role?.id ?? null,
    roleName: raw?.role?.role ?? null,
    // Address fields
    division: raw?.address?.division ?? null,
    district: raw?.address?.district ?? null,
    upazila: raw?.address?.upazila ?? null,
    address: raw?.address?.address ?? null,
    loginCount: raw?.loginCount ?? 0,
    loginHistories: raw?.loginHistories ?? [],
  }
}

export const usersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createEmployee: builder.mutation<ApiResponse<User>, CreateEmployeePayload>({
      query: (body) => ({
        url: "/users/create-employ",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "User", id: "LIST" }],
    }),

    getAllUsers: builder.query<
      PaginatedResponse<EmployeeRow>,
      ListUsersParams | void
    >({
      query: (params) => ({ url: "/users", params: (params ?? undefined) as Record<string, any> }),
      transformResponse: (raw: any): PaginatedResponse<EmployeeRow> => {
        const flat = toPaginated<EmployeeRow>(raw)
        return { ...flat, data: (raw?.data ?? []).map(flattenEmployee) }
      },
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({ type: "User" as const, id })),
              { type: "User", id: "LIST" },
            ]
          : [{ type: "User", id: "LIST" }],
    }),

    getMyData: builder.query<ApiResponse<EmployeeRow>, void>({
      query: () => "/users/my-data",
      transformResponse: (raw: unknown): ApiResponse<EmployeeRow> => {
        const r = raw as { success?: boolean; message?: string; data?: unknown }
        return {
          success: r?.success ?? true,
          message: r?.message ?? "",
          data: flattenEmployee(r?.data),
        }
      },
      providesTags: [{ type: "User", id: "ME" }],
    }),

    getUserById: builder.query<ApiResponse<User>, string>({
      query: (id) => `/users/${id}`,
      providesTags: (_r, _e, id) => [{ type: "User", id }],
    }),

    changePassword: builder.mutation<ApiResponse<null>, ChangePasswordPayload>({
      query: (body) => ({
        url: "/users/change-password",
        method: "PATCH",
        body,
      }),
    }),

    verifyOtp: builder.mutation<ApiResponse<{ token?: string }>, VerifyOtpPayload>({
      query: (body) => ({
        url: "/users/varify-otp",
        method: "POST",
        body,
      }),
    }),

    updateUser: builder.mutation<
      ApiResponse<User>,
      { id: string; data: UpdateUserPayload }
    >({
      query: ({ id, data }) => ({
        url: `/users/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (_r, _e, { id }) => [
        { type: "User", id },
        { type: "User", id: "LIST" },
      ],
    }),

    deleteUser: builder.mutation<ApiResponse<null>, string>({
      query: (id) => ({ url: `/users/${id}`, method: "DELETE" }),
      invalidatesTags: [{ type: "User", id: "LIST" }],
    }),

    softDeleteUser: builder.mutation<ApiResponse<User>, string>({
      query: (id) => ({
        url: `/users/${id}/soft-delete`,
        method: "PATCH",
      }),
      invalidatesTags: (_r, _e, id) => [
        { type: "User", id },
        { type: "User", id: "LIST" },
      ],
    }),

    blockUser: builder.mutation<ApiResponse<User>, string>({
      query: (id) => ({ url: `/users/${id}/block`, method: "PATCH" }),
      invalidatesTags: (_r, _e, id) => [
        { type: "User", id },
        { type: "User", id: "LIST" },
      ],
    }),

    forceLogoutSession: builder.mutation<ApiResponse<null>, string>({
      query: (historyId) => ({
        url: `/users/sessions/${historyId}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "User", id: "LIST" }, { type: "User" }],
    }),

    getLoginHistory: builder.query<ApiResponse<any[]>, string>({
      query: (id) => ({ url: `/users/${id}/login-history` }),
      providesTags: (_r, _e, id) => [{ type: "User", id }],
    }),
  }),
  overrideExisting: false,
})

export const {
  useCreateEmployeeMutation,
  useGetAllUsersQuery,
  useGetMyDataQuery,
  useGetUserByIdQuery,
  useChangePasswordMutation,
  useVerifyOtpMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useSoftDeleteUserMutation,
  useBlockUserMutation,
  useForceLogoutSessionMutation,
  useGetLoginHistoryQuery,
} = usersApi
