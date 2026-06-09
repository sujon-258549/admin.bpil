import { useEffect, useState } from "react"
import { useGetDynamicContentsMapQuery, useUpsertDynamicContentMutation } from "@/redux/features/dynamic-content/dynamicContent-api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { MediaPicker } from "@/components/shared"
import { Plus, Trash2, Save, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { Skeleton } from "@/components/ui/skeleton"

interface StatItem {
  value: string
  label: string
}

export interface AboutContent {
  label: string
  headingLine1: string
  headingLine2: string
  headingHighlight: string
  description: string
  buttonText: string
  buttonLink: string
  yearsOfExperience: string
  stats: StatItem[]
  imageTopId: string
  imageBottomLeftId: string
  imageBottomRightId: string
}

const defaultContent: AboutContent = {
  label: "About Us",
  headingLine1: "Professional",
  headingLine2: "Maintenance for",
  headingHighlight: "Peak Performance.",
  description: "",
  buttonText: "Learn More About Us",
  buttonLink: "/about",
  yearsOfExperience: "12",
  stats: [
    { value: "150+", label: "Projects Completed" },
    { value: "50+", label: "Client Partners" },
    { value: "1k+", label: "Power Solutions" }
  ],
  imageTopId: "",
  imageBottomLeftId: "",
  imageBottomRightId: ""
}

export function AboutTab() {
  const { data: contentMap, isLoading } = useGetDynamicContentsMapQuery("home")
  const [upsert, { isLoading: isSaving }] = useUpsertDynamicContentMutation()
  
  const [form, setForm] = useState<AboutContent>(defaultContent)

  useEffect(() => {
    const timer = setTimeout(() => {
      if (contentMap?.["home-about"]?.value) {
        setForm({ ...defaultContent, ...contentMap["home-about"].value })
      }
    }, 0)
    return () => clearTimeout(timer)
  }, [contentMap])

  const handleSave = async () => {
    try {
      await upsert({
        key: "home-about",
        group: "home",
        type: "json",
        name: "Home About Section",
        description: "Content for the About Us / Maintenance section on the home page",
        value: form,
        isActive: true,
      }).unwrap()
      toast.success("About section updated successfully")
    } catch {
      toast.error("Failed to update about section")
    }
  }

  const addStat = () => {
    setForm(prev => ({ ...prev, stats: [...prev.stats, { value: "", label: "" }] }))
  }

  const updateStat = (index: number, field: keyof StatItem, value: string) => {
    const newStats = [...form.stats]
    newStats[index] = { ...newStats[index], [field]: value }
    setForm({ ...form, stats: newStats })
  }

  const removeStat = (index: number) => {
    setForm(prev => ({
      ...prev,
      stats: prev.stats.filter((_, i) => i !== index)
    }))
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
          <h2 className="text-lg font-medium">About Section</h2>
          <p className="text-sm text-muted-foreground">
            Manage the content, stats, and imagery for the About Us section.
          </p>
        </div>
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
          Save Changes
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Left Column: Text Content */}
        <div className="space-y-6">
          <div className="space-y-4 bg-muted/20 p-4 rounded-lg border">
            <h3 className="font-semibold text-sm border-b pb-2">Typography & Content</h3>
            <div className="space-y-2">
              <Label>Small Badge Label</Label>
              <Input 
                value={form.label} 
                onChange={e => setForm({ ...form, label: e.target.value })} 
                placeholder="e.g. About Us"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Heading Line 1</Label>
                <Input 
                  value={form.headingLine1} 
                  onChange={e => setForm({ ...form, headingLine1: e.target.value })} 
                  placeholder="e.g. Professional"
                />
              </div>
              <div className="space-y-2">
                <Label>Heading Line 2</Label>
                <Input 
                  value={form.headingLine2} 
                  onChange={e => setForm({ ...form, headingLine2: e.target.value })} 
                  placeholder="e.g. Maintenance for"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Heading Highlight (Gradient Text)</Label>
              <Input 
                value={form.headingHighlight} 
                onChange={e => setForm({ ...form, headingHighlight: e.target.value })} 
                placeholder="e.g. Peak Performance."
              />
            </div>

            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea 
                value={form.description} 
                onChange={e => setForm({ ...form, description: e.target.value })} 
                className="min-h-[100px]"
                placeholder="Write the paragraph text here..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
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
            
            <div className="space-y-2">
              <Label>Years of Experience</Label>
              <Input 
                value={form.yearsOfExperience} 
                onChange={e => setForm({ ...form, yearsOfExperience: e.target.value })} 
                placeholder="e.g. 12"
              />
            </div>
          </div>

          {/* Stats Section */}
          <div className="space-y-4 bg-muted/20 p-4 rounded-lg border">
            <div className="flex items-center justify-between border-b pb-2">
              <h3 className="font-semibold text-sm">Statistics</h3>
              <Button type="button" variant="outline" size="sm" onClick={addStat}>
                <Plus className="h-4 w-4 mr-2" /> Add Stat
              </Button>
            </div>
            
            <div className="space-y-3">
              {form.stats.map((stat, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="flex-1 space-y-1">
                    <Input 
                      placeholder="Value (e.g. 150+)" 
                      value={stat.value} 
                      onChange={e => updateStat(index, "value", e.target.value)} 
                    />
                  </div>
                  <div className="flex-[2] space-y-1">
                    <Input 
                      placeholder="Label (e.g. Projects Completed)" 
                      value={stat.label} 
                      onChange={e => updateStat(index, "label", e.target.value)} 
                    />
                  </div>
                  <Button type="button" variant="destructive" size="icon" onClick={() => removeStat(index)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              {form.stats.length === 0 && (
                <p className="text-xs text-muted-foreground italic">No stats added. This might affect the frontend layout.</p>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Imagery */}
        <div className="space-y-6">
          <div className="bg-muted/20 p-4 rounded-lg border space-y-6">
            <h3 className="font-semibold text-sm border-b pb-2">Media Layout</h3>
            
            <div className="space-y-2">
              <Label>Top Wide Image (e.g. Transformer)</Label>
              <MediaPicker
                value={form.imageTopId}
                onChange={(id) => setForm({ ...form, imageTopId: id as string })}
                label="Upload Top Image"
                width="w-full"
                height="h-48"
                className="rounded-md border-border/50"
              />
              <p className="text-xs text-muted-foreground">Recommended aspect ratio: 16:10</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Bottom Left Image</Label>
                <MediaPicker
                  value={form.imageBottomLeftId}
                  onChange={(id) => setForm({ ...form, imageBottomLeftId: id as string })}
                  label="Upload Left Image"
                  width="w-full"
                  height="h-32"
                  className="rounded-md border-border/50"
                />
                <p className="text-xs text-muted-foreground">Recommended: 4:3</p>
              </div>

              <div className="space-y-2">
                <Label>Bottom Right Image</Label>
                <MediaPicker
                  value={form.imageBottomRightId}
                  onChange={(id) => setForm({ ...form, imageBottomRightId: id as string })}
                  label="Upload Right Image"
                  width="w-full"
                  height="h-32"
                  className="rounded-md border-border/50"
                />
                <p className="text-xs text-muted-foreground">Recommended: 4:3</p>
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  )
}
