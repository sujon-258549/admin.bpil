import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Plus, Trash2, Package, Eye } from "lucide-react"
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
import { useGetProjectsQuery, useDeleteProjectMutation, useUpdateProjectMutation } from "@/redux/features/projects/projects-api"

export default function ProjectListPage() {
  const navigate = useNavigate()
  const [search, setSearch] = useState("")

  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)

  const { data, isLoading, isFetching } = useGetProjectsQuery({ page, limit, searchTerm: search })
  const projects = data?.data || []
  const meta = data?.meta

  const [deleteProject] = useDeleteProjectMutation()
  const [updateProject] = useUpdateProjectMutation()
  const [pendingDelete, setPendingDelete] = useState<any>(null)

  const confirmDelete = async () => {
    if (!pendingDelete) return
    try {
      const res = await deleteProject(pendingDelete.id).unwrap()
      if (res?.success) {
        toast.success(res.message || "Project deleted")
      }
      setPendingDelete(null)
    } catch (err: any) {
      toast.error("Failed to delete project", {
        description: err?.data?.message || "Something went wrong",
      })
    }
  }

  const columns: Column<any>[] = [
    {
      key: "name",
      header: "Project Name",
      cell: (p) => (
        <div className="flex items-center gap-3">
          {p.thumbnail ? (
            <Image
              imageId={p.thumbnail.id}
              alt={p.name || "Thumbnail"}
              className="h-10 w-10 shrink-0 rounded-md object-cover border border-border/50"
              preview
            />
          ) : (
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground border border-border/50">
              <Package className="size-5" />
            </div>
          )}
          <div className="min-w-0">
            <div className="truncate font-medium">{p.name || "Untitled"}</div>
          </div>
        </div>
      ),
    },
    {
      key: "category",
      header: "Category",
      cell: (p) => (
        <Text size="sm" tone="muted">
          {p.category || "—"}
        </Text>
      ),
    },
    {
      key: "status",
      header: "Status",
      cell: (p) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          p.status === 'ONGOING' ? 'bg-blue-100 text-blue-700' :
          p.status === 'COMPLETED' ? 'bg-green-100 text-green-700' :
          'bg-yellow-100 text-yellow-700'
        }`}>
          {p.status}
        </span>
      ),
    },
    {
      key: "isActive",
      header: "Active",
      cell: (p) => (
        <div className="flex items-center">
          <Switch
            checked={p.isActive}
            onCheckedChange={async (val) => {
              try {
                const res = await updateProject({ id: p.id, data: { isActive: val } }).unwrap()
                if (res?.success) toast.success(res.message || "Active status updated")
              } catch (err: any) {
                toast.error("Failed to update status", { description: err?.data?.message })
              }
            }}
            className="data-[state=checked]:bg-primary"
          />
        </div>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      align: "right",
      fixed: "right",
      cell: (p) => (
        <div className="flex justify-end gap-1">
          <Can module="projects.project" action="read">
            <Button
              size="icon-sm"
              variant="secondary"
              onClick={() => navigate(`/projects/${p.id}`)}
              aria-label="View Details"
              className="border border-gray-300"
            >
              <Eye className="size-4" />
            </Button>
          </Can>
          <Can module="projects.project" action="update">
            <Button
              size="icon-sm"
              variant="secondary"
              onClick={() => navigate(`/projects/${p.id}/edit`)}
              aria-label="Edit"
              className="border border-gray-300"
            >
              <FiEdit />
            </Button>
          </Can>
          <Can module="projects.project" action="delete">
            <Button
              size="icon-sm"
              variant="destructive"
              onClick={() => setPendingDelete(p)}
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

  const [visibleColumns, setVisibleColumns] = useState<Column<any>[]>(columns)

  return (
    <div className="space-y-6">
      <PageMeta title="Project List" description="Manage Project List" />
      <PageHeader
        title="Projects"
        description="Manage your projects."
        actions={
          <Can module="projects.project" action="create">
            <Button onClick={() => navigate("/projects/create")}>
              <Plus className="mr-2 h-4 w-4" /> Add Project
            </Button>
          </Can>
        }
      />

      <DataTableToolbar
        value={search}
        onChange={setSearch}
        placeholder="Search projects..."
        fetching={isFetching}
        right={
          <DataTableColumnsButton
            tableName="projects"
            columns={columns}
            onVisibleColumnsChange={setVisibleColumns}
          />
        }
      />

      <DataTable<any>
        data={projects}
        columns={visibleColumns}
        isLoading={isLoading && projects.length === 0}
        isFetching={isFetching}
        empty={
          <EmptyState
            icon={Package}
            title="No projects yet."
            action={
              <Can module="projects.project" action="create">
                <Button size="sm" onClick={() => navigate("/projects/create")}>
                  <Plus className="mr-2 h-4 w-4" /> Add Project
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

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        onOpenChange={(v) => !v && setPendingDelete(null)}
        title="Delete project?"
        description={`This will permanently remove "${pendingDelete?.name ?? ""}".`}
        confirmLabel="Delete"
        destructive
        onConfirm={confirmDelete}
      />
    </div>
  )
}
