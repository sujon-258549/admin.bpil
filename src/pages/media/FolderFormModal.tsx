import { useState } from "react"
import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useFolder } from "@/hooks/data-fetch/use-folder"
import type { Folder } from "@/redux/features/folders"

interface FolderFormModalProps {
  isOpen: boolean
  onClose: () => void
  initialData?: Folder | null
  parentId?: string | null
}

export function FolderFormModal({
  isOpen,
  onClose,
  initialData,
  parentId,
}: FolderFormModalProps) {
  const isEditing = !!initialData
  const { createFolder, updateFolder } = useFolder()
  
  const [name, setName] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  
  // Track previous props to reset state when the modal opens or data changes
  const [prevIsOpen, setPrevIsOpen] = useState(false)
  const [prevInitialData, setPrevInitialData] = useState<Folder | null | undefined>(undefined)

  if (isOpen !== prevIsOpen || initialData !== prevInitialData) {
    setPrevIsOpen(isOpen)
    setPrevInitialData(initialData)
    if (isOpen) {
      setName(initialData ? initialData.name : "")
      setError("")
      setIsSubmitting(false)
    }
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!name.trim()) {
      setError("Folder name is required")
      return
    }

    setIsSubmitting(true)
    setError("")

    try {
      if (isEditing) {
        await updateFolder({ id: initialData.id, data: { name } }).unwrap()
        toast.success("Folder renamed successfully")
      } else {
        await createFolder({ name, parentId }).unwrap()
        toast.success("Folder created successfully")
      }
      onClose()
    } catch (err: any) {
      const msg = err?.data?.message || "Something went wrong"
      setError(msg)
      toast.error(msg)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEditing ? "Rename Folder" : "New Folder"}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Change the name of your folder."
              : "Enter a name for the new folder."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <Label htmlFor="folder-name" className="text-sm font-medium">
              Folder Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="folder-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Invoices"
              autoFocus
            />
            {error && <p className="text-xs text-destructive">{error}</p>}
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : isEditing ? "Rename" : "Create"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
