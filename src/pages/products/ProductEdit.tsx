import { useParams, useNavigate, Link } from "react-router-dom"
import { PageMeta } from "@/components/shared"
import PageHeader from "@/components/common/page-header"
import {
  useGetProductByIdQuery,
  useUpdateProductMutation,
} from "@/redux/features/products/products-api"
import ProductForm from "./ProductForm"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "sonner"
import { ChevronRight } from "lucide-react"

export default function ProductEdit() {
  const { id } = useParams()
  const navigate = useNavigate()

  const { data, isLoading: isFetching } = useGetProductByIdQuery(id as string, {
    skip: !id,
  })
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation()

  const handleSubmit = async (formData: any) => {
    try {
      await updateProduct({ id: id as string, data: formData }).unwrap()
      toast.success("Product updated successfully")
      navigate("/products")
    } catch (error: any) {
      toast.error("Failed to update product", {
        description: error?.data?.message || "Something went wrong",
      })
    }
  }

  if (isFetching) {
    return (
      <div className="space-y-6">
        <PageHeader title="Edit Product" />
        <div className="grid gap-6 md:grid-cols-2">
          <Skeleton className="h-[300px] md:col-span-2" />
          <Skeleton className="h-[300px] md:col-span-2" />
        </div>
      </div>
    )
  }

  const product = data?.data

  if (!product) {
    return <div>Product not found</div>
  }

  return (
    <div className="space-y-6">
      <PageMeta title="Edit Product" description="Update product details" />
      <PageHeader
        title="Edit Product"
        description="Update the product details below."
        breadcrumb={
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Link to="/dashboard" className="text-foreground hover:underline">Dashboard</Link>
            <ChevronRight className="size-3 shrink-0 text-muted-foreground/60" />
            <Link to="/products" className="text-foreground hover:underline">Products</Link>
            <ChevronRight className="size-3 shrink-0 text-muted-foreground/60" />
            <Link to={`/products/${product.id}`} className="text-foreground hover:underline">{product.name}</Link>
            <ChevronRight className="size-3 shrink-0 text-muted-foreground/60" />
            <span aria-current="page" className="font-medium text-foreground">Edit</span>
          </nav>
        }
      />
      <ProductForm
        initialData={product}
        onSubmit={handleSubmit}
        isLoading={isUpdating}
      />
    </div>
  )
}
