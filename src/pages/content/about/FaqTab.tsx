import { useState, useEffect } from "react"
import { useGetDynamicContentsMapQuery, useUpsertDynamicContentMutation } from "@/redux/features/dynamic-content/dynamicContent-api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Save, Loader2 } from "lucide-react"
import { DataTable, type Column, EmptyState, ConfirmDialog } from "@/components/shared"
import { toast } from "sonner"
import { Skeleton } from "@/components/ui/skeleton"
import { FaqFormModal, type FaqItemData } from "@/components/modal/home/FaqFormModal"
import { useCurrentUser } from "@/hooks/use-permission"
import { hasAction, isSuperAdmin } from "@/lib/permissions"


export interface FaqSectionContent {
  intro: {
    eyebrow: string
    titlePart1: string
    titleHighlight: string
    description: string
  }
  items: FaqItemData[]
}

const defaultContent: FaqSectionContent = {
  intro: {
    eyebrow: "Frequently Asked",
    titlePart1: "Answers, before you",
    titleHighlight: "ask",
    description: "The questions our clients ask most often — from project scope and certifications to after-sales and utility coordination.",
  },
  items: [
    {
      id: "1",
      question: "How long has BPIL been operating in Bangladesh?",
      answer: "BPIL has been delivering electrical infrastructure projects across Bangladesh since 2013 — over a decade of designing, supplying, installing and maintaining power systems for industries, utilities, hospitals and commercial sites.",
    },
  ]
}

export function FaqTab() {
  const user = useCurrentUser()
  const canUpdate = isSuperAdmin(user) || hasAction(user, "content.about.faq", "update")

  const { data: contentMap, isLoading } = useGetDynamicContentsMapQuery("about")
  const [upsert, { isLoading: isSaving }] = useUpsertDynamicContentMutation()
  
  const [form, setForm] = useState<FaqSectionContent>(defaultContent)
  
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingCard, setEditingCard] = useState<FaqItemData | null>(null)
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null)

  useEffect(() => {
    const timer = setTimeout(() => {
      if (contentMap?.["about-faq"]?.value) {
        setForm({ ...defaultContent, ...contentMap["about-faq"].value })
      }
    }, 0)
    return () => clearTimeout(timer)
  }, [contentMap])

  const saveFullState = async (newState: FaqSectionContent) => {
    try {
      await upsert({
        key: "about-faq",
        group: "about",
        type: "json",
        name: "About FAQ",
        description: "Frequently Asked Questions for the About page",
        value: newState,
        isActive: true,
      }).unwrap()
      toast.success("FAQ section updated successfully")
    } catch {
      toast.error("Failed to update FAQ section")
    }
  }

  const handleSaveIntro = async () => {
    await saveFullState(form)
  }

  const handleAddCard = () => {
    setEditingCard(null)
    setIsModalOpen(true)
  }

  const handleEditCard = (card: FaqItemData) => {
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

  const handleModalSubmit = async (data: FaqItemData) => {
    let newItems = [...form.items]
    if (editingCard) {
      newItems = newItems.map(i => i.id === editingCard.id ? data : i)
    } else {
      newItems = [...newItems, data]
    }
    
    const newState = { ...form, items: newItems }
    setForm(newState)
    await saveFullState(newState)
    setIsModalOpen(false)
  }

  const columns: Column<FaqItemData>[] = [
    {
      key: "question",
      header: "Question",
      cell: (d) => <div className="font-medium max-w-[300px] truncate">{d.question}</div>,
    },
    {
      key: "actions",
      header: "Actions",
      align: "right",
      fixed: "right",
      cell: (d) => (
        <div className="flex justify-end gap-2">
          <Button variant="secondary" size="sm" onClick={() => handleEditCard(d)}>Edit</Button>
          <Button variant="destructive" size="sm" onClick={() => handleDeleteCard(d.id)}>Delete</Button>
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
            <h2 className="text-lg font-medium">FAQ Section</h2>
            <p className="text-sm text-muted-foreground">
              Manage the Frequently Asked Questions for the About page.
            </p>
          </div>
          <Button onClick={handleSaveIntro} disabled={isSaving}>
            {isSaving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
            Save Typography
          </Button>
        </div>

        <div className="space-y-4 bg-muted/20 p-4 rounded-lg border">
          <h3 className="font-semibold text-sm border-b pb-2">Typography</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Small Eyebrow Label</Label>
              <Input 
                value={form.intro.eyebrow} 
                onChange={e => setForm({ ...form, intro: { ...form.intro, eyebrow: e.target.value } })} 
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
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

      <div className="border-t pt-4 -mt-2">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold text-md">FAQ List</h3>
          </div>
          {canUpdate && (
          <Button onClick={handleAddCard}>
            <Plus className="h-4 w-4 mr-2" /> Add FAQ
          </Button>
        )}
        </div>
        
        <DataTable<FaqItemData>
          data={form.items}
          columns={canUpdate ? columns : columns.filter(c => c.key !== "actions")}
          isLoading={false}
          empty={<EmptyState title="No FAQs added yet" />}
        />
      </div>

      <FaqFormModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onSubmit={handleModalSubmit}
        initialData={editingCard || undefined}
      />

      <ConfirmDialog
        open={Boolean(pendingDeleteId)}
        onOpenChange={(v) => !v && setPendingDeleteId(null)}
        title="Delete FAQ?"
        description="This will remove the question from the FAQ section."
        confirmLabel="Delete"
        destructive
        onConfirm={confirmDelete}
      />
    </div>
  )
}
