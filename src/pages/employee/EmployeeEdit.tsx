import { useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import {
  ArrowLeft,
  BadgeCheck,
  Briefcase,
  Building,
  Clock,
  IdCard,
  Loader2,
  Mail,
  MapPin,
  Phone,
  Save,
  Shield,
  UserCircle2,
} from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Combobox } from "@/components/ui/combobox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { FormField, PageHeader, Text, PageMeta, MediaPicker } from "@/components/shared"
import { FormSkeleton } from "@/components/skeleton"
import {
  DepartmentFormModal,
  DesignationFormModal,
  RoleFormModal,
} from "@/components/modal"
import {
  useDepartment,
  useDesignation,
  useEmployee,
  useRole,
} from "@/hooks/data-fetch"
import { ROUTES } from "@/config/paths"
import { getErrorMessage } from "@/lib/errors"

interface FormState {
  // Personal
  name: string
  email: string
  mobile: string
  gender: string
  dob: string
  age: string
  bloodGroup: string
  nid: string
  serialId: string
  // Address
  division: string
  district: string
  upazila: string
  address: string
  // Org
  roleId: string
  departmentId: string
  designationId: string
  // Work Info
  experience: string
  workType: string
  workStartTime: string
  workTimeLimit: string
  availableTime: string
  // Images
  photoId: string
  nidPhotoIds: string[]
  // Account flags
  isActive: boolean
  isVerified: boolean
  isBlocked: boolean
  isDeleted: boolean
  emailVerified: boolean
  phoneVerified: boolean
  nidVerified: boolean
}

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

const emptyState: FormState = {
  name: "",
  email: "",
  mobile: "",
  gender: "",
  dob: "",
  age: "",
  bloodGroup: "",
  nid: "",
  serialId: "",
  division: "",
  district: "",
  upazila: "",
  address: "",
  roleId: "",
  departmentId: "",
  designationId: "",
  experience: "",
  workType: "",
  workStartTime: "",
  workTimeLimit: "",
  availableTime: "",
  photoId: "",
  nidPhotoIds: [],
  isActive: true,
  isVerified: false,
  isBlocked: false,
  isDeleted: false,
  emailVerified: false,
  phoneVerified: false,
  nidVerified: false,
}

function SwitchRow({
  id,
  label,
  description,
  checked,
  onCheckedChange,
  color = "default",
}: {
  id: string
  label: string
  description: string
  checked: boolean
  onCheckedChange: (v: boolean) => void
  color?: "default" | "success" | "warning" | "danger"
}) {
  const colorMap = {
    default: "bg-muted/30",
    success: checked ? "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800" : "bg-muted/30",
    warning: checked ? "bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800" : "bg-muted/30",
    danger: checked ? "bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800" : "bg-muted/30",
  }
  return (
    <div className={`flex items-center justify-between rounded-md border px-3 py-2.5 transition-colors ${colorMap[color]}`}>
      <div>
        <Label htmlFor={id} className="text-sm font-medium cursor-pointer">
          {label}
        </Label>
        <Text size="xs" tone="muted">{description}</Text>
      </div>
      <Switch id={id} checked={checked} onCheckedChange={onCheckedChange} />
    </div>
  )
}

export default function EmployeeEditPage() {
  const navigate = useNavigate()
  const { id = "" } = useParams<{ id: string }>()
  const [form, setForm] = useState<FormState>(emptyState)
  const [roleModalOpen, setRoleModalOpen] = useState(false)
  const [deptModalOpen, setDeptModalOpen] = useState(false)
  const [desigModalOpen, setDesigModalOpen] = useState(false)

  const { roles } = useRole({ limit: 100 })
  const { departments } = useDepartment({ limit: 100 })
  const { designations } = useDesignation({ limit: 100 })
  const { updateEmployee, useGetEmployeeById, isLoading } = useEmployee()
  const { data: userRes, isLoading: isFetching } = useGetEmployeeById(id, {
    skip: !id,
  })

  // Detect super-admin: role name contains "super" (case-insensitive)
  const rawUser = userRes?.data as any
  const isSuperAdmin = String(rawUser?.role?.role ?? "").toLowerCase().includes("super")

  useEffect(() => {
    const u = userRes?.data as any
    if (!u) return
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setForm({
      name: u?.profile?.name ?? "",
      email: u?.email ?? "",
      mobile: u?.mobile ?? "",
      gender: u?.profile?.gender ?? "",
      dob: u?.profile?.dob ? String(u.profile.dob).slice(0, 10) : "",
      age: u?.profile?.age ? String(u.profile.age) : "",
      bloodGroup: u?.profile?.bloodGroup ?? "",
      nid: u?.profile?.nid ?? "",
      serialId: u?.profile?.serialId ?? "",
      division: u?.address?.division ?? "",
      district: u?.address?.district ?? "",
      upazila: u?.address?.upazila ?? "",
      address: u?.address?.address ?? "",
      roleId: u?.role?.id ?? u?.roleId ?? "",
      departmentId: u?.department?.id ?? u?.departmentId ?? "",
      designationId: u?.designation?.id ?? u?.designationId ?? "",
      experience: u?.workInfo?.experience ?? "",
      workType: u?.workInfo?.workType ?? "",
      workStartTime: u?.workInfo?.workStartTime ?? "",
      workTimeLimit: u?.workInfo?.workTimeLimit ?? "",
      availableTime: u?.workInfo?.availableTime ?? "",
      photoId: u?.profile?.photoId ?? "",
      nidPhotoIds: (u?.profile?.nidPhotos ?? []).map((img: any) => img.id),
      isActive: u?.isActive ?? true,
      isVerified: u?.isVerified ?? false,
      isBlocked: u?.isBlocked ?? false,
      isDeleted: u?.isDeleted ?? false,
      emailVerified: u?.profile?.emailVerified ?? false,
      phoneVerified: u?.profile?.phoneVerified ?? false,
      nidVerified: u?.profile?.nidVerified ?? false,
    })
  }, [userRes])

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((s) => ({ ...s, [key]: value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.email.trim()) {
      toast.error("Email is required")
      return
    }
    if (!form.roleId) {
      toast.error("Role is required")
      return
    }

    const tu = (v: string) => (v.trim() ? v.trim() : undefined)

    try {
      const res = await updateEmployee({
        id,
        data: {
          user: {
            email: form.email.trim(),
            mobile: tu(form.mobile),
            roleId: form.roleId || undefined,
            departmentId: form.departmentId || undefined,
            designationId: form.designationId || undefined,
            isActive: form.isActive,
            isVerified: form.isVerified,
            isBlocked: form.isBlocked,
            isDeleted: form.isDeleted,
          },
          profile: {
            name: tu(form.name),
            gender: (form.gender as "MALE" | "FEMALE" | "OTHER") || undefined,
            dob: form.dob || undefined,
            age: form.age ? Number(form.age) : undefined,
            bloodGroup: form.bloodGroup || undefined,
            nid: tu(form.nid),
            serialId: tu(form.serialId),
            photoId: form.photoId || undefined,
            nidPhotoIds: form.nidPhotoIds.length > 0 ? form.nidPhotoIds : undefined,
            emailVerified: form.emailVerified,
            phoneVerified: form.phoneVerified,
            nidVerified: form.nidVerified,
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
            workStartTime: tu(form.workStartTime),
            workTimeLimit: tu(form.workTimeLimit),
            availableTime: tu(form.availableTime),
          },
        },
      }).unwrap()
      if (res?.success) {
        toast.success(res.message || "Employee updated successfully")
      }
      navigate(ROUTES.EMPLOYEES.LIST)
    } catch (err: any) {
      toast.error(getErrorMessage(err, "Failed to update employee"))
    }
  }

  if (isFetching && !userRes) {
    return (
      <div className="space-y-5">
        <PageHeader title="Edit Employee" description="Loading employee details…" />
        <FormSkeleton fields={16} columns={2} />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <PageMeta title="Employee Edit" description="Manage Employee Edit in Muster ERP & CRM" />
      <PageHeader
        title="Edit Employee"
        description="Update personal, work, and organization details."
        actions={
          <Button variant="outline" asChild>
            <Link to={ROUTES.EMPLOYEES.LIST}>
              <ArrowLeft className="mr-1 size-4" /> Back to list
            </Link>
          </Button>
        }
      />

      <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-3">
        {/* ── Left column: main fields ── */}
        <div className="space-y-6 lg:col-span-2">

          {/* Personal Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserCircle2 className="size-4 text-primary" /> Personal Info
              </CardTitle>
              <CardDescription>Basic identification and contact details.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <FormField label="Full Name">
                <Input
                  value={form.name}
                  onChange={(e) => update("name", e.target.value)}
                  placeholder="e.g. Sujon Ahmed"
                />
              </FormField>
              <FormField label="Email" required>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type="email"
                    required
                    className="pl-9"
                    value={form.email}
                    onChange={(e) => update("email", e.target.value)}
                    placeholder="employee@company.com"
                  />
                </div>
              </FormField>
              <FormField label="Mobile">
                <div className="relative">
                  <Phone className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    className="pl-9"
                    value={form.mobile}
                    onChange={(e) => update("mobile", e.target.value)}
                    placeholder="+8801XXXXXXXXX"
                  />
                </div>
              </FormField>
              <FormField label="Gender">
                <Combobox
                  value={form.gender}
                  onChange={(value) => update("gender", value)}
                  placeholder="Select gender"
                  options={[
                    { value: "MALE", label: "Male" },
                    { value: "FEMALE", label: "Female" },
                    { value: "OTHER", label: "Other" },
                  ]}
                />
              </FormField>
              <FormField label="Date of Birth">
                <Input
                  type="date"
                  value={form.dob}
                  onChange={(e) => {
                    const newDob = e.target.value
                    update("dob", newDob)
                    if (newDob) {
                      const ageDiffMs = Date.now() - new Date(newDob).getTime()
                      const ageDate = new Date(ageDiffMs)
                      const calculatedAge = Math.abs(ageDate.getUTCFullYear() - 1970)
                      update("age", String(calculatedAge))
                    } else {
                      update("age", "")
                    }
                  }}
                  onClick={(e) => {
                    try {
                      if ("showPicker" in e.currentTarget) e.currentTarget.showPicker()
                    } catch (_e) {
                      console.log(_e)
                    }
                  }}
                  className="cursor-pointer relative [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0 [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:cursor-pointer"
                />
              </FormField>
              <FormField label="Age">
                <Input
                  type="number"
                  min={1}
                  max={100}
                  value={form.age}
                  onChange={(e) => update("age", e.target.value)}
                  placeholder="e.g. 28"
                  readOnly
                  className="bg-muted text-muted-foreground cursor-not-allowed"
                />
              </FormField>
              <FormField label="Blood Group">
                <Combobox
                  value={form.bloodGroup}
                  onChange={(value) => update("bloodGroup", value)}
                  placeholder="Select blood group"
                  options={BLOOD_GROUPS.map((b) => ({
                    value: b,
                    label: b.replace("_", " ").replace("POSITIVE", "+").replace("NEGATIVE", "−"),
                  }))}
                />
              </FormField>
              <FormField label="NID Number">
                <div className="relative">
                  <IdCard className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    className="pl-9"
                    value={form.nid}
                    onChange={(e) => update("nid", e.target.value)}
                    placeholder="National ID number"
                  />
                </div>
              </FormField>
              <FormField label="Serial ID">
                <Input
                  value={form.serialId}
                  onChange={(e) => update("serialId", e.target.value)}
                  placeholder="Employee serial / ref ID"
                />
              </FormField>

              {/* Profile Photo */}
              <div className="sm:col-span-2">
                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Profile Photo</label>
                    <MediaPicker
                      value={form.photoId}
                      onChange={(id) => update("photoId", id as string)}
                      label="Upload Photo"
                      category="single"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">NID Photos <span className="text-xs text-muted-foreground">(multiple)</span></label>
                    <MediaPicker
                      value={form.nidPhotoIds}
                      onChange={(ids) => {
                        const newIds = ids as string[]
                        if (newIds.length > 2) {
                          toast.error("You can select a maximum of 2 NID photos.")
                          return
                        }
                        update("nidPhotoIds", newIds)
                      }}
                      label="Upload NID Images"
                      category="multi"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Address */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="size-4 text-primary" /> Address
              </CardTitle>
              <CardDescription>Where the employee is based.</CardDescription>
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

          {/* Work Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="size-4 text-primary" /> Work Info
              </CardTitle>
              <CardDescription>Used by reports, rostering and schedules.</CardDescription>
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
              <FormField label="Work Start Time">
                <div className="relative">
                  <Clock className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type="time"
                    className="cursor-pointer pl-9 relative [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0 [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:cursor-pointer"
                    value={form.workStartTime}
                    onChange={(e) => update("workStartTime", e.target.value)}
                    onClick={(e) => {
                      try {
                        if ("showPicker" in e.currentTarget) e.currentTarget.showPicker()
                      } catch (_) {
                        /* ignore */
                      }
                    }}
                  />
                </div>
              </FormField>
              <FormField label="Work Time Limit">
                <Input
                  value={form.workTimeLimit}
                  onChange={(e) => update("workTimeLimit", e.target.value)}
                  placeholder="e.g. 8 hours"
                />
              </FormField>
              <FormField label="Available Time">
                <Input
                  value={form.availableTime}
                  onChange={(e) => update("availableTime", e.target.value)}
                  placeholder="e.g. 9 AM – 6 PM"
                />
              </FormField>
            </CardContent>
          </Card>

          {/* Verification flags */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BadgeCheck className="size-4 text-primary" /> Verification Status
              </CardTitle>
              <CardDescription>Mark what has been verified for this employee.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3 sm:grid-cols-3">
              <SwitchRow
                id="emailVerified"
                label="Email Verified"
                description="Email confirmed"
                checked={form.emailVerified}
                onCheckedChange={(v) => update("emailVerified", v)}
                color="success"
              />
              <SwitchRow
                id="phoneVerified"
                label="Phone Verified"
                description="Mobile confirmed"
                checked={form.phoneVerified}
                onCheckedChange={(v) => update("phoneVerified", v)}
                color="success"
              />
              <SwitchRow
                id="nidVerified"
                label="NID Verified"
                description="National ID confirmed"
                checked={form.nidVerified}
                onCheckedChange={(v) => update("nidVerified", v)}
                color="success"
              />
            </CardContent>
          </Card>
        </div>

        {/* ── Right column: org + flags ── */}
        <div className="space-y-6">
          {/* Organization */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="size-4 text-primary" /> Organization
              </CardTitle>
              <CardDescription>Set the role, department and designation.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <FormField label="Role" required>
                {isSuperAdmin ? (
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 rounded-md border border-amber-200 bg-amber-50 px-3 py-2.5 dark:border-amber-800 dark:bg-amber-950/30">
                      <Shield className="size-4 shrink-0 text-amber-500" />
                      <span className="text-sm font-medium text-amber-700 dark:text-amber-400">
                        Super Admin
                      </span>
                      <span className="ml-auto rounded-full bg-amber-100 px-2 py-0.5 text-xs text-amber-600 dark:bg-amber-900/50 dark:text-amber-400">
                        Protected
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Super Admin role cannot be changed from this page.
                    </p>
                  </div>
                ) : (
                  <Combobox
                    value={form.roleId}
                    onChange={(value) => update("roleId", value)}
                    placeholder="Select role"
                    options={roles.map((r) => ({ value: r.id, label: r.role ?? "—" }))}
                    onAddNew={() => setRoleModalOpen(true)}
                    addNewLabel="Add new"
                    onViewAll={() => window.open(ROUTES.EMPLOYEES.ROLES, "_blank")}
                    viewAllLabel="All roles"
                  />
                )}
              </FormField>
              <FormField label="Department">
                <Combobox
                  value={form.departmentId}
                  onChange={(value) => update("departmentId", value)}
                  placeholder="Select department"
                  options={departments.map((d) => ({ value: d.id, label: d.name ?? "—" }))}
                  onAddNew={() => setDeptModalOpen(true)}
                  addNewLabel="Add new"
                  onViewAll={() => window.open(ROUTES.EMPLOYEES.DEPARTMENTS, "_blank")}
                  viewAllLabel="All departments"
                />
              </FormField>
              <FormField label="Designation">
                <Combobox
                  value={form.designationId}
                  onChange={(value) => update("designationId", value)}
                  placeholder="Select designation"
                  options={designations.map((d) => ({ value: d.id, label: d.name }))}
                  onAddNew={() => setDesigModalOpen(true)}
                  addNewLabel="Add new"
                  onViewAll={() => window.open(ROUTES.EMPLOYEES.DESIGNATIONS, "_blank")}
                  viewAllLabel="All designations"
                />
              </FormField>
            </CardContent>
          </Card>

          {/* Account Flags */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="size-4 text-primary" /> Account Control
              </CardTitle>
              <CardDescription>Admin-only flags to control account access.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3">
              <SwitchRow
                id="isActive"
                label="Active Account"
                description="Allow this employee to sign in"
                checked={form.isActive}
                onCheckedChange={(v) => update("isActive", v)}
                color="success"
              />
              <SwitchRow
                id="isVerified"
                label="Email Verified"
                description="Account email is verified"
                checked={form.isVerified}
                onCheckedChange={(v) => update("isVerified", v)}
                color="success"
              />
              <SwitchRow
                id="isBlocked"
                label="Blocked"
                description="Prevent all login attempts"
                checked={form.isBlocked}
                onCheckedChange={(v) => update("isBlocked", v)}
                color="danger"
              />
              <SwitchRow
                id="isDeleted"
                label="Soft Deleted"
                description="Mark as deleted without removing data"
                checked={form.isDeleted}
                onCheckedChange={(v) => update("isDeleted", v)}
                color="warning"
              />
            </CardContent>
          </Card>

          <div className="flex gap-2">
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading ? (
                <><Loader2 className="size-4 animate-spin" /> Updating…</>
              ) : (
                <><Save className="size-4" /> Update Employee</>
              )}
            </Button>
          </div>
        </div>
      </form>

      <RoleFormModal open={roleModalOpen} onOpenChange={setRoleModalOpen} onCreated={(role) => update("roleId", role.id)} />
      <DepartmentFormModal open={deptModalOpen} onOpenChange={setDeptModalOpen} onCreated={(dept) => update("departmentId", dept.id)} />
      <DesignationFormModal open={desigModalOpen} onOpenChange={setDesigModalOpen} onCreated={(d) => update("designationId", d.id)} />
    </div>
  )
}
