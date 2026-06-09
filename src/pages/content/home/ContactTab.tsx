import { useState, useEffect } from "react"
import { useGetDynamicContentsMapQuery, useUpsertDynamicContentMutation } from "@/redux/features/dynamic-content/dynamicContent-api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Save, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { Skeleton } from "@/components/ui/skeleton"

export interface ContactSectionContent {
  intro: {
    eyebrow: string
    title: string
    description: string
  }
  contactInfo: {
    phone: string
    email: string
    office: string
    mapUrl: string
  }
}

const defaultContent: ContactSectionContent = {
  intro: {
    eyebrow: "Get In Touch",
    title: "Let's talk about your next project",
    description: "Whether you need a site survey, a project quote, or technical advice — our engineering team is one call away.",
  },
  contactInfo: {
    phone: "+8801979-176666",
    email: "info.bpilbd@gmail.com",
    office: "24/A-1, 24/A-2, Basila Main Road, Mohammadpur, Dhaka-1207",
    mapUrl: "https://maps.google.com/?q=24%2FA-1+Basila+Main+Road+Mohammadpur+Dhaka"
  }
}

export function ContactTab() {
  const { data: contentMap, isLoading } = useGetDynamicContentsMapQuery("home")
  const [upsert, { isLoading: isSaving }] = useUpsertDynamicContentMutation()
  
  const [form, setForm] = useState<ContactSectionContent>(defaultContent)

  useEffect(() => {
    const timer = setTimeout(() => {
      if (contentMap?.["home-contact"]?.value) {
        setForm({ ...defaultContent, ...contentMap["home-contact"].value })
      }
    }, 0)
    return () => clearTimeout(timer)
  }, [contentMap])

  const handleSaveIntro = async () => {
    try {
      await upsert({
        key: "home-contact",
        group: "home",
        type: "json",
        name: "Home Contact Section",
        description: "Content for the Contact section on the home page",
        value: form,
        isActive: true,
      }).unwrap()
      toast.success("Contact section updated successfully")
    } catch {
      toast.error("Failed to update contact section")
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
    <div className="rounded-lg border bg-card text-card-foreground p-6">
      
      {/* Intro Form */}
      <div className="">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-medium">Contact Section</h2>
            <p className="text-sm text-muted-foreground">
              Manage the introductory text shown on the left side of the contact section.
            </p>
          </div>
          <Button onClick={handleSaveIntro} disabled={isSaving}>
            {isSaving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
            Save Changes
          </Button>
        </div>

        <div className="space-y-4 bg-muted/20 p-4 rounded-lg border">
          <h3 className="font-semibold text-sm border-b pb-2">Typography</h3>
          
          <div className="space-y-2">
            <Label>Small Eyebrow Label</Label>
            <Input 
              value={form.intro.eyebrow} 
              onChange={e => setForm({ ...form, intro: { ...form.intro, eyebrow: e.target.value } })} 
              placeholder="e.g. Get In Touch"
            />
          </div>
          
          <div className="space-y-2">
            <Label>Main Title</Label>
            <Input 
              value={form.intro.title} 
              onChange={e => setForm({ ...form, intro: { ...form.intro, title: e.target.value } })} 
              placeholder="e.g. Let's talk about your next project"
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
        </div>

        <div className="space-y-4 bg-muted/20 p-4 rounded-lg border mt-6">
          <h3 className="font-semibold text-sm border-b pb-2">Contact Details</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Phone Number</Label>
              <Input 
                value={form.contactInfo.phone} 
                onChange={e => setForm({ ...form, contactInfo: { ...form.contactInfo, phone: e.target.value } })} 
                placeholder="e.g. +8801979-176666"
              />
            </div>
            
            <div className="space-y-2">
              <Label>Email Address</Label>
              <Input 
                value={form.contactInfo.email} 
                onChange={e => setForm({ ...form, contactInfo: { ...form.contactInfo, email: e.target.value } })} 
                placeholder="e.g. info.bpilbd@gmail.com"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Office Address</Label>
            <Textarea 
              value={form.contactInfo.office} 
              onChange={e => setForm({ ...form, contactInfo: { ...form.contactInfo, office: e.target.value } })} 
              placeholder="e.g. 24/A-1, 24/A-2, Basila Main Road, Mohammadpur, Dhaka-1207"
              className="min-h-[60px]"
            />
          </div>

          <div className="space-y-2">
            <Label>Google Maps URL</Label>
            <Input 
              value={form.contactInfo.mapUrl} 
              onChange={e => setForm({ ...form, contactInfo: { ...form.contactInfo, mapUrl: e.target.value } })} 
              placeholder="e.g. https://maps.google.com/?q=..."
            />
          </div>
        </div>
      </div>
    </div>
  )
}
