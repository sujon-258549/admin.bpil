import { SEO } from "@/components/shared"
import PageHeader from "@/components/common/page-header"

export default function InvoiceListPage() {
  return (
    <>
      <SEO title="Invoice List" />
      <div>
      <PageHeader title="Invoices" description="Issued and pending invoices" />
      <div className="rounded-lg border bg-card p-6 text-sm text-muted-foreground">
        Invoice list goes here.
      </div>
    </div>
  )
}
