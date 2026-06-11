import { useNavigate } from "react-router-dom"
import { ArrowLeft } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { PageHeader, PageMeta } from "@/components/shared"
import ProjectForm from "./ProjectForm"
import { useCreateProjectMutation } from "@/redux/features/projects/projects-api"

export default function ProjectCreate() {
  const navigate = useNavigate()
  const [createProject, { isLoading }] = useCreateProjectMutation()

  const handleSubmit = async (data: any) => {
    try {
      const res = await createProject(data).unwrap()
      if (res?.success) {
        toast.success(res.message || "Project created")
        navigate("/projects")
      }
    } catch (err: any) {
      toast.error("Failed to create project", {
        description: err?.data?.message || "Something went wrong",
      })
    }
  }

  return (
    <div className="space-y-6">
      <PageMeta title="Create Project" description="Add a new project" />
      <PageHeader
        title="Create Project"
        description="Add a new project to your catalog."
        actions={
          <Button variant="outline" onClick={() => navigate("/projects")}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Projects
          </Button>
        }
      />
      <ProjectForm onSubmit={handleSubmit} isLoading={isLoading} submitLabel="Create Project" />
    </div>
  )
}
