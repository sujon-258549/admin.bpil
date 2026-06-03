import { FolderTree } from "lucide-react"
import { ModulePlaceholder ,

  PageMeta,
} from "@/components/shared"

export default function CategoryListPage() {
  return (
    <>
      <PageMeta title="Category List" description="Manage Category List in Muster ERP & CRM" />
      <ModulePlaceholder
        title="Categories"
        description="Group products and services into top-level categories."
        icon={FolderTree}
      />
    </>
  )
}
