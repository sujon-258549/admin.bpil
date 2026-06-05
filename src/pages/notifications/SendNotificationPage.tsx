import { useState } from "react"
import { useCreateNotificationMutation } from "@/redux/features/notifications/notifications-api"
import { PageMeta } from "@/components/shared"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Loader2, Send } from "lucide-react"
import { toast } from "sonner"

export default function SendNotificationPage() {
  const [createNotification, { isLoading }] = useCreateNotificationMutation()

  const [type, setType] = useState("SYSTEM")
  const [message, setMessage] = useState("")
  const [sendToAll, setSendToAll] = useState(true)
  const [userIds, setUserIds] = useState("")

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (message.length < 5) {
      toast.error("Message must be at least 5 characters")
      return
    }

    try {
      const payload: any = {
        type,
        message,
      }

      if (sendToAll) {
        payload.sendToAll = true
      } else {
        if (!userIds.trim()) {
          toast.error("Please provide at least one User ID")
          return
        }
        payload.userIds = userIds.split(",").map(id => id.trim()).filter(Boolean)
      }

      const res = await createNotification(payload).unwrap()
      toast.success(`Notification sent successfully to ${res.data?.count || "users"}!`)
      
      setMessage("")
      setUserIds("")
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to send notification")
    }
  }

  return (
    <>
      <PageMeta title="Send Notification | Admin Portal" description="Broadcast a notification to users" />
      
      <div className="flex flex-col gap-6 w-full max-w-3xl mx-auto py-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Broadcast Notification</h1>
          <p className="text-muted-foreground mt-1">Send a manual push notification to users.</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Compose Notification</CardTitle>
            <CardDescription>
              Fill out the details below to send an instant alert.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={onSubmit} className="space-y-6">
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Notification Type</label>
                <select 
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={type} 
                  onChange={(e) => setType(e.target.value)}
                >
                  <option value="SYSTEM">System Alert</option>
                  <option value="SECURITY">Security Alert</option>
                  <option value="MESSAGE">Direct Message</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Message Content</label>
                <Textarea 
                  placeholder="Type the notification message here..." 
                  className="min-h-[120px] resize-none"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                />
              </div>

              <div className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <Checkbox
                  id="sendToAll"
                  checked={sendToAll}
                  onCheckedChange={(checked) => setSendToAll(checked === true)}
                />
                <div className="space-y-1 leading-none">
                  <label htmlFor="sendToAll" className="text-sm font-medium leading-none cursor-pointer">
                    Broadcast to all users
                  </label>
                  <p className="text-sm text-muted-foreground">
                    If checked, this notification will be sent to every registered user in the system.
                  </p>
                </div>
              </div>

              {!sendToAll && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Target User IDs</label>
                  <Input 
                    placeholder="user-id-1, user-id-2" 
                    value={userIds}
                    onChange={(e) => setUserIds(e.target.value)}
                  />
                  <p className="text-[0.8rem] text-muted-foreground">
                    Provide comma-separated User IDs to send specifically to them.
                  </p>
                </div>
              )}

              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Send className="mr-2 h-4 w-4" />
                )}
                Send Notification
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
