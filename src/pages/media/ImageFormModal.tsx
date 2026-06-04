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

interface ImageFormModalProps {
  isOpen: boolean
  onClose: () => void
  initialData?: any | null
}

export function ImageFormModal({
  isOpen,
  onClose,
  initialData,
}: ImageFormModalProps) {
  const { updateImage } = useFolder()
  
  const [name, setName] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  
  // Track previous props to reset state when the modal opens or data changes
  const [prevIsOpen, setPrevIsOpen] = useState(false)
  const [prevInitialData, setPrevInitialData] = useState<any | null | undefined>(undefined)

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
      setError("Image name is required")
      return
    }

    setIsSubmitting(true)
    setError("")

    try {
      if (initialData) {
        await updateImage({ id: initialData.id, data: { name } }).unwrap()
        toast.success("Image renamed successfully")
      }
      onClose()
    } catch (err: any) {
      const msg = err?.data?.message || "Something went wrong"
      setError(msg)
      // Removed toast.error to prevent intrusive error messages before success
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Rename Image</DialogTitle>
          <DialogDescription>
            Change the name of your image.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <Label htmlFor="image-name" className="text-sm font-medium">
              Image Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="image-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. profile-picture.jpg"
              autoFocus
            />
            {error && <p className="text-xs text-destructive">{error}</p>}
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Rename"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
