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

export interface MdSpeechContent {
  intro: {
    eyebrow: string
    titlePart1: string
    titleHighlight: string
    titlePart2: string
    paragraph1: string
    paragraph2: string
    paragraph3: string
    signatureText: string
    imageId: string
    imageAlt: string
  }
}

const defaultContent: MdSpeechContent = {
  intro: {
    eyebrow: "Managing Director's Message",
    titlePart1: "A",
    titleHighlight: "Vision",
    titlePart2: "For The Future Of Power",
    paragraph1: "Bangladesh Power Innovation Ltd is not just a company — it is a vision. A vision to redefine how energy empowers lives, industries and the future of our nation. We are here not only to supply power, but to spark progress, resilience and transformation.",
    paragraph2: "In today's world, innovation is not optional — it is essential. At BPIL we are committed to developing smart, sustainable and scalable energy solutions that meet the evolving needs of Bangladesh. From rural electrification to industrial modernisation, our technologies are designed to be efficient, eco-friendly and future-ready.",
    paragraph3: "Our journey is powered by people. I extend my deepest gratitude to our engineers, technicians, strategists and field teams whose dedication drives our success. Your expertise and passion are the foundation of everything we build.",
    signatureText: "Managing Director, BPIL",
    imageId: "",
    imageAlt: "Power control room with electrical instrumentation",
  }
}

export function MdSpeechTab() {
  const { data: contentMap, isLoading } = useGetDynamicContentsMapQuery("about")
  const [upsert, { isLoading: isSaving }] = useUpsertDynamicContentMutation()
  
  const [form, setForm] = useState<MdSpeechContent>(defaultContent)

  useEffect(() => {
    const timer = setTimeout(() => {
      if (contentMap?.["about-md-speech"]?.value) {
        setForm({ ...defaultContent, ...contentMap["about-md-speech"].value })
      }
    }, 0)
    return () => clearTimeout(timer)
  }, [contentMap])

  const handleSaveIntro = async () => {
    try {
      await upsert({
        key: "about-md-speech",
        group: "about",
        type: "json",
        name: "About MD Speech",
        description: "Managing Director's Message section on the about page",
        value: form,
        isActive: true,
      }).unwrap()
      toast.success("MD Speech section updated successfully")
    } catch {
      toast.error("Failed to update MD Speech section")
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
            <h2 className="text-lg font-medium">Managing Director's Message</h2>
            <p className="text-sm text-muted-foreground">
              Manage the MD speech text, signature, and side image.
            </p>
          </div>
          <Button onClick={handleSaveIntro} disabled={isSaving}>
            {isSaving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
            Save Changes
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-4 bg-muted/20 p-4 rounded-lg border">
            <h3 className="font-semibold text-sm border-b pb-2">Typography & Content</h3>
            
            <div className="space-y-2">
              <Label>Small Eyebrow Label</Label>
              <Input 
                value={form.intro.eyebrow} 
                onChange={e => setForm({ ...form, intro: { ...form.intro, eyebrow: e.target.value } })} 
              />
            </div>
            
            <div className="grid grid-cols-3 gap-2">
              <div className="space-y-2">
                <Label>Title (Part 1)</Label>
                <Input 
                  value={form.intro.titlePart1} 
                  onChange={e => setForm({ ...form, intro: { ...form.intro, titlePart1: e.target.value } })} 
                />
              </div>
              <div className="space-y-2">
                <Label>Highlight</Label>
                <Input 
                  value={form.intro.titleHighlight} 
                  onChange={e => setForm({ ...form, intro: { ...form.intro, titleHighlight: e.target.value } })} 
                />
              </div>
              <div className="space-y-2">
                <Label>Title (Part 2)</Label>
                <Input 
                  value={form.intro.titlePart2} 
                  onChange={e => setForm({ ...form, intro: { ...form.intro, titlePart2: e.target.value } })} 
                />
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <Label>Paragraph 1</Label>
              <Textarea 
                value={form.intro.paragraph1} 
                onChange={e => setForm({ ...form, intro: { ...form.intro, paragraph1: e.target.value } })} 
                className="min-h-[100px]"
              />
            </div>
            
            <div className="space-y-2">
              <Label>Paragraph 2</Label>
              <Textarea 
                value={form.intro.paragraph2} 
                onChange={e => setForm({ ...form, intro: { ...form.intro, paragraph2: e.target.value } })} 
                className="min-h-[100px]"
              />
            </div>
            
            <div className="space-y-2">
              <Label>Paragraph 3</Label>
              <Textarea 
                value={form.intro.paragraph3} 
                onChange={e => setForm({ ...form, intro: { ...form.intro, paragraph3: e.target.value } })} 
                className="min-h-[100px]"
              />
            </div>
            
            <div className="space-y-2">
              <Label>Signature Text</Label>
              <Input 
                value={form.intro.signatureText} 
                onChange={e => setForm({ ...form, intro: { ...form.intro, signatureText: e.target.value } })} 
                placeholder="e.g. Managing Director, BPIL"
              />
            </div>
          </div>

          <div className="space-y-4 bg-muted/20 p-4 rounded-lg border h-fit">
            <h3 className="font-semibold text-sm border-b pb-2">Featured Image (Left Side)</h3>
            <div className="space-y-2">
              <MediaPicker
                value={form.intro.imageId}
                onChange={(val) => setForm({ ...form, intro: { ...form.intro, imageId: val as string } })}
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
                value={form.intro.imageAlt} 
                onChange={e => setForm({ ...form, intro: { ...form.intro, imageAlt: e.target.value } })} 
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
