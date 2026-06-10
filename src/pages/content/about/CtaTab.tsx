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


export interface CtaSectionContent {
  eyebrow: string
  titlePart1: string
  titleHighlight: string
  titlePart2: string
  buttonText: string
  buttonLink: string
  imageId: string
}

const defaultContent: CtaSectionContent = {
  eyebrow: "Ready to Start?",
  titlePart1: "Let's Build The",
  titleHighlight: "Infrastructure",
  titlePart2: "Your Business Deserves.",
  buttonText: "Schedule a Consultation",
  buttonLink: "/contact",
  imageId: "",
}

export function CtaTab() {
  const user = useCurrentUser()
  const canUpdate = isSuperAdmin(user) || hasAction(user, "content.about.cta", "update")

  const { data: contentMap, isLoading } = useGetDynamicContentsMapQuery("about")
  const [upsert, { isLoading: isSaving }] = useUpsertDynamicContentMutation()
  
  const [form, setForm] = useState<CtaSectionContent>(defaultContent)

  useEffect(() => {
    const timer = setTimeout(() => {
      if (contentMap?.["about-cta"]?.value) {
        setForm({ ...defaultContent, ...contentMap["about-cta"].value })
      }
    }, 0)
    return () => clearTimeout(timer)
  }, [contentMap])

  const handleSaveIntro = async () => {
    try {
      await upsert({
        key: "about-cta",
        group: "about",
        type: "json",
        name: "About CTA",
        description: "Call to action banner on the About page",
        value: form,
        isActive: true,
      }).unwrap()
      toast.success("CTA section updated successfully")
    } catch {
      toast.error("Failed to update CTA section")
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
            <h2 className="text-lg font-medium">Call to Action</h2>
            <p className="text-sm text-muted-foreground">
              Manage the bottom CTA banner text and background image.
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
            <h3 className="font-semibold text-sm border-b pb-2">Typography & Link</h3>
            
            <div className="space-y-2">
              <Label>Small Eyebrow Label</Label>
              <Input 
                value={form.eyebrow} 
                onChange={e => setForm({ ...form, eyebrow: e.target.value })} 
              />
            </div>
            
            <div className="grid grid-cols-3 gap-2">
              <div className="space-y-2">
                <Label>Title (Part 1)</Label>
                <Input 
                  value={form.titlePart1} 
                  onChange={e => setForm({ ...form, titlePart1: e.target.value })} 
                />
              </div>
              <div className="space-y-2">
                <Label>Highlight</Label>
                <Input 
                  value={form.titleHighlight} 
                  onChange={e => setForm({ ...form, titleHighlight: e.target.value })} 
                />
              </div>
              <div className="space-y-2">
                <Label>Title (Part 2)</Label>
                <Input 
                  value={form.titlePart2} 
                  onChange={e => setForm({ ...form, titlePart2: e.target.value })} 
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="space-y-2">
                <Label>Button Text</Label>
                <Input 
                  value={form.buttonText} 
                  onChange={e => setForm({ ...form, buttonText: e.target.value })} 
                />
              </div>
              <div className="space-y-2">
                <Label>Button Link</Label>
                <Input 
                  value={form.buttonLink} 
                  onChange={e => setForm({ ...form, buttonLink: e.target.value })} 
                />
              </div>
            </div>
          </div>

          <div className="space-y-4 bg-muted/20 p-4 rounded-lg border">
            <h3 className="font-semibold text-sm border-b pb-2">Background Image</h3>
            <div className="space-y-2">
              <MediaPicker
                value={form.imageId}
                onChange={(val) => setForm({ ...form, imageId: val as string })}
                width="w-full"
                height="h-[200px]"
                label="Select CTA Background"
              />
              <p className="text-[11px] text-muted-foreground mt-1">
                <strong>Recommended size: 1920x1080 pixels (16:9 ratio).</strong>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
