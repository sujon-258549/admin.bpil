import { useState, useEffect } from "react"
import { useGetDynamicContentsMapQuery, useUpsertDynamicContentMutation } from "@/redux/features/dynamic-content/dynamicContent-api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Save, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { Skeleton } from "@/components/ui/skeleton"

export interface ServicesIntroContent {
  eyebrow: string
  titleHighlight: string
  description1: string
  description2: string
}

const defaultContent: ServicesIntroContent = {
  eyebrow: "All In Solution",
  titleHighlight: "Transformer Services",
  description1: "Bangladesh Power Innovation Ltd. is your trusted partner for power system reliability. We understand that a distribution transformer is the heart of your uninterrupted power supply.",
  description2: "Our dedicated service division combines advanced diagnostics, genuine parts and experienced engineers to extend asset life and prevent costly outages.",
}

export function ServicesIntroTab() {
  const { data: contentMap, isLoading } = useGetDynamicContentsMapQuery("services")
  const [upsert, { isLoading: isSaving }] = useUpsertDynamicContentMutation()
  
  const [form, setForm] = useState<ServicesIntroContent>(defaultContent)

  useEffect(() => {
    const timer = setTimeout(() => {
      if (contentMap?.["services-intro"]?.value) {
        setForm({ ...defaultContent, ...contentMap["services-intro"].value })
      }
    }, 0)
    return () => clearTimeout(timer)
  }, [contentMap])

  const handleSave = async () => {
    try {
      await upsert({
        key: "services-intro",
        group: "services",
        type: "json",
        name: "Services Intro",
        description: "The introduction text block on the services page",
        value: form,
        isActive: true,
      }).unwrap()
      toast.success("Intro updated successfully")
    } catch {
      toast.error("Failed to update intro")
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
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-medium">Intro Section</h2>
          <p className="text-sm text-muted-foreground">
            Manage the "All In Solution" text section.
          </p>
        </div>
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
          Save Changes
        </Button>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Small Eyebrow Label</Label>
            <Input 
              value={form.eyebrow} 
              onChange={e => setForm({ ...form, eyebrow: e.target.value })} 
              placeholder="e.g. All In Solution"
            />
          </div>

          <div className="space-y-2">
            <Label>Title Highlight</Label>
            <Input 
              value={form.titleHighlight} 
              onChange={e => setForm({ ...form, titleHighlight: e.target.value })} 
              placeholder="e.g. Transformer Services"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Paragraph 1</Label>
          <Textarea 
            value={form.description1} 
            onChange={e => setForm({ ...form, description1: e.target.value })} 
            placeholder="Enter the first paragraph..."
            className="min-h-[100px]"
          />
        </div>

        <div className="space-y-2">
          <Label>Paragraph 2</Label>
          <Textarea 
            value={form.description2} 
            onChange={e => setForm({ ...form, description2: e.target.value })} 
            placeholder="Enter the second paragraph..."
            className="min-h-[100px]"
          />
        </div>
      </div>
    </div>
  )
}
