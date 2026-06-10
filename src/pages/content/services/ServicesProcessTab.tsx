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

export interface ProcessStepData {
  id: string
  title: string
  description: string
  icon: string
  accent: "primary" | "secondary"
}

export interface ServicesProcessContent {
  intro: {
    eyebrow: string
    title: string
    description: string
  }
  items: ProcessStepData[]
}

const defaultContent: ServicesProcessContent = {
  intro: {
    eyebrow: "Our Process",
    title: "How We Work",
    description: "From initial survey to full-time AMC, we make managing your electrical assets hassle-free.",
  },
  items: [
    {
      id: "1",
      title: "Site Survey",
      description: "Our engineers visit your site, audit existing assets and document load profile.",
      icon: "faMagnifyingGlass",
      accent: "primary"
    }
  ]
}

export function ServicesProcessTab() {
  const { data: contentMap, isLoading } = useGetDynamicContentsMapQuery("services")
  const [upsert, { isLoading: isSaving }] = useUpsertDynamicContentMutation()
  
  const [form, setForm] = useState<ServicesProcessContent>(defaultContent)
  
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<ProcessStepData | null>(null)
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null)
  
  const [itemForm, setItemForm] = useState<ProcessStepData>({
    id: "", title: "", description: "", icon: "faMagnifyingGlass", accent: "primary"
  })

  useEffect(() => {
    const timer = setTimeout(() => {
      if (contentMap?.["services-process"]?.value) {
        setForm({ ...defaultContent, ...contentMap["services-process"].value })
      }
    }, 0)
    return () => clearTimeout(timer)
  }, [contentMap])

  const saveFullState = async (newState: ServicesProcessContent) => {
    try {
      await upsert({
        key: "services-process",
        group: "services",
        type: "json",
        name: "Services Process",
        description: "The 'How We Work' process steps",
        value: newState,
        isActive: true,
      }).unwrap()
      toast.success("Process section updated")
    } catch {
      toast.error("Failed to update Process section")
    }
  }

  const handleSaveIntro = async () => {
    await saveFullState(form)
  }

  const handleAddItem = () => {
    setEditingItem(null)
    setItemForm({ id: "", title: "", description: "", icon: "faMagnifyingGlass", accent: "primary" })
    setIsModalOpen(true)
  }

  const handleEditItem = (item: ProcessStepData) => {
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

  const columns: Column<ProcessStepData>[] = [
    {
      key: "title",
      header: "Title",
      cell: (d) => <div className="font-medium max-w-[500px] truncate">{d.title}</div>,
    },
    {
      key: "accent",
      header: "Accent",
      cell: (d) => <div className="text-xs uppercase px-2 py-1 bg-muted rounded-full w-fit">{d.accent}</div>,
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
            <h2 className="text-lg font-medium">How We Work</h2>
            <p className="text-sm text-muted-foreground">
              Manage the 4-step process and typography.
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
                <Label>Small Eyebrow Label</Label>
                <Input 
                  value={form.intro.eyebrow} 
                  onChange={e => setForm({ ...form, intro: { ...form.intro, eyebrow: e.target.value } })} 
                />
              </div>
              <div className="space-y-2">
                <Label>Main Title</Label>
                <Input 
                  value={form.intro.title} 
                  onChange={e => setForm({ ...form, intro: { ...form.intro, title: e.target.value } })} 
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
            <h3 className="font-semibold text-md">Process Steps</h3>
          </div>
          <Button onClick={handleAddItem}>
            <Plus className="h-4 w-4 mr-2" /> Add Step
          </Button>
        </div>
        
        <DataTable<ProcessStepData>
          data={form.items}
          columns={columns}
          isLoading={false}
          empty={
            <EmptyState
              icon={LayoutGrid}
              title="No steps added yet."
              action={
                <Button size="sm" onClick={handleAddItem}>
                  <Plus className="size-4 mr-2" /> Add your first step
                </Button>
              }
            />
          }
        />
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="!max-w-4xl w-full">
          <DialogHeader>
            <DialogTitle>{editingItem ? "Edit Step" : "Add Step"}</DialogTitle>
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
                  placeholder="e.g. faMagnifyingGlass"
                  required
                />
                <p className="text-[11px] text-muted-foreground leading-tight">
                  Find icons at <a href="https://fontawesome.com/search?o=r&m=free&s=solid" target="_blank" rel="noreferrer" className="text-primary hover:underline">FontAwesome</a> (e.g. <code>faMagnifyingGlass</code>).
                  <br /><em>Note: The icon must be pre-configured in the frontend code.</em>
                </p>
              </div>

              <div className="space-y-2">
                <Label>Accent Color</Label>
                <CustomSelect
                  value={itemForm.accent}
                  onChange={(v) => setItemForm({ ...itemForm, accent: v as "primary" | "secondary" })}
                  placeholder="Select Accent Color"
                >
                  <option value="primary">Primary (Brand Color)</option>
                  <option value="secondary">Secondary (Accent Color)</option>
                </CustomSelect>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">
                {editingItem ? "Save Changes" : "Add Step"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={Boolean(pendingDeleteId)}
        onOpenChange={(v) => !v && setPendingDeleteId(null)}
        title="Delete Step?"
        description="This will remove the process step from the page."
        confirmLabel="Delete"
        destructive
        onConfirm={confirmDelete}
      />
    </div>
  )
}
