import {
  useCreateFolderMutation,
  useDeleteFolderMutation,
  useGetFolderQuery,
  useListFoldersQuery,
  useUpdateFolderMutation,
  useUploadImageMutation,
  useUpdateImageMutation,
  useDeleteImageMutation,
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
  const [uploadImage, { isLoading: isUploading }] = useUploadImageMutation()
  const [updateImage, { isLoading: isUpdatingImage }] = useUpdateImageMutation()
  const [deleteImage, { isLoading: isDeletingImage }] = useDeleteImageMutation()

  return {
    response,
    folders: response?.data?.folders ?? [],
    images: response?.data?.images ?? [],
    meta: response?.meta,
    isLoading: isLoading || isFetching || isCreating || isUpdating || isDeleting || isUploading || isUpdatingImage || isDeletingImage,
    isFetching,
    refetch,
    createFolder,
    updateFolder,
    deleteFolder,
    isDeleting,
    uploadImage,
    isUploading,
    updateImage,
    deleteImage,
    useGetFolderById: useGetFolderQuery,
  }
}
