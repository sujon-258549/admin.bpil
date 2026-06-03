import { SEO } from "@/components/shared"
import PageHeader from "@/components/common/page-header"

export default function InventoryPage() {
  return (
    <>
      <SEO title="Inventory" />
      <div>
      <PageHeader title="Inventory" description="Stock levels across warehouses" />
      <div className="rounded-lg border bg-card p-6 text-sm text-muted-foreground">
        Inventory dashboard goes here.
      </div>
    </div>
  )
}
