import { Bell } from "lucide-react"
import { ModulePlaceholder ,
  SEO,
} from "@/components/shared"

export default function NotificationListPage() {
  return (
    <>
      <SEO title="Notification List" />
      <ModulePlaceholder
      title="Notifications"
      description="System and user notifications history."
      icon={Bell}
    />
  )
}
