import { useState, useEffect } from "react"
import { useGetDynamicContentsMapQuery, useUpsertDynamicContentMutation } from "@/redux/features/dynamic-content/dynamicContent-api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Save, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { Skeleton } from "@/components/ui/skeleton"
import { useCurrentUser } from "@/hooks/use-permission"
import { hasAction, isSuperAdmin } from "@/lib/permissions"


export interface GalleryVideosContent {
  eyebrow: string
  titlePart1: string
  titleHighlight: string
  description: string
}

const defaultContent: GalleryVideosContent = {
  eyebrow: "Video Reels",
  titlePart1: "Caught on",
  titleHighlight: "Camera",
  description: "Short field reels from active BPIL projects — substation commissioning, panel test runs and rooftop solar going live.",
}

export function GalleryVideosTab() {
  const user = useCurrentUser()
  const canUpdate = isSuperAdmin(user) || hasAction(user, "content.image.videos", "update")

  const { data: contentMap, isLoading } = useGetDynamicContentsMapQuery("gallery")
  const [upsert, { isLoading: isSaving }] = useUpsertDynamicContentMutation()
  
  const [form, setForm] = useState<GalleryVideosContent>(defaultContent)

  useEffect(() => {
    const timer = setTimeout(() => {
      if (contentMap?.["gallery-videos"]?.value) {
        setForm({ ...defaultContent, ...contentMap["gallery-videos"].value })
      }
    }, 0)
    return () => clearTimeout(timer)
  }, [contentMap])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await upsert({
        key: "gallery-videos",
        group: "gallery",
        type: "json",
        name: "Gallery Videos Text",
        description: "The intro text for the video reels section",
        value: form,
        isActive: true,
      }).unwrap()
      toast.success("Gallery videos text updated successfully")
    } catch {
      toast.error("Failed to update gallery videos text")
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-card border rounded-lg p-6">
      <div className="flex items-center justify-between border-b pb-4">
        <div>
          <h2 className="text-lg font-medium">Video Reels Text</h2>
          <p className="text-sm text-muted-foreground">Manage the intro text for the video reels section.</p>
        </div>
        {canUpdate && (
          <Button type="submit" disabled={isSaving}>
          {isSaving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
          Save Changes
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="eyebrow">Eyebrow (Small text above title)</Label>
            <Input 
              id="eyebrow" 
              value={form.eyebrow} 
              onChange={e => setForm(prev => ({ ...prev, eyebrow: e.target.value }))} 
              placeholder="e.g. Video Reels"
              required 
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="titlePart1">Title (Part 1)</Label>
            <Input 
              id="titlePart1" 
              value={form.titlePart1} 
              onChange={e => setForm(prev => ({ ...prev, titlePart1: e.target.value }))} 
              placeholder="e.g. Caught on"
              required 
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="titleHighlight">Title Highlight (Blue text)</Label>
            <Input 
              id="titleHighlight" 
              value={form.titleHighlight} 
              onChange={e => setForm(prev => ({ ...prev, titleHighlight: e.target.value }))} 
              placeholder="e.g. Camera"
              required 
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea 
              id="description" 
              value={form.description} 
              onChange={e => setForm(prev => ({ ...prev, description: e.target.value }))} 
              className="h-24"
              placeholder="e.g. Short field reels from active BPIL projects..."
              required 
            />
          </div>
        </div>
      </div>
    </form>
  )
}
