import { useNavigate, useParams } from "react-router-dom"
import { ArrowLeft } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { PageHeader, PageMeta } from "@/components/shared"
import { Skeleton } from "@/components/ui/skeleton"
import ProjectForm from "./ProjectForm"
import { useGetProjectByIdQuery, useUpdateProjectMutation } from "@/redux/features/projects/projects-api"

export default function ProjectEdit() {
  const { id } = useParams()
  const navigate = useNavigate()

  const { data, isLoading: isFetching } = useGetProjectByIdQuery(id as string, { skip: !id })
  const project = data?.data

  const [updateProject, { isLoading: isUpdating }] = useUpdateProjectMutation()

  const handleSubmit = async (formData: any) => {
    try {
      const res = await updateProject({ id: id as string, data: formData }).unwrap()
      if (res?.success) {
        toast.success(res.message || "Project updated")
        navigate("/projects")
      }
    } catch (err: any) {
      toast.error("Failed to update project", {
        description: err?.data?.message || "Something went wrong",
      })
    }
  }

  if (isFetching) {
    return (
      <div className="space-y-6">
        <PageHeader title="Edit Project" />
        <Skeleton className="h-[400px] w-full" />
      </div>
    )
  }

  if (!project) return <div>Project not found</div>

  return (
    <div className="space-y-6">
      <PageMeta title="Edit Project" description="Update existing project" />
      <PageHeader
        title="Edit Project"
        description={`Editing "${project.name}"`}
        actions={
          <Button variant="outline" onClick={() => navigate("/projects")}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Projects
          </Button>
        }
      />
      <ProjectForm
        initialData={project}
        onSubmit={handleSubmit}
        isLoading={isUpdating}
        submitLabel="Save Changes"
      />
    </div>
  )
}
