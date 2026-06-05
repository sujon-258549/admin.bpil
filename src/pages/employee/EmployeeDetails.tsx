import { Link, useParams } from "react-router-dom"
import {
  ArrowLeft,
  BadgeCheck,
  Briefcase,
  Building2,
  Calendar,
  Clock,
  Droplets,
  Edit,
  IdCard,
  Mail,
  MapPin,
  Phone,
  Shield,
  User,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Image, PageHeader, PageMeta, StatusBadge, Text, pickEmployeeTone } from "@/components/shared"
import { FormSkeleton } from "@/components/skeleton"
import { useEmployee } from "@/hooks/data-fetch"
import { ROUTES } from "@/config/paths"
import { shortId } from "@/lib/format"

/* ─── tiny helper components ─────────────────────────────────────────────── */

function Section({
  icon: Icon,
  title,
  children,
}: {
  icon: React.ElementType
  title: string
  children: React.ReactNode
}) {
  return (
    <div className="rounded-xl border bg-card">
      <div className="flex items-center gap-2.5 border-b px-5 py-3.5">
        <Icon className="size-4 text-primary" />
        <h3 className="text-sm font-semibold">{title}</h3>
      </div>
      <div className="p-5">{children}</div>
    </div>
  )
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[160px_1fr] gap-2 py-2 border-b last:border-b-0">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-sm font-medium break-words">{value || <span className="text-muted-foreground/50">—</span>}</span>
    </div>
  )
}

function BoolBadge({ value, trueLabel = "Yes", falseLabel = "No" }: { value: boolean; trueLabel?: string; falseLabel?: string }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
      value
        ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
        : "bg-muted text-muted-foreground"
    }`}>
      {value ? trueLabel : falseLabel}
    </span>
  )
}

/* ─── main page ──────────────────────────────────────────────────────────── */

export default function EmployeeDetailsPage() {
  const { id = "" } = useParams<{ id: string }>()
  const { useGetEmployeeById } = useEmployee()
  const { data: res, isLoading } = useGetEmployeeById(id, { skip: !id })

  const u = res?.data as any

  if (isLoading && !res) {
    return (
      <div className="space-y-5">
        <PageHeader title="Employee Details" description="Loading…" />
        <FormSkeleton fields={12} columns={2} />
      </div>
    )
  }

  if (!u) return null

  const profile    = u?.profile   ?? {}
  const address    = u?.address   ?? {}
  const workInfo   = u?.workInfo  ?? {}
  const role       = u?.role
  const dept       = u?.department
  const desig      = u?.designation
  const nidPhotos  = (profile?.nidPhotos ?? []) as any[]
  const isSuperAdmin = String(role?.role ?? "").toLowerCase().includes("super")

  const bloodLabel = (bg: string) =>
    bg?.replace("_", " ").replace("POSITIVE", "+").replace("NEGATIVE", "−")

  return (
    <div className="space-y-6">
      <PageMeta
        title={`${profile?.name ?? "Employee"} — Details`}
        description="Full employee details"
      />
      <PageHeader
        title="Employee Details"
        description="Complete information for this employee."
        actions={
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link to={ROUTES.EMPLOYEES.LIST}>
                <ArrowLeft className="mr-1 size-4" /> Back
              </Link>
            </Button>
            <Button asChild>
              <Link to={ROUTES.EMPLOYEES.EDIT(id)}>
                <Edit className="mr-1 size-4" /> Edit
              </Link>
            </Button>
          </div>
        }
      />

      {/* ── Profile banner ── */}
      <div className="rounded-xl border bg-card">
        <div className="flex flex-col items-center gap-5 p-6 sm:flex-row sm:items-start">
          {/* Avatar */}
          <div className="size-24 shrink-0 overflow-hidden rounded-full border-4 border-background bg-muted">
            {u?.profile?.photoId ? (
              <Image
                imageId={u.profile.photoId}
                alt={profile?.name ?? "Employee"}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-primary/10 text-3xl font-bold text-primary">
                {(profile?.name ?? "?")[0]?.toUpperCase()}
              </div>
            )}
          </div>

          {/* Core info */}
          <div className="flex-1 space-y-2 text-center sm:text-left">
            <div className="flex flex-col items-center gap-2 sm:flex-row">
              <h2 className="text-2xl font-bold">{profile?.name ?? "—"}</h2>
              {isSuperAdmin ? (
                <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                  Super Admin
                </span>
              ) : (
                <StatusBadge tone={pickEmployeeTone(u)} />
              )}
            </div>
            <Text tone="muted" size="sm">
              {desig?.name ?? ""}{desig?.name && dept?.name ? " · " : ""}{dept?.name ?? ""}
            </Text>
            <div className="flex flex-wrap justify-center gap-3 pt-1 sm:justify-start">
              <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <Mail className="size-3.5" /> {u?.email ?? "—"}
              </span>
              {u?.mobile && (
                <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Phone className="size-3.5" /> {u.mobile}
                </span>
              )}
              <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <IdCard className="size-3.5" /> {shortId(u?.id)}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        {/* ── Left: main data ── */}
        <div className="space-y-5 lg:col-span-2">

          {/* Personal */}
          <Section icon={User} title="Personal Information">
            <Row label="Full Name" value={profile?.name} />
            <Row label="Email" value={u?.email} />
            <Row label="Mobile" value={u?.mobile} />
            <Row label="Gender" value={profile?.gender ? profile.gender.charAt(0) + profile.gender.slice(1).toLowerCase() : undefined} />
            <Row label="Date of Birth" value={profile?.dob ? new Date(profile.dob).toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" }) : undefined} />
            <Row label="Age" value={profile?.age ? `${profile.age} years` : undefined} />
            <Row label="Blood Group" value={profile?.bloodGroup ? (
              <span className="inline-flex items-center gap-1.5">
                <Droplets className="size-3.5 text-red-500" />
                {bloodLabel(profile.bloodGroup)}
              </span>
            ) : undefined} />
            <Row label="NID Number" value={profile?.nid} />
            <Row label="Serial ID" value={profile?.serialId} />
          </Section>

          {/* Address */}
          <Section icon={MapPin} title="Address">
            <Row label="Division" value={address?.division} />
            <Row label="District" value={address?.district} />
            <Row label="Upazila" value={address?.upazila} />
            <Row label="Full Address" value={address?.address} />
          </Section>

          {/* Work Info */}
          <Section icon={Briefcase} title="Work Information">
            <Row label="Experience" value={workInfo?.experience} />
            <Row label="Work Type" value={workInfo?.workType} />
            <Row label="Work Start Time" value={workInfo?.workStartTime ? (
              <span className="flex items-center gap-1.5">
                <Clock className="size-3.5 text-muted-foreground" />
                {workInfo.workStartTime}
              </span>
            ) : undefined} />
            <Row label="Work Time Limit" value={workInfo?.workTimeLimit} />
            <Row label="Available Time" value={workInfo?.availableTime} />
          </Section>

          {/* NID Photos */}
          {nidPhotos.length > 0 && (
            <Section icon={IdCard} title={`NID Photos (${nidPhotos.length})`}>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                {nidPhotos.map((img: any) => (
                  <div
                    key={img.id}
                    className="overflow-hidden rounded-lg border bg-muted aspect-[4/3]"
                  >
                    <Image
                      imageId={img.id}
                      alt="NID"
                      preview
                      className="h-full w-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </Section>
          )}
        </div>

        {/* ── Right: org + flags ── */}
        <div className="space-y-5">

          {/* Organization */}
          <Section icon={Building2} title="Organization">
            <Row label="Role" value={role?.role ? (
              <span className="inline-flex items-center gap-1.5 capitalize">
                {isSuperAdmin && <Shield className="size-3.5 text-amber-500" />}
                {role.role.replace(/-/g, " ")}
              </span>
            ) : undefined} />
            <Row label="Department" value={dept?.name} />
            <Row label="Designation" value={desig?.name} />
          </Section>

          {/* Account Status */}
          <Section icon={Shield} title="Account Status">
            <Row label="Active" value={<BoolBadge value={u?.isActive} trueLabel="Active" falseLabel="Inactive" />} />
            <Row label="Verified" value={<BoolBadge value={u?.isVerified} trueLabel="Verified" falseLabel="Not Verified" />} />
            <Row label="Blocked" value={<BoolBadge value={u?.isBlocked} trueLabel="Blocked" falseLabel="Not Blocked" />} />
            <Row label="Deleted" value={<BoolBadge value={u?.isDeleted} trueLabel="Deleted" falseLabel="Active" />} />
            <Row label="Login Count" value={u?.loginCount ?? 0} />
            <Row label="Last Login" value={u?.lastLogin ? new Date(u.lastLogin).toLocaleString("en-GB") : undefined} />
            <Row label="Password Changed" value={<BoolBadge value={u?.passwordChanged} trueLabel="Yes" falseLabel="No" />} />
            <Row label="Password Changed At" value={u?.passwordChangeTime ? new Date(u.passwordChangeTime).toLocaleString("en-GB") : undefined} />
            <Row label="Joined" value={u?.createdAt ? new Date(u.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" }) : undefined} />
          </Section>

          {/* Verification */}
          <Section icon={BadgeCheck} title="Verification Status">
            <Row label="Email Verified" value={<BoolBadge value={profile?.emailVerified} trueLabel="Verified" falseLabel="Pending" />} />
            <Row label="Phone Verified" value={<BoolBadge value={profile?.phoneVerified} trueLabel="Verified" falseLabel="Pending" />} />
            <Row label="NID Verified" value={<BoolBadge value={profile?.nidVerified} trueLabel="Verified" falseLabel="Pending" />} />
          </Section>

          {/* Device / Session */}
          <Section icon={Calendar} title="Session Info">
            <Row label="Current Device" value={u?.currentDeviceName} />
            <Row label="Device Type" value={u?.currentDeviceType} />
            <Row label="IP Address" value={u?.currentIpAddress} />
          </Section>
        </div>
      </div>
    </div>
  )
}
