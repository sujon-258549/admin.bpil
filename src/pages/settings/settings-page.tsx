import { 
  PageMeta,
} from "@/components/shared"
import PageHeader from "@/components/common/page-header"

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <PageMeta title="Settings" description="Manage Settings in Muster ERP & CRM" />
      <PageHeader title="Settings" description="Workspace preferences and integrations" />
      
      <div className="grid gap-6">
        <div className="rounded-xl border bg-card text-card-foreground shadow-sm">
          <div className="px-6 py-4 border-b">
            <h3 className="font-semibold">General Settings</h3>
          </div>
          <div className="p-6 text-sm text-muted-foreground">
            More workspace settings will be available soon.
          </div>
        </div>
      </div>
    </div>
  )
}
