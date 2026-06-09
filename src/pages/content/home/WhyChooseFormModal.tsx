import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export interface WhyChooseCardData {
  id: string
  title: string
  description: string
  icon: string
}

interface WhyChooseFormModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  initialData?: WhyChooseCardData | null
  onSubmit: (data: WhyChooseCardData) => void
}

const defaultForm: WhyChooseCardData = {
  id: "",
  title: "",
  description: "",
  icon: "",
}

export function WhyChooseFormModal({ open, onOpenChange, initialData, onSubmit }: WhyChooseFormModalProps) {
  const [form, setForm] = useState<WhyChooseCardData>(defaultForm)

  useEffect(() => {
    if (initialData && open) {
      const timer = setTimeout(() => {
        setForm(initialData)
      }, 0)
      return () => clearTimeout(timer)
    } else if (open) {
      const timer = setTimeout(() => {
        setForm({ ...defaultForm, id: crypto.randomUUID() })
      }, 0)
      return () => clearTimeout(timer)
    }
  }, [initialData, open])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(form)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="!max-w-xl">
        <DialogHeader>
          <DialogTitle>{initialData ? "Edit Reason Card" : "Add Reason Card"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="e.g. Expert & Experienced Team"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="icon">FontAwesome Icon Name</Label>
              <Input
                id="icon"
                value={form.icon}
                onChange={(e) => setForm({ ...form, icon: e.target.value })}
                placeholder="e.g. faUsers, faShieldHalved"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Short description..."
                rows={3}
                required
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">
              {initialData ? "Save Changes" : "Add Reason"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
