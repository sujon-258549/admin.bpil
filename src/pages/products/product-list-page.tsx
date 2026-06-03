import { 
  PageMeta,
} from "@/components/shared"
import PageHeader from "@/components/common/page-header"

export default function ProductListPage() {
  return (
        <div>
      <PageMeta title="Product List" description="Manage Product List in Muster ERP & CRM" />
      <PageHeader title="Products" description="Manage your inventory items" />
      <div className="rounded-lg border p-6 text-sm text-muted-foreground">
        Product table goes here.
      </div>
    </div>
  )
}
