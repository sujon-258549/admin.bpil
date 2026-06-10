import { useState, useEffect } from "react"
import { useGetDynamicContentsMapQuery, useUpsertDynamicContentMutation } from "@/redux/features/dynamic-content/dynamicContent-api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Pencil, Trash2, Save, Loader2, ListChecks } from "lucide-react"
import { DataTable, type Column, EmptyState, ConfirmDialog, MediaPicker } from "@/components/shared"
import { toast } from "sonner"
import { Skeleton } from "@/components/ui/skeleton"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useCurrentUser } from "@/hooks/use-permission"
import { hasAction, isSuperAdmin } from "@/lib/permissions"


export interface IntroListItem {
  id: string
  text: string
}

export interface AboutIntroContent {
  intro: {
    eyebrow: string
    titlePart1: string
    titleHighlight: string
    titlePart2: string
    description1: string
    description2: string
    badgeText1: string
    badgeText2: string
    imageId: string
  }
  items: IntroListItem[]
}

const defaultContent: AboutIntroContent = {
  intro: {
    eyebrow: "Who We Are",
    titlePart1: "Powering",
    titleHighlight: "Bangladesh's",
    titlePart2: "Electrical Future",
    description1: "Since 2013, Bangladesh Power Innovation Ltd (BPIL) has been delivering reliable, high-quality electrical infrastructure across Bangladesh. We design, supply, install and commission complete power systems for industry, commerce and utility clients.",
    description2: "With over a decade of industry expertise, our commitment to quality, timely delivery and customer satisfaction has made us a trusted partner for businesses and industries nationwide.",
    badgeText1: "Since 2013",
    badgeText2: "12+ Years",
    imageId: "",
  },
  items: [
    { id: "1", text: "Distribution Transformers (100 kVA – 3000 kVA)" },
    { id: "2", text: "HT / LT Switchgear Panels" },
    { id: "3", text: "Diesel Generators & ATS" },
    { id: "4", text: "Power Factor Improvement (PFI) Panels" },
    { id: "5", text: "Solar Systems" },
    { id: "6", text: "End-to-end installation & approvals" },
  ]
}

export function IntroTab() {
  const user = useCurrentUser()
  const canUpdate = isSuperAdmin(user) || hasAction(user, "content.about.intro", "update")

  const { data: contentMap, isLoading } = useGetDynamicContentsMapQuery("about")
  const [upsert, { isLoading: isSaving }] = useUpsertDynamicContentMutation()
  
  const [form, setForm] = useState<AboutIntroContent>(defaultContent)
  
  // Modal state for items
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<IntroListItem | null>(null)
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null)
  
  // Form temp state
  const [itemText, setItemText] = useState("")

  useEffect(() => {
    const timer = setTimeout(() => {
      if (contentMap?.["about-intro"]?.value) {
        setForm({ ...defaultContent, ...contentMap["about-intro"].value })
      }
    }, 0)
    return () => clearTimeout(timer)
  }, [contentMap])

  const saveFullState = async (newState: AboutIntroContent) => {
    try {
      await upsert({
        key: "about-intro",
        group: "about",
        type: "json",
        name: "About Page Intro",
        description: "Introduction section for the about page with a list of key features",
        value: newState,
        isActive: true,
      }).unwrap()
      toast.success("Intro section updated successfully")
    } catch {
      toast.error("Failed to update intro section")
    }
  }

  const handleSaveIntro = async () => {
    await saveFullState(form)
  }

  // --- Items Handlers ---

  const handleAddItem = () => {
    setEditingItem(null)
    setItemText("")
    setIsModalOpen(true)
  }

  const handleEditItem = (item: IntroListItem) => {
    setEditingItem(item)
    setItemText(item.text)
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
      newItems = newItems.map(i => i.id === editingItem.id ? { ...i, text: itemText } : i)
    } else {
      newItems = [...newItems, { id: crypto.randomUUID(), text: itemText }]
    }
    
    const newState = { ...form, items: newItems }
    setForm(newState)
    await saveFullState(newState)
    setIsModalOpen(false)
  }

  const columns: Column<IntroListItem>[] = [
    {
      key: "text",
      header: "List Item Text",
      cell: (d) => <div className="font-medium">{d.text}</div>,
    },
    {
      key: "actions",
      header: "Actions",
      align: "right",
      fixed: "right",
      cell: (d) => (
        <div className="flex justify-end gap-1">
          <Button variant="secondary" size="icon-sm" onClick={() => handleEditItem(d)} className="border border-gray-300">
            <Pencil className="size-4" />
          </Button>
          <Button variant="destructive" size="icon-sm" onClick={() => handleDeleteItem(d.id)} className="border border-gray-300">
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
      
      {/* Intro Form */}
      <div className="mb-10 w-full">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-medium">Intro Section</h2>
            <p className="text-sm text-muted-foreground">
              Manage the "Who We Are" text, image, floating badges, and bullet points.
            </p>
          </div>
          <Button onClick={handleSaveIntro} disabled={isSaving}>
            {isSaving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
            Save Typography
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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
              <Label>Top Description Paragraph</Label>
              <Textarea 
                value={form.intro.description1} 
                onChange={e => setForm({ ...form, intro: { ...form.intro, description1: e.target.value } })} 
                className="min-h-[80px]"
              />
            </div>

            <div className="space-y-2">
              <Label>Bottom Description Paragraph</Label>
              <Textarea 
                value={form.intro.description2} 
                onChange={e => setForm({ ...form, intro: { ...form.intro, description2: e.target.value } })} 
                className="min-h-[60px]"
              />
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-4 bg-muted/20 p-4 rounded-lg border">
              <h3 className="font-semibold text-sm border-b pb-2">Featured Image</h3>
              <MediaPicker
                value={form.intro.imageId}
                onChange={(val) => setForm({ ...form, intro: { ...form.intro, imageId: val as string } })}
                width="w-full"
                height="h-[200px]"
                label="Select Intro Image"
              />
              <p className="text-[11px] text-muted-foreground mt-1">
                <strong>Recommended size: 1000x800 pixels (4:3 horizontal ratio).</strong>
              </p>
            </div>

            <div className="space-y-4 bg-muted/20 p-4 rounded-lg border">
              <h3 className="font-semibold text-sm border-b pb-2">Floating Badges</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Badge 1 Text (Check Icon)</Label>
                  <Input 
                    value={form.intro.badgeText1} 
                    onChange={e => setForm({ ...form, intro: { ...form.intro, badgeText1: e.target.value } })} 
                    placeholder="e.g. Since 2013"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Badge 2 Text (Ping Icon)</Label>
                  <Input 
                    value={form.intro.badgeText2} 
                    onChange={e => setForm({ ...form, intro: { ...form.intro, badgeText2: e.target.value } })} 
                    placeholder="e.g. 12+ Years"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* List Table */}
      <div className="border-t pt-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold text-md">Bullet Points</h3>
            <p className="text-sm text-muted-foreground">Manage the list of items shown between the paragraphs.</p>
          </div>
          {canUpdate && (
          <Button onClick={handleAddItem}>
            <Plus className="h-4 w-4 mr-2" /> Add Item
          </Button>
        )}
        </div>
        
        <DataTable<IntroListItem>
          data={form.items}
          columns={canUpdate ? columns : columns.filter(c => c.key !== "actions")}
          isLoading={false}
          empty={
            <EmptyState
              icon={ListChecks}
              title="No items added yet."
              action={
                canUpdate && (
          <Button size="sm" onClick={handleAddItem}>
                  <Plus className="size-4 mr-2" /> Add your first item
                </Button>
        )
              }
            />
          }
        />
      </div>

      {/* Item Modal (kept inline as it's very simple) */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="!max-w-md">
          <DialogHeader>
            <DialogTitle>{editingItem ? "Edit List Item" : "Add List Item"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleItemSubmit} className="space-y-6 mt-4">
            <div className="space-y-2">
              <Label htmlFor="text">Item Text</Label>
              <Input
                id="text"
                value={itemText}
                onChange={(e) => setItemText(e.target.value)}
                required
                autoFocus
              />
            </div>
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">
                {editingItem ? "Save Changes" : "Add Item"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={Boolean(pendingDeleteId)}
        onOpenChange={(v) => !v && setPendingDeleteId(null)}
        title="Delete Item?"
        description="This will remove the item from the list. This action cannot be undone."
        confirmLabel="Delete"
        destructive
        onConfirm={confirmDelete}
      />
    </div>
  )
}
