import { useState } from "react"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
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
      <DialogContent className="sm:max-w-xl">
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
  categories: string
  isPublished: boolean
}

function makeInitial(initial: Blog | null): FormState {
  if (!initial) return { title: "", content: "", description: "", categories: "", isPublished: false }
  return {
    title: initial.title ?? "",
    content: initial.content ?? "",
    description: initial.description ?? "",
    categories: initial.category?.join(", ") ?? "",
    isPublished: initial.isPublished,
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
    const formattedCategories = form.categories
      .split(",")
      .map((c) => c.trim())
      .filter(Boolean)

    try {
      if (isEdit && initial) {
        await updateBlog({
          id: initial.id,
          data: {
            title: form.title.trim(),
            content: form.content.trim() || undefined,
            description: form.description.trim() || undefined,
            category: formattedCategories.length ? formattedCategories : undefined,
            isPublished: form.isPublished,
          },
        }).unwrap()
        toast.success("Blog updated")
      } else {
        const res = await createBlog({
          title: form.title.trim(),
          content: form.content.trim() || undefined,
          description: form.description.trim() || undefined,
          category: formattedCategories.length ? formattedCategories : undefined,
          isPublished: form.isPublished,
        }).unwrap()
        toast.success("Blog created")
        if (res?.data) onCreated?.(res.data)
      }
      onClose()
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to save blog"))
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <DialogHeader>
        <DialogTitle>
          {isEdit ? "Edit Blog Post" : "Create Blog Post"}
        </DialogTitle>
        <DialogDescription>
          Publish news and updates to your blog.
        </DialogDescription>
      </DialogHeader>

      <div className="my-4 space-y-4">
        <FormField label="Title" required htmlFor="blog-title">
          <Input
            id="blog-title"
            required
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="e.g. 10 Tips for Better Management"
          />
        </FormField>
        <FormField label="Categories" htmlFor="blog-categories">
          <Input
            id="blog-categories"
            value={form.categories}
            onChange={(e) =>
              setForm({ ...form, categories: e.target.value })
            }
            placeholder="e.g. News, Update, Important (comma separated)"
          />
        </FormField>
        <FormField label="Description" htmlFor="blog-desc">
          <Textarea
            id="blog-desc"
            rows={2}
            value={form.description}
            onChange={(e) =>
              setForm({ ...form, description: e.target.value })
            }
            placeholder="Short excerpt or description"
          />
        </FormField>
        <FormField label="Content" htmlFor="blog-content">
          <Textarea
            id="blog-content"
            rows={6}
            value={form.content}
            onChange={(e) =>
              setForm({ ...form, content: e.target.value })
            }
            placeholder="Full blog content..."
          />
        </FormField>
        <div className="flex items-center justify-between rounded-md border bg-muted/30 px-3 py-2">
          <div>
            <Label className="text-sm font-medium">Publish Now</Label>
            <Text size="xs" tone="muted">
              Make this post instantly visible on the public site.
            </Text>
          </div>
          <Switch
            checked={form.isPublished}
            onCheckedChange={(v) => setForm({ ...form, isPublished: v })}
          />
        </div>
      </div>

      <DialogFooter>
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
              <Loader2 className="size-4 animate-spin" /> Saving…
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
