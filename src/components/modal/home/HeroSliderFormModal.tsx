import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { MediaPicker } from "@/components/shared"
import { Textarea } from "@/components/ui/textarea"
import { Combobox } from "@/components/ui/combobox"
import { useGetProductsQuery } from "@/redux/features/products/products-api"

export interface HeroSlide {
  id: string
  title: string
  subtitle: string
  buttonText: string
  buttonLink: string
  imageId: string
}

interface HeroSliderFormModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  initialData?: HeroSlide | null
  onSubmit: (data: HeroSlide) => void
}

export function HeroSliderFormModal({ open, onOpenChange, initialData, onSubmit }: HeroSliderFormModalProps) {
  const [form, setForm] = useState<HeroSlide>({
    id: "",
    title: "",
    subtitle: "",
    buttonText: "",
    buttonLink: "",
    imageId: "",
  })

  const { data: productsRes } = useGetProductsQuery({ limit: 100 })
  const productOptions = productsRes?.data?.map((p: any) => ({
    value: `/products/${p.slug}`,
    label: p.name,
  })) || []

  useEffect(() => {
    if (!open) return
    
    // We use setTimeout to avoid synchronous setState warnings during render
    const timer = setTimeout(() => {
      if (initialData) {
        setForm(initialData)
      } else {
        setForm({
          id: crypto.randomUUID(),
          title: "",
          subtitle: "",
          buttonText: "",
          buttonLink: "",
          imageId: "",
        })
      }
    }, 0)
    
    return () => clearTimeout(timer)
  }, [initialData, open])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(form)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="!max-w-4xl  overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{initialData ? "Edit Slide" : "Add New Slide"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="w-full md:w-1/3 space-y-2">
              <Label>Background Image</Label>
              <MediaPicker
                value={form.imageId}
                onChange={(val) => setForm({ ...form, imageId: val as string })}
                label="Select Slide Image"
                width="w-full"
                height="h-[250px]"
                className="rounded-md border-border/50"
              />
              <p className="text-[11px] text-muted-foreground mt-1">
                <strong>Recommended size: 1920x1080 pixels (16:9 ratio)</strong> to ensure it covers the entire desktop screen nicely.
              </p>
            </div>
            
            <div className="w-full md:w-2/3 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g. Modern Architecture"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="subtitle">Subtitle / Description</Label>
                <Textarea
                  id="subtitle"
                  value={form.subtitle}
                  onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
                  placeholder="Brief description here..."
                  className="min-h-[80px]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="buttonText">Button Text</Label>
                  <Input
                    id="buttonText"
                    value={form.buttonText}
                    onChange={(e) => setForm({ ...form, buttonText: e.target.value })}
                    placeholder="e.g. Learn More"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="buttonLink">Button Link (Product)</Label>
                  <Combobox
                    id="buttonLink"
                    value={form.buttonLink}
                    onChange={(val) => setForm({ ...form, buttonLink: val })}
                    options={productOptions}
                    placeholder="Select a product..."
                    searchPlaceholder="Search products..."
                    allowClear
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">
              {initialData ? "Save Changes" : "Add Slide"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
