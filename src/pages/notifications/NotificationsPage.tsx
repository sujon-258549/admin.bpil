import { useState } from "react"
import { useGetNotificationsQuery, useMarkAllAsReadMutation, useMarkAsReadMutation } from "@/redux/features/notifications/notifications-api"
import { PageMeta } from "@/components/shared"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Check, Loader2, Bell, MessageSquare, ShieldAlert, Settings } from "lucide-react"

export default function NotificationsPage() {
  const [page, setPage] = useState(1)
  const { data, isLoading, isFetching } = useGetNotificationsQuery({
    page,
    limit: 50,
    sortBy: "createdAt",
    sortOrder: "desc"
  })

  const [markAllAsRead] = useMarkAllAsReadMutation()
  const [markAsRead] = useMarkAsReadMutation()

  const notifications = data?.data || []
  const meta = data?.meta

  const getIcon = (type: string) => {
    switch (type) {
      case "MESSAGE": return <MessageSquare className="h-5 w-5 text-blue-500" />
      case "SECURITY": return <ShieldAlert className="h-5 w-5 text-red-500" />
      case "SYSTEM": return <Settings className="h-5 w-5 text-zinc-500" />
      default: return <Bell className="h-5 w-5 text-primary" />
    }
  }

  const handleMarkAsRead = async (id: string, isRead: boolean) => {
    if (!isRead) {
      await markAsRead(id).unwrap()
    }
  }

  return (
    <>
      <PageMeta title="Notifications | Admin Portal" description="All your notifications" />
      
      <div className="flex flex-col gap-6 w-full max-w-5xl mx-auto py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
            <p className="text-muted-foreground mt-1">View and manage all your alerts and messages.</p>
          </div>
          <Button onClick={() => markAllAsRead().unwrap()} variant="outline">
            <Check className="mr-2 h-4 w-4" /> Mark all as read
          </Button>
        </div>

        <Card>
          <CardHeader className="border-b bg-muted/40 py-4">
            <CardTitle className="text-lg font-medium">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="flex justify-center p-8">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : notifications.length === 0 ? (
              <div className="text-center py-16 text-muted-foreground">
                <Bell className="h-12 w-12 mx-auto mb-4 opacity-20" />
                <h3 className="text-lg font-medium text-foreground">You're all caught up!</h3>
                <p>No new notifications right now.</p>
              </div>
            ) : (
              <div className="divide-y">
                {notifications.map((notification: any) => (
                  <div 
                    key={notification.id}
                    onClick={() => handleMarkAsRead(notification.id, notification.isRead)}
                    className={`flex gap-4 p-4 hover:bg-muted/50 cursor-pointer transition-colors ${!notification.isRead ? 'bg-primary/5' : ''}`}
                  >
                    <div className="mt-1">
                      {getIcon(notification.type)}
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <p className={`text-sm font-medium ${!notification.isRead ? 'text-foreground' : 'text-muted-foreground'}`}>
                          {notification.type || "SYSTEM ALERT"}
                        </p>
                        <span className="text-xs text-muted-foreground">
                          {new Date(notification.createdAt).toLocaleString()}
                        </span>
                      </div>
                      <p className={`text-sm ${!notification.isRead ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
                        {notification.message}
                      </p>
                    </div>
                    {!notification.isRead && (
                      <div className="flex items-center">
                        <div className="h-2 w-2 rounded-full bg-primary" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {meta && meta.total > 50 && (
          <div className="flex justify-center gap-2 mt-4">
            <Button 
              variant="outline" 
              disabled={page === 1 || isFetching}
              onClick={() => setPage(p => Math.max(1, p - 1))}
            >
              Previous
            </Button>
            <Button 
              variant="outline"
              disabled={page * 50 >= meta.total || isFetching}
              onClick={() => setPage(p => p + 1)}
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </>
  )
}
