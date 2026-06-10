import { useState, useEffect } from "react"
import { useGetDynamicContentsMapQuery, useUpsertDynamicContentMutation } from "@/redux/features/dynamic-content/dynamicContent-api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Save, Loader2, Plus, LayoutGrid, Pencil, Trash2 } from "lucide-react"
import { toast } from "sonner"
import { Skeleton } from "@/components/ui/skeleton"
import { DataTable, type Column, EmptyState, ConfirmDialog, MediaPicker } from "@/components/shared"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

export interface StatItemData {
  id: string
  value: string
  label: string
  icon: string
}

export interface StatsSectionContent {
  intro: {
    imageId: string
  }
  items: StatItemData[]
}

const defaultContent: StatsSectionContent = {
  intro: {
    imageId: "",
  },
  items: [
    { id: "1", value: "100+", label: "Projects Completed", icon: "faBriefcase" },
    { id: "2", value: "50+", label: "Happy Clients", icon: "faUsers" },
    { id: "3", value: "1k+", label: "Power Solutions", icon: "faBolt" },
    { id: "4", value: "12+", label: "Years of Service", icon: "faAward" },
  ]
}

export function StatsTab() {
  const { data: contentMap, isLoading } = useGetDynamicContentsMapQuery("about")
  const [upsert, { isLoading: isSaving }] = useUpsertDynamicContentMutation()
  
  const [form, setForm] = useState<StatsSectionContent>(defaultContent)
  
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<StatItemData | null>(null)
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null)
  
  const [itemForm, setItemForm] = useState<StatItemData>({
    id: "",
    value: "",
    label: "",
    icon: "faStar",
  })

  useEffect(() => {
    const timer = setTimeout(() => {
      if (contentMap?.["about-stats"]?.value) {
        setForm({ ...defaultContent, ...contentMap["about-stats"].value })
      }
    }, 0)
    return () => clearTimeout(timer)
  }, [contentMap])

  const saveFullState = async (newState: StatsSectionContent) => {
    try {
      await upsert({
        key: "about-stats",
        group: "about",
        type: "json",
        name: "About Stats",
        description: "The background image and counters section",
        value: newState,
        isActive: true,
      }).unwrap()
      toast.success("Stats section updated successfully")
    } catch {
      toast.error("Failed to update Stats section")
    }
  }

  const handleSaveIntro = async () => {
    await saveFullState(form)
  }

  const handleAddItem = () => {
    setEditingItem(null)
    setItemForm({ id: "", value: "", label: "", icon: "faStar" })
    setIsModalOpen(true)
  }

  const handleEditItem = (item: StatItemData) => {
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

  const columns: Column<StatItemData>[] = [
    {
      key: "value",
      header: "Value",
      cell: (d) => <div className="font-bold text-lg">{d.value}</div>,
    },
    {
      key: "label",
      header: "Label",
      cell: (d) => <div className="text-sm font-medium">{d.label}</div>,
    },
    {
      key: "icon",
      header: "Icon ID",
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
            <h2 className="text-lg font-medium">Statistics</h2>
            <p className="text-sm text-muted-foreground">
              Manage the background image and stat counters.
            </p>
          </div>
          <Button onClick={handleSaveIntro} disabled={isSaving}>
            {isSaving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
            Save Background
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-4 bg-muted/20 p-4 rounded-lg border">
            <h3 className="font-semibold text-sm border-b pb-2">Background Image</h3>
            <div className="space-y-2">
              <MediaPicker
                value={form.intro.imageId}
                onChange={(val) => setForm({ ...form, intro: { ...form.intro, imageId: val as string } })}
                width="w-full"
                height="h-[200px]"
                label="Select Background"
              />
              <p className="text-[11px] text-muted-foreground mt-1">
                <strong>Recommended size: 1920x600 pixels (wide ratio).</strong>
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t pt-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold text-md">Stat Counters</h3>
          </div>
          <Button onClick={handleAddItem}>
            <Plus className="h-4 w-4 mr-2" /> Add Stat
          </Button>
        </div>
        
        <DataTable<StatItemData>
          data={form.items}
          columns={columns}
          isLoading={false}
          empty={
            <EmptyState
              icon={LayoutGrid}
              title="No stats added yet."
              action={
                <Button size="sm" onClick={handleAddItem}>
                  <Plus className="size-4 mr-2" /> Add your first stat
                </Button>
              }
            />
          }
        />
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="!max-w-md">
          <DialogHeader>
            <DialogTitle>{editingItem ? "Edit Stat" : "Add Stat"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleItemSubmit} className="space-y-4 mt-4">
            
            <div className="space-y-2">
              <Label>Value (e.g. 100+)</Label>
              <Input
                value={itemForm.value}
                onChange={(e) => setItemForm({ ...itemForm, value: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Label</Label>
              <Input
                value={itemForm.label}
                onChange={(e) => setItemForm({ ...itemForm, label: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>FontAwesome Icon ID</Label>
              <Input
                value={itemForm.icon}
                onChange={(e) => setItemForm({ ...itemForm, icon: e.target.value })}
                placeholder="e.g. faBriefcase"
                required
              />
              <p className="text-[11px] text-muted-foreground leading-tight">
                Find icons at <a href="https://fontawesome.com/search?o=r&m=free&s=solid" target="_blank" rel="noreferrer" className="text-primary hover:underline">FontAwesome</a> (e.g. <code>faBriefcase</code>).
                <br /><em>Note: The icon must be pre-configured in the frontend code.</em>
              </p>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">
                {editingItem ? "Save Changes" : "Add Stat"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={Boolean(pendingDeleteId)}
        onOpenChange={(v) => !v && setPendingDeleteId(null)}
        title="Delete Stat?"
        description="This will remove the stat from the page."
        confirmLabel="Delete"
        destructive
        onConfirm={confirmDelete}
      />
    </div>
  )
}
