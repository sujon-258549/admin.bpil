import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { MediaPicker } from "@/components/shared"


export interface IndustryCardData {
  id: string
  title: string
  tag: string
  description: string
  icon: string
  imageId: string
}

interface IndustryFormModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  initialData?: IndustryCardData | null
  onSubmit: (data: IndustryCardData) => void
}

const defaultForm: IndustryCardData = {
  id: "",
  title: "",
  tag: "",
  description: "",
  icon: "",
  imageId: "",
}

export function IndustryFormModal({ open, onOpenChange, initialData, onSubmit }: IndustryFormModalProps) {
  const [form, setForm] = useState<IndustryCardData>(defaultForm)

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
      <DialogContent className="!max-w-3xl !max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{initialData ? "Edit Industry Card" : "Add Industry Card"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Left Side: Details */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g. Heavy Manufacturing"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tag">Tag / Short Name</Label>
                <Input
                  id="tag"
                  value={form.tag}
                  onChange={(e) => setForm({ ...form, tag: e.target.value })}
                  placeholder="e.g. Factories"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="icon">FontAwesome Icon Name</Label>
                <Input
                  id="icon"
                  value={form.icon}
                  onChange={(e) => setForm({ ...form, icon: e.target.value })}
                  placeholder="e.g. faIndustry, faHospital"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Short description..."
                  rows={4}
                />
              </div>
            </div>

            {/* Right Side: Media */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Featured Image</Label>
                <MediaPicker
                  value={form.imageId}
                  onChange={(val) => setForm({ ...form, imageId: val as string })}
                  width="w-full"
                  height="h-[200px]"
                  label="Select Image"
                />
                <p className="text-[11px] text-muted-foreground mt-1">
                  <strong>Recommended size: 800x1000 pixels (4:5 vertical ratio).</strong> The first image is used as the large feature, while the rest are displayed smaller.
                </p>
              </div>
            </div>

          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">
              {initialData ? "Save Changes" : "Add Industry"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
