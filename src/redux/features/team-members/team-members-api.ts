import { baseApi } from "../../api/base-api"

export interface TeamMember {
  id: string
  name: string
  role: string
  mobile?: string
  email?: string
  bio?: string
  serial?: number
  imageId?: string
  image?: any
  facebook?: string
  twitter?: string
  instagram?: string
  linkedin?: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export const teamMembersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getTeamMembers: builder.query<{ data: TeamMember[] }, void>({
      query: () => "/team-members",
      providesTags: ["teamMembers"],
    }),

    getSingleTeamMember: builder.query<{ data: TeamMember }, string>({
      query: (id) => `/team-members/${id}`,
      providesTags: (_result, _error, id) => [{ type: "teamMembers", id }],
    }),

    createTeamMember: builder.mutation<{ data: TeamMember }, Partial<TeamMember>>({
      query: (data) => ({
        url: "/team-members",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["teamMembers"],
    }),

    updateTeamMember: builder.mutation<{ data: TeamMember }, { id: string; data: Partial<TeamMember> }>({
      query: ({ id, data }) => ({
        url: `/team-members/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "teamMembers", id },
        "teamMembers",
      ],
    }),

    deleteTeamMember: builder.mutation<{ data: TeamMember }, string>({
      query: (id) => ({
        url: `/team-members/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["teamMembers"],
    }),
  }),
})

export const {
  useGetTeamMembersQuery,
  useGetSingleTeamMemberQuery,
  useCreateTeamMemberMutation,
  useUpdateTeamMemberMutation,
  useDeleteTeamMemberMutation,
} = teamMembersApi
