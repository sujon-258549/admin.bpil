import { useState, useEffect } from "react"
import { useGetDynamicContentsMapQuery, useUpsertDynamicContentMutation } from "@/redux/features/dynamic-content/dynamicContent-api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Save, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { Skeleton } from "@/components/ui/skeleton"
import { MediaPicker } from "@/components/shared"
import { useCurrentUser } from "@/hooks/use-permission"
import { hasAction, isSuperAdmin } from "@/lib/permissions"


export interface GalleryCtaContent {
  smallText: string
  title: string
  imageId: string
  imageAlt: string
}

const defaultContent: GalleryCtaContent = {
  smallText: "Want To Be Featured Next?",
  title: "Start Your Project With BPIL",
  imageId: "",
  imageAlt: "Industrial substation switchgear at night",
}

export function GalleryCtaTab() {
  const user = useCurrentUser()
  const canUpdate = isSuperAdmin(user) || hasAction(user, "content.image.cta", "update")

  const { data: contentMap, isLoading } = useGetDynamicContentsMapQuery("gallery")
  const [upsert, { isLoading: isSaving }] = useUpsertDynamicContentMutation()
  
  const [form, setForm] = useState<GalleryCtaContent>(defaultContent)

  useEffect(() => {
    const timer = setTimeout(() => {
      if (contentMap?.["gallery-cta"]?.value) {
        setForm({ ...defaultContent, ...contentMap["gallery-cta"].value })
      }
    }, 0)
    return () => clearTimeout(timer)
  }, [contentMap])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await upsert({
        key: "gallery-cta",
        group: "gallery",
        type: "json",
        name: "Gallery CTA",
        description: "The call to action section at the bottom of the gallery",
        value: form,
        isActive: true,
      }).unwrap()
      toast.success("Gallery CTA updated successfully")
    } catch {
      toast.error("Failed to update gallery CTA")
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
          <h2 className="text-lg font-medium">Bottom CTA Section</h2>
          <p className="text-sm text-muted-foreground">Manage the call to action at the bottom of the page.</p>
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
            <Label htmlFor="smallText">Small Text (Pill badge)</Label>
            <Input 
              id="smallText" 
              value={form.smallText} 
              onChange={e => setForm(prev => ({ ...prev, smallText: e.target.value }))} 
              placeholder="e.g. Want To Be Featured Next?"
              required 
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Main Title</Label>
            <Input 
              id="title" 
              value={form.title} 
              onChange={e => setForm(prev => ({ ...prev, title: e.target.value }))} 
              placeholder="e.g. Start Your Project With BPIL"
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
              label="Select Background Image"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="imageAlt">Image Alt Text</Label>
            <Input 
              id="imageAlt" 
              value={form.imageAlt} 
              onChange={e => setForm(prev => ({ ...prev, imageAlt: e.target.value }))} 
              placeholder="e.g. Industrial substation switchgear"
            />
          </div>
        </div>
      </div>
    </form>
  )
}
