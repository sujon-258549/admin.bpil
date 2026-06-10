import { useState, useEffect } from "react"
import { useGetDynamicContentsMapQuery, useUpsertDynamicContentMutation } from "@/redux/features/dynamic-content/dynamicContent-api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Save, Loader2, Plus, LayoutGrid, Pencil, Trash2 } from "lucide-react"
import { toast } from "sonner"
import { Skeleton } from "@/components/ui/skeleton"
import { DataTable, type Column, EmptyState, ConfirmDialog, MediaPicker } from "@/components/shared"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

export interface PillarCardData {
  id: string
  title: string
  tag: string
  description: string
  imageId: string
  imageAlt: string
  icon: string
}

export interface PillarsSectionContent {
  intro: {
    eyebrow: string
    titlePart1: string
    titleHighlight: string
    titlePart2: string
    description: string
  }
  items: PillarCardData[]
}

const defaultContent: PillarsSectionContent = {
  intro: {
    eyebrow: "What Sets Us Apart",
    titlePart1: "The",
    titleHighlight: "four pillars",
    titlePart2: "of how we engineer.",
    description: "Process, people, certifications and after-sales — four disciplines we've refined over a decade of building critical electrical infrastructure across Bangladesh.",
  },
  items: [
    {
      id: "1",
      title: "In-House Engineering Team",
      tag: "Talent",
      description: "60+ certified electrical engineers — no subcontractors. Design, drafting, panel build and commissioning all happen under our roof.",
      imageId: "",
      imageAlt: "BPIL engineer working on a panel in-house",
      icon: "faPeopleGroup",
    },
  ]
}

export function PillarsTab() {
  const { data: contentMap, isLoading } = useGetDynamicContentsMapQuery("about")
  const [upsert, { isLoading: isSaving }] = useUpsertDynamicContentMutation()
  
  const [form, setForm] = useState<PillarsSectionContent>(defaultContent)
  
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<PillarCardData | null>(null)
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null)
  
  const [itemForm, setItemForm] = useState<PillarCardData>({
    id: "",
    title: "",
    tag: "",
    description: "",
    imageId: "",
    imageAlt: "",
    icon: "faStar",
  })

  useEffect(() => {
    const timer = setTimeout(() => {
      if (contentMap?.["about-pillars"]?.value) {
        setForm({ ...defaultContent, ...contentMap["about-pillars"].value })
      }
    }, 0)
    return () => clearTimeout(timer)
  }, [contentMap])

  const saveFullState = async (newState: PillarsSectionContent) => {
    try {
      await upsert({
        key: "about-pillars",
        group: "about",
        type: "json",
        name: "About Pillars",
        description: "The pillars grid section on the about page",
        value: newState,
        isActive: true,
      }).unwrap()
      toast.success("Pillars section updated successfully")
    } catch {
      toast.error("Failed to update Pillars section")
    }
  }

  const handleSaveIntro = async () => {
    await saveFullState(form)
  }

  const handleAddItem = () => {
    setEditingItem(null)
    setItemForm({
      id: "",
      title: "",
      tag: "",
      description: "",
      imageId: "",
      imageAlt: "",
      icon: "faStar",
    })
    setIsModalOpen(true)
  }

  const handleEditItem = (item: PillarCardData) => {
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

  const columns: Column<PillarCardData>[] = [
    {
      key: "title",
      header: "Title",
      cell: (d) => <div className="font-medium max-w-[200px] truncate">{d.title}</div>,
    },
    {
      key: "tag",
      header: "Tag",
      cell: (d) => <div className="text-xs">{d.tag}</div>,
    },
    {
      key: "description",
      header: "Description",
      cell: (d) => <div className="text-muted-foreground text-xs truncate max-w-[250px]">{d.description}</div>,
    },
    {
      key: "icon",
      header: "Icon",
      cell: (d) => {
        const className = d.icon?.includes("fa-") 
          ? d.icon 
          : `fa-solid fa${d.icon?.replace(/^fa/, '').replace(/[A-Z]/g, m => '-' + m.toLowerCase())}`;
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
            <h2 className="text-lg font-medium">Our Pillars</h2>
            <p className="text-sm text-muted-foreground">
              Manage the "What Sets Us Apart" text and the pillar cards.
            </p>
          </div>
          <Button onClick={handleSaveIntro} disabled={isSaving}>
            {isSaving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
            Save Typography
          </Button>
        </div>

        <div className="">
          <div className="space-y-4 bg-muted/20 p-4 rounded-lg border">
            <h3 className="font-semibold text-sm border-b pb-2">Typography & Content</h3>
            
            <div className="space-y-2">
              <Label>Small Eyebrow Label</Label>
              <Input 
                value={form.intro.eyebrow} 
                onChange={e => setForm({ ...form, intro: { ...form.intro, eyebrow: e.target.value } })} 
              />
            </div>
            
            <div className="grid grid-cols-3 gap-2">
              <div className="space-y-2">
                <Label>Title (Part 1)</Label>
                <Input 
                  value={form.intro.titlePart1} 
                  onChange={e => setForm({ ...form, intro: { ...form.intro, titlePart1: e.target.value } })} 
                />
              </div>
              <div className="space-y-2">
                <Label>Highlight</Label>
                <Input 
                  value={form.intro.titleHighlight} 
                  onChange={e => setForm({ ...form, intro: { ...form.intro, titleHighlight: e.target.value } })} 
                />
              </div>
              <div className="space-y-2">
                <Label>Title (Part 2)</Label>
                <Input 
                  value={form.intro.titlePart2} 
                  onChange={e => setForm({ ...form, intro: { ...form.intro, titlePart2: e.target.value } })} 
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
            <h3 className="font-semibold text-md">Pillar Cards</h3>
            <p className="text-sm text-muted-foreground">The first card is large, the 2nd and 3rd are medium, and the 4th is wide.</p>
          </div>
          <Button onClick={handleAddItem}>
            <Plus className="h-4 w-4 mr-2" /> Add Pillar
          </Button>
        </div>
        
        <DataTable<PillarCardData>
          data={form.items}
          columns={columns}
          isLoading={false}
          empty={
            <EmptyState
              icon={LayoutGrid}
              title="No pillars added yet."
              action={
                <Button size="sm" onClick={handleAddItem}>
                  <Plus className="size-4 mr-2" /> Add your first pillar
                </Button>
              }
            />
          }
        />
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="!max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingItem ? "Edit Pillar Card" : "Add Pillar Card"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleItemSubmit} className="space-y-6 mt-4">
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Title</Label>
                <Input
                  value={itemForm.title}
                  onChange={(e) => setItemForm({ ...itemForm, title: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Tag (e.g. Talent)</Label>
                <Input
                  value={itemForm.tag}
                  onChange={(e) => setItemForm({ ...itemForm, tag: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={itemForm.description}
                onChange={(e) => setItemForm({ ...itemForm, description: e.target.value })}
                required
                className="min-h-[80px]"
              />
            </div>

            <div className="grid grid-cols-2 gap-5">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>FontAwesome Icon ID</Label>
                  <Input
                    value={itemForm.icon}
                    onChange={(e) => setItemForm({ ...itemForm, icon: e.target.value })}
                    placeholder="e.g. faPeopleGroup, faAward"
                    required
                  />
                  <p className="text-[11px] text-muted-foreground leading-tight">
                    Find icons at <a href="https://fontawesome.com/search?o=r&m=free&s=solid" target="_blank" rel="noreferrer" className="text-primary hover:underline">FontAwesome</a> (e.g. <code>faPeopleGroup</code>).
                    <br /><em>Note: The icon must be pre-configured in the frontend code.</em>
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Card Image</Label>
                <MediaPicker
                  value={itemForm.imageId}
                  onChange={(val) => setItemForm({ ...itemForm, imageId: val as string })}
                  width="w-full"
                  height="h-[150px]"
                  label="Select Image"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">
                {editingItem ? "Save Changes" : "Add Pillar"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={Boolean(pendingDeleteId)}
        onOpenChange={(v) => !v && setPendingDeleteId(null)}
        title="Delete Pillar?"
        description="This will remove the pillar card from the page."
        confirmLabel="Delete"
        destructive
        onConfirm={confirmDelete}
      />
    </div>
  )
}
