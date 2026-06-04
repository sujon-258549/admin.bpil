import { useState, useEffect } from "react"
import { Folder as FolderIcon, Plus, ChevronRight, Home, Upload, Search, X } from "lucide-react"
import { PageMeta } from "@/components/shared"
import { useFolder } from "@/hooks/data-fetch/use-folder"
import { FolderItem } from "./FolderItem"
import { FolderFormModal } from "./FolderFormModal"
import { ImageFormModal } from "./ImageFormModal"
import { ImageUploadModal } from "./ImageUploadModal"
import { ConfirmDialog, Image } from "@/components/shared"
import type { Folder } from "@/redux/features/folders"

export default function MediaLibraryPage() {
  const [currentFolderId, setCurrentFolderId] = useState<string>("root")
  const [breadcrumbs, setBreadcrumbs] = useState<{ id: string; name: string }[]>([
    { id: "root", name: "Home" },
  ])

  // Context Menu State
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; targetType?: "image" | "folder"; targetItem?: any } | null>(null)

  // Search State
  const [searchQuery, setSearchQuery] = useState("")

  // Modals State
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [folderToEdit, setFolderToEdit] = useState<Folder | null>(null)
  const [folderToDelete, setFolderToDelete] = useState<Folder | null>(null)
  const [isImageFormOpen, setIsImageFormOpen] = useState(false)
  const [imageToEdit, setImageToEdit] = useState<any | null>(null)
  const [imageToDelete, setImageToDelete] = useState<any | null>(null)
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)

  const {
    folders,
    images,
    isLoading,
    useGetFolderById,
    deleteFolder,
    deleteImage,
  } = useFolder(
    currentFolderId === "root" 
      ? { parentId: "root", sortBy: "createdAt", sortOrder: "asc" } 
      : undefined
  )

  // Fetch children if we are inside a folder
  const { data: specificFolderData, isLoading: isSpecificLoading } = useGetFolderById(
    currentFolderId !== "root" ? currentFolderId : "",
    { skip: currentFolderId === "root" }
  )

  const rawDisplayFolders =
    currentFolderId === "root" ? folders : specificFolderData?.data?.children || []
  const rawDisplayImages =
    currentFolderId === "root" ? images : specificFolderData?.data?.images || []
  const displayLoading = currentFolderId === "root" ? isLoading : isSpecificLoading

  // Filter based on search query
  const displayFolders = rawDisplayFolders.filter((f: any) => 
    f.name.toLowerCase().includes(searchQuery.toLowerCase())
  )
  const displayImages = rawDisplayImages.filter((img: any) => 
    img.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  console.log("displayImages", displayImages)

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

  const handleDeleteFolder = async () => {
    if (!folderToDelete) return
    try {
      await deleteFolder(folderToDelete.id).unwrap()
      setFolderToDelete(null)
    } catch (error) {
      console.error("Failed to delete folder", error)
    }
  }

  const handleDeleteImage = async () => {
    if (!imageToDelete) return
    try {
      await deleteImage(imageToDelete.id).unwrap()
      setImageToDelete(null)
    } catch (error) {
      console.error("Failed to delete image", error)
    }
  }

  return (
    <>
      <PageMeta title="Media Library" description="Manage folders and media files" />
      
      <div className="flex h-[calc(100vh-100px)] flex-col rounded-xl border bg-card shadow-sm">
        {/* Header / Breadcrumbs */}
        <div className="flex items-center justify-between border-b bg-muted/20 px-6 py-4">
          <div className="flex items-center gap-2">
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

          <div className="flex flex-wrap items-center gap-3">
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search images or folders..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-9 w-[260px] md:w-[320px] rounded-md border border-input bg-background pl-9 pr-8 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>

            <button
              onClick={() => setIsUploadModalOpen(true)}
              className="flex items-center gap-2 rounded-md bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground hover:bg-secondary/90 disabled:opacity-50 h-9"
            >
              <Upload className="h-4 w-4" />
              Upload Image
            </button>
            <button
              onClick={() => {
                setFolderToEdit(null)
                setIsFormOpen(true)
              }}
              className="flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 h-9"
            >
              <Plus className="h-4 w-4" />
              New Folder
            </button>
          </div>
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
          ) : displayFolders.length === 0 && displayImages.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-muted-foreground">
              <FolderIcon className="mb-4 h-16 w-16 opacity-20" />
              <p>This folder is empty.</p>
              <p className="mb-4 text-sm">Right-click anywhere or click the button below to create a new folder.</p>
              <button
                onClick={() => {
                  setFolderToEdit(null)
                  setIsFormOpen(true)
                }}
                className="flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
              >
                <Plus className="h-4 w-4" />
                Create New Folder
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8">
              {displayFolders.map((folder: Folder) => (
                <FolderItem
                  key={folder.id}
                  folder={folder}
                  onDoubleClick={() => handleDoubleClickFolder(folder)}
                  onRename={() => {
                    setFolderToEdit(folder)
                    setIsFormOpen(true)
                  }}
                  onDelete={() => setFolderToDelete(folder)}
                />
              ))}
              
              {displayImages.map((img: any) => (
                <div 
                  key={img.id} 
                  className="group relative flex cursor-pointer flex-col items-center gap-2 rounded-lg p-4 hover:bg-muted/50 transition-colors"
                  onContextMenu={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    setContextMenu({
                      x: e.pageX,
                      y: e.pageY,
                      targetType: "image",
                      targetItem: img
                    })
                  }}
                >
                  <div className="flex h-16 w-16 items-center justify-center rounded-md bg-muted text-muted-foreground overflow-hidden">
                    <Image 
                      src={img.url} 
                      alt={img.name} 
                      preview={true}
                      className="h-full w-full object-cover" 
                    />
                  </div>
                  <span className="w-full truncate text-center text-sm font-medium">
                    {img.name}
                  </span>
                </div>
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
          {contextMenu.targetType === "image" ? (
            <>
              <button
                onClick={() => {
                  setImageToEdit(contextMenu.targetItem)
                  setIsImageFormOpen(true)
                  setContextMenu(null)
                }}
                className="flex w-full items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground"
              >
                Rename
              </button>
              <button
                onClick={() => {
                  setImageToDelete(contextMenu.targetItem)
                  setContextMenu(null)
                }}
                className="flex w-full items-center rounded-sm px-2 py-1.5 text-sm text-destructive outline-none hover:bg-accent hover:text-destructive"
              >
                Delete
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => {
                  setFolderToEdit(null)
                  setIsFormOpen(true)
                  setContextMenu(null)
                }}
                className="flex w-full items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground"
              >
                <Plus className="mr-2 h-4 w-4" />
                New Folder
              </button>
            </>
          )}
        </div>
      )}

      {/* Folder Modals */}
      <FolderFormModal
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false)
          setFolderToEdit(null)
        }}
        initialData={folderToEdit}
        parentId={currentFolderId === "root" ? null : currentFolderId}
      />
      
      {/* Image Modals */}
      <ImageFormModal
        isOpen={isImageFormOpen}
        onClose={() => {
          setIsImageFormOpen(false)
          setImageToEdit(null)
        }}
        initialData={imageToEdit}
      />

      <ConfirmDialog
        open={!!folderToDelete}
        onOpenChange={(open) => {
          if (!open) setFolderToDelete(null)
        }}
        onConfirm={handleDeleteFolder}
        title="Delete Folder"
        description={`Are you sure you want to delete "${folderToDelete?.name}"? All contents will be moved to trash.`}
      />

      <ConfirmDialog
        open={!!imageToDelete}
        onOpenChange={(open) => {
          if (!open) setImageToDelete(null)
        }}
        onConfirm={handleDeleteImage}
        title="Delete Image"
        description={`Are you sure you want to delete "${imageToDelete?.name}"? This action cannot be undone.`}
      />

      <ImageUploadModal 
        isOpen={isUploadModalOpen} 
        onClose={() => setIsUploadModalOpen(false)} 
        currentFolderId={currentFolderId} 
      />
    </>
  )
}
