import { User as UserIcon, Mail, Phone, MapPin, Building, Briefcase } from "lucide-react"
import { PageHeader, PageMeta } from "@/components/shared"
import { useGetMyDataQuery } from "@/redux/features/users/users-api"
import { Skeleton } from "@/components/ui/skeleton"

export default function YourProfile() {
  const { data: response, isLoading } = useGetMyDataQuery()
  const user = response?.data

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageMeta title="Your Profile" description="View your profile information" />
        <PageHeader title="Your Profile" description="Manage your personal information and settings." />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton className="h-64 rounded-xl" />
          <Skeleton className="h-64 rounded-xl md:col-span-2" />
        </div>
      </div>
    )
  }

  if (!user) {
    return <div>Failed to load profile.</div>
  }

  return (
    <div className="space-y-6">
      <PageMeta title="Your Profile" description="View your profile information" />
      <PageHeader
        title="Your Profile"
        description="View your personal information and settings."
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="rounded-xl border bg-card text-card-foreground shadow-sm overflow-hidden h-max">
          <div className="h-24 bg-gradient-to-r from-primary/20 to-primary/5"></div>
          <div className="px-6 pb-6 relative">
            <div className="size-20 rounded-full border-4 border-background bg-muted flex items-center justify-center -mt-10 mb-4 mx-auto md:mx-0 shrink-0 overflow-hidden shadow-sm">
              {user.avatar ? (
                <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                <UserIcon className="size-8 text-muted-foreground" />
              )}
            </div>
            
            <div className="text-center md:text-left">
              <h2 className="text-xl font-bold">{user.name || "Unknown"}</h2>
              <p className="text-sm text-muted-foreground capitalize mt-1">
                {user.roleName || user.role || "User"}
              </p>
            </div>
          </div>
        </div>

        {/* Details Card */}
        <div className="md:col-span-2 space-y-6">
          <div className="rounded-xl border bg-card text-card-foreground shadow-sm">
            <div className="px-6 py-5 border-b">
              <h3 className="font-semibold text-lg">Personal Information</h3>
            </div>
            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-4">
              <div className="flex items-start gap-3">
                <Mail className="size-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Email Address</p>
                  <p className="text-sm text-muted-foreground">{user.email || "—"}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="size-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Mobile Number</p>
                  <p className="text-sm text-muted-foreground">{user.mobile || "—"}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <UserIcon className="size-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Gender</p>
                  <p className="text-sm text-muted-foreground capitalize">{user.gender || "—"}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <UserIcon className="size-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Blood Group</p>
                  <p className="text-sm text-muted-foreground">{user.bloodGroup || "—"}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-xl border bg-card text-card-foreground shadow-sm">
            <div className="px-6 py-5 border-b">
              <h3 className="font-semibold text-lg">Work Information</h3>
            </div>
            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-4">
              <div className="flex items-start gap-3">
                <Building className="size-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Department</p>
                  <p className="text-sm text-muted-foreground">{user.departmentName || "—"}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Briefcase className="size-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Designation</p>
                  <p className="text-sm text-muted-foreground">{user.designationName || "—"}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="size-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Branch</p>
                  <p className="text-sm text-muted-foreground">{user.branchName || "—"}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
