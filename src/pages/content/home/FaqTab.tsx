import { useState, useEffect } from "react"
import { useGetDynamicContentsMapQuery, useUpsertDynamicContentMutation } from "@/redux/features/dynamic-content/dynamicContent-api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Pencil, Trash2, Save, Loader2, HelpCircle } from "lucide-react"
import { DataTable, type Column, EmptyState, Text, ConfirmDialog } from "@/components/shared"
import { toast } from "sonner"
import { Skeleton } from "@/components/ui/skeleton"
import { FaqFormModal, type FaqItemData } from "@/components/modal/home/FaqFormModal"

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
    eyebrow: "FAQ",
    titlePart1: "Got Questions?",
    titleHighlight: "We Have Answers.",
    description: "Everything you wanted to know about BPIL — our products, installation process, brands, support and how to get a quote.",
  },
  items: []
}

export function FaqTab() {
  const { data: contentMap, isLoading } = useGetDynamicContentsMapQuery("home")
  const [upsert, { isLoading: isSaving }] = useUpsertDynamicContentMutation()
  
  const [form, setForm] = useState<FaqSectionContent>(defaultContent)
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingCard, setEditingCard] = useState<FaqItemData | null>(null)
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null)

  useEffect(() => {
    const timer = setTimeout(() => {
      if (contentMap?.["home-faq"]?.value) {
        setForm({ ...defaultContent, ...contentMap["home-faq"].value })
      }
    }, 0)
    return () => clearTimeout(timer)
  }, [contentMap])

  const handleSaveIntro = async () => {
    try {
      await upsert({
        key: "home-faq",
        group: "home",
        type: "json",
        name: "Home FAQ Section",
        description: "Content and list of Frequently Asked Questions on the home page",
        value: form,
        isActive: true,
      }).unwrap()
      toast.success("FAQ intro updated successfully")
    } catch {
      toast.error("Failed to update intro text")
    }
  }

  const saveFullState = async (newState: FaqSectionContent) => {
    try {
      await upsert({
        key: "home-faq",
        group: "home",
        type: "json",
        name: "Home FAQ Section",
        description: "Content and list of Frequently Asked Questions on the home page",
        value: newState,
        isActive: true,
      }).unwrap()
      toast.success("FAQ updated successfully")
    } catch {
      toast.error("Failed to update FAQ")
    }
  }

  // --- Cards Handlers ---

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

  const handleFormSubmit = async (cardData: FaqItemData) => {
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

  const columns: Column<FaqItemData>[] = [
    {
      key: "details",
      header: "Question & Answer",
      cell: (d) => (
        <div className="min-w-0 max-w-[500px]">
          <div className="truncate font-medium">{d.question || "Untitled"}</div>
          <Text size="xs" tone="muted" className="truncate mt-0.5">
            {d.answer}
          </Text>
        </div>
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
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-medium">FAQ Section</h2>
            <p className="text-sm text-muted-foreground">
              Manage the intro text and the list of frequently asked questions.
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
              placeholder="e.g. FAQ"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Title (Part 1)</Label>
              <Input 
                value={form.intro.titlePart1} 
                onChange={e => setForm({ ...form, intro: { ...form.intro, titlePart1: e.target.value } })} 
                placeholder="e.g. Got Questions?"
              />
            </div>
            <div className="space-y-2">
              <Label>Title (Highlight)</Label>
              <Input 
                value={form.intro.titleHighlight} 
                onChange={e => setForm({ ...form, intro: { ...form.intro, titleHighlight: e.target.value } })} 
                placeholder="e.g. We Have Answers."
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
      <div className="border-t pt-4 -mt-2">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold text-md">FAQ List</h3>
          </div>
          <Button onClick={handleAddCard}>
            <Plus className="h-4 w-4 mr-2" /> Add FAQ
          </Button>
        </div>
        
        <DataTable<FaqItemData>
          data={form.items}
          columns={columns}
          isLoading={false}
          empty={
            <EmptyState
              icon={HelpCircle}
              title="No FAQs added yet."
              action={
                <Button size="sm" onClick={handleAddCard}>
                  <Plus className="size-4 mr-2" /> Add your first FAQ
                </Button>
              }
            />
          }
        />
      </div>

      <FaqFormModal 
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        initialData={editingCard}
        onSubmit={handleFormSubmit}
      />

      <ConfirmDialog
        open={Boolean(pendingDeleteId)}
        onOpenChange={(v) => !v && setPendingDeleteId(null)}
        title="Delete FAQ?"
        description="This will permanently remove this question from the FAQ list. This action cannot be undone."
        confirmLabel="Delete"
        destructive
        onConfirm={confirmDelete}
      />
    </div>
  )
}
