import { Wrench } from "lucide-react"
import { ModulePlaceholder ,
  SEO,
} from "@/components/shared"

export default function WorkTypeListPage() {
  return (
    <>
      <SEO title="Work Type List" />
      <ModulePlaceholder
      title="Work Types"
      description="Manage the types of work an employee or contractor can perform."
      icon={Wrench}
    />
  )
}
