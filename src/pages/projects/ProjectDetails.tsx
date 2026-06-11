import { useParams, useNavigate } from "react-router-dom"
import { PageMeta } from "@/components/shared"
import PageHeader from "@/components/common/page-header"
import { useGetProjectByIdQuery } from "@/redux/features/projects/projects-api"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ChevronRight } from "lucide-react"
import { Link } from "react-router-dom"
import { Image, YoutubeEmbed } from "@/components/shared"
import { PreviewRichText } from "@/components/ui/preview-richtext"

export default function ProjectDetails() {
  const { id } = useParams()
  const navigate = useNavigate()

  const { data, isLoading } = useGetProjectByIdQuery(id as string, { skip: !id })

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Project Details" />
        <Skeleton className="h-[400px] w-full" />
      </div>
    )
  }

  const project = data?.data
  if (!project) {
    return <div>Project not found</div>
  }

  return (
    <div className="space-y-6">
      <PageMeta title="Project Details" description="View project details" />
      <PageHeader
        title="Project Details"
        description="View details of this project."
        breadcrumb={
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Link to="/dashboard" className="text-foreground hover:underline">Dashboard</Link>
            <ChevronRight className="size-3 shrink-0 text-muted-foreground/60" />
            <Link to="/projects" className="text-foreground hover:underline">Projects</Link>
            <ChevronRight className="size-3 shrink-0 text-muted-foreground/60" />
            <span aria-current="page" className="font-medium text-foreground">{project.name}</span>
          </nav>
        }
        actions={
          <Button variant="outline" onClick={() => navigate("/projects")}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Projects
          </Button>
        }
      />
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-1/3">
            {project.thumbnail ? (
              <Image preview imageId={project.thumbnail.id} alt={project.name} className="w-full h-auto rounded-md object-cover border" />
            ) : (
              <div className="w-full aspect-square bg-muted rounded-md flex items-center justify-center text-muted-foreground">
                No Image
              </div>
            )}
          </div>
          <div className="w-full md:w-2/3 space-y-4">
            <div className="flex justify-between items-start">
              <h2 className="text-2xl font-bold">{project.name}</h2>
              <span className={`px-3 py-1 rounded-full text-xs font-medium border ${
                project.status === 'ONGOING' ? 'bg-blue-100 text-blue-700 border-blue-200' :
                project.status === 'COMPLETED' ? 'bg-green-100 text-green-700 border-green-200' :
                'bg-yellow-100 text-yellow-700 border-yellow-200'
              }`}>
                {project.status}
              </span>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-semibold text-muted-foreground">Category: </span>
                <span>{project.category || "N/A"}</span>
              </div>
              <div>
                <span className="font-semibold text-muted-foreground">Price: </span>
                <span>{project.price || "N/A"}</span>
              </div>
              <div>
                <span className="font-semibold text-muted-foreground">Active: </span>
                <span>{project.isActive ? "Yes" : "No"}</span>
              </div>
            </div>
            {project.shortDesc && (
              <div>
                <h4 className="font-semibold mt-4 mb-2">Short Description</h4>
                <p className="text-muted-foreground whitespace-pre-wrap">{project.shortDesc}</p>
              </div>
            )}
            {project.product && (
              <div className="mt-4 p-4 border rounded-md bg-muted/20 flex items-center justify-between">
                <div>
                  <h5 className="font-medium text-sm text-muted-foreground mb-1">Related Product</h5>
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-foreground">{project.product.name}</p>
                    <span className="text-xs text-muted-foreground bg-background px-2 py-0.5 rounded-full border">
                      {project.product.category || "No Category"}
                    </span>
                  </div>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <Link to={`/products/details/${project.product.id}`}>View Product</Link>
                </Button>
              </div>
            )}
          </div>
        </div>

        {project.gallery && project.gallery.length > 0 && (
          <div className="mt-8">
            <h4 className="font-semibold mb-4 text-lg border-b pb-2">Gallery</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {project.gallery.map((g: any, i: number) => (
                <Image preview key={i} imageId={g.id} alt={`${project.name} gallery ${i+1}`} className="w-full aspect-square object-cover rounded-md border" />
              ))}
            </div>
          </div>
        )}

        {project.youtubeVideoIds && project.youtubeVideoIds.length > 0 && (
          <div className="mt-8">
            <h4 className="font-semibold mb-4 text-lg border-b pb-2">Videos</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {project.youtubeVideoIds.map((youtubeId: string, i: number) => (
                <YoutubeEmbed key={i} youtubeId={youtubeId} />
              ))}
            </div>
          </div>
        )}

        {project.detailsDesc && (
          <div className="mt-8">
            <h4 className="font-semibold pb-4 text-lg border-b -mb-5">Detailed Description</h4>
            <PreviewRichText className="max-w-none" content={project.detailsDesc} />
          </div>
        )}
      </div>
    </div>
  )
}
