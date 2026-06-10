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


export interface SmartItemData {
  id: string
  title: string
  tag: string
  description: string
  imageId: string
  imageAlt: string
  icon: string
  image?: string
}

export interface ServicesSmartContent {
  intro: {
    eyebrow: string
    titlePart1: string
    titleHighlight: string
    description: string
    buttonText: string
    buttonLink: string
    statsText: string
  }
  items: SmartItemData[]
}

const defaultContent: ServicesSmartContent = {
  intro: {
    eyebrow: "Smart Services",
    titlePart1: "Next-Gen",
    titleHighlight: "Intelligence",
    description: "We've paired our field-engineering expertise with IoT sensors, cloud analytics and machine learning — turning routine maintenance into a predictive, always-on service.",
    buttonText: "Request Demo",
    buttonLink: "/contact",
    statsText: "Live across 120+ sites",
  },
  items: [
    {
      id: "1",
      title: "IoT Remote Monitoring",
      tag: "IoT",
      description: "Real-time telemetry from your transformers and switchgear streamed to a secure cloud — anomalies surface before they become outages.",
      imageId: "",
      image: "/gallery/control-panel.jpg",
      imageAlt: "Smart control panel with live telemetry",
      icon: "faSatelliteDish",
    },
    {
      id: "2",
      title: "AI Predictive Diagnostics",
      tag: "Predictive AI",
      description: "Machine-learning models trained on years of field data flag failing components weeks in advance of breakdown.",
      imageId: "",
      image: "/gallery/engineer-panel.jpg",
      imageAlt: "Engineer reviewing AI diagnostic dashboard",
      icon: "faMicrochip",
    },
    {
      id: "3",
      title: "Cloud Analytics Suite",
      tag: "Cloud",
      description: "Dashboards, alerts and historical trend lines — accessible from any browser, any device.",
      imageId: "",
      image: "/gallery/control-room.jpg",
      imageAlt: "Cloud analytics control room",
      icon: "faCloud",
    },
    {
      id: "4",
      title: "24/7 Live Operations Center",
      tag: "Always On",
      description: "Round-the-clock monitoring by certified engineers — instant escalation when your assets deviate from baseline.",
      imageId: "",
      image: "/gallery/substation-dusk.jpg",
      imageAlt: "Substation at dusk under live monitoring",
      icon: "faChartLine",
    }
  ]
}

export function ServicesSmartTab() {
  const user = useCurrentUser()
  const canUpdate = isSuperAdmin(user) || hasAction(user, "content.services.smart", "update")

  const { data: contentMap, isLoading } = useGetDynamicContentsMapQuery("services")
  const [upsert, { isLoading: isSaving }] = useUpsertDynamicContentMutation()
  
  const [form, setForm] = useState<ServicesSmartContent>(defaultContent)
  
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<SmartItemData | null>(null)
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null)
  
  const [itemForm, setItemForm] = useState<SmartItemData>({
    id: "", title: "", tag: "", description: "", imageId: "", imageAlt: "", icon: "faSatelliteDish", image: ""
  })

  useEffect(() => {
    const timer = setTimeout(() => {
      if (contentMap?.["services-smart"]?.value) {
        setForm({ ...defaultContent, ...contentMap["services-smart"].value })
      }
    }, 0)
    return () => clearTimeout(timer)
  }, [contentMap])

  const saveFullState = async (newState: ServicesSmartContent) => {
    try {
      await upsert({
        key: "services-smart",
        group: "services",
        type: "json",
        name: "Services Smart Solutions",
        description: "The Industry 4.0 smart solutions section",
        value: newState,
        isActive: true,
      }).unwrap()
      toast.success("Smart section updated")
    } catch {
      toast.error("Failed to update Smart section")
    }
  }

  const handleSaveIntro = async () => {
    await saveFullState(form)
  }

  const handleAddItem = () => {
    setEditingItem(null)
    setItemForm({ id: "", title: "", tag: "", description: "", imageId: "", imageAlt: "", icon: "faSatelliteDish", image: "" })
    setIsModalOpen(true)
  }

  const handleEditItem = (item: SmartItemData) => {
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

  const columns: Column<SmartItemData>[] = [
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
      key: "tag",
      header: "Tag",
      cell: (d) => <div className="text-xs uppercase px-2 py-1 bg-muted rounded-full w-fit">{d.tag}</div>,
    },
    {
      key: "icon",
      header: "Icon",
      cell: (d) => {
        const className = d.icon.includes("fa-") 
          ? d.icon 
          : `fa-solid fa${d.icon.replace(/^fa/, '').replace(/[A-Z]/g, m => '-' + m.toLowerCase())}`;
        return <div className="text-xl text-primary"><i className={className} title={d.icon}></i></div>;
      },
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
            <h2 className="text-lg font-medium">Smart Solutions</h2>
            <p className="text-sm text-muted-foreground">
              Manage the "Industry 4.0" section cards and typography.
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
            
            <div className="space-y-2">
              <Label>Small Eyebrow Label</Label>
              <Input 
                value={form.intro.eyebrow} 
                onChange={e => setForm({ ...form, intro: { ...form.intro, eyebrow: e.target.value } })} 
              />
            </div>
            
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

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-2">
                <Label>Button Text</Label>
                <Input 
                  value={form.intro.buttonText} 
                  onChange={e => setForm({ ...form, intro: { ...form.intro, buttonText: e.target.value } })} 
                />
              </div>
              <div className="space-y-2">
                <Label>Button Link</Label>
                <Input 
                  value={form.intro.buttonLink} 
                  onChange={e => setForm({ ...form, intro: { ...form.intro, buttonLink: e.target.value } })} 
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Stats Text (e.g. Live across 120+ sites)</Label>
              <Input 
                value={form.intro.statsText} 
                onChange={e => setForm({ ...form, intro: { ...form.intro, statsText: e.target.value } })} 
              />
            </div>
          </div>
        </div>
      </div>

      <div className="border-t pt-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold text-md">Smart Cards</h3>
          </div>
          {canUpdate && (
          <Button onClick={handleAddItem}>
            <Plus className="h-4 w-4 mr-2" /> Add Card
          </Button>
        )}
        </div>
        
        <DataTable<SmartItemData>
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
        <DialogContent className="!max-w-4xl w-full">
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
                  <Label>Tag</Label>
                  <Input
                    value={itemForm.tag}
                    onChange={(e) => setItemForm({ ...itemForm, tag: e.target.value })}
                    placeholder="e.g. IoT"
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
                    placeholder="e.g. faSatelliteDish"
                    required
                  />
                  <p className="text-[11px] text-muted-foreground leading-tight">
                    Find icons at <a href="https://fontawesome.com/search?o=r&m=free&s=solid" target="_blank" rel="noreferrer" className="text-primary hover:underline">FontAwesome</a> (e.g. <code>faSatelliteDish</code>).
                    <br /><em>Note: The icon must be pre-configured in the frontend code.</em>
                  </p>
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
                    <strong>Recommended size: 800x800 pixels (1:1 square).</strong>
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
        description="This will remove the smart solution card from the page."
        confirmLabel="Delete"
        destructive
        onConfirm={confirmDelete}
      />
    </div>
  )
}
