import {
  User as UserIcon,
  Mail,
  Phone,
  MapPin,
  Building,
  Briefcase,
  CalendarDays,
  Droplet,
  CreditCard,
  BadgeCheck,
  Clock,
} from "lucide-react"
import { Image, PageHeader, PageMeta } from "@/components/shared"
import { useGetMyDataQuery } from "@/redux/features/users/users-api"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType
  label: string
  value?: string | null
}) {
  return (
    <div className="flex items-start gap-3">
      <Icon className="size-4 text-muted-foreground mt-0.5 shrink-0" />
      <div className="min-w-0">
        <p className="text-xs font-medium text-muted-foreground">{label}</p>
        <p className="text-sm font-medium truncate">{value || "—"}</p>
      </div>
    </div>
  )
}

function SectionCard({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <div className="rounded-xl border bg-card text-card-foreground shadow-sm">
      <div className="px-6 py-4 border-b">
        <h3 className="font-semibold">{title}</h3>
      </div>
      <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-5">{children}</div>
    </div>
  )
}

export default function YourProfile() {
  const { data: response, isLoading } = useGetMyDataQuery()
  const user = response?.data

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageMeta title="Your Profile" description="View your profile information" />
        <PageHeader title="Your Profile" description="Manage your personal information and settings." />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton className="h-72 rounded-xl" />
          <Skeleton className="h-72 rounded-xl md:col-span-2" />
        </div>
      </div>
    )
  }

  if (!user) {
    return <div>Failed to load profile.</div>
  }

  const formatDob = (dob?: string | null) => {
    if (!dob) return null
    try {
      return new Date(dob).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    } catch {
      return dob
    }
  }

  const formatBloodGroup = (bg?: string | null) =>
    bg
      ? bg.replace("_POSITIVE", " +").replace("_NEGATIVE", " −")
      : null

  const fullAddress = [user.upazila, user.district, user.division]
    .filter(Boolean)
    .join(", ")

  return (
    <div className="space-y-6 max-w-5xl">
      <PageMeta title="Your Profile" description="View your profile information" />
      <PageHeader
        title="Your Profile"
        description="View your personal information and settings."
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="rounded-xl border bg-card text-card-foreground shadow-sm overflow-hidden h-max">
          <div className="h-24 bg-gradient-to-br from-primary/30 via-primary/10 to-transparent" />
          <div className="px-6 pb-6 relative">
            {/* Avatar */}
            <div className="size-24 rounded-full border-4 border-background bg-muted flex items-center justify-center -mt-12 mb-4 mx-auto shrink-0 overflow-hidden shadow-md">
              <Image
                preview={true}
                imageId={user.photoId}
                className="w-full h-full object-cover"
                alt={user.name}
              />
            </div>

            <div className="text-center space-y-2">
              <h2 className="text-xl font-bold">{user.name || "Unknown"}</h2>
              <Badge variant="secondary" className="capitalize">
                {(user.roleName || user.role || "User").replace(/_/g, " ").toLowerCase()}
              </Badge>

              {user.email && (
                <p className="text-xs text-muted-foreground break-all">{user.email}</p>
              )}
              {user.mobile && (
                <p className="text-xs text-muted-foreground">{user.mobile}</p>
              )}
            </div>

            {/* Status badges */}
            <div className="mt-4 flex flex-wrap gap-2 justify-center">
              {user.isActive && (
                <span className="inline-flex items-center gap-1 text-xs bg-emerald-500/10 text-emerald-600 rounded-full px-2 py-0.5 font-medium">
                  <BadgeCheck className="size-3" /> Active
                </span>
              )}
              {user.isVerified && (
                <span className="inline-flex items-center gap-1 text-xs bg-blue-500/10 text-blue-600 rounded-full px-2 py-0.5 font-medium">
                  <BadgeCheck className="size-3" /> Verified
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="md:col-span-2 space-y-6">
          <SectionCard title="Personal Information">
            <InfoRow icon={Mail} label="Email Address" value={user.email} />
            <InfoRow icon={Phone} label="Mobile Number" value={user.mobile} />
            <InfoRow icon={UserIcon} label="Gender" value={user.gender?.toLowerCase()} />
            <InfoRow
              icon={Droplet}
              label="Blood Group"
              value={formatBloodGroup(user.bloodGroup)}
            />
            <InfoRow
              icon={CalendarDays}
              label="Date of Birth"
              value={formatDob(user.dob) || "—"}
            />
            <InfoRow icon={CreditCard} label="NID" value={user.nid} />
          </SectionCard>

          <SectionCard title="Work Information">
            <InfoRow icon={Building} label="Department" value={user.departmentName} />
            <InfoRow icon={Briefcase} label="Designation" value={user.designationName} />
            <InfoRow icon={MapPin} label="Branch" value={user.branchName} />
            <InfoRow icon={Clock} label="Experience" value={user.experience} />
          </SectionCard>

          {(user.division || user.district || user.upazila || user.address) && (
            <SectionCard title="Address">
              <InfoRow icon={MapPin} label="Division" value={user.division} />
              <InfoRow icon={MapPin} label="District" value={user.district} />
              <InfoRow icon={MapPin} label="Upazila" value={user.upazila} />
              <div className="sm:col-span-2">
                <InfoRow
                  icon={MapPin}
                  label="Full Address"
                  value={user.address || fullAddress || undefined}
                />
              </div>
            </SectionCard>
          )}
        </div>
      </div>
    </div>
  )
}
