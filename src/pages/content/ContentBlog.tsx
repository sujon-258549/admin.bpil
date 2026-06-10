import { BlogBannerTab } from "./blog/BlogBannerTab";
import { useCurrentUser } from "@/hooks/use-permission";
import { hasAction, isSuperAdmin } from "@/lib/permissions";

export default function ContentBlog() {
  const user = useCurrentUser();
  const canViewBanner = isSuperAdmin(user) || hasAction(user, "content.blog.banner", "read");

  return (
    <div className="">
      <h1 className="text-2xl font-semibold mb-4">Blog Content Management</h1>
      <p className="text-muted-foreground mb-6">Manage dynamic content for the Blog page.</p>
      
      {canViewBanner && <BlogBannerTab />}
    </div>
  );
}
