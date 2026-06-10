import { useState, useEffect } from "react"
import { useGetDynamicContentsMapQuery, useUpsertDynamicContentMutation } from "@/redux/features/dynamic-content/dynamicContent-api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Pencil, Trash2, Save, Loader2, PlaySquare } from "lucide-react"
import { Image, DataTable, type Column, EmptyState, Text, ConfirmDialog } from "@/components/shared"
import { toast } from "sonner"
import { Skeleton } from "@/components/ui/skeleton"
import { ServicesVideoFormModal, type VideoServiceData } from "@/components/modal/home/ServicesVideoFormModal"
import { useCurrentUser } from "@/hooks/use-permission"
import { hasAction, isSuperAdmin } from "@/lib/permissions"


export interface ServicesVideoSectionContent {
  intro: {
    eyebrow: string
    titlePart1: string
    titleHighlight: string
    description: string
    buttonText: string
    buttonLink: string
  }
  items: VideoServiceData[]
}

const defaultContent: ServicesVideoSectionContent = {
  intro: {
    eyebrow: "Watch Reels",
    titlePart1: "Services in",
    titleHighlight: "Action",
    description: "Short field reels from our engineers — see how each maintenance line actually runs on a live industrial site.",
    buttonText: "View All Services",
    buttonLink: "/services"
  },
  items: []
}

export function ServicesVideoTab() {
  const user = useCurrentUser()
  const canUpdate = isSuperAdmin(user) || hasAction(user, "content.home.services-video", "update")

  const { data: contentMap, isLoading } = useGetDynamicContentsMapQuery("home")
  const [upsert, { isLoading: isSaving }] = useUpsertDynamicContentMutation()
  
  const [form, setForm] = useState<ServicesVideoSectionContent>(defaultContent)
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingCard, setEditingCard] = useState<VideoServiceData | null>(null)
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null)

  useEffect(() => {
    const timer = setTimeout(() => {
      if (contentMap?.["home-services-video"]?.value) {
        setForm({ ...defaultContent, ...contentMap["home-services-video"].value })
      }
    }, 0)
    return () => clearTimeout(timer)
  }, [contentMap])

  const handleSaveIntro = async () => {
    try {
      await upsert({
        key: "home-services-video",
        group: "home",
        type: "json",
        name: "Home Services Video Section",
        description: "Content and video cards for the Watch Reels section on the home page",
        value: form,
        isActive: true,
      }).unwrap()
      toast.success("Video section intro updated successfully")
    } catch {
      toast.error("Failed to update intro text")
    }
  }

  const saveFullState = async (newState: ServicesVideoSectionContent) => {
    try {
      await upsert({
        key: "home-services-video",
        group: "home",
        type: "json",
        name: "Home Services Video Section",
        description: "Content and video cards for the Watch Reels section on the home page",
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

  const handleEditCard = (card: VideoServiceData) => {
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

  const handleFormSubmit = async (cardData: VideoServiceData) => {
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

  const columns: Column<VideoServiceData>[] = [
    {
      key: "image",
      header: "Poster",
      cell: (d) => (
        <div className="relative h-14 w-24 rounded-md overflow-hidden bg-black flex items-center justify-center border">
          {d.imageId ? (
            <Image preview imageId={d.imageId} alt={d.title} className="w-full h-full object-cover opacity-70" />
          ) : (
            <span className="text-[10px] text-muted-foreground">No Image</span>
          )}
          <PlaySquare className="absolute text-white/80 h-5 w-5" />
        </div>
      ),
    },
    {
      key: "title",
      header: "Video Detail",
      cell: (d) => (
        <div className="min-w-0 max-w-[250px]">
          <div className="truncate font-medium">{d.title || "Untitled"}</div>
          <Text size="xs" tone="muted" className="truncate mt-0.5">
            {d.category} • {d.duration}
          </Text>
        </div>
      ),
    },
    {
      key: "youtubeId",
      header: "YouTube ID",
      cell: (d) => (
        <Text size="xs" tone="muted" className="truncate font-mono">
          {d.youtubeId || "—"}
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
            <h2 className="text-lg font-medium">Services Video Section</h2>
            <p className="text-sm text-muted-foreground">
              Manage the intro text and the YouTube video reels grid.
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
              placeholder="e.g. Watch Reels"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Title (Part 1)</Label>
              <Input 
                value={form.intro.titlePart1} 
                onChange={e => setForm({ ...form, intro: { ...form.intro, titlePart1: e.target.value } })} 
                placeholder="e.g. Services in"
              />
            </div>
            <div className="space-y-2">
              <Label>Title (Highlight)</Label>
              <Input 
                value={form.intro.titleHighlight} 
                onChange={e => setForm({ ...form, intro: { ...form.intro, titleHighlight: e.target.value } })} 
                placeholder="e.g. Action"
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
      </div>

      {/* Cards Table */}
      <div className="border-t pt-8 mt-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold text-md">Video Reels</h3>
            <p className="text-xs text-muted-foreground mt-1">The first video will be displayed large on the left, followed by the others.</p>
          </div>
          {canUpdate && (
          <Button onClick={handleAddCard}>
            <Plus className="h-4 w-4 mr-2" /> Add Video
          </Button>
        )}
        </div>
        
        <DataTable<VideoServiceData>
          data={form.items}
          columns={canUpdate ? columns : columns.filter(c => c.key !== "actions")}
          isLoading={false}
          empty={
            <EmptyState
              icon={PlaySquare}
              title="No videos added yet."
              action={
                canUpdate && (
          <Button size="sm" onClick={handleAddCard}>
                  <Plus className="size-4 mr-2" /> Add your first video
                </Button>
        )
              }
            />
          }
        />
      </div>

      <ServicesVideoFormModal 
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        initialData={editingCard}
        onSubmit={handleFormSubmit}
      />

      <ConfirmDialog
        open={Boolean(pendingDeleteId)}
        onOpenChange={(v) => !v && setPendingDeleteId(null)}
        title="Delete Video Reel?"
        description="This will permanently remove this video from the section. This action cannot be undone."
        confirmLabel="Delete"
        destructive
        onConfirm={confirmDelete}
      />
    </div>
  )
}
