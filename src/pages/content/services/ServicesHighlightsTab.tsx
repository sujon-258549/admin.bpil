import { useState, useEffect } from "react"
import { useGetDynamicContentsMapQuery, useUpsertDynamicContentMutation } from "@/redux/features/dynamic-content/dynamicContent-api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Pencil, Save } from "lucide-react"
import { toast } from "sonner"
import { Skeleton } from "@/components/ui/skeleton"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { MediaPicker } from "@/components/shared"

export interface HighlightItemData {
  id: string
  title: string
  description: string
  icon: string
}

export interface ServicesHighlightsContent {
  imageId?: string
  imageAlt?: string
  items: HighlightItemData[]
}

const defaultContent: ServicesHighlightsContent = {
  imageId: "",
  imageAlt: "BPIL field engineer inspecting a substation",
  items: [
    {
      id: "1",
      title: "Certified Engineers",
      description: "Our field team is fully certified for high-voltage testing and compliance.",
      icon: "faUserTie",
    },
    {
      id: "2",
      title: "Genuine Spares",
      description: "We use only OEM-approved components for all replacements and repairs.",
      icon: "faGear",
    },
    {
      id: "3",
      title: "Annual Maintenance Contracts",
      description: "We offer flexible AMC packages for PFI Panels to ensure year-round reliability.",
      icon: "faLifeRing",
    },
    {
      id: "4",
      title: "Emergency Support",
      description: "We provide technical support within 24 hours for urgent cases.",
      icon: "faHeadset",
    }
  ]
}

export function ServicesHighlightsTab() {
  const { data: contentMap, isLoading } = useGetDynamicContentsMapQuery("services")
  const [upsert, { isLoading: isSaving }] = useUpsertDynamicContentMutation()
  
  const [form, setForm] = useState<ServicesHighlightsContent>(defaultContent)
  
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<HighlightItemData | null>(null)
  
  const [itemForm, setItemForm] = useState<HighlightItemData>({
    id: "", title: "", description: "", icon: "faUserTie"
  })

  useEffect(() => {
    const timer = setTimeout(() => {
      if (contentMap?.["services-highlights"]?.value) {
        setForm({ ...defaultContent, ...contentMap["services-highlights"].value })
      }
    }, 0)
    return () => clearTimeout(timer)
  }, [contentMap])

  const saveFullState = async (newState: ServicesHighlightsContent) => {
    try {
      await upsert({
        key: "services-highlights",
        group: "services",
        type: "json",
        name: "Services Highlights",
        description: "The 4 highlight boxes",
        value: newState,
        isActive: true,
      }).unwrap()
      toast.success("Highlights updated")
    } catch {
      toast.error("Failed to update highlights")
    }
  }

  const handleEditItem = (item: HighlightItemData) => {
    setEditingItem(item)
    setItemForm({ ...item })
    setIsModalOpen(true)
  }

  const handleItemSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingItem) return
    const newItems = form.items.map(i => i.id === editingItem.id ? { ...itemForm } : i)
    
    const newState = { ...form, items: newItems }
    setForm(newState)
    await saveFullState(newState)
    setIsModalOpen(false)
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
      
      <div className="mb-6 w-full">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-medium">Highlights</h2>
            <p className="text-sm text-muted-foreground">
              Manage the 4 feature highlight boxes (Note: This section strictly requires exactly 4 items for the layout).
            </p>
          </div>
          <Button onClick={() => saveFullState(form)} disabled={isSaving}>
            <Save className="h-4 w-4 mr-2" /> Save Image
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 mb-8 border-b pb-8">
        <div className="space-y-2">
          <Label>Highlight Center Image</Label>
          <MediaPicker
            value={form.imageId || ""}
            onChange={(url) => setForm({ ...form, imageId: url })}
          />
          <p className="text-xs text-muted-foreground mt-2">
            This image is displayed in the center of the highlights grid. <br />
            <strong>Recommended Size:</strong> 4:5 aspect ratio (e.g. 800x1000px).
          </p>
        </div>
        <div className="space-y-2">
          <Label>Image Alt Text</Label>
          <Input
            value={form.imageAlt || ""}
            onChange={(e) => setForm({ ...form, imageAlt: e.target.value })}
            placeholder="e.g. Engineer inspecting a substation"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {form.items.map((item) => (
          <div key={item.id} className="p-4 border rounded-lg bg-muted/20 relative group">
            <Button
              variant="secondary"
              size="icon"
              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => handleEditItem(item)}
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <div className="text-xl text-primary mb-2">
              <i className={item.icon.includes("fa-") ? item.icon : `fa-solid fa${item.icon.replace(/^fa/, '').replace(/[A-Z]/g, m => '-' + m.toLowerCase())}`} title={item.icon}></i>
            </div>
            <h3 className="font-semibold text-primary mb-2">{item.title}</h3>
            <p className="text-sm text-muted-foreground line-clamp-3">{item.description}</p>
          </div>
        ))}
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="!max-w-3xl w-full">
          <DialogHeader>
            <DialogTitle>Edit Highlight</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleItemSubmit} className="space-y-6 mt-4">
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Title</Label>
                <Input
                  value={itemForm.title}
                  onChange={(e) => setItemForm({ ...itemForm, title: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  value={itemForm.description}
                  onChange={(e) => setItemForm({ ...itemForm, description: e.target.value })}
                  required
                  className="min-h-[100px]"
                />
              </div>

              <div className="space-y-2">
                <Label>FontAwesome Icon ID</Label>
                <Input
                  value={itemForm.icon}
                  onChange={(e) => setItemForm({ ...itemForm, icon: e.target.value })}
                  placeholder="e.g. faUserTie"
                  required
                />
                <p className="text-[11px] text-muted-foreground leading-tight">
                  Find icons at <a href="https://fontawesome.com/search?o=r&m=free&s=solid" target="_blank" rel="noreferrer" className="text-primary hover:underline">FontAwesome</a> (e.g. <code>faUserTie</code>).
                  <br /><em>Note: The icon must be pre-configured in the frontend code.</em>
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">
                Save Changes
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
