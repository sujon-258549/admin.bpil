import {
  useCreateBlogMutation,
  useDeleteBlogMutation,
  useListBlogsQuery,
  useGetBlogQuery,
  useUpdateBlogMutation,
  useToggleBlogStatusMutation,
  type BlogListParams,
} from "@/redux/features/blogs"

export const useBlog = (params?: BlogListParams) => {
  const {
    data: response,
    isLoading,
    isFetching,
    refetch,
  } = useListBlogsQuery(params ?? {})

  const [createBlog, { isLoading: isCreating }] = useCreateBlogMutation()
  const [updateBlog, { isLoading: isUpdating }] = useUpdateBlogMutation()
  const [deleteBlog, { isLoading: isDeleting }] = useDeleteBlogMutation()
  const [toggleBlogStatus, { isLoading: isStatusUpdating }] =
    useToggleBlogStatusMutation()

  return {
    response,
    blogs: response?.data ?? [],
    meta: response?.meta,
    isLoading:
      isLoading ||
      isFetching ||
      isCreating ||
      isUpdating ||
      isDeleting ||
      isStatusUpdating,
    isFetching,
    refetch,
    createBlog,
    updateBlog,
    deleteBlog,
    toggleBlogStatus,
    useGetBlogById: useGetBlogQuery,
  }
}
