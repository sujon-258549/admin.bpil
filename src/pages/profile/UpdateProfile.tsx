import { useEffect, useState } from "react"
import { toast } from "sonner"
import { PageHeader, PageMeta, FormField } from "@/components/shared"
import { useGetMyDataQuery, useUpdateUserMutation } from "@/redux/features/users/users-api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Loader2, UserCircle2, MapPin, Briefcase, Save, Image as ImageIcon } from "lucide-react"
import { getErrorMessage } from "@/lib/errors"
import { Skeleton } from "@/components/ui/skeleton"
import { MediaPicker } from "@/components/shared/media-picker"
import { Combobox } from "@/components/ui/combobox"

const BLOOD_GROUPS = [
  "A_POSITIVE",
  "A_NEGATIVE",
  "B_POSITIVE",
  "B_NEGATIVE",
  "AB_POSITIVE",
  "AB_NEGATIVE",
  "O_POSITIVE",
  "O_NEGATIVE",
] as const

interface FormState {
  name: string
  mobile: string
  gender: string
  bloodGroup: string
  dob: string
  nid: string
  photoId: string
  division: string
  district: string
  upazila: string
  address: string
  experience: string
  workType: string
}

const emptyState: FormState = {
  name: "",
  mobile: "",
  gender: "",
  bloodGroup: "",
  dob: "",
  nid: "",
  photoId: "",
  division: "",
  district: "",
  upazila: "",
  address: "",
  experience: "",
  workType: "",
}

export default function UpdateProfile() {
  const { data: response, isLoading: isLoadingProfile } = useGetMyDataQuery()
  const user = response?.data

  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation()

  const [form, setForm] = useState<FormState>(emptyState)

  useEffect(() => {
    if (user) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setForm({
        name: user.name || "",
        mobile: user.mobile || "",
        gender: user.gender || "",
        bloodGroup: user.bloodGroup || "",
        dob: user.dob ? String(user.dob).slice(0, 10) : "",
        nid: user.nid || "",
        photoId: user.photoId || "",
        division: user.division || "",
        district: user.district || "",
        upazila: user.upazila || "",
        address: user.address || "",
        experience: user.experience || "",
        workType: user.workType || "",
      })
    }
  }, [user])

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((s) => ({ ...s, [key]: value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    const tu = (v: string) => (v.trim() ? v.trim() : undefined)

    try {
      const res = await updateUser({
        id: user.id,
        data: {
          user: {
            mobile: tu(form.mobile),
          },
          profile: {
            name: tu(form.name),
            gender: (form.gender as "MALE" | "FEMALE" | "OTHER") || undefined,
            bloodGroup: form.bloodGroup || undefined,
            dob: form.dob || undefined,
            nid: tu(form.nid),
            photoId: form.photoId || undefined,
          },
          address: {
            division: tu(form.division),
            district: tu(form.district),
            upazila: tu(form.upazila),
            address: tu(form.address),
          },
          workInfo: {
            experience: tu(form.experience),
            workType: tu(form.workType),
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
      <div className="space-y-6">
        <PageMeta title="Update Profile" description="Edit your profile details" />
        <PageHeader title="Update Profile" description="Modify your personal information." />
        <Skeleton className="h-96 rounded-xl" />
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-5xl">
      <PageMeta title="Update Profile" description="Edit your profile details" />
      <PageHeader
        title="Update Profile"
        description="Update your personal details, contact information, and profile picture."
      />

      <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserCircle2 className="size-4 text-primary" /> Personal Info
              </CardTitle>
              <CardDescription>
                Basic identification and contact details.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <FormField label="Full Name">
                <Input
                  required
                  value={form.name}
                  onChange={(e) => update("name", e.target.value)}
                  placeholder="e.g. Sujon Ahmed"
                />
              </FormField>
              
              <FormField label="Mobile Number">
                <Input
                  value={form.mobile}
                  onChange={(e) => update("mobile", e.target.value)}
                  placeholder="+8801XXXXXXXXX"
                />
              </FormField>

              <FormField label="Gender">
                <Select
                  value={form.gender}
                  onChange={(v) => update("gender", v)}
                  placeholder="Select Gender"
                >
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                  <option value="OTHER">Other</option>
                </Select>
              </FormField>
              
              <FormField label="Date of Birth">
                <Input
                  type="date"
                  value={form.dob}
                  onChange={(e) => update("dob", e.target.value)}
                  onClick={(e) => {
                    try {
                      if ("showPicker" in e.currentTarget) {
                        e.currentTarget.showPicker()
                      }
                    } catch {
                      // ignore
                    }
                  }}
                  className="cursor-pointer"
                />
              </FormField>
              
              <FormField label="Blood Group">
                <Combobox
                  value={form.bloodGroup}
                  onChange={(value) => update("bloodGroup", value)}
                  placeholder="Select blood group"
                  options={BLOOD_GROUPS.map((b) => ({
                    value: b,
                    label: b
                      .replace("_", " ")
                      .replace("POSITIVE", "+")
                      .replace("NEGATIVE", "−"),
                  }))}
                />
              </FormField>
              
              <FormField label="NID">
                <Input
                  value={form.nid}
                  onChange={(e) => update("nid", e.target.value)}
                  placeholder="National ID number"
                />
              </FormField>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="size-4 text-primary" /> Address
              </CardTitle>
              <CardDescription>Where you are based.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-3">
              <FormField label="Division">
                <Input
                  value={form.division}
                  onChange={(e) => update("division", e.target.value)}
                  placeholder="Dhaka"
                />
              </FormField>
              <FormField label="District">
                <Input
                  value={form.district}
                  onChange={(e) => update("district", e.target.value)}
                  placeholder="Dhaka"
                />
              </FormField>
              <FormField label="Upazila">
                <Input
                  value={form.upazila}
                  onChange={(e) => update("upazila", e.target.value)}
                  placeholder="Mirpur"
                />
              </FormField>
              <div className="sm:col-span-3">
                <FormField label="Full Address">
                  <Textarea
                    rows={2}
                    value={form.address}
                    onChange={(e) => update("address", e.target.value)}
                    placeholder="House, road, area, landmark…"
                  />
                </FormField>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="size-4 text-primary" /> Work Info
              </CardTitle>
              <CardDescription>
                Optional work-related details.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <FormField label="Experience">
                <Input
                  value={form.experience}
                  onChange={(e) => update("experience", e.target.value)}
                  placeholder="e.g. 3 years"
                />
              </FormField>
              <FormField label="Work Type">
                <Input
                  value={form.workType}
                  onChange={(e) => update("workType", e.target.value)}
                  placeholder="e.g. Full-time, On-site"
                />
              </FormField>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ImageIcon className="size-4 text-primary" /> Profile Picture
              </CardTitle>
              <CardDescription>
                Upload a professional headshot.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center">
              <MediaPicker
                value={form.photoId}
                onChange={(id) => update("photoId", id)}
                label="Select Photo"
                className="rounded-full w-40 h-40"
              />
            </CardContent>
          </Card>

          <Button type="submit" disabled={isUpdating} className="w-full">
            {isUpdating ? (
              <>
                <Loader2 className="mr-2 size-4 animate-spin" /> Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 size-4" /> Save Changes
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
