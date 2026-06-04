import { useEffect, useState } from "react"
import { toast } from "sonner"
import { PageHeader, PageMeta, FormField } from "@/components/shared"
import { useGetMyDataQuery, useUpdateUserMutation } from "@/redux/features/users/users-api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"
import { Loader2 } from "lucide-react"
import { getErrorMessage } from "@/lib/errors"
import { Skeleton } from "@/components/ui/skeleton"

export default function UpdateProfile() {
  const { data: response, isLoading: isLoadingProfile } = useGetMyDataQuery()
  const user = response?.data

  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation()

  const [form, setForm] = useState({
    name: "",
    mobile: "",
    gender: "",
    bloodGroup: "",
  })

  useEffect(() => {
    if (user) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setForm({
        name: user.name || "",
        mobile: user.mobile || "",
        gender: user.gender || "",
        bloodGroup: user.bloodGroup || "",
      })
    }
  }, [user])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    try {
      const res = await updateUser({
        id: user.id,
        data: {
          user: {
            mobile: form.mobile || undefined,
          },
          profile: {
            name: form.name || undefined,
            gender: form.gender ? (form.gender as any) : undefined,
            bloodGroup: form.bloodGroup || undefined,
          },
        },
      }).unwrap()

      if (res.success) {
        toast.success(res.message || "Profile updated successfully!")
      }
    } catch (err: any) {
      toast.error(getErrorMessage(err, "Failed to update profile."))
    }
  }

  if (isLoadingProfile) {
    return (
      <div className="space-y-6 max-w-2xl">
        <PageMeta title="Update Profile" description="Edit your profile details" />
        <PageHeader title="Update Profile" description="Modify your personal information." />
        <Skeleton className="h-96 rounded-xl" />
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <PageMeta title="Update Profile" description="Edit your profile details" />
      <PageHeader
        title="Update Profile"
        description="Update your personal details and contact information."
      />

      <div className="rounded-xl border bg-card text-card-foreground shadow-sm">
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField label="Full Name" required htmlFor="profileName">
              <Input
                id="profileName"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="John Doe"
                className="h-11"
              />
            </FormField>

            <FormField label="Mobile Number" htmlFor="profileMobile">
              <Input
                id="profileMobile"
                value={form.mobile}
                onChange={(e) => setForm({ ...form, mobile: e.target.value })}
                placeholder="01XXXXXXXXX"
                className="h-11"
              />
            </FormField>

            <FormField label="Gender" htmlFor="profileGender">
              <Select
                value={form.gender}
                onChange={(v) => setForm({ ...form, gender: v })}
                placeholder="Select Gender"
                className="h-11"
              >
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
                <option value="OTHER">Other</option>
              </Select>
            </FormField>

            <FormField label="Blood Group" htmlFor="profileBlood">
              <Select
                value={form.bloodGroup}
                onChange={(v) => setForm({ ...form, bloodGroup: v })}
                placeholder="Select Blood Group"
                className="h-11"
              >
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
              </Select>
            </FormField>
          </div>

          <div className="pt-4 flex justify-end border-t mt-4">
            <Button type="submit" disabled={isUpdating} className="min-w-32 h-11">
              {isUpdating ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" /> Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
