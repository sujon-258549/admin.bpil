import { PageHeader ,

  PageMeta,
} from "@/components/shared"
import { WorkflowGuide } from "./workflow-guide"

export default function WorkflowPage() {
  return (
        <div className="space-y-6">
      <PageMeta title="Workflow" description="Manage Workflow in Muster ERP & CRM" />
      <PageHeader
        title="Workflow Guide"
        description="Platform Super Admin playbook — selling, onboarding, and operating a new company."
      />
      <div className="rounded-lg border bg-card p-6">
        <WorkflowGuide />
      </div>
    </div>
  )
}
