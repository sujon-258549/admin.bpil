import { useState, useEffect } from "react"
import { useGetDynamicContentsMapQuery, useUpsertDynamicContentMutation } from "@/redux/features/dynamic-content/dynamicContent-api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Save, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { Skeleton } from "@/components/ui/skeleton"
import { MediaPicker } from "@/components/shared"
import { useCurrentUser } from "@/hooks/use-permission"
import { hasAction, isSuperAdmin } from "@/lib/permissions"


export interface BlogBannerContent {
  eyebrow: string
  title: string
  description: string
  imageId: string
  imageAlt: string
}

const defaultContent: BlogBannerContent = {
  eyebrow: "Insights & Updates",
  title: "BPIL Blog",
  description: "Read the latest industry news, technical insights, and company updates from Bangladesh Power Innovation Ltd.",
  imageId: "",
  imageAlt: "Blog banner image",
}

export function BlogBannerTab() {
  const user = useCurrentUser()
  const canUpdate = isSuperAdmin(user) || hasAction(user, "content.blog.banner", "update")

  const { data: contentMap, isLoading } = useGetDynamicContentsMapQuery("blog")
  const [upsert, { isLoading: isSaving }] = useUpsertDynamicContentMutation()
  
  const [form, setForm] = useState<BlogBannerContent>(defaultContent)

  useEffect(() => {
    const timer = setTimeout(() => {
      if (contentMap?.["blog-banner"]?.value) {
        setForm({ ...defaultContent, ...contentMap["blog-banner"].value })
      }
    }, 0)
    return () => clearTimeout(timer)
  }, [contentMap])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await upsert({
        key: "blog-banner",
        group: "blog",
        type: "json",
        name: "Blog Banner",
        description: "The top hero banner for the Blog page",
        value: form,
        isActive: true,
      }).unwrap()
      toast.success("Blog banner updated successfully")
    } catch {
      toast.error("Failed to update blog banner")
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-40 w-full" />
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-card border rounded-lg p-6">
      <div className="flex items-center justify-between border-b pb-4">
        <div>
          <h2 className="text-lg font-medium">Page Banner</h2>
          <p className="text-sm text-muted-foreground">Manage the top hero section of the Blog page.</p>
        </div>
        {canUpdate && (
          <Button type="submit" disabled={isSaving}>
          {isSaving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
          Save Changes
          </Button>
        )}
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="eyebrow">Eyebrow (Small text above title)</Label>
            <Input 
              id="eyebrow" 
              value={form.eyebrow} 
              onChange={e => setForm(prev => ({ ...prev, eyebrow: e.target.value }))} 
              placeholder="e.g. Insights & Updates"
              required 
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Main Title</Label>
            <Input 
              id="title" 
              value={form.title} 
              onChange={e => setForm(prev => ({ ...prev, title: e.target.value }))} 
              placeholder="e.g. BPIL Blog"
              required 
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea 
              id="description" 
              value={form.description} 
              onChange={e => setForm(prev => ({ ...prev, description: e.target.value }))} 
              className="h-24"
              placeholder="e.g. Read the latest industry news..."
              required 
            />
          </div>
        </div>

        <div className="space-y-4 bg-muted/30 p-4 rounded-lg border">
          <div className="space-y-2">
            <Label>Background Image</Label>
            <MediaPicker
              value={form.imageId}
              onChange={(val) => setForm(prev => ({ ...prev, imageId: val as string }))}
              width="w-full"
              height="h-[180px]"
              label="Select Banner Image"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="imageAlt">Image Alt Text (SEO)</Label>
            <Input 
              id="imageAlt" 
              value={form.imageAlt} 
              onChange={e => setForm(prev => ({ ...prev, imageAlt: e.target.value }))} 
              placeholder="e.g. Blog banner image"
            />
          </div>
        </div>
      </div>
    </form>
  )
}
