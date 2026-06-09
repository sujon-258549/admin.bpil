import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { MediaPicker } from "@/components/shared"

export interface VideoServiceData {
  id: string
  title: string
  category: string
  duration: string
  description: string
  youtubeId: string
  href: string
  imageId: string
}

interface ServicesVideoFormModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  initialData?: VideoServiceData | null
  onSubmit: (data: VideoServiceData) => void
}

const defaultForm: VideoServiceData = {
  id: "",
  title: "",
  category: "",
  duration: "",
  description: "",
  youtubeId: "",
  href: "",
  imageId: "",
}

export function ServicesVideoFormModal({ open, onOpenChange, initialData, onSubmit }: ServicesVideoFormModalProps) {
  const [form, setForm] = useState<VideoServiceData>(defaultForm)

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
      <DialogContent className="!max-w-4xl !max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{initialData ? "Edit Video Reel" : "Add Video Reel"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Left Side */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Video Title</Label>
                <Input
                  id="title"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g. Transformer Service"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category Badge</Label>
                  <Input
                    id="category"
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    placeholder="e.g. Field Demo"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duration">Duration</Label>
                  <Input
                    id="duration"
                    value={form.duration}
                    onChange={(e) => setForm({ ...form, duration: e.target.value })}
                    placeholder="e.g. 2:14"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="youtubeId">YouTube Video ID</Label>
                <Input
                  id="youtubeId"
                  value={form.youtubeId}
                  onChange={(e) => setForm({ ...form, youtubeId: e.target.value })}
                  placeholder="e.g. ScMzIvxBSi4"
                  required
                />
                <p className="text-[11px] text-muted-foreground mt-1">
                  The 11-character code in the YouTube URL. e.g., youtube.com/watch?v=<b>ScMzIvxBSi4</b>
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="href">Action Link (Optional)</Label>
                <Input
                  id="href"
                  value={form.href}
                  onChange={(e) => setForm({ ...form, href: e.target.value })}
                  placeholder="e.g. /products/transformer"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Short Description</Label>
                <Textarea
                  id="description"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Visible on the card..."
                  rows={3}
                  required
                />
              </div>
            </div>

            {/* Right Side: Media */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Cover Poster Image</Label>
                <MediaPicker
                  value={form.imageId}
                  onChange={(val) => setForm({ ...form, imageId: val as string })}
                  width="w-full"
                  height="h-[250px]"
                  label="Select Thumbnail"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Displays before the video starts playing. The first video in the list uses a large cover, the next two use square covers.
                </p>
              </div>

              {form.youtubeId && (
                <div className="rounded-lg overflow-hidden border aspect-video bg-black flex items-center justify-center">
                  <iframe
                    src={`https://www.youtube.com/embed/${form.youtubeId}?modestbranding=1&rel=0`}
                    className="w-full h-full"
                    allowFullScreen
                  />
                </div>
              )}
            </div>

          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">
              {initialData ? "Save Changes" : "Add Video"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
