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
import { useCurrentUser } from "@/hooks/use-permission"
import { hasAction, isSuperAdmin } from "@/lib/permissions"


export interface GalleryCategoryData {
  id: string
  name: string
  count: string
  description: string
  imageId: string
  imageAlt: string
  icon: string
  href: string
}

export interface GalleryCategoriesContent {
  intro: {
    eyebrow: string
    titlePart1: string
    titleHighlight: string
    titlePart2: string
    description: string
  }
  items: GalleryCategoryData[]
}

const defaultContent: GalleryCategoriesContent = {
  intro: {
    eyebrow: "What You're Seeing",
    titlePart1: "Categories in this",
    titleHighlight: "portfolio",
    titlePart2: "",
    description: "Every photo and reel above belongs to one of these disciplines — the cumulative footprint of BPIL projects across Bangladesh.",
  },
  items: [
    {
      id: "1",
      name: "Transformers",
      count: "120+",
      description: "Distribution and step-up units commissioned across utility and industrial sites.",
      imageId: "",
      imageAlt: "Distribution transformer at a substation",
      icon: "faBolt",
      href: "/products/transformer",
    },
  ]
}

export function GalleryCategoriesTab() {
  const user = useCurrentUser()
  const canUpdate = isSuperAdmin(user) || hasAction(user, "content.image.categories", "update")

  const { data: contentMap, isLoading } = useGetDynamicContentsMapQuery("gallery")
  const [upsert, { isLoading: isSaving }] = useUpsertDynamicContentMutation()
  
  const [form, setForm] = useState<GalleryCategoriesContent>(defaultContent)
  
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<GalleryCategoryData | null>(null)
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null)
  
  const [itemForm, setItemForm] = useState<GalleryCategoryData>({
    id: "",
    name: "",
    count: "",
    description: "",
    imageId: "",
    imageAlt: "",
    icon: "faBolt",
    href: "",
  })

  useEffect(() => {
    const timer = setTimeout(() => {
      if (contentMap?.["gallery-categories"]?.value) {
        setForm({ ...defaultContent, ...contentMap["gallery-categories"].value })
      }
    }, 0)
    return () => clearTimeout(timer)
  }, [contentMap])

  const saveFullState = async (newState: GalleryCategoriesContent) => {
    try {
      await upsert({
        key: "gallery-categories",
        group: "gallery",
        type: "json",
        name: "Gallery Categories",
        description: "The categories grid on the gallery page",
        value: newState,
        isActive: true,
      }).unwrap()
      toast.success("Gallery categories updated successfully")
    } catch {
      toast.error("Failed to update Gallery categories")
    }
  }

  const handleSaveIntro = async () => {
    await saveFullState(form)
  }

  const handleAddItem = () => {
    setEditingItem(null)
    setItemForm({
      id: "",
      name: "",
      count: "",
      description: "",
      imageId: "",
      imageAlt: "",
      icon: "faBolt",
      href: "",
    })
    setIsModalOpen(true)
  }

  const handleEditItem = (item: GalleryCategoryData) => {
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

  const columns: Column<GalleryCategoryData>[] = [
    {
      key: "name",
      header: "Category Name",
      cell: (d) => <div className="font-medium max-w-[150px] truncate">{d.name}</div>,
    },
    {
      key: "count",
      header: "Count",
      cell: (d) => <div className="text-xs">{d.count}</div>,
    },
    {
      key: "description",
      header: "Description",
      cell: (d) => <div className="text-muted-foreground text-xs truncate max-w-[200px]">{d.description}</div>,
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
            <h2 className="text-lg font-medium">Gallery Categories</h2>
            <p className="text-sm text-muted-foreground">
              Manage the "Categories in this portfolio" section and category cards.
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
            <h3 className="font-semibold text-md">Category Cards</h3>
            <p className="text-sm text-muted-foreground">Manage the cards that link to specific services/products.</p>
          </div>
          {canUpdate && (
          <Button onClick={handleAddItem}>
            <Plus className="h-4 w-4 mr-2" /> Add Category
          </Button>
        )}
        </div>
        
        <DataTable<GalleryCategoryData>
          data={form.items}
          columns={canUpdate ? columns : columns.filter(c => c.key !== "actions")}
          isLoading={false}
          empty={
            <EmptyState
              icon={LayoutGrid}
              title="No categories added yet."
              action={
                canUpdate && (
          <Button size="sm" onClick={handleAddItem}>
                  <Plus className="size-4 mr-2" /> Add your first category
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
            <DialogTitle>{editingItem ? "Edit Category Card" : "Add Category Card"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleItemSubmit} className="space-y-6 mt-4">
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Category Name</Label>
                <Input
                  value={itemForm.name}
                  onChange={(e) => setItemForm({ ...itemForm, name: e.target.value })}
                  placeholder="e.g. Transformers"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Count (e.g. 120+)</Label>
                <Input
                  value={itemForm.count}
                  onChange={(e) => setItemForm({ ...itemForm, count: e.target.value })}
                  placeholder="e.g. 120+"
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

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Link URL (href)</Label>
                <Input
                  value={itemForm.href}
                  onChange={(e) => setItemForm({ ...itemForm, href: e.target.value })}
                  placeholder="e.g. /products/transformer"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>FontAwesome Icon ID</Label>
                <Input
                  value={itemForm.icon}
                  onChange={(e) => setItemForm({ ...itemForm, icon: e.target.value })}
                  placeholder="e.g. faBolt"
                  required
                />
                <p className="text-[11px] text-muted-foreground leading-tight mt-1">
                  Use camelCase (e.g. <code className="bg-muted px-1 rounded">faBolt</code>). Find free solid icons at{" "}
                  <a href="https://fontawesome.com/search?s=solid&f=classic&o=r" target="_blank" rel="noreferrer" className="text-primary hover:underline font-medium">
                    FontAwesome
                  </a>.
                  <br />
                  <span className="text-amber-500/80 mt-1 inline-block"><em>*Note: The icon must be pre-configured in the frontend code to render properly.</em></span>
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-5">
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
              <div className="space-y-2">
                <Label>Image Alt Text</Label>
                <Input
                  value={itemForm.imageAlt}
                  onChange={(e) => setItemForm({ ...itemForm, imageAlt: e.target.value })}
                  placeholder="e.g. Distribution transformer"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">
                {editingItem ? "Save Changes" : "Add Category"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={Boolean(pendingDeleteId)}
        onOpenChange={(v) => !v && setPendingDeleteId(null)}
        title="Delete Category?"
        description="This will remove the category card from the page."
        confirmLabel="Delete"
        destructive
        onConfirm={confirmDelete}
      />
    </div>
  )
}
