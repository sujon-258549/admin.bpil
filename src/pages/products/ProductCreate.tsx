import { useNavigate } from "react-router-dom"
import { PageMeta } from "@/components/shared"
import PageHeader from "@/components/common/page-header"
import { useCreateProductMutation } from "@/redux/features/products/products-api"
import { toast } from "sonner"
import ProductForm from "./ProductForm"

export default function ProductCreate() {
  const navigate = useNavigate()
  const [createProduct, { isLoading }] = useCreateProductMutation()

  const handleSubmit = async (data: any) => {
    try {
      await createProduct(data).unwrap()
      toast.success("Product created successfully")
      navigate("/products")
    } catch (error: any) {
      toast.error("Failed to create product", {
        description: error?.data?.message || "Something went wrong",
      })
    }
  }

  return (
    <div className="space-y-6">
      <PageMeta title="Create Product" description="Add a new product" />
      <PageHeader
        title="Create Product"
        description="Fill in the details to create a new product."
      />
      <ProductForm onSubmit={handleSubmit} isLoading={isLoading} />
    </div>
  )
}
