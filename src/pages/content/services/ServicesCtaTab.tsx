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


export interface ServicesCtaContent {
  eyebrow: string
  title: string
  description: string
  buttonText: string
  buttonLink: string
  imageId: string
  imageAlt: string
}

const defaultContent: ServicesCtaContent = {
  eyebrow: "Get Started Today",
  title: "Power Your Success Today",
  description: "Let us transform your electrical infrastructure with our comprehensive solutions — engineered, installed and supported by specialists.",
  buttonText: "Get A Free Consultation",
  buttonLink: "/contact",
  imageId: "",
  imageAlt: "Industrial substation switchgear at night",
}

export function ServicesCtaTab() {
  const user = useCurrentUser()
  const canUpdate = isSuperAdmin(user) || hasAction(user, "content.services.cta", "update")

  const { data: contentMap, isLoading } = useGetDynamicContentsMapQuery("services")
  const [upsert, { isLoading: isSaving }] = useUpsertDynamicContentMutation()
  
  const [form, setForm] = useState<ServicesCtaContent>(defaultContent)

  useEffect(() => {
    const timer = setTimeout(() => {
      if (contentMap?.["services-cta"]?.value) {
        setForm({ ...defaultContent, ...contentMap["services-cta"].value })
      }
    }, 0)
    return () => clearTimeout(timer)
  }, [contentMap])

  const handleSave = async () => {
    try {
      await upsert({
        key: "services-cta",
        group: "services",
        type: "json",
        name: "Services Call To Action",
        description: "The bottom CTA banner on the services page",
        value: form,
        isActive: true,
      }).unwrap()
      toast.success("CTA banner updated successfully")
    } catch {
      toast.error("Failed to update CTA banner")
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
          <h2 className="text-lg font-medium">Call To Action Banner</h2>
          <p className="text-sm text-muted-foreground">
            Manage the bottom visual banner to drive conversions on the Services page.
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
              placeholder="e.g. Get Started Today"
            />
          </div>

          <div className="space-y-2">
            <Label>Main Title</Label>
            <Input 
              value={form.title} 
              onChange={e => setForm({ ...form, title: e.target.value })} 
              placeholder="e.g. Power Your Success Today"
            />
          </div>

          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea 
              value={form.description} 
              onChange={e => setForm({ ...form, description: e.target.value })} 
              placeholder="Enter the CTA description text..."
              className="min-h-[100px]"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Button Text</Label>
              <Input 
                value={form.buttonText} 
                onChange={e => setForm({ ...form, buttonText: e.target.value })} 
                placeholder="e.g. Get A Free Consultation"
              />
            </div>
            <div className="space-y-2">
              <Label>Button Link</Label>
              <Input 
                value={form.buttonLink} 
                onChange={e => setForm({ ...form, buttonLink: e.target.value })} 
                placeholder="e.g. /contact"
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Background Image</Label>
            <MediaPicker
              value={form.imageId}
              onChange={(val) => setForm({ ...form, imageId: val as string })}
              width="w-full"
              height="h-[200px]"
              label="Select Banner Image"
            />
            <p className="text-[11px] text-muted-foreground mt-1">
              <strong>Recommended size: 1200x800 pixels.</strong>
            </p>
          </div>

          <div className="space-y-2">
            <Label>Image Alt Text</Label>
            <Input 
              value={form.imageAlt} 
              onChange={e => setForm({ ...form, imageAlt: e.target.value })} 
              placeholder="e.g. Industrial substation switchgear at night"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
