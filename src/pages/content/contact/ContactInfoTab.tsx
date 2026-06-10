import { useState, useEffect } from "react"
import { useGetDynamicContentsMapQuery, useUpsertDynamicContentMutation } from "@/redux/features/dynamic-content/dynamicContent-api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Save, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { Skeleton } from "@/components/ui/skeleton"
import { useCurrentUser } from "@/hooks/use-permission"
import { hasAction, isSuperAdmin } from "@/lib/permissions"


export interface ContactInfoContent {
  phoneCard: {
    title: string
    line1: string
    line2: string
    icon: string
  }
  emailCard: {
    title: string
    line1: string
    line2: string
    icon: string
  }
  visitCard: {
    title: string
    line1: string
    line2: string
    mapUrl: string
    icon: string
  }
  hoursCard: {
    title: string
    line1: string
    line2: string
    icon: string
  }
  mapOptions: {
    latitude: string
    longitude: string
    zoom: string
  }
}

const defaultContent: ContactInfoContent = {
  phoneCard: {
    title: "Call Us",
    line1: "+880 1713 222 333",
    line2: "",
    icon: "faPhone",
  },
  emailCard: {
    title: "Email Us",
    line1: "sales@bpilbd.com",
    line2: "support@bpilbd.com",
    icon: "faEnvelope",
  },
  visitCard: {
    title: "Visit Us",
    line1: "House #12, Road #3, Block A",
    line2: "Mohammadpur, Dhaka 1207",
    mapUrl: "https://maps.google.com/...",
    icon: "faLocationDot",
  },
  hoursCard: {
    title: "Working Hours",
    line1: "Sun – Thu · 9:00 – 18:00",
    line2: "Saturday · 10:00 – 14:00",
    icon: "faClock",
  },
  mapOptions: {
    latitude: "23.7565",
    longitude: "90.3491",
    zoom: "15",
  }
}

export function ContactInfoTab() {
  const user = useCurrentUser()
  const canUpdate = isSuperAdmin(user) || hasAction(user, "content.contact.info", "update")

  const { data: contentMap, isLoading } = useGetDynamicContentsMapQuery("contact")
  const [upsert, { isLoading: isSaving }] = useUpsertDynamicContentMutation()
  
  const [form, setForm] = useState<ContactInfoContent>(defaultContent)

  useEffect(() => {
    const timer = setTimeout(() => {
      if (contentMap?.["contact-info"]?.value) {
        setForm({ ...defaultContent, ...contentMap["contact-info"].value })
      }
    }, 0)
    return () => clearTimeout(timer)
  }, [contentMap])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await upsert({
        key: "contact-info",
        group: "contact",
        type: "json",
        name: "Contact Information",
        description: "The info cards and map coordinates on the Contact page",
        value: form,
        isActive: true,
      }).unwrap()
      toast.success("Contact info updated successfully")
    } catch {
      toast.error("Failed to update contact info")
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-card border rounded-lg p-6">
      <div className="flex items-center justify-between border-b pb-4">
        <div>
          <h2 className="text-lg font-medium">Contact Details & Map</h2>
          <p className="text-sm text-muted-foreground">Manage the 4 info cards and the map location.</p>
        </div>
        {canUpdate && (
          <Button type="submit" disabled={isSaving}>
          {isSaving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
          Save Changes
          </Button>
        )}
      </div>

      <div className="grid grid-cols-2 gap-8">
        
        {/* Info Cards */}
        <div className="space-y-8">
          <div className="space-y-4 bg-muted/20 p-4 rounded-lg border">
            <h3 className="font-semibold text-sm border-b pb-2">Card 1: Phone</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Title</Label>
                <Input value={form.phoneCard.title} onChange={e => setForm(f => ({...f, phoneCard: {...f.phoneCard, title: e.target.value}}))} required />
              </div>
              <div className="space-y-2">
                <Label>FontAwesome Icon ID</Label>
                <Input value={form.phoneCard.icon} onChange={e => setForm(f => ({...f, phoneCard: {...f.phoneCard, icon: e.target.value}}))} required />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Phone Line 1</Label>
              <Input value={form.phoneCard.line1} onChange={e => setForm(f => ({...f, phoneCard: {...f.phoneCard, line1: e.target.value}}))} required />
            </div>
            <div className="space-y-2">
              <Label>Phone Line 2 (Optional)</Label>
              <Input value={form.phoneCard.line2} onChange={e => setForm(f => ({...f, phoneCard: {...f.phoneCard, line2: e.target.value}}))} />
            </div>
          </div>

          <div className="space-y-4 bg-muted/20 p-4 rounded-lg border">
            <h3 className="font-semibold text-sm border-b pb-2">Card 2: Email</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Title</Label>
                <Input value={form.emailCard.title} onChange={e => setForm(f => ({...f, emailCard: {...f.emailCard, title: e.target.value}}))} required />
              </div>
              <div className="space-y-2">
                <Label>FontAwesome Icon ID</Label>
                <Input value={form.emailCard.icon} onChange={e => setForm(f => ({...f, emailCard: {...f.emailCard, icon: e.target.value}}))} required />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Email Line 1</Label>
              <Input value={form.emailCard.line1} onChange={e => setForm(f => ({...f, emailCard: {...f.emailCard, line1: e.target.value}}))} required />
            </div>
            <div className="space-y-2">
              <Label>Email Line 2 (Optional)</Label>
              <Input value={form.emailCard.line2} onChange={e => setForm(f => ({...f, emailCard: {...f.emailCard, line2: e.target.value}}))} />
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="space-y-4 bg-muted/20 p-4 rounded-lg border">
            <h3 className="font-semibold text-sm border-b pb-2">Card 3: Address & Map</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Title</Label>
                <Input value={form.visitCard.title} onChange={e => setForm(f => ({...f, visitCard: {...f.visitCard, title: e.target.value}}))} required />
              </div>
              <div className="space-y-2">
                <Label>FontAwesome Icon ID</Label>
                <Input value={form.visitCard.icon} onChange={e => setForm(f => ({...f, visitCard: {...f.visitCard, icon: e.target.value}}))} required />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Address Line 1</Label>
              <Input value={form.visitCard.line1} onChange={e => setForm(f => ({...f, visitCard: {...f.visitCard, line1: e.target.value}}))} required />
            </div>
            <div className="space-y-2">
              <Label>Address Line 2</Label>
              <Input value={form.visitCard.line2} onChange={e => setForm(f => ({...f, visitCard: {...f.visitCard, line2: e.target.value}}))} />
            </div>
            <div className="space-y-2">
              <Label>Google Maps External Link (URL)</Label>
              <Input value={form.visitCard.mapUrl} onChange={e => setForm(f => ({...f, visitCard: {...f.visitCard, mapUrl: e.target.value}}))} required />
            </div>
          </div>

          <div className="space-y-4 bg-muted/20 p-4 rounded-lg border">
            <h3 className="font-semibold text-sm border-b pb-2">Card 4: Working Hours</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Title</Label>
                <Input value={form.hoursCard.title} onChange={e => setForm(f => ({...f, hoursCard: {...f.hoursCard, title: e.target.value}}))} required />
              </div>
              <div className="space-y-2">
                <Label>FontAwesome Icon ID</Label>
                <Input value={form.hoursCard.icon} onChange={e => setForm(f => ({...f, hoursCard: {...f.hoursCard, icon: e.target.value}}))} required />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Hours Line 1</Label>
              <Input value={form.hoursCard.line1} onChange={e => setForm(f => ({...f, hoursCard: {...f.hoursCard, line1: e.target.value}}))} required />
            </div>
            <div className="space-y-2">
              <Label>Hours Line 2 (Optional)</Label>
              <Input value={form.hoursCard.line2} onChange={e => setForm(f => ({...f, hoursCard: {...f.hoursCard, line2: e.target.value}}))} />
            </div>
          </div>

          <div className="space-y-4 bg-muted/20 p-4 rounded-lg border">
            <h3 className="font-semibold text-sm border-b pb-2">Bottom Leaflet Map (Coordinates)</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Latitude</Label>
                <Input value={form.mapOptions.latitude} onChange={e => setForm(f => ({...f, mapOptions: {...f.mapOptions, latitude: e.target.value}}))} required />
              </div>
              <div className="space-y-2">
                <Label>Longitude</Label>
                <Input value={form.mapOptions.longitude} onChange={e => setForm(f => ({...f, mapOptions: {...f.mapOptions, longitude: e.target.value}}))} required />
              </div>
              <div className="space-y-2">
                <Label>Default Zoom</Label>
                <Input type="number" value={form.mapOptions.zoom} onChange={e => setForm(f => ({...f, mapOptions: {...f.mapOptions, zoom: e.target.value}}))} required />
              </div>
            </div>
          </div>

        </div>

      </div>
    </form>
  )
}
