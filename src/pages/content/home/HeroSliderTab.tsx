import { useState } from "react"
import { useGetDynamicContentsMapQuery, useUpsertDynamicContentMutation } from "@/redux/features/dynamic-content/dynamicContent-api"
import { Button } from "@/components/ui/button"
import { Plus, Pencil, Trash2, Image as ImageIcon } from "lucide-react"
import { HeroSliderFormModal, type HeroSlide } from "./HeroSliderFormModal"
import { Image, DataTable, type Column, EmptyState, Text, ConfirmDialog } from "@/components/shared"
import { toast } from "sonner"
import { Skeleton } from "@/components/ui/skeleton"

export function HeroSliderTab() {
  const { data: contentMap, isLoading } = useGetDynamicContentsMapQuery("home")
  const [upsert] = useUpsertDynamicContentMutation()
  
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingSlide, setEditingSlide] = useState<HeroSlide | null>(null)

  const heroSliderContent = contentMap?.["home-hero-slider"]
  const slides: HeroSlide[] = heroSliderContent?.value || []

  const handleAddSlide = () => {
    setEditingSlide(null)
    setIsModalOpen(true)
  }

  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null)

  const handleEditSlide = (slide: HeroSlide) => {
    setEditingSlide(slide)
    setIsModalOpen(true)
  }

  const handleDeleteSlide = (id: string) => {
    setPendingDeleteId(id)
  }

  const confirmDelete = async () => {
    if (!pendingDeleteId) return
    const newSlides = slides.filter(s => s.id !== pendingDeleteId)
    await saveSlides(newSlides)
    setPendingDeleteId(null)
  }

  const saveSlides = async (newSlides: HeroSlide[]) => {
    try {
      await upsert({
        key: "home-hero-slider",
        group: "home",
        type: "json",
        name: "Home Hero Slider",
        description: "Array of slides for the main home page hero section",
        value: newSlides,
        isActive: true,
      }).unwrap()
      toast.success("Hero slider updated successfully")
    } catch {
      toast.error("Failed to update hero slider")
    }
  }

  const handleFormSubmit = async (data: HeroSlide) => {
    let newSlides = [...slides]
    
    if (editingSlide) {
      // Update existing
      newSlides = newSlides.map(s => s.id === data.id ? data : s)
    } else {
      // Add new
      newSlides.push(data)
    }
    
    await saveSlides(newSlides)
  }

  const columns: Column<HeroSlide>[] = [
    {
      key: "image",
      header: "Image",
      cell: (d) => (
        <div className="h-12 w-20 rounded-md overflow-hidden bg-muted flex items-center justify-center border">
          {d.imageId ? (
            <Image preview imageId={d.imageId} alt={d.title} className="w-full h-full object-cover" />
          ) : (
            <span className="text-[10px] text-muted-foreground">No Image</span>
          )}
        </div>
      ),
    },
    {
      key: "title",
      header: "Title & Subtitle",
      cell: (d) => (
        <div className="min-w-0 max-w-[250px]">
          <div className="truncate font-medium">{d.title || "Untitled Slide"}</div>
          <Text size="xs" tone="muted" className="truncate">
            {d.subtitle || "No subtitle"}
          </Text>
        </div>
      ),
    },
    {
      key: "links",
      header: "Button / Link",
      cell: (d) => (
        <div className="flex gap-3 text-xs text-muted-foreground max-w-[200px] truncate">
          {d.buttonText && <span>Btn: {d.buttonText}</span>}
          {d.buttonLink && <span>Link: {d.buttonLink}</span>}
        </div>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      align: "right",
      fixed: "right",
      cell: (d) => (
        <div className="flex justify-end gap-1">
          <Button variant="secondary" size="icon-sm" onClick={() => handleEditSlide(d)} className="border border-gray-300">
            <Pencil className="size-4" />
          </Button>
          <Button variant="destructive" size="icon-sm" onClick={() => handleDeleteSlide(d.id)} className="border border-gray-300">
            <Trash2 className="size-4" />
          </Button>
        </div>
      ),
    },
  ]

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    )
  }

  return (
    <div className="rounded-lg border bg-card text-card-foreground p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-medium">Hero Slider</h2>
          <p className="text-sm text-muted-foreground">
            Manage the slides shown at the top of the home page.
          </p>
        </div>
        <Button onClick={handleAddSlide}>
          <Plus className="h-4 w-4 mr-2" /> Add Slide
        </Button>
      </div>

      <DataTable<HeroSlide>
        data={slides}
        columns={columns}
        isLoading={isLoading}
        empty={
          <EmptyState
            icon={ImageIcon}
            title="No slides added yet."
            action={
              <Button size="sm" onClick={handleAddSlide}>
                <Plus className="size-4 mr-2" /> Add your first slide
              </Button>
            }
          />
        }
      />

      <HeroSliderFormModal 
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        initialData={editingSlide}
        onSubmit={handleFormSubmit}
      />

      <ConfirmDialog
        open={Boolean(pendingDeleteId)}
        onOpenChange={(v) => !v && setPendingDeleteId(null)}
        title="Delete Slide?"
        description="This will permanently remove this slide from the Hero Slider. This action cannot be undone."
        confirmLabel="Delete"
        destructive
        onConfirm={confirmDelete}
      />
    </div>
  )
}
