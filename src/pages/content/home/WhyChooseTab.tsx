import { useState, useEffect } from "react"
import { useGetDynamicContentsMapQuery, useUpsertDynamicContentMutation } from "@/redux/features/dynamic-content/dynamicContent-api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Pencil, Trash2, Save, Loader2, ListChecks } from "lucide-react"
import { DataTable, type Column, EmptyState, Text, ConfirmDialog } from "@/components/shared"
import { toast } from "sonner"
import { Skeleton } from "@/components/ui/skeleton"
import { WhyChooseFormModal, type WhyChooseCardData } from "@/components/modal/home/WhyChooseFormModal"
import { useCurrentUser } from "@/hooks/use-permission"
import { hasAction, isSuperAdmin } from "@/lib/permissions"


export interface WhyChooseSectionContent {
  intro: {
    eyebrow: string
    titlePart1: string
    titleHighlight: string
    titlePart2: string
    description: string
  }
  items: WhyChooseCardData[]
}

const defaultContent: WhyChooseSectionContent = {
  intro: {
    eyebrow: "Why Choose Us",
    titlePart1: "Why Choose",
    titleHighlight: "Bangladesh Power Innovation",
    titlePart2: "?",
    description: "Six commitments that show up on every project — each backed by a decade of field engineering, real customer wins and a quality system that doesn't bend."
  },
  items: []
}

export function WhyChooseTab() {
  const user = useCurrentUser()
  const canUpdate = isSuperAdmin(user) || hasAction(user, "content.home.why-choose", "update")

  const { data: contentMap, isLoading } = useGetDynamicContentsMapQuery("home")
  const [upsert, { isLoading: isSaving }] = useUpsertDynamicContentMutation()
  
  const [form, setForm] = useState<WhyChooseSectionContent>(defaultContent)
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingCard, setEditingCard] = useState<WhyChooseCardData | null>(null)
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null)

  useEffect(() => {
    const timer = setTimeout(() => {
      if (contentMap?.["home-why-choose"]?.value) {
        setForm({ ...defaultContent, ...contentMap["home-why-choose"].value })
      }
    }, 0)
    return () => clearTimeout(timer)
  }, [contentMap])

  const handleSaveIntro = async () => {
    try {
      await upsert({
        key: "home-why-choose",
        group: "home",
        type: "json",
        name: "Home Why Choose Us Section",
        description: "Content and cards for the Why Choose Us section on the home page",
        value: form,
        isActive: true,
      }).unwrap()
      toast.success("Why Choose Us intro updated successfully")
    } catch {
      toast.error("Failed to update intro text")
    }
  }

  const saveFullState = async (newState: WhyChooseSectionContent) => {
    try {
      await upsert({
        key: "home-why-choose",
        group: "home",
        type: "json",
        name: "Home Why Choose Us Section",
        description: "Content and cards for the Why Choose Us section on the home page",
        value: newState,
        isActive: true,
      }).unwrap()
      toast.success("Section updated successfully")
    } catch {
      toast.error("Failed to update section")
    }
  }

  // --- Cards Handlers ---

  const handleAddCard = () => {
    if (form.items.length >= 6) {
      toast.warning("Maximum Limit Reached", {
        description: "You can only add up to 6 reason cards. Adding more will break the design layout on the frontend website."
      })
      return
    }
    setEditingCard(null)
    setIsModalOpen(true)
  }

  const handleEditCard = (card: WhyChooseCardData) => {
    setEditingCard(card)
    setIsModalOpen(true)
  }

  const handleDeleteCard = (id: string) => {
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

  const handleFormSubmit = async (cardData: WhyChooseCardData) => {
    let newItems = [...form.items]
    if (editingCard) {
      newItems = newItems.map(i => i.id === cardData.id ? cardData : i)
    } else {
      newItems = [...newItems, cardData]
    }
    
    const newState = { ...form, items: newItems }
    setForm(newState)
    await saveFullState(newState)
  }

  const columns: Column<WhyChooseCardData>[] = [
    {
      key: "title",
      header: "Reason / Title",
      cell: (d) => (
        <div className="min-w-0 max-w-[300px]">
          <div className="truncate font-medium">{d.title || "Untitled"}</div>
          <Text size="xs" tone="muted" className="truncate mt-0.5">
            {d.description}
          </Text>
        </div>
      ),
    },
    {
      key: "icon",
      header: "Icon Name",
      cell: (d) => (
        <Text size="xs" tone="muted" className="truncate font-mono">
          {d.icon || "—"}
        </Text>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      align: "right",
      fixed: "right",
      cell: (d) => (
        <div className="flex justify-end gap-1">
          <Button variant="secondary" size="icon-sm" onClick={() => handleEditCard(d)} className="border border-gray-300">
            <Pencil className="size-4" />
          </Button>
          <Button variant="destructive" size="icon-sm" onClick={() => handleDeleteCard(d.id)} className="border border-gray-300">
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
      <div className="mb-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-medium">Why Choose Us Section</h2>
            <p className="text-sm text-muted-foreground">
              Manage the intro text and the list of reason cards.
            </p>
          </div>
          <Button onClick={handleSaveIntro} disabled={isSaving}>
            {isSaving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
            Save Intro Text
          </Button>
        </div>

        <div className="space-y-4 bg-muted/20 p-4 rounded-lg border">
          <h3 className="font-semibold text-sm border-b pb-2">Typography & Content</h3>
          
          <div className="space-y-2">
            <Label>Small Eyebrow Label</Label>
            <Input 
              value={form.intro.eyebrow} 
              onChange={e => setForm({ ...form, intro: { ...form.intro, eyebrow: e.target.value } })} 
              placeholder="e.g. Why Choose Us"
            />
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Title (Part 1)</Label>
              <Input 
                value={form.intro.titlePart1} 
                onChange={e => setForm({ ...form, intro: { ...form.intro, titlePart1: e.target.value } })} 
                placeholder="e.g. Why Choose"
              />
            </div>
            <div className="space-y-2">
              <Label>Title (Highlight)</Label>
              <Input 
                value={form.intro.titleHighlight} 
                onChange={e => setForm({ ...form, intro: { ...form.intro, titleHighlight: e.target.value } })} 
                placeholder="e.g. Bangladesh Power Innovation"
              />
            </div>
            <div className="space-y-2">
              <Label>Title (Part 2)</Label>
              <Input 
                value={form.intro.titlePart2} 
                onChange={e => setForm({ ...form, intro: { ...form.intro, titlePart2: e.target.value } })} 
                placeholder="e.g. ?"
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

      {/* Cards Table */}
      <div className="border-t pt-8 mt-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-md">Reason Cards</h3>
          {canUpdate && (
          <Button onClick={handleAddCard}>
            <Plus className="h-4 w-4 mr-2" /> Add Reason
          </Button>
        )}
        </div>
        
        <DataTable<WhyChooseCardData>
          data={form.items}
          columns={canUpdate ? columns : columns.filter(c => c.key !== "actions")}
          isLoading={false}
          empty={
            <EmptyState
              icon={ListChecks}
              title="No reasons added yet."
              action={
                canUpdate && (
          <Button size="sm" onClick={handleAddCard}>
                  <Plus className="size-4 mr-2" /> Add your first reason
                </Button>
        )
              }
            />
          }
        />
      </div>

      <WhyChooseFormModal 
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        initialData={editingCard}
        onSubmit={handleFormSubmit}
      />

      <ConfirmDialog
        open={Boolean(pendingDeleteId)}
        onOpenChange={(v) => !v && setPendingDeleteId(null)}
        title="Delete Reason Card?"
        description="This will permanently remove this reason from the list. This action cannot be undone."
        confirmLabel="Delete"
        destructive
        onConfirm={confirmDelete}
      />
    </div>
  )
}
