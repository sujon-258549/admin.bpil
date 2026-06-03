import { FolderTree } from "lucide-react"
import { ModulePlaceholder ,
  SEO,
} from "@/components/shared"

export default function SubCategoryListPage() {
  return (
    <>
      <SEO title="Sub Category List" />
      <ModulePlaceholder
      title="Sub Categories"
      description="Nested categories that belong to a parent category."
      icon={FolderTree}
    />
  )
}
