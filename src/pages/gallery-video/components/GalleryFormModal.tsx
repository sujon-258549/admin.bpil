import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useGallery } from "@/hooks/data-fetch"
import { MediaPicker } from "@/components/shared/media-picker"
import type { GalleryItem } from "@/redux/features/gallery"
import { toast } from "sonner"
import { FormField } from "@/components/shared"

const gallerySchema = z.object({
  alt: z.string().min(1, "Alt text is required"),
  category: z.string().min(1, "Category is required"),
  imageId: z.string().min(1, "Image is required"),
})

type GalleryFormValues = z.infer<typeof gallerySchema>

interface GalleryFormModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  initial?: GalleryItem | null
  onCreated?: () => void
}

export function GalleryFormModal({ open, onOpenChange, initial, onCreated }: GalleryFormModalProps) {
  const { createGallery, updateGallery } = useGallery()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<GalleryFormValues>({
    resolver: zodResolver(gallerySchema),
    defaultValues: {
      alt: "",
      category: "",
      imageId: "",
    },
  })

  // Reset form when modal opens/closes or initial data changes
  useEffect(() => {
    if (open) {
      if (initial) {
        form.reset({
          alt: initial.alt,
          category: initial.category || "",
          imageId: initial.imageId,
        })
      } else {
        form.reset({
          alt: "",
          category: "",
          imageId: "",
        })
      }
    }
  }, [open, initial, form])

  const onSubmit = async (data: GalleryFormValues) => {
    setIsSubmitting(true)
    try {
      if (initial) {
        await updateGallery(initial.id, data)
        toast.success("Gallery item updated successfully")
      } else {
        await createGallery(data)
        toast.success("Gallery item created successfully")
        onCreated?.()
      }
      onOpenChange(false)
    } catch (error: any) {
      toast.error(error?.data?.message || "Something went wrong")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="!max-w-2xl">
        <DialogHeader>
          <DialogTitle>{initial ? "Edit Gallery Item" : "Add Gallery Item"}</DialogTitle>
          <DialogDescription>
            {initial ? "Update the details of this gallery image." : "Add a new image to the gallery."}
          </DialogDescription>
        </DialogHeader>

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-6">
                <FormField
                  label="Alt Text / Title"
                  error={form.formState.errors.alt?.message}
                >
                  <Input
                    placeholder="e.g. Substation infrastructure"
                    {...form.register("alt")}
                  />
                </FormField>

                <FormField
                  label="Category"
                  error={form.formState.errors.category?.message}
                >
                  <Input
                    placeholder="e.g. Transformers"
                    {...form.register("category")}
                  />
                </FormField>
              </div>

              <div>
                <FormField
                  label="Image"
                  error={form.formState.errors.imageId?.message}
                >
                  <MediaPicker
                    value={form.watch("imageId") || undefined}
                    onChange={(imageId: string) => {
                      form.setValue("imageId", imageId, { shouldValidate: true })
                    }}
                  />
                </FormField>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : initial ? "Update Item" : "Add Item"}
              </Button>
            </div>
          </form>
      </DialogContent>
    </Dialog>
  )
}
