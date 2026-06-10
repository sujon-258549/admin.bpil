import { useState, useEffect } from "react"
import { useGetDynamicContentsMapQuery, useUpsertDynamicContentMutation } from "@/redux/features/dynamic-content/dynamicContent-api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Save, Loader2, Plus, LayoutGrid, Pencil, Trash2 } from "lucide-react"
import { toast } from "sonner"
import { Skeleton } from "@/components/ui/skeleton"
import { DataTable, type Column, EmptyState, ConfirmDialog } from "@/components/shared"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

export interface LocationCardData {
  id: string
  title: string
  linesText: string // multi-line text
  icon: string
  href?: string
}

export interface LocationSectionContent {
  intro: {
    eyebrow: string
    titlePart1: string
    titleHighlight: string
    description: string
  }
  items: LocationCardData[]
}

const defaultContent: LocationSectionContent = {
  intro: {
    eyebrow: "Where To Find Us",
    titlePart1: "Visit Our",
    titleHighlight: "Head Office",
    description: "Drop by for a project briefing or product demo — our engineers are happy to walk you through specifications, lead times and site survey options in person.",
  },
  items: [
    {
      id: "1",
      title: "Head Office",
      linesText: "Dhaka, Bangladesh",
      icon: "faLocationDot",
    },
    {
      id: "2",
      title: "Call Us",
      linesText: "+880 123 456 789",
      icon: "faPhone",
      href: "tel:+880123456789",
    },
    {
      id: "3",
      title: "Email Us",
      linesText: "hello@bpil.com",
      icon: "faEnvelope",
      href: "mailto:hello@bpil.com",
    },
    {
      id: "4",
      title: "Working Hours",
      linesText: "Sun – Thu · 9:00 – 18:00\nSaturday · 10:00 – 14:00",
      icon: "faClock",
    },
  ]
}

export function LocationTab() {
  const { data: contentMap, isLoading } = useGetDynamicContentsMapQuery("about")
  const [upsert, { isLoading: isSaving }] = useUpsertDynamicContentMutation()
  
  const [form, setForm] = useState<LocationSectionContent>(defaultContent)
  
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<LocationCardData | null>(null)
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null)
  
  const [itemForm, setItemForm] = useState<LocationCardData>({
    id: "",
    title: "",
    linesText: "",
    icon: "faLocationDot",
    href: "",
  })

  useEffect(() => {
    const timer = setTimeout(() => {
      if (contentMap?.["about-location"]?.value) {
        setForm({ ...defaultContent, ...contentMap["about-location"].value })
      }
    }, 0)
    return () => clearTimeout(timer)
  }, [contentMap])

  const saveFullState = async (newState: LocationSectionContent) => {
    try {
      await upsert({
        key: "about-location",
        group: "about",
        type: "json",
        name: "About Location",
        description: "The location and contact cards on the about page",
        value: newState,
        isActive: true,
      }).unwrap()
      toast.success("Location section updated successfully")
    } catch {
      toast.error("Failed to update Location section")
    }
  }

  const handleSaveIntro = async () => {
    await saveFullState(form)
  }

  const handleAddItem = () => {
    setEditingItem(null)
    setItemForm({ id: "", title: "", linesText: "", icon: "faLocationDot", href: "" })
    setIsModalOpen(true)
  }

  const handleEditItem = (item: LocationCardData) => {
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

  const columns: Column<LocationCardData>[] = [
    {
      key: "title",
      header: "Title",
      cell: (d) => <div className="font-bold">{d.title}</div>,
    },
    {
      key: "linesText",
      header: "Details",
      cell: (d) => <div className="text-sm max-w-[200px] truncate">{d.linesText.replace(/\n/g, ", ")}</div>,
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
            <h2 className="text-lg font-medium">Location & Contact</h2>
            <p className="text-sm text-muted-foreground">
              Manage the "Where To Find Us" text and contact cards. The map uses global site settings.
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
            <h3 className="font-semibold text-md">Contact Cards</h3>
          </div>
          <Button onClick={handleAddItem}>
            <Plus className="h-4 w-4 mr-2" /> Add Card
          </Button>
        </div>
        
        <DataTable<LocationCardData>
          data={form.items}
          columns={columns}
          isLoading={false}
          empty={
            <EmptyState
              icon={LayoutGrid}
              title="No cards added yet."
              action={
                <Button size="sm" onClick={handleAddItem}>
                  <Plus className="size-4 mr-2" /> Add your first card
                </Button>
              }
            />
          }
        />
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="!max-w-md">
          <DialogHeader>
            <DialogTitle>{editingItem ? "Edit Card" : "Add Card"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleItemSubmit} className="space-y-4 mt-4">
            
            <div className="space-y-2">
              <Label>Title</Label>
              <Input
                value={itemForm.title}
                onChange={(e) => setItemForm({ ...itemForm, title: e.target.value })}
                placeholder="e.g. Call Us"
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Details (Lines)</Label>
              <Textarea
                value={itemForm.linesText}
                onChange={(e) => setItemForm({ ...itemForm, linesText: e.target.value })}
                placeholder="Enter details. Use new lines for multiple lines."
                className="min-h-[80px]"
                required
              />
            </div>

            <div className="space-y-2">
              <Label>FontAwesome Icon ID</Label>
              <Input
                value={itemForm.icon}
                onChange={(e) => setItemForm({ ...itemForm, icon: e.target.value })}
                placeholder="e.g. faPhone, faEnvelope"
                required
              />
              <p className="text-[11px] text-muted-foreground leading-tight">
                Find icons at <a href="https://fontawesome.com/search?o=r&m=free&s=solid" target="_blank" rel="noreferrer" className="text-primary hover:underline">FontAwesome</a> (e.g. <code>faPhone</code>).
                <br /><em>Note: The icon must be pre-configured in the frontend code.</em>
              </p>
            </div>

            <div className="space-y-2">
              <Label>Link (Optional)</Label>
              <Input
                value={itemForm.href}
                onChange={(e) => setItemForm({ ...itemForm, href: e.target.value })}
                placeholder="e.g. tel:+880123456789 or mailto:..."
              />
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
        description="This will remove the contact card."
        confirmLabel="Delete"
        destructive
        onConfirm={confirmDelete}
      />
    </div>
  )
}
