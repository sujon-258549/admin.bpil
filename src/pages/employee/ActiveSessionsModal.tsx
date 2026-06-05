import { MonitorSmartphone, Laptop, Smartphone, Globe, LogOut } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Text } from "@/components/shared"
import { useForceLogoutSessionMutation } from "@/redux/features/users/users-api"
import { toast } from "sonner"
import { getErrorMessage } from "@/lib/errors"

interface Session {
  id: string
  os: string | null
  browser: string | null
  deviceType: string | null
  ipAddress: string | null
  loggedInAt: string | null
}

interface ActiveSessionsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  employeeName: string
  sessions: Session[]
}

export function ActiveSessionsModal({ open, onOpenChange, employeeName, sessions }: ActiveSessionsModalProps) {
  const [forceLogout, { isLoading }] = useForceLogoutSessionMutation()

  const handleLogout = async (sessionId: string) => {
    try {
      const res = await forceLogout(sessionId).unwrap()
      if (res?.success) {
        toast.success(res.message || "Session logged out successfully")
      }
    } catch (err: any) {
      toast.error(getErrorMessage(err, "Failed to log out session"))
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MonitorSmartphone className="size-5" />
            Active Sessions for {employeeName}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 mt-4">
          {sessions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No active sessions found.</p>
            </div>
          ) : (
            sessions.map((s) => (
              <div key={s.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg gap-4 bg-muted/20">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-primary/10 rounded-full shrink-0">
                    {s.deviceType === "Mobile" ? (
                      <Smartphone className="size-5 text-primary" />
                    ) : (
                      <Laptop className="size-5 text-primary" />
                    )}
                  </div>
                  <div>
                    <Text className="font-medium">
                      {s.os || "Unknown OS"} • {s.browser || "Unknown Browser"}
                    </Text>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Globe className="size-3.5" />
                        {s.ipAddress || "Unknown IP"}
                      </span>
                      <span>
                        Logged in: {s.loggedInAt ? new Date(s.loggedInAt).toLocaleString() : "Unknown time"}
                      </span>
                    </div>
                  </div>
                </div>
                <Button 
                  variant="destructive" 
                  size="sm" 
                  onClick={() => handleLogout(s.id)}
                  disabled={isLoading}
                  className="shrink-0 w-full sm:w-auto"
                >
                  <LogOut className="size-4 mr-1.5" />
                  Force Logout
                </Button>
              </div>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
