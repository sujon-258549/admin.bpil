import {
  useCreateVideoMutation,
  useDeleteVideoMutation,
  useListVideosQuery,
  useUpdateVideoMutation,
  useToggleVideoStatusMutation,
  type VideoListParams,
} from "@/redux/features/videos"

export function useVideo(params?: VideoListParams) {
  const { data, isLoading, isFetching } = useListVideosQuery(params ?? {}, {
    skip: !params,
  })

  const [createVideo, { isLoading: isCreating }] = useCreateVideoMutation()
  const [updateVideo, { isLoading: isUpdating }] = useUpdateVideoMutation()
  const [deleteVideo, { isLoading: isDeleting }] = useDeleteVideoMutation()
  const [toggleVideoStatus, { isLoading: isToggling }] =
    useToggleVideoStatusMutation()

  return {
    videos: data?.data ?? [],
    meta: data?.meta,
    isLoading,
    isFetching,
    createVideo,
    isCreating,
    updateVideo,
    isUpdating,
    deleteVideo,
    isDeleting,
    toggleVideoStatus,
    isToggling,
  }
}
