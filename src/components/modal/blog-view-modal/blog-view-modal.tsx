import { Newspaper, Calendar, User } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Image } from "@/components/shared"
import type { Blog } from "@/redux/features/blogs"

interface BlogViewModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  blog: Blog | null
}

export function BlogViewModal({ open, onOpenChange, blog }: BlogViewModalProps) {
  if (!blog) return null

  const authorName = blog.author?.profile?.name || blog.authorName || "Unknown Author"
  const formattedDate = new Date(blog.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="!max-w-[95vw] w-[95vw] h-[95vh] !max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl font-bold">
            <Newspaper className="size-5 text-primary" />
            Blog Details
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 pt-4">
          {/* Cover / Thumbnail Image */}
          {blog.coverImageId || blog.thumbnailId ? (
            <div className="relative w-full h-64 rounded-lg overflow-hidden border">
              <Image
                imageId={blog.coverImageId || blog.thumbnailId}
                alt={blog.title || "Cover Image"}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="flex h-40 w-full items-center justify-center rounded-lg bg-muted text-muted-foreground border">
              <Newspaper className="size-16 opacity-30" />
            </div>
          )}

          {/* Title and Metadata */}
          <div className="space-y-3">
            <h1 className="text-2xl font-bold text-foreground leading-tight">{blog.title}</h1>
            
            <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <User className="size-3.5" />
                <span>By {authorName}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="size-3.5" />
                <span>{formattedDate}</span>
              </div>
              <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${blog.isPublished ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"}`}>
                {blog.isPublished ? "Published" : "Draft"}
              </span>
            </div>
          </div>

          {/* Tags & Categories */}
          <div className="flex flex-wrap gap-2 border-t pt-4">
            {blog.category && blog.category.map((cat) => (
              <span key={cat} className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium">
                {cat}
              </span>
            ))}
            {blog.tags && blog.tags.map((tag) => (
              <span key={tag} className="px-2.5 py-0.5 rounded-full bg-secondary text-secondary-foreground text-xs font-medium">
                #{tag}
              </span>
            ))}
          </div>

          {/* Excerpt / Short Description */}
          {blog.description && (
            <div className="border-t pt-4">
              <span className="block text-sm font-semibold text-muted-foreground mb-1">Short Description</span>
              <p className="text-sm text-foreground italic bg-muted/30 p-3 rounded-md border">{blog.description}</p>
            </div>
          )}

          {/* HTML Content Body */}
          {blog.content && (
            <div className="border-t pt-4 space-y-2">
              <span className="block text-sm font-semibold text-muted-foreground">Content</span>
              <div 
                className="text-sm text-foreground leading-relaxed whitespace-pre-wrap p-4 rounded-md border bg-background prose prose-sm dark:prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: blog.content }}
              />
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
