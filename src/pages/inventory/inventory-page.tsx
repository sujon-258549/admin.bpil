import { 
  PageMeta,
} from "@/components/shared"
import PageHeader from "@/components/common/page-header"

export default function InventoryPage() {
  return (
        <div>
      <PageMeta title="Inventory" description="Manage Inventory in Muster ERP & CRM" />
      <PageHeader title="Inventory" description="Stock levels across warehouses" />
      <div className="rounded-lg border bg-card p-6 text-sm text-muted-foreground">
        Inventory dashboard goes here.
      </div>
    </div>
  )
}
