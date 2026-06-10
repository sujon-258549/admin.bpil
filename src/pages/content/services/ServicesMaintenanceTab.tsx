import { useState, useEffect } from "react"
import { useGetDynamicContentsMapQuery, useUpsertDynamicContentMutation } from "@/redux/features/dynamic-content/dynamicContent-api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Save, Loader2, Plus, LayoutGrid, Pencil, Trash2 } from "lucide-react"
import { toast } from "sonner"
import { Skeleton } from "@/components/ui/skeleton"
import { DataTable, type Column, EmptyState, ConfirmDialog, MediaPicker, Image } from "@/components/shared"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useCurrentUser } from "@/hooks/use-permission"
import { hasAction, isSuperAdmin } from "@/lib/permissions"


export interface MaintenanceItemData {
  id: string
  title: string
  category: string
  description: string
  imageId: string
  imageAlt: string
  href: string
  image?: string
}

export interface ServicesMaintenanceContent {
  intro: {
    titlePart1: string
    titleHighlight: string
    description: string
  }
  items: MaintenanceItemData[]
}

const defaultContent: ServicesMaintenanceContent = {
  intro: {
    titlePart1: "Our",
    titleHighlight: "Preventive Maintenance",
    description: "Six service lines covering your entire electrical stack — routine maintenance to prevent major failures and unexpected breakdowns.",
  },
  items: [
    {
      id: "1",
      title: "Transformer Service",
      category: "Transformers",
      description: "BDV (Breakdown Voltage) and DGA (Dissolved Gas Analysis) tests assess the internal health of your transformer, detecting potential faults long before they cause downtime.",
      imageId: "",
      image: "/gallery/transformer.jpg",
      imageAlt: "Distribution transformer at substation",
      href: "/products/transformer"
    },
    {
      id: "2",
      title: "HT Switch Gear Service",
      category: "High-Tension",
      description: "Thorough inspection for oil leaks, bushing cracks, body corrosion and other signs of damage — keeping your 11kV / 33kV systems safe and reliable.",
      imageId: "",
      image: "/gallery/ht-switchgear.jpg",
      imageAlt: "HT switchgear panel close-up",
      href: "/products/ht-switchgear"
    },
    {
      id: "3",
      title: "LT Switch Gear Service",
      category: "Low-Tension",
      description: "State-of-the-art machinery removes moisture and contaminants, restoring oil insulating properties and topping up as required — protecting downstream loads.",
      imageId: "",
      image: "/gallery/lt-switchgear.jpg",
      imageAlt: "LT switchgear panel installation",
      href: "/products/lt-switchgear"
    },
    {
      id: "4",
      title: "PFI Service",
      category: "Power Factor",
      description: "Capacitor checks, contactor inspection and silica gel breather replacement keep your PFI panels at peak efficiency — cutting reactive power penalties month after month.",
      imageId: "",
      image: "/gallery/pfi-capacitor.jpg",
      imageAlt: "Industrial PFI capacitor bank",
      href: "/products/pfi-panel"
    },
    {
      id: "5",
      title: "Generator Service",
      category: "Generators",
      description: "Cooling fins, radiators, fuel lines and electrical terminations are inspected and cleaned to maintain efficient heat dissipation and optimal operating temperatures.",
      imageId: "",
      image: "/gallery/generator.jpg",
      imageAlt: "Industrial diesel generator unit",
      href: "/products/generators"
    },
    {
      id: "6",
      title: "Solar Service",
      category: "Renewables",
      description: "Electrical connections are inspected and tightened to prevent sparking and overheating. Earthing integrity is verified, panels cleaned and inverter health logged.",
      imageId: "",
      image: "/gallery/solar.jpg",
      imageAlt: "Solar PV array under blue sky",
      href: "/products/solar"
    }
  ]
}

export function ServicesMaintenanceTab() {
  const user = useCurrentUser()
  const canUpdate = isSuperAdmin(user) || hasAction(user, "content.services.maintenance", "update")

  const { data: contentMap, isLoading } = useGetDynamicContentsMapQuery("services")
  const [upsert, { isLoading: isSaving }] = useUpsertDynamicContentMutation()
  
  const [form, setForm] = useState<ServicesMaintenanceContent>(defaultContent)
  
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<MaintenanceItemData | null>(null)
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null)
  
  const [itemForm, setItemForm] = useState<MaintenanceItemData>({
    id: "", title: "", category: "", description: "", imageId: "", imageAlt: "", href: "", image: ""
  })

  useEffect(() => {
    const timer = setTimeout(() => {
      if (contentMap?.["services-maintenance"]?.value) {
        setForm({ ...defaultContent, ...contentMap["services-maintenance"].value })
      }
    }, 0)
    return () => clearTimeout(timer)
  }, [contentMap])

  const saveFullState = async (newState: ServicesMaintenanceContent) => {
    try {
      await upsert({
        key: "services-maintenance",
        group: "services",
        type: "json",
        name: "Services Maintenance",
        description: "The preventive maintenance section and cards",
        value: newState,
        isActive: true,
      }).unwrap()
      toast.success("Maintenance section updated")
    } catch {
      toast.error("Failed to update Maintenance section")
    }
  }

  const handleSaveIntro = async () => {
    await saveFullState(form)
  }

  const handleAddItem = () => {
    setEditingItem(null)
    setItemForm({ id: "", title: "", category: "", description: "", imageId: "", imageAlt: "", href: "", image: "" })
    setIsModalOpen(true)
  }

  const handleEditItem = (item: MaintenanceItemData) => {
    setEditingItem(item)
    setItemForm({ ...item })
    setIsModalOpen(true)
  }

  const handleDeleteItem = (id: string) => {
    setPendingDeleteId(id)
  }

  const confirmDelete = async () => {
    if (!pendingDeleteId) return
    const newItems = form.items.filter(i => i.id !== pendingDeleteId)
    const newState = { ...form, items: newItems }
    setForm(newState)
    await saveFullState(newState)
    setPendingDeleteId(null)
  }

  const handleItemSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    let newItems = [...form.items]
    if (editingItem) {
      newItems = newItems.map(i => i.id === editingItem.id ? { ...itemForm, id: i.id } : i)
    } else {
      newItems = [...newItems, { ...itemForm, id: crypto.randomUUID() }]
    }
    
    const newState = { ...form, items: newItems }
    setForm(newState)
    await saveFullState(newState)
    setIsModalOpen(false)
  }

  const columns: Column<MaintenanceItemData>[] = [
    {
      key: "image",
      header: "Image",
      cell: (d) => {
        return (d.imageId || d.image) ? (
          <div className="h-10 w-16 shrink-0 overflow-hidden rounded-md border">
            <Image 
              imageId={d.imageId} 
              src={d.image} 
              alt={d.title} 
              preview 
              className="h-full w-full object-cover" 
            />
          </div>
        ) : (
          <div className="h-10 w-16 shrink-0 rounded-md bg-muted flex items-center justify-center text-[10px] text-muted-foreground">
            No img
          </div>
        )
      }
    },
    {
      key: "title",
      header: "Title",
      cell: (d) => <div className="font-medium max-w-[200px] truncate">{d.title}</div>,
    },
    {
      key: "category",
      header: "Category",
      cell: (d) => <div className="text-xs uppercase px-2 py-1 bg-muted rounded-full w-fit">{d.category}</div>,
    },
    {
      key: "actions",
      header: "Actions",
      align: "right",
      fixed: "right",
      cell: (d) => (
        <div className="flex justify-end gap-1">
          <Button variant="secondary" size="icon-sm" onClick={() => handleEditItem(d)}>
            <Pencil className="size-4" />
          </Button>
          <Button variant="destructive" size="icon-sm" onClick={() => handleDeleteItem(d.id)}>
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
        <Skeleton className="h-64 w-full" />
      </div>
    )
  }

  return (
    <div className="rounded-lg border bg-card text-card-foreground p-6">
      
      <div className="mb-10 w-full">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-medium">Maintenance Services</h2>
            <p className="text-sm text-muted-foreground">
              Manage the "Comprehensive Maintenance Solutions" text and cards.
            </p>
          </div>
          <Button onClick={handleSaveIntro} disabled={isSaving}>
            {isSaving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
            Save Typography
          </Button>
        </div>

        <div className="">
          <div className="space-y-4 bg-muted/20 p-4 rounded-lg border">
            <h3 className="font-semibold text-sm border-b pb-2">Header Configuration</h3>
            
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-2">
                <Label>Title (Part 1)</Label>
                <Input 
                  value={form.intro.titlePart1} 
                  onChange={e => setForm({ ...form, intro: { ...form.intro, titlePart1: e.target.value } })} 
                />
              </div>
              <div className="space-y-2">
                <Label>Title Highlight</Label>
                <Input 
                  value={form.intro.titleHighlight} 
                  onChange={e => setForm({ ...form, intro: { ...form.intro, titleHighlight: e.target.value } })} 
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea 
                value={form.intro.description} 
                onChange={e => setForm({ ...form, intro: { ...form.intro, description: e.target.value } })} 
                className="min-h-[80px]"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="border-t pt-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold text-md">Maintenance Cards</h3>
          </div>
          {canUpdate && (
          <Button onClick={handleAddItem}>
            <Plus className="h-4 w-4 mr-2" /> Add Card
          </Button>
        )}
        </div>
        
        <DataTable<MaintenanceItemData>
          data={form.items}
          columns={canUpdate ? columns : columns.filter(c => c.key !== "actions")}
          isLoading={false}
          empty={
            <EmptyState
              icon={LayoutGrid}
              title="No cards added yet."
              action={
                canUpdate && (
          <Button size="sm" onClick={handleAddItem}>
                  <Plus className="size-4 mr-2" /> Add your first card
                </Button>
        )
              }
            />
          }
        />
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="!max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingItem ? "Edit Card" : "Add Card"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleItemSubmit} className="space-y-6 mt-4">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  <Label>Category</Label>
                  <Input
                    value={itemForm.category}
                    onChange={(e) => setItemForm({ ...itemForm, category: e.target.value })}
                    placeholder="e.g. Transformers"
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
                  <Label>Link / HREF</Label>
                  <Input
                    value={itemForm.href}
                    onChange={(e) => setItemForm({ ...itemForm, href: e.target.value })}
                    placeholder="e.g. /products/transformer"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Featured Image</Label>
                  <MediaPicker
                    value={itemForm.imageId}
                    onChange={(val) => setItemForm({ ...itemForm, imageId: val as string })}
                    width="w-full"
                    height="h-[150px]"
                    label="Select Image"
                  />
                  <p className="text-[11px] text-muted-foreground mt-1">
                    <strong>Recommended size: 800x600 pixels.</strong>
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label>Image Alt Text</Label>
                  <Input
                    value={itemForm.imageAlt}
                    onChange={(e) => setItemForm({ ...itemForm, imageAlt: e.target.value })}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">
                {editingItem ? "Save Changes" : "Add Card"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={Boolean(pendingDeleteId)}
        onOpenChange={(v) => !v && setPendingDeleteId(null)}
        title="Delete Card?"
        description="This will remove the maintenance card from the page."
        confirmLabel="Delete"
        destructive
        onConfirm={confirmDelete}
      />
    </div>
  )
}
