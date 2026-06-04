import { useState } from "react"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { TagInput } from "@/components/ui/tag-input"
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
import { useBlog } from "@/hooks/data-fetch"
import type { Blog } from "@/redux/features/blogs"
import { getErrorMessage } from "@/lib/errors"
import RichTextEditor from "@/components/ui/rich-text-editor"
import { MediaPicker } from "@/components/shared"

interface BlogFormModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  initial?: Blog | null
  onCreated?: (blog: Blog) => void
}

export function BlogFormModal({
  open,
  onOpenChange,
  initial,
  onCreated,
}: BlogFormModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="!w-[95vw] !max-w-[95vw] max-h-[95vh] p-0 flex flex-col overflow-hidden bg-background">
        <BlogForm
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
  content: string
  description: string
  categories: string[]
  isPublished: boolean
  thumbnailId?: string
  coverImageId?: string
}

function makeInitial(initial: Blog | null): FormState {
  if (!initial) return { title: "", content: "", description: "", categories: [], isPublished: false }
  return {
    title: initial.title ?? "",
    content: initial.content ?? "",
    description: initial.description ?? "",
    categories: initial.category ?? [],
    isPublished: initial.isPublished,
    thumbnailId: initial.thumbnailId,
    coverImageId: initial.coverImageId,
  }
}

function BlogForm({
  initial,
  onClose,
  onCreated,
}: {
  initial: Blog | null
  onClose: () => void
  onCreated?: (blog: Blog) => void
}) {
  const [form, setForm] = useState<FormState>(() => makeInitial(initial))
  const { createBlog, updateBlog, isLoading } = useBlog()
  const isEdit = Boolean(initial?.id)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.title.trim()) {
      toast.error("Title is required")
      return
    }
    const formattedCategories = form.categories.map(c => c.trim()).filter(Boolean)

    try {
      if (isEdit && initial) {
        const res = await updateBlog({
          id: initial.id,
          data: {
            title: form.title.trim(),
            content: form.content.trim() || undefined,
            description: form.description.trim() || undefined,
            category: formattedCategories.length ? formattedCategories : undefined,
            thumbnailId: form.thumbnailId,
            coverImageId: form.coverImageId,
            isPublished: form.isPublished,
          },
        }).unwrap()
        if (res?.success) {
          toast.success(res.message || "Blog updated")
        }
      } else {
        const res = await createBlog({
          title: form.title.trim(),
          content: form.content.trim() || undefined,
          description: form.description.trim() || undefined,
          category: formattedCategories.length ? formattedCategories : undefined,
          thumbnailId: form.thumbnailId,
          coverImageId: form.coverImageId,
          isPublished: form.isPublished,
        }).unwrap()
        if (res?.success) {
          toast.success(res.message || "Blog created")
        }
        if (res?.data) onCreated?.(res.data)
      }
      onClose()
    } catch (err: any) {
      toast.error(getErrorMessage(err, "Failed to save blog"))
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col h-full max-h-[95vh]">
      <DialogHeader className="px-6 py-5 border-b bg-muted/10">
        <DialogTitle className="text-2xl font-bold tracking-tight">
          {isEdit ? "Edit Blog Post" : "Create Blog Post"}
        </DialogTitle>
        <DialogDescription className="text-base">
          Publish news and updates to your audience. Make it rich and beautiful!
        </DialogDescription>
      </DialogHeader>

      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
        <FormField label="Title" required htmlFor="blog-title">
          <Input
            id="blog-title"
            required
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="e.g. 10 Tips for Better Management"
            className="h-11 transition-all focus:ring-2 focus:ring-primary/20"
          />
        </FormField>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label className="mb-2 block text-sm font-medium">
              Thumbnail <span className="text-destructive">*</span>
            </Label>
            <MediaPicker
              value={form.thumbnailId}
              onChange={(id) => setForm({ ...form, thumbnailId: id as string })}
              label="Upload Image"
            />
          </div>

          <div>
            <Label className="mb-2 block text-sm font-medium">Cover Image</Label>
            <MediaPicker
              value={form.coverImageId}
              onChange={(id) => setForm({ ...form, coverImageId: id as string })}
              label="Upload Cover"
            />
          </div>
        </div>

        <FormField label="Categories" htmlFor="blog-categories">
          <TagInput
            id="blog-categories"
            value={form.categories}
            onChange={(value) =>
              setForm({ ...form, categories: value })
            }
            suggestions={["News", "Update", "Important", "Management", "Technology", "Design", "Marketing", "Event"]}
            placeholder="Type a category and press Enter..."
            className="min-h-11 transition-all focus-within:ring-2 focus-within:ring-primary/20"
          />
        </FormField>

        <FormField label="Short Description" htmlFor="blog-desc">
          <Input
            id="blog-desc"
            value={form.description}
            onChange={(e) =>
              setForm({ ...form, description: e.target.value })
            }
            placeholder="A brief excerpt or description for blog lists and SEO..."
            className="h-11 transition-all focus:ring-2 focus:ring-primary/20"
          />
        </FormField>
        <div className="pt-2">
          <Label className="mb-2 block text-sm font-medium">Content</Label>
          <div className="rounded-lg shadow-sm border overflow-hidden">
            <RichTextEditor
              id="blog-content"
              name="content"
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              placeholder="Write your amazing blog post here..."
              height={550}
            />
          </div>
        </div>

        <div className="flex items-center justify-between rounded-md border bg-gradient-to-r from-muted/30 to-muted/10 px-5 py-4 mt-4">
          <div>
            <Label className="text-base font-semibold text-foreground">Publish Now</Label>
            <Text size="xs" tone="muted" className="mt-1">
              Make this post instantly visible on the public site.
            </Text>
          </div>
          <Switch
            checked={form.isPublished}
            onCheckedChange={(v) => setForm({ ...form, isPublished: v })}
            className="data-[state=checked]:bg-primary"
          />
        </div>
      </div>

      <DialogFooter className="px-6 py-4 border-t bg-muted/10 mt-auto">
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          disabled={isLoading}
          className="min-w-24"
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading} className="min-w-24">
          {isLoading ? (
            <>
              <Loader2 className="mr-2 size-4 animate-spin" /> Saving...
            </>
          ) : isEdit ? (
            "Update Post"
          ) : (
            "Publish Post"
          )}
        </Button>
      </DialogFooter>
    </form>
  )
}

