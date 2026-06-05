import { useState } from "react"
import { Bell, Check, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useGetNotificationsQuery, useMarkAllAsReadMutation, useMarkAsReadMutation } from "@/redux/features/notifications/notifications-api"
import { useNavigate } from "react-router-dom"

export function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false)
  const navigate = useNavigate()
  
  // Get token and socket from state/context if possible, but the app uses socket.io
  // We'll set up a global socket listener in the app layout, but for now we can
  // just poll or rely on the global socket to invalidate tags.
  // Assuming the global socket handler calls:
  // dispatch(baseApi.util.invalidateTags(["Notifications"]))

  const { data: notificationsData, isLoading } = useGetNotificationsQuery({
    limit: 20,
    sortBy: "createdAt",
    sortOrder: "desc",
  }, {
    // Polling as a fallback if socket is not available yet, otherwise socket will invalidate
    pollingInterval: 60000 
  })

  const [markAllAsRead, { isLoading: isMarkingRead }] = useMarkAllAsReadMutation()
  const [markAsRead] = useMarkAsReadMutation()

  const notifications = notificationsData?.data || []
  const unreadCount = notifications.filter((n: any) => !n.isRead).length

  const handleMarkAllRead = async () => {
    if (unreadCount === 0) return
    await markAllAsRead().unwrap()
  }

  const handleNotificationClick = async (notification: any) => {
    if (!notification.isRead) {
      await markAsRead(notification.id).unwrap()
    }
    setIsOpen(false)
    navigate("/notifications")
  }

  // Format date relative (e.g. "2 mins ago")
  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)
    
    if (diffInSeconds < 60) return "Just now"
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
    return `${Math.floor(diffInSeconds / 86400)}d ago`
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
            >
              {unreadCount > 99 ? "99+" : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <div className="flex items-center justify-between px-4 py-2">
          <DropdownMenuLabel className="font-semibold text-lg p-0">Notifications</DropdownMenuLabel>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 text-xs text-muted-foreground"
            onClick={handleMarkAllRead}
            disabled={unreadCount === 0 || isMarkingRead}
          >
            {isMarkingRead ? <Loader2 className="h-3 w-3 animate-spin mr-1" /> : <Check className="h-3 w-3 mr-1" />}
            Mark all read
          </Button>
        </div>
        <DropdownMenuSeparator />
        
        <ScrollArea className="h-[300px]">
          {isLoading ? (
            <div className="flex justify-center p-4">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : notifications.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground text-sm">
              <Bell className="h-8 w-8 mx-auto mb-2 opacity-20" />
              <p>No notifications yet</p>
            </div>
          ) : (
            <div className="flex flex-col gap-1 p-1">
              {notifications.map((notification: any) => (
                <DropdownMenuItem 
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification)}
                  className={`flex flex-col items-start gap-1 p-3 cursor-pointer ${
                    !notification.isRead ? "bg-primary/5" : ""
                  }`}
                >
                  <div className="flex items-center gap-2 w-full">
                    <span className="flex h-2 w-2 rounded-full bg-primary transition-opacity" style={{ opacity: notification.isRead ? 0 : 1 }} />
                    <span className="font-medium text-sm leading-none">{notification.type || "SYSTEM"}</span>
                    <span className="text-xs text-muted-foreground ml-auto">
                      {formatTimeAgo(notification.createdAt)}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2 pl-4">
                    {notification.message}
                  </p>
                </DropdownMenuItem>
              ))}
            </div>
          )}
        </ScrollArea>
        <DropdownMenuSeparator />
        <Button 
          variant="ghost" 
          className="w-full rounded-none justify-center h-10 text-primary hover:text-primary"
          onClick={() => {
            setIsOpen(false)
            navigate("/notifications")
          }}
        >
          View all notifications
        </Button>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
