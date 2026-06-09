import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export interface FaqItemData {
  id: string
  question: string
  answer: string
}

interface FaqFormModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  initialData?: FaqItemData | null
  onSubmit: (data: FaqItemData) => void
}

const defaultForm: FaqItemData = {
  id: "",
  question: "",
  answer: "",
}

export function FaqFormModal({ open, onOpenChange, initialData, onSubmit }: FaqFormModalProps) {
  const [form, setForm] = useState<FaqItemData>(defaultForm)

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
          <DialogTitle>{initialData ? "Edit FAQ" : "Add FAQ"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="question">Question</Label>
              <Input
                id="question"
                value={form.question}
                onChange={(e) => setForm({ ...form, question: e.target.value })}
                placeholder="e.g. What products and services does BPIL offer?"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="answer">Answer</Label>
              <Textarea
                id="answer"
                value={form.answer}
                onChange={(e) => setForm({ ...form, answer: e.target.value })}
                placeholder="Write the detailed answer here..."
                className="min-h-[120px]"
                required
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">
              {initialData ? "Save Changes" : "Add FAQ"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
