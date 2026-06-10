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

export interface MissionVisionContent {
  mission: {
    eyebrow: string
    title: string
    description: string
  }
  vision: {
    eyebrow: string
    title: string
    description: string
  }
  media: {
    imageId: string
    imageAlt: string
  }
}

const defaultContent: MissionVisionContent = {
  mission: {
    eyebrow: "Our Mission",
    title: "Reliable, sustainable power for every Bangladeshi business",
    description: "To deliver world-class, reliable and sustainable electrical solutions that empower businesses, industries and communities across Bangladesh. From transformer testing and switchgear commissioning to AMC packages and 24/7 breakdown response — we keep the lights on for the factories, hospitals and infrastructure that the country depends on, with engineering rigor that doesn't compromise on safety, uptime or compliance.",
  },
  vision: {
    eyebrow: "Our Vision",
    title: "The benchmark for power infrastructure in Bangladesh",
    description: "To be the leading provider of complete electrical infrastructure solutions in Bangladesh — setting new benchmarks for innovation, quality and customer satisfaction.",
  },
  media: {
    imageId: "",
    imageAlt: "Substation infrastructure at dusk",
  }
}

export function MissionVisionTab() {
  const { data: contentMap, isLoading } = useGetDynamicContentsMapQuery("about")
  const [upsert, { isLoading: isSaving }] = useUpsertDynamicContentMutation()
  
  const [form, setForm] = useState<MissionVisionContent>(defaultContent)

  useEffect(() => {
    const timer = setTimeout(() => {
      if (contentMap?.["about-mission-vision"]?.value) {
        setForm({ ...defaultContent, ...contentMap["about-mission-vision"].value })
      }
    }, 0)
    return () => clearTimeout(timer)
  }, [contentMap])

  const handleSaveIntro = async () => {
    try {
      await upsert({
        key: "about-mission-vision",
        group: "about",
        type: "json",
        name: "Mission & Vision",
        description: "Content for the Mission and Vision section on the About page",
        value: form,
        isActive: true,
      }).unwrap()
      toast.success("Mission & Vision updated successfully")
    } catch {
      toast.error("Failed to update Mission & Vision")
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
            <h2 className="text-lg font-medium">Mission & Vision</h2>
            <p className="text-sm text-muted-foreground">
              Manage the texts for the Mission card, Vision card, and the featured right-side image.
            </p>
          </div>
          <Button onClick={handleSaveIntro} disabled={isSaving}>
            {isSaving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
            Save Changes
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-6">
            <div className="space-y-4 bg-muted/20 p-4 rounded-lg border">
              <h3 className="font-semibold text-sm border-b pb-2 text-primary">Mission Card</h3>
              <div className="space-y-2">
                <Label>Eyebrow</Label>
                <Input 
                  value={form.mission.eyebrow} 
                  onChange={e => setForm({ ...form, mission: { ...form.mission, eyebrow: e.target.value } })} 
                />
              </div>
              <div className="space-y-2">
                <Label>Title</Label>
                <Input 
                  value={form.mission.title} 
                  onChange={e => setForm({ ...form, mission: { ...form.mission, title: e.target.value } })} 
                />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea 
                  value={form.mission.description} 
                  onChange={e => setForm({ ...form, mission: { ...form.mission, description: e.target.value } })} 
                  className="min-h-[120px]"
                />
              </div>
            </div>

            <div className="space-y-4 bg-muted/20 p-4 rounded-lg border">
              <h3 className="font-semibold text-sm border-b pb-2 text-secondary">Vision Card</h3>
              <div className="space-y-2">
                <Label>Eyebrow</Label>
                <Input 
                  value={form.vision.eyebrow} 
                  onChange={e => setForm({ ...form, vision: { ...form.vision, eyebrow: e.target.value } })} 
                />
              </div>
              <div className="space-y-2">
                <Label>Title</Label>
                <Input 
                  value={form.vision.title} 
                  onChange={e => setForm({ ...form, vision: { ...form.vision, title: e.target.value } })} 
                />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea 
                  value={form.vision.description} 
                  onChange={e => setForm({ ...form, vision: { ...form.vision, description: e.target.value } })} 
                  className="min-h-[120px]"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4 bg-muted/20 p-4 rounded-lg border h-fit">
            <h3 className="font-semibold text-sm border-b pb-2">Featured Image (Right Side)</h3>
            <div className="space-y-2">
              <MediaPicker
                value={form.media.imageId}
                onChange={(val) => setForm({ ...form, media: { ...form.media, imageId: val as string } })}
                width="w-full"
                height="h-[300px]"
                label="Select Image"
              />
              <p className="text-[11px] text-muted-foreground mt-1">
                <strong>Recommended size: 800x1000 pixels (4:5 vertical ratio).</strong>
              </p>
            </div>
            <div className="space-y-2 mt-4">
              <Label>Image Alt Text</Label>
              <Input 
                value={form.media.imageAlt} 
                onChange={e => setForm({ ...form, media: { ...form.media, imageAlt: e.target.value } })} 
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
