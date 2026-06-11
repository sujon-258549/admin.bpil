import { useState } from "react"
import { 
  useGetNotificationsQuery, 
  useMarkAllAsReadMutation, 
  useMarkAsReadMutation 
} from "@/redux/features/notifications/notifications-api"
import { 
  PageMeta, 
  PageHeader, 
  DataTable, 
  EmptyState,
  DateRangeFilter,
  Text,
  type Column
} from "@/components/shared"
import { Button } from "@/components/ui/button"
import { Check, Bell, MessageSquare, ShieldAlert, Settings } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export default function NotificationsPage() {
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(20)
  
  // Date filter state
  const [startDate, setStartDate] = useState<string | undefined>()
  const [endDate, setEndDate] = useState<string | undefined>()

  const { data, isLoading, isFetching } = useGetNotificationsQuery({
    page,
    limit,
    sortBy: "createdAt",
    sortOrder: "desc",
    ...(startDate ? { startDate } : {}),
    ...(endDate ? { endDate } : {})
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

  const columns: Column<any>[] = [
    {
      key: "type",
      header: "Alert",
      cell: (n) => (
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-full ${!n.isRead ? 'bg-primary/10' : 'bg-muted/50'}`}>
            {getIcon(n.type)}
          </div>
          <div className="min-w-0">
            <div className={`truncate font-medium ${!n.isRead ? 'text-foreground' : 'text-muted-foreground'}`}>
              {n.type || "SYSTEM ALERT"}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: "message",
      header: "Message",
      cell: (n) => (
        <Text size="sm" className={`line-clamp-2 ${!n.isRead ? 'font-medium text-foreground' : 'text-muted-foreground'}`}>
          {n.message}
        </Text>
      ),
    },
    {
      key: "date",
      header: "Date Received",
      cell: (n) => (
        <Text size="sm" tone="muted">
          {new Date(n.createdAt).toLocaleString()}
        </Text>
      ),
    },
    {
      key: "status",
      header: "Status",
      cell: (n) => (
        n.isRead ? (
          <Badge variant="outline" className="text-muted-foreground">Read</Badge>
        ) : (
          <Badge variant="default" className="bg-primary/20 text-primary hover:bg-primary/30 border-transparent">New</Badge>
        )
      ),
    },
    {
      key: "actions",
      header: "Actions",
      align: "right",
      cell: (n) => (
        <div className="flex justify-end">
          {!n.isRead && (
            <Button 
              size="sm" 
              variant="ghost" 
              onClick={() => handleMarkAsRead(n.id, n.isRead)}
              className="text-primary hover:text-primary hover:bg-primary/10"
            >
              <Check className="h-4 w-4 mr-1" /> Mark Read
            </Button>
          )}
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <PageMeta title="Notifications | Admin Portal" description="All your notifications" />
      
      <PageHeader
        title="Notifications"
        description="View and manage all your alerts and messages."
        actions={
          <Button onClick={() => markAllAsRead().unwrap()} variant="outline">
            <Check className="mr-2 h-4 w-4" /> Mark all as read
          </Button>
        }
      />

      <div className="flex items-center gap-3">
        <DateRangeFilter 
          onRangeChange={(start: string | undefined, end: string | undefined) => {
            setStartDate(start);
            setEndDate(end);
            setPage(1); // Reset page on filter change
          }} 
        />
      </div>

      <DataTable<any>
        data={notifications}
        columns={columns}
        isLoading={isLoading && notifications.length === 0}
        isFetching={isFetching}
        empty={
          <EmptyState
            icon={Bell}
            title="You're all caught up!"
            description={startDate || endDate ? "No notifications found for the selected date range." : "No new notifications right now."}
          />
        }
        meta={meta}
        onPageChange={setPage}
        onPageSizeChange={(newSize) => {
          setLimit(newSize)
          setPage(1)
        }}
      />
    </div>
  )
}
