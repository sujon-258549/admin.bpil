import { useState, useEffect } from "react"
import { useGetDynamicContentsMapQuery, useUpsertDynamicContentMutation } from "@/redux/features/dynamic-content/dynamicContent-api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Save, Loader2, Plus, ListCollapse, Pencil, Trash2 } from "lucide-react"
import { toast } from "sonner"
import { Skeleton } from "@/components/ui/skeleton"
import { DataTable, type Column, EmptyState, ConfirmDialog } from "@/components/shared"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useCurrentUser } from "@/hooks/use-permission"
import { hasAction, isSuperAdmin } from "@/lib/permissions"


export interface ContactFaqData {
  id: string
  question: string
  answer: string
}

export interface ContactFaqContent {
  intro: {
    title: string
    description: string
    ctaText: string
    ctaLinkLabel: string
    ctaHref: string
  }
  items: ContactFaqData[]
}

const defaultContent: ContactFaqContent = {
  intro: {
    title: "What Are You Looking For?",
    description: "Common questions about our products, installation, support and project lifecycle — answered.",
    ctaText: "Our team can also help with full EPC scope and preventative maintenance plans.",
    ctaLinkLabel: "Contact Us Now!",
    ctaHref: "#contact-form",
  },
  items: [
    {
      id: "1",
      question: "What products and services does BPIL provide?",
      answer: "We supply and install solar PV systems, diesel and gas generators, HT and LT switchgear, PFI panels and distribution transformers — backed by turnkey installation and after-sales service.",
    },
  ]
}

export function ContactFaqTab() {
  const user = useCurrentUser()
  const canUpdate = isSuperAdmin(user) || hasAction(user, "content.contact.faq", "update")

  const { data: contentMap, isLoading } = useGetDynamicContentsMapQuery("contact")
  const [upsert, { isLoading: isSaving }] = useUpsertDynamicContentMutation()
  
  const [form, setForm] = useState<ContactFaqContent>(defaultContent)
  
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<ContactFaqData | null>(null)
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null)
  
  const [itemForm, setItemForm] = useState<ContactFaqData>({
    id: "",
    question: "",
    answer: "",
  })

  useEffect(() => {
    const timer = setTimeout(() => {
      if (contentMap?.["contact-faq"]?.value) {
        setForm({ ...defaultContent, ...contentMap["contact-faq"].value })
      }
    }, 0)
    return () => clearTimeout(timer)
  }, [contentMap])

  const saveFullState = async (newState: ContactFaqContent) => {
    try {
      await upsert({
        key: "contact-faq",
        group: "contact",
        type: "json",
        name: "Contact FAQ",
        description: "The FAQ section on the contact page",
        value: newState,
        isActive: true,
      }).unwrap()
      toast.success("Contact FAQ updated successfully")
    } catch {
      toast.error("Failed to update Contact FAQ")
    }
  }

  const handleSaveIntro = async () => {
    await saveFullState(form)
  }

  const handleAddItem = () => {
    setEditingItem(null)
    setItemForm({
      id: "",
      question: "",
      answer: "",
    })
    setIsModalOpen(true)
  }

  const handleEditItem = (item: ContactFaqData) => {
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

  const columns: Column<ContactFaqData>[] = [
    {
      key: "question",
      header: "Question",
      cell: (d) => <div className="font-medium max-w-[250px] truncate">{d.question}</div>,
    },
    {
      key: "answer",
      header: "Answer",
      cell: (d) => <div className="text-muted-foreground text-xs truncate max-w-[350px]">{d.answer}</div>,
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
            <h2 className="text-lg font-medium">FAQ Section</h2>
            <p className="text-sm text-muted-foreground">
              Manage the Frequently Asked Questions on the Contact page.
            </p>
          </div>
          <Button onClick={handleSaveIntro} disabled={isSaving}>
            {isSaving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
            Save Typography
          </Button>
        </div>

        <div className="">
          <div className="space-y-4 bg-muted/20 p-4 rounded-lg border">
            <h3 className="font-semibold text-sm border-b pb-2">Typography & CTA</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Title</Label>
                <Input 
                  value={form.intro.title} 
                  onChange={e => setForm({ ...form, intro: { ...form.intro, title: e.target.value } })} 
                  placeholder="e.g. What Are You Looking For?"
                />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea 
                  value={form.intro.description} 
                  onChange={e => setForm({ ...form, intro: { ...form.intro, description: e.target.value } })} 
                  placeholder="e.g. Common questions about our products..."
                  className="min-h-[40px]"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-2">
              <div className="space-y-2">
                <Label>CTA Text</Label>
                <Input 
                  value={form.intro.ctaText} 
                  onChange={e => setForm({ ...form, intro: { ...form.intro, ctaText: e.target.value } })} 
                  placeholder="e.g. Our team can also help with..."
                />
              </div>
              <div className="space-y-2">
                <Label>CTA Link Label</Label>
                <Input 
                  value={form.intro.ctaLinkLabel} 
                  onChange={e => setForm({ ...form, intro: { ...form.intro, ctaLinkLabel: e.target.value } })} 
                  placeholder="e.g. Contact Us Now!"
                />
              </div>
              <div className="space-y-2">
                <Label>CTA Href (URL or ID)</Label>
                <Input 
                  value={form.intro.ctaHref} 
                  onChange={e => setForm({ ...form, intro: { ...form.intro, ctaHref: e.target.value } })} 
                  placeholder="e.g. #contact-form"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t pt-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold text-md">FAQ Questions</h3>
            <p className="text-sm text-muted-foreground">Manage the questions and answers list.</p>
          </div>
          {canUpdate && (
          <Button onClick={handleAddItem}>
            <Plus className="h-4 w-4 mr-2" /> Add Question
          </Button>
        )}
        </div>
        
        <DataTable<ContactFaqData>
          data={form.items}
          columns={canUpdate ? columns : columns.filter(c => c.key !== "actions")}
          isLoading={false}
          empty={
            <EmptyState
              icon={ListCollapse}
              title="No FAQs added yet."
              action={
                canUpdate && (
          <Button size="sm" onClick={handleAddItem}>
                  <Plus className="size-4 mr-2" /> Add your first question
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
            <DialogTitle>{editingItem ? "Edit FAQ Item" : "Add FAQ Item"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleItemSubmit} className="space-y-6 mt-4">
            
            <div className="space-y-2">
              <Label>Question</Label>
              <Input
                value={itemForm.question}
                onChange={(e) => setItemForm({ ...itemForm, question: e.target.value })}
                placeholder="e.g. Do you handle installation and commissioning?"
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Answer</Label>
              <Textarea
                value={itemForm.answer}
                onChange={(e) => setItemForm({ ...itemForm, answer: e.target.value })}
                placeholder="e.g. Yes. Every product is delivered turnkey..."
                required
                className="min-h-[120px]"
              />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">
                {editingItem ? "Save Changes" : "Add Question"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={Boolean(pendingDeleteId)}
        onOpenChange={(v) => !v && setPendingDeleteId(null)}
        title="Delete FAQ?"
        description="This will remove the question from the page."
        confirmLabel="Delete"
        destructive
        onConfirm={confirmDelete}
      />
    </div>
  )
}
