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
import { CustomSelect } from "@/components/ui/custom-select"
import { useCurrentUser } from "@/hooks/use-permission"
import { hasAction, isSuperAdmin } from "@/lib/permissions"


export interface ValueCardData {
  id: string
  title: string
  description: string
  icon: string
  accent: "primary" | "secondary"
}

export interface ValuesSectionContent {
  intro: {
    eyebrow: string
    titlePart1: string
    titleHighlight: string
    description: string
  }
  items: ValueCardData[]
}

const defaultContent: ValuesSectionContent = {
  intro: {
    eyebrow: "Our Values",
    titlePart1: "Our Unique",
    titleHighlight: "Strengths (USP)",
    description: "Six commitments that shape how BPIL delivers every project, big or small.",
  },
  items: [
    {
      id: "1",
      title: "Over 12 Years Of Industry Experience",
      description: "Delivering superior quality solutions that exceed industry standards and customer expectations.",
      icon: "faAward",
      accent: "primary",
    },
  ]
}

export function ValuesTab() {
  const user = useCurrentUser()
  const canUpdate = isSuperAdmin(user) || hasAction(user, "content.about.values", "update")

  const { data: contentMap, isLoading } = useGetDynamicContentsMapQuery("about")
  const [upsert, { isLoading: isSaving }] = useUpsertDynamicContentMutation()
  
  const [form, setForm] = useState<ValuesSectionContent>(defaultContent)
  
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<ValueCardData | null>(null)
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null)
  
  const [itemForm, setItemForm] = useState<ValueCardData>({
    id: "",
    title: "",
    description: "",
    icon: "faAward",
    accent: "primary",
  })

  useEffect(() => {
    const timer = setTimeout(() => {
      if (contentMap?.["about-values"]?.value) {
        setForm({ ...defaultContent, ...contentMap["about-values"].value })
      }
    }, 0)
    return () => clearTimeout(timer)
  }, [contentMap])

  const saveFullState = async (newState: ValuesSectionContent) => {
    try {
      await upsert({
        key: "about-values",
        group: "about",
        type: "json",
        name: "About Values",
        description: "Core values and strengths section for the about page",
        value: newState,
        isActive: true,
      }).unwrap()
      toast.success("Values section updated successfully")
    } catch {
      toast.error("Failed to update Values section")
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
      description: "",
      icon: "faAward",
      accent: "primary",
    })
    setIsModalOpen(true)
  }

  const handleEditItem = (item: ValueCardData) => {
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

  const columns: Column<ValueCardData>[] = [
    {
      key: "title",
      header: "Title",
      cell: (d) => <div className="font-medium max-w-[200px] truncate">{d.title}</div>,
    },
    {
      key: "description",
      header: "Description",
      cell: (d) => <div className="text-muted-foreground text-xs truncate max-w-[300px]">{d.description}</div>,
    },
    {
      key: "accent",
      header: "Accent Color",
      cell: (d) => <div className="text-xs uppercase px-2 py-1 bg-muted rounded-full w-fit">{d.accent}</div>,
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
            <h2 className="text-lg font-medium">Core Values</h2>
            <p className="text-sm text-muted-foreground">
              Manage the "Our Unique Strengths" section text and value cards.
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
          </div>
        </div>
      </div>

      <div className="border-t pt-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold text-md">Value Cards</h3>
          </div>
          {canUpdate && (
          <Button onClick={handleAddItem}>
            <Plus className="h-4 w-4 mr-2" /> Add Value Card
          </Button>
        )}
        </div>
        
        <DataTable<ValueCardData>
          data={form.items}
          columns={canUpdate ? columns : columns.filter(c => c.key !== "actions")}
          isLoading={false}
          empty={
            <EmptyState
              icon={LayoutGrid}
              title="No values added yet."
              action={
                canUpdate && (
          <Button size="sm" onClick={handleAddItem}>
                  <Plus className="size-4 mr-2" /> Add your first value
                </Button>
        )
              }
            />
          }
        />
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="!max-w-xl">
          <DialogHeader>
            <DialogTitle>{editingItem ? "Edit Value Card" : "Add Value Card"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleItemSubmit} className="space-y-6 mt-4">
            
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

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>FontAwesome Icon ID</Label>
                <Input
                  value={itemForm.icon}
                  onChange={(e) => setItemForm({ ...itemForm, icon: e.target.value })}
                  placeholder="e.g. faAward, faShieldHalved"
                  required
                />
                <p className="text-[11px] text-muted-foreground leading-tight">
                  Find icons at <a href="https://fontawesome.com/search?o=r&m=free&s=solid" target="_blank" rel="noreferrer" className="text-primary hover:underline">FontAwesome</a> (e.g. <code>faAward</code>).
                  <br /><em>Note: The icon must be pre-configured in the frontend code.</em>
                </p>
              </div>

              <div className="space-y-2">
                <Label>Accent Color</Label>
                <CustomSelect 
                  value={itemForm.accent} 
                  onChange={(v) => setItemForm({ ...itemForm, accent: v as "primary" | "secondary" })}
                  placeholder="Select accent color"
                >
                  <option value="primary">Primary (Blue)</option>
                  <option value="secondary">Secondary (Orange)</option>
                </CustomSelect>
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
        title="Delete Value?"
        description="This will remove the value card from the page."
        confirmLabel="Delete"
        destructive
        onConfirm={confirmDelete}
      />
    </div>
  )
}
