import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { PageHeader } from "@/components/shared/page-header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { FormField } from "@/components/shared/form-field"
import { MediaPicker } from "@/components/shared/media-picker"
import { Switch } from "@/components/ui/switch"
import {
  useCreateTeamMemberMutation,
  useUpdateTeamMemberMutation,
  useGetSingleTeamMemberQuery,
} from "@/redux/features/team-members/team-members-api"
import { toast } from "sonner"

export default function TeamMemberForm() {
  const { id } = useParams()
  const isEditing = !!id
  const navigate = useNavigate()

  const [form, setForm] = useState({
    name: "",
    role: "",
    mobile: "",
    email: "",
    bio: "",
    serial: 0,
    imageId: "",
    facebook: "",
    twitter: "",
    instagram: "",
    linkedin: "",
    isActive: true,
  })

  const { data, isLoading: isFetching } = useGetSingleTeamMemberQuery(id as string, {
    skip: !isEditing,
  })

  const [createTeamMember, { isLoading: isCreating }] = useCreateTeamMemberMutation()
  const [updateTeamMember, { isLoading: isUpdating }] = useUpdateTeamMemberMutation()

  useEffect(() => {
    if (isEditing && data?.data) {
      const tm = data.data
      // eslint-disable-next-line
      setForm({
        name: tm.name || "",
        role: tm.role || "",
        mobile: tm.mobile || "",
        email: tm.email || "",
        bio: tm.bio || "",
        serial: typeof tm.serial === 'number' ? tm.serial : 0,
        imageId: tm.imageId || "",
        facebook: tm.facebook || "",
        twitter: tm.twitter || "",
        instagram: tm.instagram || "",
        linkedin: tm.linkedin || "",
        isActive: tm.isActive,
      })
    }
  }, [isEditing, data])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!form.name || !form.role) {
      toast.error("Please fill in the required fields (Name, Role)")
      return
    }

    try {
      if (isEditing) {
        await updateTeamMember({ id: id as string, data: form }).unwrap()
        toast.success("Team member updated successfully")
      } else {
        await createTeamMember(form).unwrap()
        toast.success("Team member created successfully")
      }
      navigate("/team-members")
    } catch {
      toast.error(isEditing ? "Failed to update team member" : "Failed to create team member")
    }
  }

  const isLoading = isCreating || isUpdating

  if (isEditing && isFetching) {
    return <div>Loading...</div>
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={isEditing ? "Edit Team Member" : "Create Team Member"}
        description={isEditing ? "Update an existing team member's details" : "Add a new tech talent to your team"}
        actions={
          <Button variant="outline" onClick={() => navigate("/team-members")}>
            Cancel
          </Button>
        }
      />

      <form onSubmit={handleSubmit} className="space-y-8 pb-10">
        <div className="space-y-6">
          <div className="rounded-md border bg-card p-6 space-y-4">
            <h3 className="text-lg font-semibold mb-2">Basic Info</h3>
            
            <FormField label="Profile Photo">
              <MediaPicker
                category="single"
                value={form.imageId}
                onChange={(id) => setForm({ ...form, imageId: id as string })}
              />
            </FormField>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField label="Full Name" required>
                <Input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. David Cooper"
                  required
                />
              </FormField>
              <FormField label="Job Role / Title" required>
                <Input
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                  placeholder="e.g. Lead Engineer"
                  required
                />
              </FormField>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField label="Email Address">
                <Input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="e.g. david@example.com"
                />
              </FormField>
              <FormField label="Mobile Number">
                <Input
                  type="tel"
                  value={form.mobile}
                  onChange={(e) => setForm({ ...form, mobile: e.target.value })}
                  placeholder="e.g. +8801700000000"
                />
              </FormField>
            </div>

            {isEditing && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField label="Display Serial / Sort Order">
                  <Input
                    type="number"
                    value={form.serial}
                    onChange={(e) => setForm({ ...form, serial: parseInt(e.target.value) || 0 })}
                    placeholder="e.g. 1"
                  />
                </FormField>
              </div>
            )}
            <FormField label="Brief Bio">
              <Textarea
                value={form.bio}
                onChange={(e) => setForm({ ...form, bio: e.target.value })}
                placeholder="A short introduction about the team member..."
                rows={3}
              />
            </FormField>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-md border bg-card p-6 space-y-4">
            <h3 className="text-lg font-semibold mb-2">Social Links (Optional)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField label="LinkedIn URL">
                <Input
                  value={form.linkedin}
                  onChange={(e) => setForm({ ...form, linkedin: e.target.value })}
                  placeholder="https://linkedin.com/in/..."
                />
              </FormField>
              <FormField label="Twitter URL">
                <Input
                  value={form.twitter}
                  onChange={(e) => setForm({ ...form, twitter: e.target.value })}
                  placeholder="https://twitter.com/..."
                />
              </FormField>
              <FormField label="Facebook URL">
                <Input
                  value={form.facebook}
                  onChange={(e) => setForm({ ...form, facebook: e.target.value })}
                  placeholder="https://facebook.com/..."
                />
              </FormField>
              <FormField label="Instagram URL">
                <Input
                  value={form.instagram}
                  onChange={(e) => setForm({ ...form, instagram: e.target.value })}
                  placeholder="https://instagram.com/..."
                />
              </FormField>
            </div>
          </div>
        </div>

        <div className="space-y-6 rounded-md border bg-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium">Active Status</h3>
              <p className="text-sm text-muted-foreground">
                Hide or show this team member on the website
              </p>
            </div>
            <Switch
              checked={form.isActive}
              onCheckedChange={(checked) => setForm({ ...form, isActive: checked })}
            />
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Button size="lg" type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : isEditing ? "Update Team Member" : "Create Team Member"}
          </Button>
        </div>
      </form>
    </div>
  )
}
