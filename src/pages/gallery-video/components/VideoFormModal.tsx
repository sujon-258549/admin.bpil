import { useState } from "react"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { FormField, Text } from "@/components/shared"
import { MediaPicker } from "@/components/shared/media-picker"
import { useVideo } from "@/hooks/data-fetch/use-video"
import type { Video } from "@/redux/features/videos"
import { getErrorMessage } from "@/lib/errors"

interface VideoFormModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  initial?: Video | null
  onCreated?: (video: Video) => void
}

export function VideoFormModal({
  open,
  onOpenChange,
  initial,
  onCreated,
}: VideoFormModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="!max-w-2xl">
        <VideoForm
          key={initial?.id ?? "new"}
          initial={initial ?? null}
          onClose={() => onOpenChange(false)}
          onCreated={onCreated}
        />
      </DialogContent>
    </Dialog>
  )
}

interface FormState {
  title: string
  category: string
  duration: string
  posterId: string
  posterUrl: string
  posterAlt: string
  youtubeId: string
  isActive: boolean
}

function makeInitial(initial: Video | null): FormState {
  if (!initial) {
    return {
      title: "",
      category: "",
      duration: "",
      posterId: "",
      posterUrl: "",
      posterAlt: "",
      youtubeId: "",
      isActive: true,
    }
  }
  return {
    title: initial.title ?? "",
    category: initial.category ?? "",
    duration: initial.duration ?? "",
    posterId: initial.posterId ?? "",
    posterUrl: initial.poster?.url ?? "",
    posterAlt: initial.posterAlt ?? "",
    youtubeId: initial.youtubeId ?? "",
    isActive: initial.isActive,
  }
}

function VideoForm({
  initial,
  onClose,
  onCreated,
}: {
  initial: Video | null
  onClose: () => void
  onCreated?: (video: Video) => void
}) {
  const [form, setForm] = useState<FormState>(() => makeInitial(initial))
  const { createVideo, updateVideo, isLoading } = useVideo()
  const isEdit = Boolean(initial?.id)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.title.trim()) {
      toast.error("Title is required")
      return
    }
    if (!form.youtubeId.trim()) {
      toast.error("YouTube ID is required")
      return
    }

    try {
      const payload = {
        title: form.title.trim(),
        category: form.category.trim() || undefined,
        duration: form.duration.trim() || undefined,
        posterId: form.posterId || undefined,
        posterAlt: form.posterAlt.trim() || undefined,
        youtubeId: form.youtubeId.trim(),
        isActive: form.isActive,
      }

      if (isEdit && initial) {
        const res = await updateVideo({
          id: initial.id,
          data: payload,
        }).unwrap()
        if (res?.success) {
          toast.success(res.message || "Video updated")
        }
      } else {
        const res = await createVideo(payload).unwrap()
        if (res?.success) {
          toast.success(res.message || "Video created")
        }
        if (res?.data) onCreated?.(res.data)
      }
      onClose()
    } catch (err: any) {
      toast.error(getErrorMessage(err, "Failed to save video"))
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex max-h-[85vh] flex-col overflow-hidden">
      <DialogHeader className="flex-shrink-0 p-6 pb-2">
        <DialogTitle>{isEdit ? "Edit Video" : "Create Video"}</DialogTitle>
        <DialogDescription>
          Add a YouTube video to the gallery. Provide the YouTube video ID and a poster image.
        </DialogDescription>
      </DialogHeader>

      <div className="flex-1 overflow-y-auto p-6 pt-4 space-y-4">
        <FormField label="Title" required htmlFor="video-title">
          <Input
            id="video-title"
            required
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="e.g. Substation Walkthrough"
          />
        </FormField>
        
        <div className="grid grid-cols-2 gap-4">
          <FormField label="YouTube ID" required htmlFor="video-youtube">
            <Input
              id="video-youtube"
              required
              value={form.youtubeId}
              onChange={(e) => setForm({ ...form, youtubeId: e.target.value })}
              placeholder="e.g. ScMzIvxBSi4"
            />
          </FormField>
          <FormField label="Category" htmlFor="video-category">
            <Input
              id="video-category"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              placeholder="e.g. Field Reel"
            />
          </FormField>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField label="Duration" htmlFor="video-duration">
            <Input
              id="video-duration"
              value={form.duration}
              onChange={(e) => setForm({ ...form, duration: e.target.value })}
              placeholder="e.g. 1:54"
            />
          </FormField>
          <FormField label="Poster Alt Text" htmlFor="video-alt">
            <Input
              id="video-alt"
              value={form.posterAlt}
              onChange={(e) => setForm({ ...form, posterAlt: e.target.value })}
              placeholder="e.g. Industrial substation"
            />
          </FormField>
        </div>

        <FormField label="Poster Image">
          <MediaPicker
            value={form.posterId || undefined}
            onChange={(imageId: string) =>
              setForm({
                ...form,
                posterId: imageId,
              })
            }
          />
          <Text size="xs" tone="muted" className="mt-1">
            Recommended aspect ratio 16:9 for video posters.
          </Text>
        </FormField>

        <div className="flex items-center justify-between rounded-md border bg-muted/30 px-3 py-2">
          <div>
            <Label className="text-sm font-medium">Active</Label>
            <Text size="xs" tone="muted">
              Hidden videos won't appear on the public website.
            </Text>
          </div>
          <Switch
            checked={form.isActive}
            onCheckedChange={(v) => setForm({ ...form, isActive: v })}
          />
        </div>
      </div>

      <DialogFooter className="flex-shrink-0 p-6 pt-2">
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="size-4 mr-2 animate-spin" /> Saving…
            </>
          ) : isEdit ? (
            "Update"
          ) : (
            "Create"
          )}
        </Button>
      </DialogFooter>
    </form>
  )
}
