import { ProjectBannerTab } from "./projects/ProjectBannerTab";
import { useCurrentUser } from "@/hooks/use-permission";
import { hasAction, isSuperAdmin } from "@/lib/permissions";

export default function ContentProjects() {
  const user = useCurrentUser();
  const canViewBanner = isSuperAdmin(user) || hasAction(user, "content.projects.banner", "read");

  return (
    <div className="">
      <h1 className="text-2xl font-semibold mb-4">Projects Page Content Management</h1>
      <p className="text-muted-foreground mb-6">Manage all dynamic sections for the Projects page.</p>

      {canViewBanner && (
        <div className="mt-4 outline-none">
          <ProjectBannerTab />
        </div>
      )}
    </div>
  );
}
