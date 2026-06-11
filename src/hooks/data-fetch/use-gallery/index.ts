import {
  useGetGalleriesQuery,
  useCreateGalleryMutation,
  useUpdateGalleryMutation,
  useDeleteGalleryMutation,
  useToggleGalleryStatusMutation,
  type GalleryItem,
} from "@/redux/features/gallery"

export function useGallery(params?: { page?: number; limit?: number; searchTerm?: string }) {
  const { data, isLoading, isFetching, refetch } = useGetGalleriesQuery(params || {})
  const [create] = useCreateGalleryMutation()
  const [update] = useUpdateGalleryMutation()
  const [remove] = useDeleteGalleryMutation()
  const [toggleStatus] = useToggleGalleryStatusMutation()

  const galleries = data?.data || []
  const meta = data?.meta || { page: 1, perPage: 10, total: 0, totalPages: 0 }

  const createGallery = async (payload: Partial<GalleryItem>) => {
    return create(payload).unwrap()
  }

  const updateGallery = async (id: string, payload: Partial<GalleryItem>) => {
    return update({ id, data: payload }).unwrap()
  }

  const deleteGallery = async (id: string) => {
    return remove(id).unwrap()
  }

  const toggleGalleryStatus = async (id: string) => {
    return toggleStatus(id).unwrap()
  }

  return {
    galleries,
    meta,
    isLoading,
    isFetching,
    refetch,
    createGallery,
    updateGallery,
    deleteGallery,
    toggleGalleryStatus,
  }
}
