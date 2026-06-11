import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Plus, Trash2, Users, Eye } from "lucide-react"
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
import { useGetTeamMembersQuery, useDeleteTeamMemberMutation, useUpdateTeamMemberMutation } from "@/redux/features/team-members/team-members-api"
import { TeamMemberViewModal } from "@/components/modal/team-member-view-modal/team-member-view-modal"

export default function TeamMemberListPage() {
  const navigate = useNavigate()
  const [search, setSearch] = useState("")
  const [viewingMember, setViewingMember] = useState<any>(null)

  // Assuming your API handles pagination (page, limit, searchTerm)
  // If not, it will just return all and we can ignore pagination state for now
  const { data, isLoading, isFetching } = useGetTeamMembersQuery()
  const teamMembers = data?.data || []
  // const meta = data?.meta // If API supports pagination

  const [deleteTeamMember] = useDeleteTeamMemberMutation()
  const [updateTeamMember] = useUpdateTeamMemberMutation()
  const [pendingDelete, setPendingDelete] = useState<any>(null)

  const confirmDelete = async () => {
    if (!pendingDelete) return
    try {
      await deleteTeamMember(pendingDelete.id).unwrap()
      toast.success("Team member deleted successfully")
      setPendingDelete(null)
    } catch {
      toast.error("Failed to delete team member")
    }
  }

  const columns: Column<any>[] = [
    {
      key: "name",
      header: "Team Member",
      cell: (p) => (
        <div className="flex items-center gap-3">
          {p.imageId ? (
            <Image
              imageId={p.imageId}
              alt={p.name || "Photo"}
              className="h-10 w-10 shrink-0 rounded-md object-cover border border-border/50"
              preview
            />
          ) : (
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground border border-border/50">
              <Users className="size-5" />
            </div>
          )}
          <div className="min-w-0">
            <div className="truncate font-medium">{p.name || "Unnamed"}</div>
          </div>
        </div>
      ),
    },
    {
      key: "role",
      header: "Role",
      cell: (p) => (
        <Text size="sm" tone="muted">
          {p.role || "—"}
        </Text>
      ),
    },
    {
      key: "serial",
      header: "Serial/Order",
      cell: (p) => (
        <Text size="sm" tone="muted">
          {p.serial ?? 0}
        </Text>
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
                await updateTeamMember({ id: p.id, data: { isActive: val } }).unwrap()
                toast.success("Active status updated")
              } catch {
                toast.error("Failed to update status")
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
          <Button
            size="icon-sm"
            variant="default"
            onClick={() => setViewingMember(p)}
            aria-label="View Details"
            className="border border-gray-300"
          >
            <Eye className="size-4" />
          </Button>
          <Can module="team_members.list" action="update">
            <Button
              size="icon-sm"
              variant="default"
              onClick={() => navigate(`/team-members/edit/${p.id}`)}
              aria-label="Edit"
              className="border border-gray-300"
            >
              <FiEdit />
            </Button>
          </Can>
          <Can module="team_members.list" action="delete">
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

  // Simple client-side search since we fetch all
  const filteredData = teamMembers.filter(m => m.name.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="space-y-6">
      <PageMeta title="Team Members" description="Manage Team Members" />
      <PageHeader
        title="Team Members"
        description="Manage your team members and tech talent."
        actions={
          <Can module="team_members.create" action="create">
            <Button onClick={() => navigate("/team-members/create")}>
              <Plus className="mr-2 h-4 w-4" /> Add Team Member
            </Button>
          </Can>
        }
      />

      <DataTableToolbar
        value={search}
        onChange={setSearch}
        placeholder="Search team members..."
        fetching={isFetching}
        right={
          <DataTableColumnsButton
            tableName="team_members"
            columns={columns}
            onVisibleColumnsChange={setVisibleColumns}
          />
        }
      />

      <DataTable<any>
        data={filteredData}
        columns={visibleColumns}
        isLoading={isLoading && filteredData.length === 0}
        isFetching={isFetching}
        empty={
          <EmptyState
            icon={Users}
            title="No team members yet."
            action={
              <Can module="team_members.create" action="create">
                <Button size="sm" onClick={() => navigate("/team-members/create")}>
                  <Plus className="mr-2 h-4 w-4" /> Add Team Member
                </Button>
              </Can>
            }
          />
        }
      />

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        onOpenChange={(v) => !v && setPendingDelete(null)}
        title="Delete Team Member?"
        description={`This will permanently remove "${pendingDelete?.name ?? ""}".`}
        confirmLabel="Delete"
        destructive
        onConfirm={confirmDelete}
      />

      <TeamMemberViewModal
        open={Boolean(viewingMember)}
        onOpenChange={(v) => !v && setViewingMember(null)}
        member={viewingMember}
      />
    </div>
  )
}
