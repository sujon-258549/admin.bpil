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

export interface AboutBannerContent {
  intro: {
    eyebrow: string
    title: string
    description: string
    imageId: string
    imageAlt: string
  }
}

const defaultContent: AboutBannerContent = {
  intro: {
    eyebrow: "Our Story",
    title: "About Us",
    description: "A decade-plus of designing, supplying and commissioning electrical infrastructure for Bangladesh's industries, utilities and commercial sites.",
    imageId: "",
    imageAlt: "BPIL engineering team at an industrial substation",
  }
}

export function BannerTab() {
  const user = useCurrentUser()
  const canUpdate = isSuperAdmin(user) || hasAction(user, "content.about.banner", "update")
  const { data: contentMap, isLoading } = useGetDynamicContentsMapQuery("about")
  const [upsert, { isLoading: isSaving }] = useUpsertDynamicContentMutation()
  
  const [form, setForm] = useState<AboutBannerContent>(defaultContent)

  useEffect(() => {
    const timer = setTimeout(() => {
      if (contentMap?.["about-banner"]?.value) {
        setForm({ ...defaultContent, ...contentMap["about-banner"].value })
      }
    }, 0)
    return () => clearTimeout(timer)
  }, [contentMap])

  const handleSaveIntro = async () => {
    try {
      await upsert({
        key: "about-banner",
        group: "about",
        type: "json",
        name: "About Page Banner",
        description: "The top hero banner for the About page",
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
      
      <div className="w-full">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-medium">Page Banner</h2>
            <p className="text-sm text-muted-foreground">
              Manage the top banner text and background image for the About page.
            </p>
          </div>
          {canUpdate && (
            <Button onClick={handleSaveIntro} disabled={isSaving}>
            {isSaving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
            Save Changes
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-4 bg-muted/20 p-4 rounded-lg border">
            <h3 className="font-semibold text-sm border-b pb-2">Typography</h3>
            
            <div className="space-y-2">
              <Label>Eyebrow Label</Label>
              <Input 
                value={form.intro.eyebrow} 
                onChange={e => setForm({ ...form, intro: { ...form.intro, eyebrow: e.target.value } })} 
              />
            </div>
            
            <div className="space-y-2">
              <Label>Main Title</Label>
              <Input 
                value={form.intro.title} 
                onChange={e => setForm({ ...form, intro: { ...form.intro, title: e.target.value } })} 
              />
            </div>

            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea 
                value={form.intro.description} 
                onChange={e => setForm({ ...form, intro: { ...form.intro, description: e.target.value } })} 
                className="min-h-[100px]"
              />
            </div>
          </div>

          <div className="space-y-4 bg-muted/20 p-4 rounded-lg border">
            <h3 className="font-semibold text-sm border-b pb-2">Background Image</h3>
            <div className="space-y-2">
              <Label>Select Image</Label>
              <MediaPicker
                value={form.intro.imageId}
                onChange={(val) => setForm({ ...form, intro: { ...form.intro, imageId: val as string } })}
                width="w-full"
                height="h-[200px]"
                label="Select Banner Background"
              />
              <p className="text-[11px] text-muted-foreground mt-1">
                <strong>Recommended size: 1920x600 pixels (wide ratio).</strong>
              </p>
            </div>
            
            <div className="space-y-2 mt-4">
              <Label>Image Alt Text</Label>
              <Input 
                value={form.intro.imageAlt} 
                onChange={e => setForm({ ...form, intro: { ...form.intro, imageAlt: e.target.value } })} 
                placeholder="Describe the image for accessibility"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
