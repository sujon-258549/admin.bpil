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


export interface ProjectsBannerContent {
  eyebrow: string
  title: string
  description: string
  imageId: string
  imageAlt: string
}

const defaultContent: ProjectsBannerContent = {
  eyebrow: "Our Projects",
  title: "All Projects",
  description: "Explore the electrical infrastructure and power engineering projects successfully delivered by Bangladesh Power Innovation Ltd.",
  imageId: "",
  imageAlt: "Substation at dusk",
}

export function ProjectBannerTab() {
  const user = useCurrentUser()
  const canUpdate = isSuperAdmin(user) || hasAction(user, "content.projects.banner", "update")

  const { data: contentMap, isLoading } = useGetDynamicContentsMapQuery("projects")
  const [upsert, { isLoading: isSaving }] = useUpsertDynamicContentMutation()
  
  const [form, setForm] = useState<ProjectsBannerContent>(defaultContent)

  useEffect(() => {
    const timer = setTimeout(() => {
      if (contentMap?.["projects-banner"]?.value) {
        setForm({ ...defaultContent, ...contentMap["projects-banner"].value })
      }
    }, 0)
    return () => clearTimeout(timer)
  }, [contentMap])

  const handleSave = async () => {
    try {
      await upsert({
        key: "projects-banner",
        group: "projects",
        type: "json",
        name: "Projects Page Banner",
        description: "The top hero banner on the projects page",
        value: form,
        isActive: true,
      }).unwrap()
      toast.success("Banner updated successfully")
    } catch {
      toast.error("Failed to update banner")
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
    <div className="rounded-lg border bg-card text-card-foreground p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-lg font-medium">Page Banner</h2>
          <p className="text-sm text-muted-foreground">
            Manage the hero banner text and background image for the Projects page.
          </p>
        </div>
        {canUpdate && (
          <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
          Save Changes
        </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Small Eyebrow Label</Label>
            <Input 
              value={form.eyebrow} 
              onChange={e => setForm({ ...form, eyebrow: e.target.value })} 
              placeholder="e.g. Our Projects"
            />
          </div>

          <div className="space-y-2">
            <Label>Main Title</Label>
            <Input 
              value={form.title} 
              onChange={e => setForm({ ...form, title: e.target.value })} 
              placeholder="e.g. All Projects"
            />
          </div>

          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea 
              value={form.description} 
              onChange={e => setForm({ ...form, description: e.target.value })} 
              placeholder="Enter the banner description text..."
              className="min-h-[120px]"
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Featured Image</Label>
            <MediaPicker
              value={form.imageId}
              onChange={(val) => setForm({ ...form, imageId: val as string })}
              width="w-full"
              height="h-[200px]"
              label="Select Banner Image"
            />
            <p className="text-[11px] text-muted-foreground mt-1">
              <strong>Recommended size: 1920x600 pixels (wide banner ratio).</strong>
            </p>
          </div>

          <div className="space-y-2">
            <Label>Image Alt Text</Label>
            <Input 
              value={form.imageAlt} 
              onChange={e => setForm({ ...form, imageAlt: e.target.value })} 
              placeholder="e.g. Substation at dusk"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
