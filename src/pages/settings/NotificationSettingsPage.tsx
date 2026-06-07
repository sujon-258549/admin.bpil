import { 
  PageMeta,
} from "@/components/shared"
import PageHeader from "@/components/common/page-header"
import { NotificationSettings } from "./NotificationSettings"

export default function NotificationSettingsPage() {
  return (
    <div className="space-y-6">
      <PageMeta title="Notification Settings" description="Manage notification preferences" />
      <PageHeader title="Notification Settings" description="Configure alerts and sounds" />
      <NotificationSettings />
    </div>
  )
}
