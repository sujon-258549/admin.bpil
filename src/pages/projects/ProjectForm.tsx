import React, { useState } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { FormField, Text } from "@/components/shared"
import { MediaPicker } from "@/components/shared/media-picker"
import { X, Plus } from "lucide-react"
import RichTextEditor from "@/components/ui/rich-text-editor"
import { Textarea } from "@/components/ui/textarea"
import { CustomSelect } from "@/components/ui/custom-select"
import { useGetProductsQuery } from "@/redux/features/products/products-api"

export interface ProjectFormState {
  name: string
  category: string
  price: string
  thumbnailId: string
  gallery: string[]
  youtubeVideoIds: string[]
  status: string
  productId: string
  shortDesc: string
  detailsDesc: string
  isActive: boolean
}

interface ProjectFormProps {
  initialData?: any
  onSubmit: (data: Partial<ProjectFormState>) => Promise<void>
  isLoading?: boolean
  submitLabel?: string
}

export default function ProjectForm({
  initialData,
  onSubmit,
  isLoading,
  submitLabel = "Save Project",
}: ProjectFormProps) {
  const makeInitial = (): ProjectFormState => {
    if (!initialData) {
      return {
        name: "",
        category: "",
        price: "",
        thumbnailId: "",
        gallery: [],
        youtubeVideoIds: [""],
        status: "ONGOING",
        productId: "",
        shortDesc: "",
        detailsDesc: "",
        isActive: true,
      }
    }
    return {
      name: initialData.name || "",
      category: initialData.category || "",
      price: initialData.price || "",
      thumbnailId: initialData.thumbnailId || "",
      gallery: initialData.gallery?.map((g: any) => g.id || g) || initialData.gallery || [],
      youtubeVideoIds: initialData.youtubeVideoIds?.length ? initialData.youtubeVideoIds : [""],
      status: initialData.status || "ONGOING",
      productId: initialData.productId || "",
      shortDesc: initialData.shortDesc || "",
      detailsDesc: initialData.detailsDesc || "",
      isActive: initialData.isActive ?? true,
    }
  }

  const [form, setForm] = useState<ProjectFormState>(makeInitial)
  const { data: productsData } = useGetProductsQuery({ limit: 100 })
  const products = productsData?.data || []

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name.trim()) {
      toast.error("Project name is required")
      return
    }
    
    const cleanedForm = {
      ...form,
      youtubeVideoIds: form.youtubeVideoIds.filter(id => id.trim() !== "")
    }
    
    // Remove empty productId before submission
    if (!cleanedForm.productId) {
      delete (cleanedForm as any).productId
    }
    
    await onSubmit(cleanedForm)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 pb-10">
      <div className="space-y-6">
        <div className="rounded-md border bg-card p-6 space-y-4">
            <h3 className="text-lg font-semibold mb-2">Basic Info</h3>
            <FormField label="Project Name" required>
              <Input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. Modern Web App"
              />
            </FormField>
            <div className="grid grid-cols-2 gap-4">
              <FormField label="Category">
                <Input
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  placeholder="e.g. Web Development"
                />
              </FormField>
              <FormField label="Price">
                <Input
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  placeholder="e.g. $5,000"
                />
              </FormField>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <FormField label="Status">
                <CustomSelect value={form.status} onChange={(val) => setForm({ ...form, status: val })} placeholder="Select Status">
                  <option value="UPCOMING">Upcoming</option>
                  <option value="ONGOING">Ongoing</option>
                  <option value="COMPLETED">Completed</option>
                </CustomSelect>
              </FormField>
              
              <FormField label="Related Product (Optional)">
                <CustomSelect value={form.productId} onChange={(val) => setForm({ ...form, productId: val })} placeholder="None">
                  <option value="">None</option>
                  {products.map((p: any) => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </CustomSelect>
              </FormField>
            </div>
            
            <FormField label="Short Description">
              <Textarea
                rows={3}
                value={form.shortDesc}
                onChange={(e) => setForm({ ...form, shortDesc: e.target.value })}
                placeholder="A brief summary of the project..."
              />
            </FormField>
            <div className="flex items-center justify-between rounded-md border p-3">
              <div>
                <Label className="text-sm font-medium">Active Status</Label>
                <Text size="xs" tone="muted">
                  Hide or show this project globally
                </Text>
              </div>
              <Switch
                checked={form.isActive}
                onCheckedChange={(val) => setForm({ ...form, isActive: val })}
              />
            </div>
          </div>
      </div>

      <div className="space-y-6">
        <div className="rounded-md border bg-card p-6 space-y-4">
            <h3 className="text-lg font-semibold mb-2">Media</h3>
            <div className="flex flex-wrap gap-12 relative">
              <FormField label="Thumbnail Image">
                <MediaPicker
                  category="single"
                  value={form.thumbnailId}
                  onChange={(id) => setForm({ ...form, thumbnailId: id as string })}
                />
              </FormField>
              
              <div className="hidden md:block w-px bg-border -mx-6 self-stretch"></div>
              
              <div className="flex-1">
                <FormField label="Gallery Images">
                  <MediaPicker
                    category="multi"
                    value={form.gallery}
                    onChange={(ids) => setForm({ ...form, gallery: ids })}
                  />
                </FormField>
              </div>
            </div>
          </div>
      </div>

      <div className="space-y-6 rounded-md border bg-card p-6">
        <h3 className="text-lg font-semibold">Videos</h3>
        <div>
          <Label className="mb-2 block text-sm font-medium">YouTube Video IDs</Label>
          <Text size="xs" tone="muted" className="mb-4">
            Paste the YouTube Video IDs (e.g., qB3u5egTc6Q). You can add multiple videos.
          </Text>
          <div className="space-y-3">
            {form.youtubeVideoIds.map((id, index) => (
              <div key={index} className="flex items-center gap-2">
                <Input
                  value={id}
                  onChange={(e) => {
                    const newIds = [...form.youtubeVideoIds]
                    newIds[index] = e.target.value
                    setForm({ ...form, youtubeVideoIds: newIds })
                  }}
                  placeholder="e.g. qB3u5egTc6Q"
                  className="h-11 flex-1"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="h-11 w-11 shrink-0 text-destructive hover:bg-destructive/10"
                  onClick={() => {
                    const newIds = form.youtubeVideoIds.filter((_, i) => i !== index)
                    setForm({ ...form, youtubeVideoIds: newIds.length ? newIds : [""] })
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setForm({ ...form, youtubeVideoIds: [...form.youtubeVideoIds, ""] })}
            >
              <Plus className="mr-2 h-4 w-4" /> Add Another Video ID
            </Button>
          </div>
        </div>
      </div>

      <div className="rounded-md border bg-card p-6">
        <h3 className="text-lg font-semibold mb-4">Detailed Description</h3>
        <RichTextEditor
          value={form.detailsDesc}
          onChange={(e) => setForm({ ...form, detailsDesc: e.target.value })}
        />
      </div>

      <div className="flex justify-end gap-3">
        <Button size="lg" type="submit" disabled={isLoading}>
          {isLoading ? "Saving..." : submitLabel}
        </Button>
      </div>
    </form>
  )
}
