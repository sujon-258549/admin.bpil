import { FolderTree } from "lucide-react"
import { ModulePlaceholder ,

  PageMeta,
} from "@/components/shared"

export default function SubCategoryListPage() {
  return (
    <>
      <PageMeta title="Sub Category List" description="Manage Sub Category List in Muster ERP & CRM" />
      <ModulePlaceholder
        title="Subcategories"
        description="Nested categories for better organization."
        icon={FolderTree}
      />
    </>
  )
}
