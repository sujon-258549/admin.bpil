import { useState, useEffect } from "react"
import { Plus, Home, ChevronRight, Folder as FolderIcon } from "lucide-react"
import { PageMeta } from "@/components/shared"
import { useFolder } from "@/hooks/data-fetch/use-folder"
import { FolderItem } from "./FolderItem"
import { FolderFormModal } from "./FolderFormModal"
import { ConfirmDialog } from "@/components/shared/confirm-dialog"
import type { Folder } from "@/redux/features/folders"

export default function MediaLibraryPage() {
  const [currentFolderId, setCurrentFolderId] = useState<string>("root")
  const [breadcrumbs, setBreadcrumbs] = useState<{ id: string; name: string }[]>([
    { id: "root", name: "Home" },
  ])

  // Context Menu State
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null)

  // Modals State
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [folderToEdit, setFolderToEdit] = useState<Folder | null>(null)
  const [folderToDelete, setFolderToDelete] = useState<Folder | null>(null)

  const {
    folders,
    isLoading,
    useGetFolderById,
    deleteFolder,
  } = useFolder(
    currentFolderId === "root" ? { parentId: "root", limit: 100 } : undefined
  )

  // Fetch children if we are inside a folder
  const { data: specificFolderData, isLoading: isSpecificLoading } = useGetFolderById(
    currentFolderId !== "root" ? currentFolderId : "",
    { skip: currentFolderId === "root" }
  )

  const displayFolders =
    currentFolderId === "root" ? folders : specificFolderData?.data?.children || []
  const displayLoading = currentFolderId === "root" ? isLoading : isSpecificLoading

  // Close context menu on click anywhere
  useEffect(() => {
    const handleClick = () => setContextMenu(null)
    window.addEventListener("click", handleClick)
    return () => window.removeEventListener("click", handleClick)
  }, [])

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault()
    setContextMenu({ x: e.pageX, y: e.pageY })
  }

  const handleDoubleClickFolder = (folder: Folder) => {
    setCurrentFolderId(folder.id)
    setBreadcrumbs((prev) => [...prev, { id: folder.id, name: folder.name }])
  }

  const handleNavigateBreadcrumb = (id: string, index: number) => {
    setCurrentFolderId(id)
    setBreadcrumbs((prev) => prev.slice(0, index + 1))
  }

  const handleDeleteConfirm = async () => {
    if (folderToDelete) {
      await deleteFolder(folderToDelete.id).unwrap()
      setFolderToDelete(null)
    }
  }

  return (
    <>
      <PageMeta title="Media Library" description="Manage folders and media files" />
      
      <div className="flex h-[calc(100vh-100px)] flex-col rounded-xl border bg-card shadow-sm">
        {/* Header / Breadcrumbs */}
        <div className="flex items-center gap-2 border-b bg-muted/20 px-6 py-4">
          {breadcrumbs.map((crumb, idx) => (
            <div key={crumb.id} className="flex items-center text-sm">
              <button
                onClick={() => handleNavigateBreadcrumb(crumb.id, idx)}
                className={`flex items-center hover:text-foreground transition-colors ${
                  idx === breadcrumbs.length - 1
                    ? "font-semibold text-foreground"
                    : "text-muted-foreground"
                }`}
              >
                {idx === 0 ? <Home className="mr-1 h-4 w-4" /> : null}
                {crumb.name}
              </button>
              {idx < breadcrumbs.length - 1 && (
                <ChevronRight className="mx-1 h-4 w-4 text-muted-foreground/50" />
              )}
            </div>
          ))}
        </div>

        {/* Main Content Area (Right-clickable) */}
        <div
          className="flex-1 overflow-auto p-6"
          onContextMenu={handleContextMenu}
        >
          {displayLoading ? (
            <div className="flex h-full items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            </div>
          ) : displayFolders.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-muted-foreground">
              <FolderIcon className="mb-4 h-16 w-16 opacity-20" />
              <p>This folder is empty.</p>
              <p className="text-sm">Right-click anywhere to create a new folder.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8">
              {displayFolders.map((folder: Folder) => (
                <FolderItem
                  key={folder.id}
                  folder={folder}
                  onDoubleClick={handleDoubleClickFolder}
                  onRename={(f) => {
                    setFolderToEdit(f)
                    setIsFormOpen(true)
                  }}
                  onDelete={(f) => setFolderToDelete(f)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Custom Context Menu */}
      {contextMenu && (
        <div
          className="fixed z-50 min-w-[160px] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md animate-in fade-in-80 zoom-in-95"
          style={{ top: contextMenu.y, left: contextMenu.x }}
        >
          <button
            onClick={() => {
              setFolderToEdit(null)
              setIsFormOpen(true)
            }}
            className="flex w-full items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground cursor-pointer"
          >
            <Plus className="mr-2 h-4 w-4" />
            New Folder
          </button>
        </div>
      )}

      {/* Modals */}
      <FolderFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        initialData={folderToEdit}
        parentId={currentFolderId === "root" ? null : currentFolderId}
      />

      <ConfirmDialog
        open={!!folderToDelete}
        onOpenChange={(open) => {
          if (!open) setFolderToDelete(null)
        }}
        onConfirm={handleDeleteConfirm}
        title="Delete Folder"
        description={`Are you sure you want to delete "${folderToDelete?.name}"? All contents will be moved to trash.`}
      />
    </>
  )
}
