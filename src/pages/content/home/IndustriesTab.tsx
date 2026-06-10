import { useState, useEffect } from "react"
import { useGetDynamicContentsMapQuery, useUpsertDynamicContentMutation } from "@/redux/features/dynamic-content/dynamicContent-api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Pencil, Trash2, Save, Loader2, Image as ImageIcon } from "lucide-react"
import { Image, DataTable, type Column, EmptyState, Text, ConfirmDialog } from "@/components/shared"
import { toast } from "sonner"
import { Skeleton } from "@/components/ui/skeleton"
import { IndustryFormModal, type IndustryCardData } from "@/components/modal/home/IndustryFormModal"

interface StatItem {
  value: string
  label: string
}

export interface IndustriesSectionContent {
  intro: {
    label: string
    headingLine1: string
    headingHighlight: string
    headingLine2: string
    description: string
    buttonText: string
    buttonLink: string
    stats: StatItem[]
  }
  items: IndustryCardData[]
}

const defaultContent: IndustriesSectionContent = {
  intro: {
    label: "Industries We Power",
    headingLine1: "Trusted by",
    headingHighlight: "every sector",
    headingLine2: "that can't afford downtime.",
    description: "From textile floors to telecom towers...",
    buttonText: "Explore Services",
    buttonLink: "/services",
    stats: [
      { value: "500+", label: "Sites" },
      { value: "12", label: "Sectors" },
      { value: "24/7", label: "Support" }
    ]
  },
  items: []
}

export function IndustriesTab() {
  const { data: contentMap, isLoading } = useGetDynamicContentsMapQuery("home")
  const [upsert, { isLoading: isSaving }] = useUpsertDynamicContentMutation()
  
  const [form, setForm] = useState<IndustriesSectionContent>(defaultContent)
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingCard, setEditingCard] = useState<IndustryCardData | null>(null)
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null)

  useEffect(() => {
    const timer = setTimeout(() => {
      if (contentMap?.["home-industries"]?.value) {
        setForm({ ...defaultContent, ...contentMap["home-industries"].value })
      }
    }, 0)
    return () => clearTimeout(timer)
  }, [contentMap])

  const handleSaveIntro = async () => {
    try {
      await upsert({
        key: "home-industries",
        group: "home",
        type: "json",
        name: "Home Industries Section",
        description: "Content and cards for the Industries section on the home page",
        value: form,
        isActive: true,
      }).unwrap()
      toast.success("Industries intro updated successfully")
    } catch {
      toast.error("Failed to update industries intro")
    }
  }

  const saveFullState = async (newState: IndustriesSectionContent) => {
    try {
      await upsert({
        key: "home-industries",
        group: "home",
        type: "json",
        name: "Home Industries Section",
        description: "Content and cards for the Industries section on the home page",
        value: newState,
        isActive: true,
      }).unwrap()
      toast.success("Industries updated successfully")
    } catch {
      toast.error("Failed to update industries")
    }
  }

  const addStat = () => {
    setForm(prev => ({ 
      ...prev, 
      intro: { ...prev.intro, stats: [...prev.intro.stats, { value: "", label: "" }] } 
    }))
  }

  const updateStat = (index: number, field: keyof StatItem, value: string) => {
    const newStats = [...form.intro.stats]
    newStats[index] = { ...newStats[index], [field]: value }
    setForm(prev => ({ ...prev, intro: { ...prev.intro, stats: newStats } }))
  }

  const removeStat = (index: number) => {
    setForm(prev => ({
      ...prev,
      intro: { ...prev.intro, stats: prev.intro.stats.filter((_, i) => i !== index) }
    }))
  }

  // --- Industry Cards Handlers ---

  const handleAddCard = () => {
    setEditingCard(null)
    setIsModalOpen(true)
  }

  const handleEditCard = (card: IndustryCardData) => {
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

  const handleFormSubmit = async (cardData: IndustryCardData) => {
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

  const columns: Column<IndustryCardData>[] = [
    {
      key: "image",
      header: "Image",
      cell: (d) => (
        <div className="h-12 w-12 rounded-md overflow-hidden bg-muted flex items-center justify-center border">
          {d.imageId ? (
            <Image preview imageId={d.imageId} alt={d.title} className="w-full h-full object-cover" />
          ) : (
            <span className="text-[10px] text-muted-foreground">No Image</span>
          )}
        </div>
      ),
    },
    {
      key: "title",
      header: "Industry",
      cell: (d) => (
        <div className="min-w-0 max-w-[200px]">
          <div className="truncate font-medium">{d.title || "Untitled"}</div>
          <Text size="xs" tone="muted" className="truncate">
            {d.tag}
          </Text>
        </div>
      ),
    },
    {
      key: "icon",
      header: "Icon",
      cell: (d) => (
        <Text size="xs" tone="muted" className="truncate">
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
            <h2 className="text-lg font-medium">Industries Section</h2>
            <p className="text-sm text-muted-foreground">
              Manage the intro text and the industry cards below it.
            </p>
          </div>
          <Button onClick={handleSaveIntro} disabled={isSaving}>
            {isSaving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
            Save Intro Text
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div className="space-y-4 bg-muted/20 p-4 rounded-lg border">
            <h3 className="font-semibold text-sm border-b pb-2">Typography & Content</h3>
            <div className="space-y-2">
              <Label>Small Badge Label</Label>
              <Input 
                value={form.intro.label} 
                onChange={e => setForm({ ...form, intro: { ...form.intro, label: e.target.value } })} 
                placeholder="e.g. Industries We Power"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Heading Line 1</Label>
                <Input 
                  value={form.intro.headingLine1} 
                  onChange={e => setForm({ ...form, intro: { ...form.intro, headingLine1: e.target.value } })} 
                  placeholder="e.g. Trusted by"
                />
              </div>
              <div className="space-y-2">
                <Label>Heading Highlight</Label>
                <Input 
                  value={form.intro.headingHighlight} 
                  onChange={e => setForm({ ...form, intro: { ...form.intro, headingHighlight: e.target.value } })} 
                  placeholder="e.g. every sector"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Heading Line 2</Label>
              <Input 
                value={form.intro.headingLine2} 
                onChange={e => setForm({ ...form, intro: { ...form.intro, headingLine2: e.target.value } })} 
                placeholder="e.g. that can't afford downtime."
              />
            </div>

            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea 
                value={form.intro.description} 
                onChange={e => setForm({ ...form, intro: { ...form.intro, description: e.target.value } })} 
                className="min-h-[80px]"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Button Text</Label>
                <Input 
                  value={form.intro.buttonText} 
                  onChange={e => setForm({ ...form, intro: { ...form.intro, buttonText: e.target.value } })} 
                />
              </div>
              <div className="space-y-2">
                <Label>Button Link</Label>
                <Input 
                  value={form.intro.buttonLink} 
                  onChange={e => setForm({ ...form, intro: { ...form.intro, buttonLink: e.target.value } })} 
                />
              </div>
            </div>
          </div>

          <div className="space-y-4 bg-muted/20 p-4 rounded-lg border">
            <div className="flex items-center justify-between border-b pb-2">
              <h3 className="font-semibold text-sm">Statistics</h3>
              <Button type="button" variant="outline" size="sm" onClick={addStat}>
                <Plus className="h-4 w-4 mr-2" /> Add Stat
              </Button>
            </div>
            
            <div className="space-y-3">
              {form.intro.stats.map((stat, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="flex-1 space-y-1">
                    <Input 
                      placeholder="Value (e.g. 500+)" 
                      value={stat.value} 
                      onChange={e => updateStat(index, "value", e.target.value)} 
                    />
                  </div>
                  <div className="flex-1 space-y-1">
                    <Input 
                      placeholder="Label (e.g. Sites)" 
                      value={stat.label} 
                      onChange={e => updateStat(index, "label", e.target.value)} 
                    />
                  </div>
                  <Button type="button" variant="destructive" size="icon" onClick={() => removeStat(index)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Industry Cards Table */}
      <div className="border-t pt-8 mt-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-md">Industry Cards</h3>
          <Button onClick={handleAddCard}>
            <Plus className="h-4 w-4 mr-2" /> Add Industry
          </Button>
        </div>
        
        <DataTable<IndustryCardData>
          data={form.items}
          columns={columns}
          isLoading={false}
          empty={
            <EmptyState
              icon={ImageIcon}
              title="No industries added yet."
              action={
                <Button size="sm" onClick={handleAddCard}>
                  <Plus className="size-4 mr-2" /> Add your first industry
                </Button>
              }
            />
          }
        />
      </div>

      <IndustryFormModal 
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        initialData={editingCard}
        onSubmit={handleFormSubmit}
      />

      <ConfirmDialog
        open={Boolean(pendingDeleteId)}
        onOpenChange={(v) => !v && setPendingDeleteId(null)}
        title="Delete Industry Card?"
        description="This will permanently remove this industry from the section. This action cannot be undone."
        confirmLabel="Delete"
        destructive
        onConfirm={confirmDelete}
      />
    </div>
  )
}
