import { useParams, useNavigate } from "react-router-dom"
import { PageMeta } from "@/components/shared"
import PageHeader from "@/components/common/page-header"
import {
  useGetProductByIdQuery,
  useUpdateProductMutation,
} from "@/redux/features/products/products-api"
import ProductForm from "./ProductForm"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "sonner"

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
      />
      <ProductForm
        initialData={product}
        onSubmit={handleSubmit}
        isLoading={isUpdating}
      />
    </div>
  )
}
