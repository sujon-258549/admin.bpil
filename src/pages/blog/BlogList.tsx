import { useState } from "react"
import { Newspaper, Plus, Trash2 } from "lucide-react"
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
  PageHeader,
  Text,
  Image,
  type Column,

  PageMeta,
} from "@/components/shared"
import { useDebounce } from "@/hooks/use-debounce"
import { useBlog } from "@/hooks/data-fetch"
import type { Blog } from "@/redux/features/blogs"
import { getErrorMessage } from "@/lib/errors"
import { BlogFormModal } from "@/components/modal"
import { env } from "@/config/env"

export default function BlogListPage() {
  const [search, setSearch] = useState("")
  const debounced = useDebounce(search, 350)

  const {
    blogs,
    isFetching,
    isLoading,
    deleteBlog,
    toggleBlogStatus,
  } = useBlog({ searchTerm: debounced || undefined, limit: 100 })

  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<Blog | null>(null)
  const [pendingDelete, setPendingDelete] = useState<Blog | null>(null)

  const openCreate = () => {
    setEditing(null)
    setFormOpen(true)
  }
  const openEdit = (b: Blog) => {
    setEditing(b)
    setFormOpen(true)
  }

  const confirmDelete = async () => {
    if (!pendingDelete) return
    try {
      const res = await deleteBlog(pendingDelete.id).unwrap()
      if (res?.success) {
        toast.success(res.message || "Blog deleted")
      }
      setPendingDelete(null)
    } catch (err: any) {
      toast.error(getErrorMessage(err, "Failed to delete blog"))
    }
  }

  const onToggle = async (id: string) => {
    try {
      const res = await toggleBlogStatus(id).unwrap()
      if (res?.success) {
        toast.success(res.message || "Status updated")
      }
    } catch (err: any) {
      toast.error(getErrorMessage(err, "Failed to update status"))
    }
  }

  const columns: Column<Blog>[] = [
    {
      key: "title",
      header: "Title",
      cell: (b) => (
        <div className="flex items-center gap-3">
          {b.thumbnail ? (
            <Image
              imageId={b.thumbnail.id}
              alt={b.title || "Thumbnail"}
              className="h-10 w-10 shrink-0 rounded-md object-cover border border-border/50"
              preview
            />
          ) : (
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground border border-border/50">
              <Newspaper className="size-5" />
            </div>
          )}
          <div className="min-w-0">
            <div className="truncate font-medium">{b.title || "Untitled"}</div>
            <Text size="xs" tone="muted">
              {b.authorName || "Unknown Author"} {b.authorImage ? "" : ""}
            </Text>
          </div>
        </div>
      ),
    },
    {
      key: "description",
      header: "Description",
      hideOnMobile: true,
      cell: (b) => (
        <Text size="sm" tone="muted" className="line-clamp-2">
          {b.description || "—"}
        </Text>
      ),
    },
    {
      key: "isPublished",
      header: "Published",
      cell: (b) => (
        <Switch
          checked={b.isPublished}
          onCheckedChange={() => onToggle(b.id)}
          withLabels
        />
      ),
    },
    {
      key: "actions",
      header: "Actions",
      align: "right",
      fixed: "right",
      cell: (b) => (
        <div className="flex justify-end gap-1">
          <Can module="blog" action="update">
            <Button
              size="icon-sm"
              variant="soft"
              onClick={() => openEdit(b)}
              aria-label="Edit"
              className="border border-gray-300"
            >
              <FiEdit />
            </Button>
          </Can>
          <Can module="blog" action="delete">
            <Button
              size="icon-sm"
              variant="soft-destructive"
              onClick={() => setPendingDelete(b)}
              aria-label="Delete"
              className="border border-gray-300"
            >
              <Trash2 />
            </Button>
          </Can>
        </div>
      ),
    },
  ]

  const [visibleColumns, setVisibleColumns] = useState<Column<Blog>[]>(columns)

  return (
        <div className="space-y-6">
      <PageMeta title="Blog List" description="Manage Blog List in Muster ERP & CRM" />
      <PageHeader
        title="Blog Posts"
        description="Create, edit and publish blog posts for your audience."
        actions={
          <Can module="blog" action="create">
            <Button onClick={openCreate}>
              <Plus className="size-4" /> New Post
            </Button>
          </Can>
        }
      />

      <DataTableToolbar
        value={search}
        onChange={setSearch}
        placeholder="Search blogs..."
        fetching={isFetching}
        right={
          <DataTableColumnsButton
            tableName="blogs"
            columns={columns}
            onVisibleColumnsChange={setVisibleColumns}
          />
        }
      />

      <DataTable<Blog>
        data={blogs}
        columns={visibleColumns}
        isLoading={isLoading && blogs.length === 0}
        isFetching={isFetching}
        empty={
          <EmptyState
            icon={Newspaper}
            title="No blogs yet."
            action={
              <Can module="blog" action="create">
                <Button size="sm" onClick={openCreate}>
                  <Plus className="size-4" /> Create Blog Post
                </Button>
              </Can>
            }
          />
        }
      />

      <BlogFormModal
        open={formOpen}
        onOpenChange={setFormOpen}
        initial={editing}
      />

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        onOpenChange={(v) => !v && setPendingDelete(null)}
        title="Delete blog?"
        description={`This will permanently remove "${pendingDelete?.title ?? ""}".`}
        confirmLabel="Delete"
        destructive
        onConfirm={confirmDelete}
      />
    </div>
  )
}
