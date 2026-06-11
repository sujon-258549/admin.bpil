import { useState } from "react"
import { Plus, Trash2, Image as ImageIcon } from "lucide-react"
import { FiEdit } from "react-icons/fi"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import {
  Can,
  ConfirmDialog,
  DataTable,
  DataTableColumnsButton,
  DataTableToolbar,
  EmptyState,
  Image,
  PageHeader,
  Text,
  type Column,
  PageMeta,
} from "@/components/shared"
import { useDebounce } from "@/hooks/use-debounce"
import { useGallery } from "@/hooks/data-fetch/use-gallery"
import type { GalleryItem } from "@/redux/features/gallery"
import { getErrorMessage } from "@/lib/errors"
import { shortId } from "@/lib/format"
import { GalleryFormModal } from "./components/GalleryFormModal"

export default function GalleryPage() {
  const [search, setSearch] = useState("")
  const debounced = useDebounce(search, 350)
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)

  const { galleries, meta, isFetching, isLoading, deleteGallery, toggleGalleryStatus } =
    useGallery({ page, limit, searchTerm: debounced || undefined })

  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<GalleryItem | null>(null)
  const [pendingDelete, setPendingDelete] = useState<GalleryItem | null>(null)

  const openCreate = () => {
    setEditing(null)
    setFormOpen(true)
  }
  const openEdit = (v: GalleryItem) => {
    setEditing(v)
    setFormOpen(true)
  }

  const confirmDelete = async () => {
    if (!pendingDelete) return
    try {
      const res = await deleteGallery(pendingDelete.id)
      if (res?.success) {
        toast.success(res.message || "Gallery item deleted")
      }
      setPendingDelete(null)
    } catch (err: any) {
      toast.error(getErrorMessage(err, "Failed to delete gallery item"))
    }
  }

  const onToggle = async (id: string) => {
    try {
      const res = await toggleGalleryStatus(id)
      if (res?.success) {
        toast.success(res.message || "Status updated")
      }
    } catch (err: any) {
      toast.error(getErrorMessage(err, "Failed to update status"))
    }
  }

  const columns: Column<GalleryItem>[] = [
    {
      key: "image",
      header: "Image",
      cell: (v) => (
        <div className="flex items-center gap-3">
          <Image
            imageId={v.imageId}
            alt={v.alt}
            preview
            className="h-10 w-16 flex-shrink-0 rounded-md object-cover ring-1 ring-border shadow-sm"
          />
          <div className="min-w-0">
            <div className="truncate font-medium">{v.alt}</div>
            <Text size="xs" tone="muted">
              {shortId(v.id)}
            </Text>
          </div>
        </div>
      ),
    },
    {
      key: "category",
      header: "Category",
      cell: (v) => v.category || "—",
    },
    {
      key: "status",
      header: "Status",
      cell: (v) => (
        <Switch
          checked={v.isActive}
          onCheckedChange={() => onToggle(v.id)}
          withLabels
        />
      ),
    },
    {
      key: "actions",
      header: "Actions",
      align: "right",
      fixed: "right",
      cell: (v) => (
        <div className="flex justify-end gap-1">
          <Can module="gallery_video.gallery" action="update">
            <Button
              size="icon-sm"
              variant="ghost"
              onClick={() => openEdit(v)}
              title="Edit Gallery Item"
            >
              <FiEdit className="size-4" />
            </Button>
          </Can>
          <Can module="gallery_video.gallery" action="delete">
            <Button
              size="icon-sm"
              variant="ghost"
              className="text-destructive hover:bg-destructive/10 hover:text-destructive"
              onClick={() => setPendingDelete(v)}
              title="Delete Gallery Item"
            >
              <Trash2 className="size-4" />
            </Button>
          </Can>
        </div>
      ),
    },
  ]

  const [visibleColumns, setVisibleColumns] = useState(columns)

  return (
    <div className="space-y-6">
      <PageMeta title="Gallery | Admin" />
      <PageHeader
        title="Gallery"
        description="Manage the project photography gallery."
        actions={
          <Can module="gallery_video.gallery" action="create">
            <Button onClick={openCreate}>
              <Plus className="size-4 mr-2" /> Add Image
            </Button>
          </Can>
        }
      />

      <DataTableToolbar
        value={search}
        onChange={setSearch}
        placeholder="Search gallery images..."
        fetching={isFetching}
        right={
          <DataTableColumnsButton
            tableName="gallery"
            columns={columns}
            onVisibleColumnsChange={setVisibleColumns}
          />
        }
      />

      <DataTable<GalleryItem>
        data={galleries}
        columns={visibleColumns}
        isLoading={isLoading && galleries.length === 0}
        isFetching={isFetching}
        empty={
          <EmptyState
            icon={ImageIcon}
            title="No gallery images yet."
            action={
              <Can module="gallery_video.gallery" action="create">
                <Button size="sm" onClick={openCreate}>
                  <Plus className="size-4 mr-2" /> Add Image
                </Button>
              </Can>
            }
          />
        }
        meta={meta}
        onPageChange={setPage}
        onPageSizeChange={(newSize) => {
          setLimit(newSize)
          setPage(1)
        }}
      />

      <GalleryFormModal
        open={formOpen}
        onOpenChange={setFormOpen}
        initial={editing}
      />

      <ConfirmDialog
        open={!!pendingDelete}
        onOpenChange={(isOpen) => !isOpen && setPendingDelete(null)}
        title="Delete Gallery Image"
        description={`Are you sure you want to delete "${pendingDelete?.alt}"? This action cannot be undone.`}
        confirmLabel="Delete"
        destructive
        onConfirm={confirmDelete}
      />
    </div>
  )
}
