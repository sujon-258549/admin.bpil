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


export interface GalleryBannerContent {
  eyebrow: string
  title: string
  description: string
  imageId: string
  imageAlt: string
}

const defaultContent: GalleryBannerContent = {
  eyebrow: "Our Work",
  title: "Gallery",
  description: "A selection of recent installations, equipment and field engineering work delivered by Bangladesh Power Innovation Ltd.",
  imageId: "",
  imageAlt: "Industrial substation infrastructure",
}

export function GalleryBannerTab() {
  const user = useCurrentUser()
  const canUpdate = isSuperAdmin(user) || hasAction(user, "content.image.banner", "update")

  const { data: contentMap, isLoading } = useGetDynamicContentsMapQuery("gallery")
  const [upsert, { isLoading: isSaving }] = useUpsertDynamicContentMutation()
  
  const [form, setForm] = useState<GalleryBannerContent>(defaultContent)

  useEffect(() => {
    const timer = setTimeout(() => {
      if (contentMap?.["gallery-banner"]?.value) {
        setForm({ ...defaultContent, ...contentMap["gallery-banner"].value })
      }
    }, 0)
    return () => clearTimeout(timer)
  }, [contentMap])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await upsert({
        key: "gallery-banner",
        group: "gallery",
        type: "json",
        name: "Gallery Banner",
        description: "The top hero banner for the Gallery page",
        value: form,
        isActive: true,
      }).unwrap()
      toast.success("Gallery banner updated successfully")
    } catch {
      toast.error("Failed to update gallery banner")
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
          <p className="text-sm text-muted-foreground">Manage the top hero section of the Gallery page.</p>
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
              placeholder="e.g. Our Work"
              required 
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Main Title</Label>
            <Input 
              id="title" 
              value={form.title} 
              onChange={e => setForm(prev => ({ ...prev, title: e.target.value }))} 
              placeholder="e.g. Gallery"
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
              placeholder="e.g. A selection of recent installations..."
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
              placeholder="e.g. Industrial substation infrastructure"
            />
          </div>
        </div>
      </div>
    </form>
  )
}
