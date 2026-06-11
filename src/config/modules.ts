// Single source of truth for every module in the app.
// Each module's `key` doubles as its permission name — granting a user
// the "customers" permission means they can access the customers module.
import {
  Image,
  LayoutDashboard,
  Newspaper,
  Settings,
  UsersRound,
  Users,
  Activity,
  MessageSquare,
  AppWindow,
  ShoppingBag,
  type LucideIcon,
} from "lucide-react";

export type ModuleKey =
  | "dashboard"
  | "content"
  | "users"
  | "blog"
  | "media"
  | "inquiries"
  | "contacts"
  | "notifications"
  | "workflow"
  | "logs"
  | "profile"
  | "products"
  | "gallery_video"
  | "settings";

export type ModuleGroup = "Overview" | "CRM" | "ERP" | "System";

// A child entry doubles as its own permission item when `key` is set —
// the permission modal then drops the parent in favor of these children.
// Use a stable key (kebab/dot case) so backend rows survive label edits.
export interface AppModuleChild {
  key: string;
  label: string;
  path: string;
}

export interface AppModule {
  key: ModuleKey;
  label: string;
  path: string;
  icon: LucideIcon;
  children?: AppModuleChild[];
}

export const MODULES: AppModule[] = [
  {
    key: "dashboard",
    label: "Dashboard",
    path: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    key: "content",
    label: "Content Management",
    path: "/content",
    icon: AppWindow, // using AppWindow for better distinction
    children: [
      { key: "content.home", label: "Home", path: "/content/home" },
      { key: "content.about", label: "About Us", path: "/content/about" },
      { key: "content.services", label: "Services", path: "/content/services" },
      { key: "content.projects", label: "Projects", path: "/content/projects" },
      { key: "content.image", label: "Image / Gallery", path: "/content/gallery" },
      { key: "content.blog", label: "Blog", path: "/content/blog" },
      { key: "content.contact", label: "Contact Us", path: "/content/contact" },
    ],
  },
  {
    key: "users",
    label: "Employee Management",
    path: "/employees",
    icon: UsersRound,
    children: [
      { key: "employees", label: "Employee List", path: "/employees" },
      {
        key: "departments",
        label: "Department List",
        path: "/employees/departments",
      },
      { key: "roles", label: "Role List", path: "/employees/roles" },
      {
        key: "designations",
        label: "Designation List",
        path: "/employees/designations",
      },
    ],
  },
  {
    key: "blog",
    label: "Blog",
    path: "/blog",
    icon: Newspaper,
  },
  {
    key: "products",
    label: "Products",
    path: "/products",
    icon: ShoppingBag,
    children: [
      { key: "products.list", label: "Product List", path: "/products" },
      { key: "products.create", label: "Create Product", path: "/products/create" },
    ],
  },
  {
    key: "media",
    label: "Media Library",
    path: "/media",
    icon: Image,
  },
  {
    key: "gallery_video",
    label: "Gallery & Video",
    path: "/gallery-video",
    icon: Image,
    children: [
      { key: "gallery_video.video", label: "Video", path: "/gallery-video/video" },
      { key: "gallery_video.gallery", label: "Gallery", path: "/gallery-video/gallery" },
    ],
  },
  {
    key: "inquiries",
    label: "Inquiries",
    path: "/inquiries/contacts",
    icon: MessageSquare,
    children: [
      { key: "contacts", label: "All Contacts", path: "/inquiries/contacts" },
      { key: "notifications", label: "All Notifications", path: "/notifications" },
    ],
  },
  {
    key: "logs",
    label: "Logs",
    path: "/logs",
    icon: Activity,
    children: [
      { key: "logs.actions", label: "Action Logs", path: "/logs/actions" },
      { key: "logs.errors", label: "Error Logs", path: "/logs/errors" },
    ],
  },
  {
    key: "profile",
    label: "Profile Management",
    path: "/profile",
    icon: Users,
    children: [
      { key: "profile.overview", label: "Your Profile", path: "/profile" },
      { key: "profile.update", label: "Update Profile", path: "/profile/edit" },
      { key: "profile.password", label: "Change Password", path: "/profile/password" },
    ],
  },
  {
    key: "settings",
    label: "Settings",
    path: "/settings",
    icon: Settings,
    children: [
      { key: "settings", label: "General", path: "/settings" },
      { key: "settings.notifications", label: "Notification Settings", path: "/settings/notifications" },
      { key: "workflow", label: "Workflow Guide", path: "/workflow" },
    ],
  },
];

export const MODULE_KEYS = MODULES.map((m) => m.key);

export const MODULE_GROUPS: ModuleGroup[] = [
  "Overview",
  "CRM",
  "ERP",
  "System",
];

export const getModule = (key: ModuleKey): AppModule | undefined =>
  MODULES.find((m) => m.key === key);

// Note: the role-permission modal flattens MODULES into per-sub-module
// permission items with custom action lists. See
// `src/config/permission-catalog.ts` for that derivation.
