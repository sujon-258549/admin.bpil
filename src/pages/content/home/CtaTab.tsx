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

export interface CtaSectionContent {
  intro: {
    eyebrow: string
    title: string
    description: string
    buttonText: string
    buttonLink: string
    imageId: string
  }
}

const defaultContent: CtaSectionContent = {
  intro: {
    eyebrow: "Let's Build Together",
    title: "Transform Your Power Infrastructure",
    description: "Ready to enhance your electrical system with engineered, dependable solutions? Our team is one call away.",
    buttonText: "Get In Touch",
    buttonLink: "/contact",
    imageId: ""
  }
}

export function CtaTab() {
  const { data: contentMap, isLoading } = useGetDynamicContentsMapQuery("home")
  const [upsert, { isLoading: isSaving }] = useUpsertDynamicContentMutation()
  
  const [form, setForm] = useState<CtaSectionContent>(defaultContent)

  useEffect(() => {
    const timer = setTimeout(() => {
      if (contentMap?.["home-cta"]?.value) {
        setForm({ ...defaultContent, ...contentMap["home-cta"].value })
      }
    }, 0)
    return () => clearTimeout(timer)
  }, [contentMap])

  const handleSaveIntro = async () => {
    try {
      await upsert({
        key: "home-cta",
        group: "home",
        type: "json",
        name: "Home CTA Section",
        description: "Content and background image for the Call To Action section on the home page",
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
      
      {/* Intro Form */}
      <div className="">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-medium">CTA Section</h2>
            <p className="text-sm text-muted-foreground">
              Manage the Call To Action banner text and background image.
            </p>
          </div>
          <Button onClick={handleSaveIntro} disabled={isSaving}>
            {isSaving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
            Save Changes
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4 bg-muted/20 p-4 rounded-lg border">
            <h3 className="font-semibold text-sm border-b pb-2">Typography & Content</h3>
            
            <div className="space-y-2">
              <Label>Small Eyebrow Label</Label>
              <Input 
                value={form.intro.eyebrow} 
                onChange={e => setForm({ ...form, intro: { ...form.intro, eyebrow: e.target.value } })} 
                placeholder="e.g. Let's Build Together"
              />
            </div>
            
            <div className="space-y-2">
              <Label>Main Title (Gradient)</Label>
              <Input 
                value={form.intro.title} 
                onChange={e => setForm({ ...form, intro: { ...form.intro, title: e.target.value } })} 
                placeholder="e.g. Transform Your Power Infrastructure"
              />
            </div>

            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea 
                value={form.intro.description} 
                onChange={e => setForm({ ...form, intro: { ...form.intro, description: e.target.value } })} 
                className="min-h-[80px]"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Primary Button Text</Label>
                <Input 
                  value={form.intro.buttonText} 
                  onChange={e => setForm({ ...form, intro: { ...form.intro, buttonText: e.target.value } })} 
                />
              </div>
              <div className="space-y-2">
                <Label>Primary Button Link</Label>
                <Input 
                  value={form.intro.buttonLink} 
                  onChange={e => setForm({ ...form, intro: { ...form.intro, buttonLink: e.target.value } })} 
                />
              </div>
            </div>
            
            <p className="text-[11px] text-muted-foreground mt-2">
              Note: The second button is automatically populated with your global phone number setting.
            </p>
          </div>

          <div className="space-y-4 bg-muted/20 p-4 rounded-lg border">
            <h3 className="font-semibold text-sm border-b pb-2">Background Image</h3>
            <div className="space-y-2">
              <Label>Select Background Cover</Label>
              <MediaPicker
                value={form.intro.imageId}
                onChange={(val) => setForm({ ...form, intro: { ...form.intro, imageId: val as string } })}
                width="w-full"
                height="h-[250px]"
                label="Select CTA Background"
              />
              <p className="text-[11px] text-muted-foreground mt-2">
                <strong>Recommended size: 1920x1080 pixels (16:9 ratio).</strong> This image will be heavily darkened by a gradient overlay so the white text remains readable.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
