import { useState, useEffect } from "react"
import { useGetDynamicContentsMapQuery, useUpsertDynamicContentMutation } from "@/redux/features/dynamic-content/dynamicContent-api"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Save, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { Skeleton } from "@/components/ui/skeleton"
import { Input } from "@/components/ui/input"

export interface ServicesConsultLineContent {
  textPart1: string
  textHighlight: string
  textPart2: string
}

const defaultContent: ServicesConsultLineContent = {
  textPart1: "Ensure your PFI system operates at peak efficiency with",
  textHighlight: "Bangladesh Power Innovation Ltd.",
  textPart2: "Contact us today for a consultation or to schedule a service.",
}

export function ServicesConsultLineTab() {
  const { data: contentMap, isLoading } = useGetDynamicContentsMapQuery("services")
  const [upsert, { isLoading: isSaving }] = useUpsertDynamicContentMutation()
  
  const [form, setForm] = useState<ServicesConsultLineContent>(defaultContent)

  useEffect(() => {
    const timer = setTimeout(() => {
      if (contentMap?.["services-consult-line"]?.value) {
        setForm({ ...defaultContent, ...contentMap["services-consult-line"].value })
      }
    }, 0)
    return () => clearTimeout(timer)
  }, [contentMap])

  const handleSave = async () => {
    try {
      await upsert({
        key: "services-consult-line",
        group: "services",
        type: "json",
        name: "Services Consult Line",
        description: "The small consultation text snippet banner in the middle",
        value: form,
        isActive: true,
      }).unwrap()
      toast.success("Consult line updated successfully")
    } catch {
      toast.error("Failed to update consult line")
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
          <h2 className="text-lg font-medium">Consultation Line</h2>
          <p className="text-sm text-muted-foreground">
            Manage the small consultation text snippet banner in the middle of the page.
          </p>
        </div>
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
          Save Changes
        </Button>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Text Part 1 (Before Highlight)</Label>
          <Textarea 
            value={form.textPart1} 
            onChange={e => setForm({ ...form, textPart1: e.target.value })} 
            placeholder="e.g. Ensure your PFI system operates at peak efficiency with"
            className="min-h-[80px]"
          />
        </div>

        <div className="space-y-2">
          <Label>Highlighted Text (Gradient Color)</Label>
          <Input 
            value={form.textHighlight} 
            onChange={e => setForm({ ...form, textHighlight: e.target.value })} 
            placeholder="e.g. Bangladesh Power Innovation Ltd."
          />
        </div>

        <div className="space-y-2">
          <Label>Text Part 2 (After Highlight)</Label>
          <Textarea 
            value={form.textPart2} 
            onChange={e => setForm({ ...form, textPart2: e.target.value })} 
            placeholder="e.g. Contact us today for a consultation or to schedule a service."
            className="min-h-[80px]"
          />
        </div>

        <div className="p-4 bg-muted/20 border rounded-lg mt-6">
          <Label className="text-muted-foreground block mb-2">Preview:</Label>
          <p className="text-sm leading-relaxed text-foreground/85 sm:text-base">
            {form.textPart1} {" "}
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text font-semibold text-transparent">
              {form.textHighlight}
            </span>{" "}
            {form.textPart2}
          </p>
        </div>
      </div>
    </div>
  )
}
