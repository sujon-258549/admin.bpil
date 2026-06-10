import { useState, useEffect } from "react"
import { useGetDynamicContentsMapQuery, useUpsertDynamicContentMutation } from "@/redux/features/dynamic-content/dynamicContent-api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Pencil, Trash2, Save, Loader2, Image as ImageIcon } from "lucide-react"
import { DataTable, type Column, EmptyState, Text, ConfirmDialog, MediaPicker } from "@/components/shared"
import { toast } from "sonner"
import { Skeleton } from "@/components/ui/skeleton"
import { ComprehensiveFormModal, type ComprehensiveServiceData } from "@/components/modal/home/ComprehensiveFormModal"

export interface ComprehensiveSectionContent {
  intro: {
    eyebrow: string
    heading: string
    description: string
    buttonText: string
    buttonLink: string
    badgeCircleText: string
    badgeTitle: string
    badgeSubtitle: string
    imageId: string
  }
  items: ComprehensiveServiceData[]
}

const defaultContent: ComprehensiveSectionContent = {
  intro: {
    eyebrow: "End-To-End Delivery",
    heading: "Our Comprehensive Service",
    description: "Six service lines under one roof — designed so you never have to chase three contractors for one electrical scope.",
    buttonText: "Explore All Services",
    buttonLink: "/services",
    badgeCircleText: "24/7",
    badgeTitle: "On-Call Engineering",
    badgeSubtitle: "Country-wide response",
    imageId: ""
  },
  items: []
}

export function ComprehensiveTab() {
  const { data: contentMap, isLoading } = useGetDynamicContentsMapQuery("home")
  const [upsert, { isLoading: isSaving }] = useUpsertDynamicContentMutation()
  
  const [form, setForm] = useState<ComprehensiveSectionContent>(defaultContent)
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingCard, setEditingCard] = useState<ComprehensiveServiceData | null>(null)
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null)

  useEffect(() => {
    const timer = setTimeout(() => {
      if (contentMap?.["home-comprehensive"]?.value) {
        setForm({ ...defaultContent, ...contentMap["home-comprehensive"].value })
      }
    }, 0)
    return () => clearTimeout(timer)
  }, [contentMap])

  const handleSaveIntro = async () => {
    try {
      await upsert({
        key: "home-comprehensive",
        group: "home",
        type: "json",
        name: "Home Comprehensive Section",
        description: "Content and cards for the Comprehensive Services section on the home page",
        value: form,
        isActive: true,
      }).unwrap()
      toast.success("Comprehensive section intro updated successfully")
    } catch {
      toast.error("Failed to update intro text")
    }
  }

  const saveFullState = async (newState: ComprehensiveSectionContent) => {
    try {
      await upsert({
        key: "home-comprehensive",
        group: "home",
        type: "json",
        name: "Home Comprehensive Section",
        description: "Content and cards for the Comprehensive Services section on the home page",
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
    setEditingCard(null)
    setIsModalOpen(true)
  }

  const handleEditCard = (card: ComprehensiveServiceData) => {
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

  const handleFormSubmit = async (cardData: ComprehensiveServiceData) => {
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

  const columns: Column<ComprehensiveServiceData>[] = [
    {
      key: "title",
      header: "Service Title",
      cell: (d) => (
        <div className="min-w-0 max-w-[400px]">
          <div className="truncate font-medium">{d.title || "Untitled"}</div>
          <Text size="xs" tone="muted" className="truncate mt-0.5">
            {d.description}
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
      <div className="mb-10 max-w-5xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-medium">Comprehensive Services Section</h2>
            <p className="text-sm text-muted-foreground">
              Manage the featured image, the floating badge, and the list of services.
            </p>
          </div>
          <Button onClick={handleSaveIntro} disabled={isSaving}>
            {isSaving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
            Save Intro & Image
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          
          {/* Typography */}
          <div className="space-y-4 bg-muted/20 p-4 rounded-lg border">
            <h3 className="font-semibold text-sm border-b pb-2">Typography</h3>
            
            <div className="space-y-2">
              <Label>Small Eyebrow Label</Label>
              <Input 
                value={form.intro.eyebrow} 
                onChange={e => setForm({ ...form, intro: { ...form.intro, eyebrow: e.target.value } })} 
                placeholder="e.g. End-To-End Delivery"
              />
            </div>
            
            <div className="space-y-2">
              <Label>Main Heading</Label>
              <Input 
                value={form.intro.heading} 
                onChange={e => setForm({ ...form, intro: { ...form.intro, heading: e.target.value } })} 
                placeholder="e.g. Our Comprehensive Service"
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

          {/* Media & Badge */}
          <div className="space-y-6">
            <div className="space-y-4 bg-muted/20 p-4 rounded-lg border">
              <h3 className="font-semibold text-sm border-b pb-2">Featured Image</h3>
              <MediaPicker
                value={form.intro.imageId}
                onChange={(val) => setForm({ ...form, intro: { ...form.intro, imageId: val as string } })}
                width="w-full"
                height="h-64"
                label="Select Large Image"
              />
              <p className="text-[11px] text-muted-foreground mt-1">
                <strong>Recommended size: 1000x1250 pixels (4:5 vertical ratio).</strong> Displays large on the left side of the section.
              </p>
            </div>

            <div className="space-y-4 bg-muted/20 p-4 rounded-lg border">
              <h3 className="font-semibold text-sm border-b pb-2">Floating Badge Text</h3>
              
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2 col-span-1">
                  <Label>Circle Text</Label>
                  <Input 
                    value={form.intro.badgeCircleText} 
                    onChange={e => setForm({ ...form, intro: { ...form.intro, badgeCircleText: e.target.value } })} 
                    placeholder="e.g. 24/7"
                  />
                </div>
                <div className="space-y-2 col-span-2">
                  <Label>Badge Title</Label>
                  <Input 
                    value={form.intro.badgeTitle} 
                    onChange={e => setForm({ ...form, intro: { ...form.intro, badgeTitle: e.target.value } })} 
                    placeholder="e.g. On-Call Engineering"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Badge Subtitle</Label>
                <Input 
                  value={form.intro.badgeSubtitle} 
                  onChange={e => setForm({ ...form, intro: { ...form.intro, badgeSubtitle: e.target.value } })} 
                  placeholder="e.g. Country-wide response"
                />
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Cards Table */}
      <div className="border-t pt-8 mt-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold text-md">Services List</h3>
            <p className="text-xs text-muted-foreground mt-1">All services in this list automatically get the CheckCircle icon.</p>
          </div>
          <Button onClick={handleAddCard}>
            <Plus className="h-4 w-4 mr-2" /> Add Service
          </Button>
        </div>
        
        <DataTable<ComprehensiveServiceData>
          data={form.items}
          columns={columns}
          isLoading={false}
          empty={
            <EmptyState
              icon={ImageIcon}
              title="No services added yet."
              action={
                <Button size="sm" onClick={handleAddCard}>
                  <Plus className="size-4 mr-2" /> Add your first service
                </Button>
              }
            />
          }
        />
      </div>

      <ComprehensiveFormModal 
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        initialData={editingCard}
        onSubmit={handleFormSubmit}
      />

      <ConfirmDialog
        open={Boolean(pendingDeleteId)}
        onOpenChange={(v) => !v && setPendingDeleteId(null)}
        title="Delete Service?"
        description="This will permanently remove this service from the list. This action cannot be undone."
        confirmLabel="Delete"
        destructive
        onConfirm={confirmDelete}
      />
    </div>
  )
}
