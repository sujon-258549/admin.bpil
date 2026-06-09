import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { FormField, Text } from "@/components/shared"
import { MediaPicker } from "@/components/shared/media-picker"
import RichTextEditor from "@/components/ui/rich-text-editor"

export interface ProductFormState {
  name: string
  category: string
  price: string
  thumbnailId: string
  gallery: string[]
  shortDesc: string
  detailsDesc: string
  isActive: boolean
}

interface ProductFormProps {
  initialData?: any
  onSubmit: (data: ProductFormState) => Promise<void>
  isLoading?: boolean
}

function makeInitial(initialData: any): ProductFormState {
  if (!initialData) {
    return {
      name: "",
      category: "",
      price: "",
      thumbnailId: "",
      gallery: [],
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
    shortDesc: initialData.shortDesc || "",
    detailsDesc: initialData.detailsDesc || "",
    isActive: initialData.isActive ?? true,
  }
}

export default function ProductForm({ initialData, onSubmit, isLoading }: ProductFormProps) {
  const navigate = useNavigate()

  const [form, setForm] = useState<ProductFormState>(() => makeInitial(initialData))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name.trim()) {
      toast.error("Product name is required")
      return
    }
    await onSubmit(form)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="space-y-6 rounded-md border bg-card p-6">
        <h3 className="text-lg font-semibold">Basic Information</h3>
        
        <FormField label="Product Name" required htmlFor="product-name">
          <Input
            id="product-name"
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="e.g., Solar System"
            className="h-11 transition-all focus:ring-2 focus:ring-primary/20"
          />
        </FormField>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <FormField label="Category" htmlFor="product-category">
            <Input
              id="product-category"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              placeholder="e.g., Renewable Energy"
              className="h-11 transition-all focus:ring-2 focus:ring-primary/20"
            />
          </FormField>

          <FormField label="Price / Value" htmlFor="product-price">
            <Input
              id="product-price"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              placeholder="e.g., Get a Quote"
              className="h-11 transition-all focus:ring-2 focus:ring-primary/20"
            />
          </FormField>
        </div>
      </div>

      <div className="space-y-6 rounded-md border bg-card p-6">
        <h3 className="text-lg font-semibold">Media</h3>
        <div className="flex flex-col sm:flex-row gap-8">
          <div>
            <Label className="mb-2 block text-sm font-medium">Thumbnail Image</Label>
            <MediaPicker
              value={form.thumbnailId}
              onChange={(id) => setForm({ ...form, thumbnailId: id as string })}
              label="Upload Thumbnail"
              width="w-48"
              height="h-48"
              className="rounded-md border-border/50"
            />
          </div>
          <div className="flex-1">
            <Label className="mb-2 block text-sm font-medium">Product Gallery</Label>
            <MediaPicker
              category="multi"
              value={form.gallery}
              onChange={(val) => setForm({ ...form, gallery: val as string[] })}
              label="Add Gallery Images"
              width="w-full"
              height="h-48"
              className="rounded-md border-border/50 min-h-48"
            />
          </div>
        </div>
      </div>

      <div className="space-y-6 rounded-md border bg-card p-6">
        <h3 className="text-lg font-semibold">Descriptions</h3>
        
        <FormField label="Short Description" htmlFor="product-short-desc">
          <Textarea
            id="product-short-desc"
            value={form.shortDesc}
            onChange={(e) => setForm({ ...form, shortDesc: e.target.value })}
            placeholder="Brief summary of product"
            className="min-h-[100px] transition-all focus:ring-2 focus:ring-primary/20"
          />
        </FormField>

        <div className="pt-2">
          <Label className="mb-2 block text-sm font-medium">Detailed Description</Label>
          <div className="rounded-md border overflow-hidden">
            <RichTextEditor
              id="product-details"
              name="detailsDesc"
              value={form.detailsDesc}
              onChange={(e) => setForm({ ...form, detailsDesc: e.target.value })}
              placeholder="Detailed description with rich text formatting..."
              height={500}
            />
          </div>
        </div>
      </div>

      <div className="space-y-6 rounded-md border bg-card p-6">
        <h3 className="text-lg font-semibold">Settings</h3>
        <div className="flex items-center justify-between rounded-md border bg-gradient-to-r from-muted/30 to-muted/10 px-5 py-4">
          <div>
            <Label className="text-base font-semibold text-foreground">Active Status</Label>
            <Text size="xs" tone="muted" className="mt-1">
              Turn off to hide product from the frontend
            </Text>
          </div>
          <Switch
            checked={form.isActive}
            onCheckedChange={(v) => setForm({ ...form, isActive: v })}
            className="data-[state=checked]:bg-primary"
          />
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => navigate("/products")}
          disabled={isLoading}
          className="min-w-24"
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading} className="min-w-24">
          {isLoading ? (
            <>
              <Loader2 className="mr-2 size-4 animate-spin" /> Saving...
            </>
          ) : (
            "Save Product"
          )}
        </Button>
      </div>
    </form>
  )
}
