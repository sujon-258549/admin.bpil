import { Users } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Image } from "@/components/shared"

interface TeamMemberViewModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  member: any
}

export function TeamMemberViewModal({ open, onOpenChange, member }: TeamMemberViewModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Team Member Details</DialogTitle>
        </DialogHeader>
        {member && (
          <div className="space-y-6 pt-4">
            <div className="flex items-center gap-4">
              {member.imageId ? (
                <Image
                  imageId={member.imageId}
                  alt={member.name || "Photo"}
                  className="h-20 w-20 rounded-md object-cover border border-border/50"
                />
              ) : (
                <div className="flex h-20 w-20 items-center justify-center rounded-md bg-muted text-muted-foreground border border-border/50">
                  <Users className="size-10" />
                </div>
              )}
              <div>
                <h4 className="text-xl font-bold text-foreground">{member.name || "Unnamed"}</h4>
                <p className="text-sm font-medium text-muted-foreground">{member.role || "No Role Specified"}</p>
                <span className={`inline-block mt-2 px-2 py-0.5 rounded text-xs font-semibold ${member.isActive ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"}`}>
                  {member.isActive ? "Active" : "Inactive"}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 border-t pt-4 text-sm">
              <div>
                <span className="block font-semibold text-muted-foreground">Email Address</span>
                <span className="text-foreground">{member.email || "—"}</span>
              </div>
              <div>
                <span className="block font-semibold text-muted-foreground">Mobile Number</span>
                <span className="text-foreground">{member.mobile || "—"}</span>
              </div>
              <div>
                <span className="block font-semibold text-muted-foreground">Display Serial</span>
                <span className="text-foreground">{member.serial ?? 0}</span>
              </div>
              <div>
                <span className="block font-semibold text-muted-foreground">Joined At</span>
                <span className="text-foreground">{new Date(member.createdAt).toLocaleDateString()}</span>
              </div>
            </div>

            {member.bio && (
              <div className="border-t pt-4">
                <span className="block text-sm font-semibold text-muted-foreground mb-1">Brief Bio</span>
                <p className="text-sm text-foreground bg-muted/30 p-3 rounded-md border border-border/50 whitespace-pre-wrap">{member.bio}</p>
              </div>
            )}

            <div className="border-t pt-4 space-y-2">
              <span className="block text-sm font-semibold text-muted-foreground">Social Links</span>
              <div className="flex gap-3">
                {member.facebook && (
                  <a href={member.facebook} target="_blank" rel="noreferrer" className="text-sm text-blue-600 hover:underline">Facebook</a>
                )}
                {member.twitter && (
                  <a href={member.twitter} target="_blank" rel="noreferrer" className="text-sm text-sky-500 hover:underline">Twitter</a>
                )}
                {member.instagram && (
                  <a href={member.instagram} target="_blank" rel="noreferrer" className="text-sm text-pink-600 hover:underline">Instagram</a>
                )}
                {member.linkedin && (
                  <a href={member.linkedin} target="_blank" rel="noreferrer" className="text-sm text-blue-800 hover:underline">LinkedIn</a>
                )}
                {!member.facebook && !member.twitter && !member.instagram && !member.linkedin && (
                  <span className="text-sm text-muted-foreground">—</span>
                )}
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
