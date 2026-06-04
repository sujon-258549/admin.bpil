import { useEffect, useState } from "react"
import { Folder as FolderIcon, ChevronRight, Home, Upload, Search, X, Edit, Trash } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Image, ConfirmDialog } from "@/components/shared"
import { useFolder } from "@/hooks/data-fetch/use-folder"
import { ImageUploadModal } from "@/pages/media/ImageUploadModal"
import { FolderFormModal } from "@/pages/media/FolderFormModal"
import { ImageFormModal } from "@/pages/media/ImageFormModal"
import { env } from "@/config/env"
import type { Folder } from "@/redux/features/folders"

interface MediaUploadsModalProps {
  isOpen: boolean
  onClose: () => void
  onSelect: (imageIds: string[]) => void
  category?: "single" | "multi"
  initialSelectedIds?: string[]
}

export function MediaUploadsModal({ isOpen, onClose, onSelect, category = "single", initialSelectedIds = [] }: MediaUploadsModalProps) {
  const [currentFolderId, setCurrentFolderId] = useState<string>("root")
  const [breadcrumbs, setBreadcrumbs] = useState<{ id: string; name: string }[]>([
    { id: "root", name: "Home" },
  ])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedImageIds, setSelectedImageIds] = useState<string[]>([])
  const [isFolderModalOpen, setIsFolderModalOpen] = useState(false)
  
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; targetType: "folder" | "image"; targetItem: any } | null>(null)
  const [folderToDelete, setFolderToDelete] = useState<Folder | null>(null)
  const [imageToDelete, setImageToDelete] = useState<any | null>(null)
  const [folderToEdit, setFolderToEdit] = useState<Folder | null>(null)
  const [imageToEdit, setImageToEdit] = useState<any | null>(null)
  const [isImageFormOpen, setIsImageFormOpen] = useState(false)
  
  const [prevIsOpen, setPrevIsOpen] = useState(isOpen)
  
  if (isOpen !== prevIsOpen) {
    setPrevIsOpen(isOpen)
    if (isOpen) {
      setSelectedImageIds(initialSelectedIds)
    }
  }
  
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)

  // Fetch data
  const { folders = [], images = [], isLoading, useGetFolderById, deleteFolder, deleteImage } = useFolder(
    currentFolderId === "root" 
      ? { parentId: "root", sortBy: "createdAt", sortOrder: "asc" } 
      : undefined
  )

  const { data: specificFolderData, isLoading: isSpecificLoading } = useGetFolderById(
    currentFolderId !== "root" ? currentFolderId : "",
    { skip: currentFolderId === "root" }
  )

  const rawDisplayFolders = currentFolderId === "root" ? folders : specificFolderData?.data?.children || []
  const rawDisplayImages = currentFolderId === "root" ? images : specificFolderData?.data?.images || []
  const displayLoading = currentFolderId === "root" ? isLoading : isSpecificLoading

  const displayFolders = rawDisplayFolders.filter((f: any) => 
    f.name.toLowerCase().includes(searchQuery.toLowerCase())
  )
  const displayImages = rawDisplayImages.filter((img: any) => 
    img.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  useEffect(() => {
    const handleClick = () => setContextMenu(null)
    window.addEventListener("click", handleClick)
    return () => window.removeEventListener("click", handleClick)
  }, [])

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

  const handleNavigateBreadcrumb = (folderId: string, index: number) => {
    setCurrentFolderId(folderId)
    setBreadcrumbs((prev) => prev.slice(0, index + 1))
  }

  const handleFolderClick = (folder: Folder) => {
    setCurrentFolderId(folder.id)
    setBreadcrumbs((prev) => [...prev, { id: folder.id, name: folder.name }])
    setSearchQuery("")
  }

  const toggleImageSelection = (imageId: string) => {
    if (category === "single") {
      setSelectedImageIds((prev) => prev.includes(imageId) ? [] : [imageId])
    } else {
      setSelectedImageIds((prev) => 
        prev.includes(imageId) ? prev.filter(id => id !== imageId) : [...prev, imageId]
      )
    }
  }

  const handleConfirm = () => {
    if (selectedImageIds.length > 0) {
      onSelect(selectedImageIds)
      onClose()
      // reset state for next open
      setTimeout(() => setSelectedImageIds([]), 300)
    }
  }

  const handleModalClose = () => {
    onClose()
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleModalClose}>
        <DialogContent className="!w-[95vw] !max-w-[95vw] !h-[95vh] flex flex-col p-0 overflow-hidden bg-background">
          <DialogHeader className="px-6 py-4 border-b bg-muted/20 shrink-0">
            <div className="flex items-center justify-between">
              <DialogTitle className="text-xl">Select Media</DialogTitle>
              
              <div className="flex flex-wrap items-center gap-3">
                <div className="relative">
                  <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search media..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="h-9 w-[250px] sm:w-[350px] md:w-[450px] lg:w-[500px] rounded-md border border-input bg-background pl-9 pr-8 py-1 text-sm shadow-sm transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
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
                
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => setIsFolderModalOpen(true)}
                  className="gap-2 h-9"
                >
                  <FolderIcon className="h-4 w-4" />
                  New Folder
                </Button>
                <Button 
                  size="sm" 
                  variant="secondary"
                  onClick={() => setIsUploadModalOpen(true)}
                  className="gap-2 h-9"
                >
                  <Upload className="h-4 w-4" />
                  Upload
                </Button>
              </div>
            </div>
          </DialogHeader>

          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 px-6 py-2 border-b bg-muted/5 shrink-0">
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

          <div className="flex-1 overflow-y-auto p-6 bg-muted/5">
            {displayLoading ? (
              <div className="flex h-40 items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
              </div>
            ) : displayFolders.length === 0 && displayImages.length === 0 ? (
              <div className="flex h-40 flex-col items-center justify-center text-muted-foreground">
                <FolderIcon className="mb-2 h-10 w-10 opacity-20" />
                <p>No media found</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                {/* Folders */}
                {displayFolders.map((folder: Folder) => (
                  <div
                    key={folder.id}
                    onClick={() => handleFolderClick(folder)}
                    onContextMenu={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      setContextMenu({ x: e.pageX, y: e.pageY, targetType: "folder", targetItem: folder })
                    }}
                    className="group relative flex cursor-pointer flex-col items-center justify-center gap-2 rounded-md border bg-card p-4 transition-all hover:border-primary hover:shadow-md"
                  >
                    <div className="rounded-full bg-primary/10 p-4 transition-colors group-hover:bg-primary/20">
                      <FolderIcon className="h-8 w-8 text-primary" fill="currentColor" fillOpacity={0.2} />
                    </div>
                    <span className="w-full truncate text-center text-sm font-medium">{folder.name}</span>
                    
                    {/* Hover Actions */}
                    <div className="absolute right-2 top-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation()
                          setFolderToEdit(folder)
                          setIsFolderModalOpen(true)
                        }}
                        className="rounded-md bg-background/80 p-1.5 text-muted-foreground hover:bg-background hover:text-foreground shadow-sm border"
                      >
                        <Edit className="h-3.5 w-3.5" />
                      </button>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation()
                          setFolderToDelete(folder)
                        }}
                        className="rounded-md bg-background/80 p-1.5 text-muted-foreground hover:bg-destructive hover:text-destructive-foreground shadow-sm border"
                      >
                        <Trash className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ))}

                {/* Images */}
                {displayImages.map((image: any) => {
                  const isSelected = selectedImageIds.includes(image.id)
                  return (
                    <div
                      key={image.id}
                      onClick={() => toggleImageSelection(image.id)}
                      onContextMenu={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        setContextMenu({ x: e.pageX, y: e.pageY, targetType: "image", targetItem: image })
                      }}
                      className={`group relative cursor-pointer overflow-hidden rounded-md border-2 transition-all hover:shadow-md ${
                        isSelected ? "border-primary" : "border-border hover:border-primary/50"
                      }`}
                    >
                      <div className="aspect-square bg-muted">
                        <Image
                          src={`${env.API_URL}/folder/image/${image.id}`}
                          alt={image.name}
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                          loading="lazy"
                        />
                      </div>
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-3 pt-6">
                        <p className="truncate text-xs font-medium text-white">{image.name}</p>
                      </div>

                      <div className="absolute top-2 right-2">
                        <Checkbox 
                          checked={isSelected} 
                          onCheckedChange={() => toggleImageSelection(image.id)}
                          className="h-5 w-5 bg-background shadow-sm data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                          // prevent the event from bubbling if they click exactly on the checkbox
                          onClick={(e) => e.stopPropagation()}
                        />
                      </div>
                      
                      {/* Hover Actions */}
                      <div className="absolute left-2 top-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation()
                            setImageToEdit(image)
                            setIsImageFormOpen(true)
                          }}
                          className="rounded-md bg-background/80 backdrop-blur-sm p-1.5 text-muted-foreground hover:bg-background hover:text-foreground shadow-sm border"
                        >
                          <Edit className="h-3.5 w-3.5" />
                        </button>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation()
                            setImageToDelete(image)
                          }}
                          className="rounded-md bg-background/80 backdrop-blur-sm p-1.5 text-muted-foreground hover:bg-destructive hover:text-destructive-foreground shadow-sm border"
                        >
                          <Trash className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          <DialogFooter className="px-6 py-4 border-t bg-muted/10 shrink-0">
            <div className="flex w-full items-center justify-between">
              <div className="text-sm text-muted-foreground">
                {selectedImageIds.length > 0 
                  ? `${selectedImageIds.length} image${selectedImageIds.length > 1 ? 's' : ''} selected` 
                  : "No image selected"}
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={handleModalClose}>Cancel</Button>
                <Button 
                  onClick={handleConfirm} 
                  disabled={selectedImageIds.length === 0}
                >
                  Confirm Selection
                </Button>
              </div>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Custom Context Menu */}
      {contextMenu && (
        <div
          className="fixed z-[100] min-w-[160px] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md animate-in fade-in-80 zoom-in-95"
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
                Rename Image
              </button>
              <button
                onClick={() => {
                  setImageToDelete(contextMenu.targetItem)
                  setContextMenu(null)
                }}
                className="flex w-full items-center rounded-sm px-2 py-1.5 text-sm text-destructive outline-none hover:bg-accent hover:text-destructive"
              >
                Delete Image
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => {
                  setFolderToEdit(contextMenu.targetItem)
                  setIsFolderModalOpen(true)
                  setContextMenu(null)
                }}
                className="flex w-full items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground"
              >
                Rename Folder
              </button>
              <button
                onClick={() => {
                  setFolderToDelete(contextMenu.targetItem)
                  setContextMenu(null)
                }}
                className="flex w-full items-center rounded-sm px-2 py-1.5 text-sm text-destructive outline-none hover:bg-accent hover:text-destructive"
              >
                Delete Folder
              </button>
            </>
          )}
        </div>
      )}
      
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

      {/* Embedded Upload Modal */}
      <ImageUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        currentFolderId={currentFolderId}
      />
      
      <FolderFormModal
        isOpen={isFolderModalOpen}
        onClose={() => {
          setIsFolderModalOpen(false)
          setFolderToEdit(null)
        }}
        initialData={folderToEdit}
        parentId={currentFolderId === "root" ? null : currentFolderId}
      />
      
      <ImageFormModal
        isOpen={isImageFormOpen}
        onClose={() => {
          setIsImageFormOpen(false)
          setImageToEdit(null)
        }}
        initialData={imageToEdit}
      />
    </>
  )
}
