import { Image as ImageIcon } from "lucide-react"
import { ModulePlaceholder ,

  PageMeta,
} from "@/components/shared"

export default function MediaLibraryPage() {
  return (
    <>
      <PageMeta title="Media Library" description="Manage Media Library in Muster ERP & CRM" />
      <ModulePlaceholder
        title="Media Library"
        description="Manage all uploaded files and images."
        icon={ImageIcon}
      />
    </>
  )
}
