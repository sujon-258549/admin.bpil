import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { MediaPicker } from "@/components/shared"

export interface GalleryItemData {
  id: string
  category: string
  alt: string
  imageId: string
}

interface GalleryFormModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  initialData?: GalleryItemData | null
  onSubmit: (data: GalleryItemData) => void
}

const defaultForm: GalleryItemData = {
  id: "",
  category: "",
  alt: "",
  imageId: "",
}

export function GalleryFormModal({ open, onOpenChange, initialData, onSubmit }: GalleryFormModalProps) {
  const [form, setForm] = useState<GalleryItemData>(defaultForm)

  useEffect(() => {
    if (initialData && open) {
      const timer = setTimeout(() => {
        setForm(initialData)
      }, 0)
      return () => clearTimeout(timer)
    } else if (open) {
      const timer = setTimeout(() => {
        setForm({ ...defaultForm, id: crypto.randomUUID() })
      }, 0)
      return () => clearTimeout(timer)
    }
  }, [initialData, open])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(form)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="!max-w-2xl">
        <DialogHeader>
          <DialogTitle>{initialData ? "Edit Gallery Image" : "Add Gallery Image"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category Badge</Label>
              <Input
                id="category"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                placeholder="e.g. Transformers, Solar"
                required
              />
              <p className="text-[11px] text-muted-foreground mt-1">
                This appears as the small label overlay on the image.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="alt">Image Alt Text</Label>
              <Input
                id="alt"
                value={form.alt}
                onChange={(e) => setForm({ ...form, alt: e.target.value })}
                placeholder="e.g. Distribution transformer at a substation"
                required
              />
            </div>

            <div className="space-y-2 pt-2">
              <Label>Gallery Image</Label>
              <MediaPicker
                value={form.imageId}
                onChange={(val) => setForm({ ...form, imageId: val as string })}
                width="w-full"
                height="h-[200px]"
                label="Select Image"
              />
              <p className="text-[11px] text-muted-foreground mt-1">
                <strong>Recommended size: 800x1000 pixels (4:5 vertical ratio)</strong> to ensure uniform grid display.
              </p>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">
              {initialData ? "Save Changes" : "Add Image"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
