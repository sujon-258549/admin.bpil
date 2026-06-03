import { FolderTree } from "lucide-react"
import { ModulePlaceholder ,
  SEO,
} from "@/components/shared"

export default function CategoryListPage() {
  return (
    <>
      <SEO title="Category List" />
      <ModulePlaceholder
      title="Categories"
      description="Group products and services into top-level categories."
      icon={FolderTree}
    />
  )
}
