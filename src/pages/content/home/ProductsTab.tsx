import { useEffect, useState } from "react"
import { useGetDynamicContentsMapQuery, useUpsertDynamicContentMutation } from "@/redux/features/dynamic-content/dynamicContent-api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Save, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { Skeleton } from "@/components/ui/skeleton"

export interface ProductsSectionContent {
  label: string
  headingLine1: string
  headingHighlight: string
  description: string
}

const defaultContent: ProductsSectionContent = {
  label: "Our Products",
  headingLine1: "What We",
  headingHighlight: "Manufacture",
  description: "From distribution transformers to rooftop solar — six product lines engineered for industry, commerce and utility clients."
}

export function ProductsTab() {
  const { data: contentMap, isLoading } = useGetDynamicContentsMapQuery("home")
  const [upsert, { isLoading: isSaving }] = useUpsertDynamicContentMutation()
  
  const [form, setForm] = useState<ProductsSectionContent>(defaultContent)

  useEffect(() => {
    const timer = setTimeout(() => {
      if (contentMap?.["home-products"]?.value) {
        setForm({ ...defaultContent, ...contentMap["home-products"].value })
      }
    }, 0)
    return () => clearTimeout(timer)
  }, [contentMap])

  const handleSave = async () => {
    try {
      await upsert({
        key: "home-products",
        group: "home",
        type: "json",
        name: "Home Products Section",
        description: "Typography configuration for the Products section on the home page",
        value: form,
        isActive: true,
      }).unwrap()
      toast.success("Products section updated successfully")
    } catch {
      toast.error("Failed to update products section")
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
    )
  }

  return (
    <div className="rounded-lg border bg-card text-card-foreground p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-medium">Products Section</h2>
          <p className="text-sm text-muted-foreground">
            Manage the typography and intro text for the Our Products section.
          </p>
        </div>
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
          Save Changes
        </Button>
      </div>

      <div className="space-y-6">
        <div className="space-y-4 bg-muted/20 p-4 rounded-lg border">
          <h3 className="font-semibold text-sm border-b pb-2">Typography & Content</h3>
          
          <div className="space-y-2">
            <Label>Small Badge Label</Label>
            <Input 
              value={form.label} 
              onChange={e => setForm({ ...form, label: e.target.value })} 
              placeholder="e.g. OUR PRODUCTS"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Heading Line 1</Label>
              <Input 
                value={form.headingLine1} 
                onChange={e => setForm({ ...form, headingLine1: e.target.value })} 
                placeholder="e.g. What We"
              />
            </div>
            <div className="space-y-2">
              <Label>Heading Highlight</Label>
              <Input 
                value={form.headingHighlight} 
                onChange={e => setForm({ ...form, headingHighlight: e.target.value })} 
                placeholder="e.g. Manufacture"
              />
            </div>
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
        </div>
      </div>
    </div>
  )
}
