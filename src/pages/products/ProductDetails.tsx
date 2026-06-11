import { useParams, useNavigate } from "react-router-dom"
import { PageMeta } from "@/components/shared"
import PageHeader from "@/components/common/page-header"
import { useGetProductByIdQuery } from "@/redux/features/products/products-api"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ChevronRight } from "lucide-react"
import { Link } from "react-router-dom"
import { Image, YoutubeEmbed } from "@/components/shared"
import { PreviewRichText } from "@/components/ui/preview-richtext"

export default function ProductDetails() {
  const { id } = useParams()
  const navigate = useNavigate()

  const { data, isLoading } = useGetProductByIdQuery(id as string, { skip: !id })

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Product Details" />
        <Skeleton className="h-[400px] w-full" />
      </div>
    )
  }

  const product = data?.data
  if (!product) {
    return <div>Product not found</div>
  }

  return (
    <div className="space-y-6">
      <PageMeta title="Product Details" description="View product details" />
      <PageHeader
        title="Product Details"
        description="View details of this product."
        breadcrumb={
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Link to="/dashboard" className="text-foreground hover:underline">Dashboard</Link>
            <ChevronRight className="size-3 shrink-0 text-muted-foreground/60" />
            <Link to="/products" className="text-foreground hover:underline">Products</Link>
            <ChevronRight className="size-3 shrink-0 text-muted-foreground/60" />
            <span aria-current="page" className="font-medium text-foreground">{product.name}</span>
          </nav>
        }
        actions={
          <Button variant="outline" onClick={() => navigate("/products")}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Products
          </Button>
        }
      />
      <div className="  space-y-6">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-1/3">
            {product.thumbnail ? (
              <Image preview imageId={product.thumbnail.id} alt={product.name} className="w-full h-auto rounded-md object-cover border" />
            ) : (
              <div className="w-full aspect-square bg-muted rounded-md flex items-center justify-center text-muted-foreground">
                No Image
              </div>
            )}
          </div>
          <div className="w-full md:w-2/3 space-y-4">
            <h2 className="text-2xl font-bold">{product.name}</h2>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-semibold text-muted-foreground">Category: </span>
                <span>{product.category || "N/A"}</span>
              </div>
              <div>
                <span className="font-semibold text-muted-foreground">Price: </span>
                <span>{product.price || "N/A"}</span>
              </div>
              <div>
                <span className="font-semibold text-muted-foreground">Status: </span>
                <span>{product.isActive ? "Active" : "Inactive"}</span>
              </div>
            </div>
            {product.shortDesc && (
              <div>
                <h4 className="font-semibold mt-4 mb-2">Short Description</h4>
                <p className="text-muted-foreground whitespace-pre-wrap">{product.shortDesc}</p>
              </div>
            )}
          </div>
        </div>

        {product.gallery && product.gallery.length > 0 && (
          <div className="mt-8">
            <h4 className="font-semibold mb-4 text-lg border-b pb-2">Gallery</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {product.gallery.map((g: any, i: number) => (
                <Image preview key={i} imageId={g.id} alt={`${product.name} gallery ${i+1}`} className="w-full aspect-square object-cover rounded-md border" />
              ))}
            </div>
          </div>
        )}

        {product.youtubeVideoIds && product.youtubeVideoIds.length > 0 && (
          <div className="mt-8">
            <h4 className="font-semibold mb-4 text-lg border-b pb-2">Videos</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {product.youtubeVideoIds.map((youtubeId: string, i: number) => (
                <YoutubeEmbed key={i} youtubeId={youtubeId} />
              ))}
            </div>
          </div>
        )}

        {product.detailsDesc && (
          <div className="mt-8">
            <h4 className="font-semibold pb-4 text-lg border-b -mb-5">Detailed Description</h4>
            <PreviewRichText className="max-w-none" content={product.detailsDesc} />
          </div>
        )}
      </div>
    </div>
  )
}
