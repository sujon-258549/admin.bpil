import { Bell } from "lucide-react"
import { ModulePlaceholder ,

  PageMeta,
} from "@/components/shared"

export default function NotificationListPage() {
  return (
    <>
      <PageMeta title="Notification List" description="Manage Notification List in Muster ERP & CRM" />
      <ModulePlaceholder
        title="Notifications"
        description="View and manage system alerts."
        icon={Bell}
      />
    </>
  )
}
