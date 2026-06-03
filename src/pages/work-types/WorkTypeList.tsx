import { Briefcase } from "lucide-react"
import { ModulePlaceholder ,

  PageMeta,
} from "@/components/shared"

export default function WorkTypeListPage() {
  return (
    <>
      <PageMeta title="Work Type List" description="Manage Work Type List in Muster ERP & CRM" />
      <ModulePlaceholder
        title="Work Types"
        description="Define standard types of work and shifts."
        icon={Briefcase}
      />
    </>
  )
}
