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


export interface ServicesBannerContent {
  eyebrow: string
  title: string
  description: string
  imageId: string
  imageAlt: string
}

const defaultContent: ServicesBannerContent = {
  eyebrow: "What We Do",
  title: "Services",
  description: "Preventive maintenance, on-site testing and emergency support for transformers, switchgear, PFI panels, generators and solar — all under one roof.",
  imageId: "",
  imageAlt: "Engineer inspecting industrial switchgear",
}

export function ServicesBannerTab() {
  const user = useCurrentUser()
  const canUpdate = isSuperAdmin(user) || hasAction(user, "content.services.banner", "update")

  const { data: contentMap, isLoading } = useGetDynamicContentsMapQuery("services")
  const [upsert, { isLoading: isSaving }] = useUpsertDynamicContentMutation()
  
  const [form, setForm] = useState<ServicesBannerContent>(defaultContent)

  useEffect(() => {
    const timer = setTimeout(() => {
      if (contentMap?.["services-banner"]?.value) {
        setForm({ ...defaultContent, ...contentMap["services-banner"].value })
      }
    }, 0)
    return () => clearTimeout(timer)
  }, [contentMap])

  const handleSave = async () => {
    try {
      await upsert({
        key: "services-banner",
        group: "services",
        type: "json",
        name: "Services Page Banner",
        description: "The top hero banner on the services page",
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
            Manage the hero banner text and background image for the Services page.
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
              placeholder="e.g. What We Do"
            />
          </div>

          <div className="space-y-2">
            <Label>Main Title</Label>
            <Input 
              value={form.title} 
              onChange={e => setForm({ ...form, title: e.target.value })} 
              placeholder="e.g. Services"
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
              placeholder="e.g. Engineer inspecting industrial switchgear"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
