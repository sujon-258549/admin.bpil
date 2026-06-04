import {
  useCreateFolderMutation,
  useDeleteFolderMutation,
  useGetFolderQuery,
  useListFoldersQuery,
  useUpdateFolderMutation,
  type FolderListParams,
} from "@/redux/features/folders"

export const useFolder = (params?: FolderListParams) => {
  const {
    data: response,
    isLoading,
    isFetching,
    refetch,
  } = useListFoldersQuery(params ?? {})

  const [createFolder, { isLoading: isCreating }] = useCreateFolderMutation()
  const [updateFolder, { isLoading: isUpdating }] = useUpdateFolderMutation()
  const [deleteFolder, { isLoading: isDeleting }] = useDeleteFolderMutation()

  return {
    response,
    folders: response?.data?.folders ?? [],
    images: response?.data?.images ?? [],
    meta: response?.meta,
    isLoading: isLoading || isFetching || isCreating || isUpdating || isDeleting,
    isFetching,
    refetch,
    createFolder,
    updateFolder,
    deleteFolder,
    useGetFolderById: useGetFolderQuery,
  }
}
