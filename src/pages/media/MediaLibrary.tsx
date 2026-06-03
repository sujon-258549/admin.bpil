import { Image } from "lucide-react"
import { ModulePlaceholder ,
  SEO,
} from "@/components/shared"

export default function MediaLibraryPage() {
  return (
    <>
      <SEO title="Media Library" />
      <ModulePlaceholder
      title="Media Library"
      description="Upload, browse, and manage images and documents."
      icon={Image}
    />
  )
}
