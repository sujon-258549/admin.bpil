import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Plus, Trash2, Package, Eye } from "lucide-react"
import { FiEdit } from "react-icons/fi"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import {
  Can,
  ConfirmDialog,
  DataTable,
  DataTableColumnsButton,
  DataTableToolbar,
  EmptyState,
  PageHeader,
  Text,
  Image,
  type Column,
  PageMeta,
} from "@/components/shared"
import { useGetProductsQuery, useDeleteProductMutation, useUpdateProductMutation } from "@/redux/features/products/products-api"

export default function ProductListPage() {
  const navigate = useNavigate()
  const [search, setSearch] = useState("")

  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)

  // Assuming getProducts handles pagination implicitly or via props passed
  const { data, isLoading, isFetching } = useGetProductsQuery({ page, limit })
  const products = data?.data || []
  const meta = data?.meta

  const [deleteProduct] = useDeleteProductMutation()
  const [updateProduct] = useUpdateProductMutation()
  const [pendingDelete, setPendingDelete] = useState<any>(null)

  const confirmDelete = async () => {
    if (!pendingDelete) return
    try {
      const res = await deleteProduct(pendingDelete.id).unwrap()
      if (res?.success) {
        toast.success(res.message || "Product deleted")
      }
      setPendingDelete(null)
    } catch (err: any) {
      toast.error("Failed to delete product", {
        description: err?.data?.message || "Something went wrong",
      })
    }
  }

  const columns: Column<any>[] = [
    {
      key: "name",
      header: "Product Name",
      cell: (p) => (
        <div className="flex items-center gap-3">
          {p.thumbnail ? (
            <Image
              imageId={p.thumbnail.id}
              alt={p.name || "Thumbnail"}
              className="h-10 w-10 shrink-0 rounded-md object-cover border border-border/50"
              preview
            />
          ) : (
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground border border-border/50">
              <Package className="size-5" />
            </div>
          )}
          <div className="min-w-0">
            <div className="truncate font-medium">{p.name || "Untitled"}</div>
          </div>
        </div>
      ),
    },
    {
      key: "category",
      header: "Category",
      cell: (p) => (
        <Text size="sm" tone="muted">
          {p.category || "—"}
        </Text>
      ),
    },
    {
      key: "price",
      header: "Price",
      cell: (p) => (
        <Text size="sm" tone="muted">
          {p.price || "—"}
        </Text>
      ),
    },
    {
      key: "isActive",
      header: "Status",
      cell: (p) => (
        <div className="flex items-center">
          <Switch
            checked={p.isActive}
            onCheckedChange={async (val) => {
              try {
                const res = await updateProduct({ id: p.id, data: { isActive: val } }).unwrap()
                if (res?.success) toast.success(res.message || "Status updated")
              } catch (err: any) {
                toast.error("Failed to update status", { description: err?.data?.message })
              }
            }}
            className="data-[state=checked]:bg-primary"
          />
          <Text size="sm" tone="muted" className="ml-2">
            {p.isActive ? "Active" : "Inactive"}
          </Text>
        </div>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      align: "right",
      fixed: "right",
      cell: (p) => (
        <div className="flex justify-end gap-1">
          <Can module="products" action="read">
            <Button
              size="icon-sm"
              variant="secondary"
              onClick={() => navigate(`/products/${p.id}`)}
              aria-label="View Details"
              className="border border-gray-300"
            >
              <Eye className="size-4" />
            </Button>
          </Can>
          <Can module="products" action="update">
            <Button
              size="icon-sm"
              variant="secondary"
              onClick={() => navigate(`/products/${p.id}/edit`)}
              aria-label="Edit"
              className="border border-gray-300"
            >
              <FiEdit />
            </Button>
          </Can>
          <Can module="products" action="delete">
            <Button
              size="icon-sm"
              variant="destructive"
              onClick={() => setPendingDelete(p)}
              aria-label="Delete"
              className="border border-gray-300"
            >
              <Trash2 />
            </Button>
          </Can>
        </div>
      ),
    },
  ]

  const [visibleColumns, setVisibleColumns] = useState<Column<any>[]>(columns)

  return (
    <div className="space-y-6">
      <PageMeta title="Product List" description="Manage Product List" />
      <PageHeader
        title="Products"
        description="Manage your product catalog."
        actions={
          <Can module="products" action="create">
            <Button onClick={() => navigate("/products/create")}>
              <Plus className="mr-2 h-4 w-4" /> Add Product
            </Button>
          </Can>
        }
      />

      <DataTableToolbar
        value={search}
        onChange={setSearch}
        placeholder="Search products..."
        fetching={isFetching}
        right={
          <DataTableColumnsButton
            tableName="products"
            columns={columns}
            onVisibleColumnsChange={setVisibleColumns}
          />
        }
      />

      <DataTable<any>
        data={products}
        columns={visibleColumns}
        isLoading={isLoading && products.length === 0}
        isFetching={isFetching}
        empty={
          <EmptyState
            icon={Package}
            title="No products yet."
            action={
              <Can module="products" action="create">
                <Button size="sm" onClick={() => navigate("/products/create")}>
                  <Plus className="mr-2 h-4 w-4" /> Add Product
                </Button>
              </Can>
            }
          />
        }
        meta={meta}
        onPageChange={setPage}
        onPageSizeChange={(newSize) => {
          setLimit(newSize)
          setPage(1)
        }}
      />

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        onOpenChange={(v) => !v && setPendingDelete(null)}
        title="Delete product?"
        description={`This will permanently remove "${pendingDelete?.name ?? ""}".`}
        confirmLabel="Delete"
        destructive
        onConfirm={confirmDelete}
      />
    </div>
  )
}
