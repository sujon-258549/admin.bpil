import { createBrowserRouter, Navigate } from "react-router-dom";
import { useCurrentUser } from "@/hooks/use-permission";
import { firstAccessiblePath, isSuperAdmin } from "@/lib/permissions";
import { ROUTES } from "@/config/paths";

// "/" entry: redirect to the first module the signed-in user can read.
// Super-admin lands on /dashboard; users with no grants go to /access-denied.
function SmartIndex() {
  const user = useCurrentUser();
  if (isSuperAdmin(user))
    return <Navigate to={ROUTES.MODULES.DASHBOARD} replace />;
  const target = firstAccessiblePath(user);
  return <Navigate to={target ?? "/access-denied"} replace />;
}

// ─────────────────────────────────────────────────────────────────────────────
// Route guards — only-here-for-routing helpers.
// ─────────────────────────────────────────────────────────────────────────────
import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";
import RequirePermission from "./RequirePermission";

// ─────────────────────────────────────────────────────────────────────────────
// Layouts
// ─────────────────────────────────────────────────────────────────────────────
import AuthLayout from "@/layouts/auth-layout";
import DashboardLayout from "@/layouts/dashboard-layout";

// ─────────────────────────────────────────────────────────────────────────────
// Auth pages
// ─────────────────────────────────────────────────────────────────────────────
import Login from "@/pages/auth/login-page";
import ForgotPassword from "@/pages/auth/forgot-password-page";

// ─────────────────────────────────────────────────────────────────────────────
// Common pages (404, error, loading)
// ─────────────────────────────────────────────────────────────────────────────
import NotFound from "@/pages/common/NotFound";
import ErrorPage from "@/pages/common/ErrorPage";
import AccessDenied from "@/pages/common/AccessDenied";

// ─────────────────────────────────────────────────────────────────────────────
// Dashboard
// ─────────────────────────────────────────────────────────────────────────────
import Dashboard from "@/pages/dashboard/dashboard-page";

// ─────────────────────────────────────────────────────────────────────────────
// Employee Management — every page used by the Employee Management mega menu.
// ─────────────────────────────────────────────────────────────────────────────
import EmployeeList from "@/pages/employee/EmployeeList";
import EmployeeCreate from "@/pages/employee/EmployeeCreate";
import EmployeeEdit from "@/pages/employee/EmployeeEdit";
import EmployeeDetails from "@/pages/employee/EmployeeDetails";
import EmployeeSecurity from "@/pages/employee/EmployeeSecurity";
import DepartmentList from "@/pages/department/DepartmentList";
import RoleList from "@/pages/role/RoleList";
import DesignationList from "@/pages/designation/DesignationList";
import ActionLogs from "@/pages/logs/ActionLogs";
import ErrorLogs from "@/pages/logs/ErrorLogs";

// ─────────────────────────────────────────────────────────────────────────────
// Content Management
// ─────────────────────────────────────────────────────────────────────────────
import ContentHome from "@/pages/content/ContentHome";
import ContentAbout from "@/pages/content/ContentAbout";
import ContentProducts from "@/pages/content/ContentProducts";
import ContentServices from "@/pages/content/ContentServices";
import ContentGallery from "@/pages/content/ContentGallery"
import ContentProjects from "@/pages/content/ContentProjects";
import ContentBlog from "@/pages/content/ContentBlog";
import ContentContact from "@/pages/content/ContentContact";

// ─────────────────────────────────────────────────────────────────────────────
// CRM / ERP module placeholders
// ─────────────────────────────────────────────────────────────────────────────
import CustomerList from "@/pages/customers/customer-list-page";
import ProductList from "@/pages/products/product-list-page";
import ProductCreate from "@/pages/products/ProductCreate";
import ProductEdit from "@/pages/products/ProductEdit";
import ProductDetails from "@/pages/products/ProductDetails";
import InventoryPage from "@/pages/inventory/inventory-page";
import InvoiceList from "@/pages/invoices/invoice-list-page";
import SettingsPage from "@/pages/settings/settings-page";
import NotificationSettingsPage from "@/pages/settings/NotificationSettingsPage";
import WorkflowPage from "@/pages/workflow/WorkflowPage";
import CategoryList from "@/pages/categories/CategoryList";
import SubCategoryList from "@/pages/categories/SubCategoryList";
import BlogList from "@/pages/blog/BlogList";
import MediaLibrary from "@/pages/media/MediaLibrary";
import NotificationsPage from "@/pages/notifications/NotificationsPage";
import SendNotificationPage from "@/pages/notifications/SendNotificationPage";
import ContactList from "@/pages/contacts/ContactList";
import YourProfile from "@/pages/profile/YourProfile";
import UpdateProfile from "@/pages/profile/UpdateProfile";
import ChangePassword from "@/pages/profile/ChangePassword";
import VideoPage from "@/pages/gallery-video/VideoPage";
import GalleryPage from "@/pages/gallery-video/GalleryPage";

// ─────────────────────────────────────────────────────────────────────────────
// Router
//
// Branch layout:
//   /login              → PublicRoute → AuthLayout → Login
//   /                   → ProtectedRoute → DashboardLayout → every feature page
//     *                 → 404 fallback (only matches inside the protected tree)
// ─────────────────────────────────────────────────────────────────────────────
export const router = createBrowserRouter([
  // Public auth screen. Signed-in users are bounced to /dashboard.
  {
    path: "/login",
    element: (
      <PublicRoute>
        <AuthLayout>
          <Login />
        </AuthLayout>
      </PublicRoute>
    ),
    errorElement: <ErrorPage />,
  },
  {
    path: "/forgot-password",
    element: (
      <PublicRoute>
        <AuthLayout variant="forgot-password">
          <ForgotPassword />
        </AuthLayout>
      </PublicRoute>
    ),
    errorElement: <ErrorPage />,
  },

  // Protected app. Sign-in required; everything renders inside DashboardLayout.
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    errorElement: <ErrorPage />,
    children: [
      // Index "/" routes the user to their first accessible module.
      { index: true, element: <SmartIndex /> },

      // Dashboard — needs explicit `dashboard.read` permission like any
      // other module. Super-admins bypass.
      {
        path: "dashboard",
        element: (
          <RequirePermission moduleKey="dashboard">
            <Dashboard />
          </RequirePermission>
        ),
      },

      // Logs
      {
        path: "logs/actions",
        element: (
          <RequirePermission moduleKey="dashboard">
            <ActionLogs />
          </RequirePermission>
        ),
      },
      {
        path: "logs/errors",
        element: (
          <RequirePermission moduleKey="dashboard">
            <ErrorLogs />
          </RequirePermission>
        ),
      },

      // Shown when the user is signed in but has no module access (or hit
      // a route they don't have permission for).
      { path: "access-denied", element: <AccessDenied /> },

      // Employee Management — each sub-module guarded by its own key.
      // Keys match what the permission modal writes to the backend.
      {
        path: "employees",
        element: (
          <RequirePermission moduleKey="employees">
            <EmployeeList />
          </RequirePermission>
        ),
      },
      {
        path: "employees/new",
        element: (
          <RequirePermission moduleKey="employees" action="create">
            <EmployeeCreate />
          </RequirePermission>
        ),
      },
      {
        path: "employees/:id/edit",
        element: (
          <RequirePermission moduleKey="employees" action="update">
            <EmployeeEdit />
          </RequirePermission>
        ),
      },
      {
        path: "employees/:id",
        element: (
          <RequirePermission moduleKey="employees">
            <EmployeeDetails />
          </RequirePermission>
        ),
      },
      {
        path: "employees/:id/security",
        element: (
          <RequirePermission moduleKey="employees" action="update">
            <EmployeeSecurity />
          </RequirePermission>
        ),
      },
      {
        path: "employees/departments",
        element: (
          <RequirePermission moduleKey="departments">
            <DepartmentList />
          </RequirePermission>
        ),
      },
      {
        path: "employees/roles",
        element: (
          <RequirePermission moduleKey="roles">
            <RoleList />
          </RequirePermission>
        ),
      },
      {
        path: "employees/designations",
        element: (
          <RequirePermission moduleKey="designations">
            <DesignationList />
          </RequirePermission>
        ),
      },

      // Back-compat: legacy /users URLs land in the new employee list.
      { path: "users", element: <Navigate to="/employees" replace /> },

      // CRM / ERP module placeholders — parents without children use their
      // own key; parents with children use the "list" child key.
      {
        path: "customers",
        element: (
          <RequirePermission moduleKey="customers.list">
            <CustomerList />
          </RequirePermission>
        ),
      },
      {
        path: "products",
        element: (
          <RequirePermission moduleKey="products.list">
            <ProductList />
          </RequirePermission>
        ),
      },
      {
        path: "products/create",
        element: (
          <RequirePermission moduleKey="products.create" action="create">
            <ProductCreate />
          </RequirePermission>
        ),
      },
      {
        path: "products/:id/edit",
        element: (
          <RequirePermission moduleKey="products.list" action="update">
            <ProductEdit />
          </RequirePermission>
        ),
      },
      {
        path: "products/:id",
        element: (
          <RequirePermission moduleKey="products.list">
            <ProductDetails />
          </RequirePermission>
        ),
      },
      {
        path: "inventory",
        element: (
          <RequirePermission moduleKey="inventory">
            <InventoryPage />
          </RequirePermission>
        ),
      },
      {
        path: "invoices",
        element: (
          <RequirePermission moduleKey="invoices">
            <InvoiceList />
          </RequirePermission>
        ),
      },
      {
        path: "settings",
        element: (
          <RequirePermission moduleKey="settings">
            <SettingsPage />
          </RequirePermission>
        ),
      },
      {
        path: "settings/notifications",
        element: (
          <RequirePermission moduleKey="settings">
            <NotificationSettingsPage />
          </RequirePermission>
        ),
      },
      {
        path: "workflow",
        element: (
          <RequirePermission moduleKey="workflow">
            <WorkflowPage />
          </RequirePermission>
        ),
      },

      // Content Management
      {
        path: "content/home",
        element: (
          <RequirePermission moduleKey="content.home">
            <ContentHome />
          </RequirePermission>
        ),
      },
      {
        path: "content/about",
        element: (
          <RequirePermission moduleKey="content.about">
            <ContentAbout />
          </RequirePermission>
        ),
      },
      {
        path: "content/products",
        element: (
          <RequirePermission moduleKey="content.products">
            <ContentProducts />
          </RequirePermission>
        ),
      },
      {
        path: "content/services",
        element: (
          <RequirePermission moduleKey="content.services">
            <ContentServices />
          </RequirePermission>
        ),
      },
      {
        path: "content/gallery",
        element: (
          <RequirePermission moduleKey="content.image">
            <ContentGallery />
          </RequirePermission>
        ),
      },
      
      // Projects Content Management
      {
        path: "content/projects",
        element: (
          <RequirePermission moduleKey="content.projects">
            <ContentProjects />
          </RequirePermission>
        ),
      },


      {
        path: "content/blog",
        element: (
          <RequirePermission moduleKey="content.blog">
            <ContentBlog />
          </RequirePermission>
        ),
      },
      {
        path: "content/contact",
        element: (
          <RequirePermission moduleKey="content.contact">
            <ContentContact />
          </RequirePermission>
        ),
      },
      // Categories
      {
        path: "categories",
        element: (
          <RequirePermission moduleKey="categories.list">
            <CategoryList />
          </RequirePermission>
        ),
      },
      {
        path: "categories/sub",
        element: (
          <RequirePermission moduleKey="subcategories.list">
            <SubCategoryList />
          </RequirePermission>
        ),
      },

      // Blog
      {
        path: "blog",
        element: (
          <RequirePermission moduleKey="blog">
            <BlogList />
          </RequirePermission>
        ),
      },

      // Media Library
      {
        path: "media",
        element: (
          <RequirePermission moduleKey="media">
            <MediaLibrary />
          </RequirePermission>
        ),
      },

      // Gallery & Video
      {
        path: "gallery-video/gallery",
        element: (
          <RequirePermission moduleKey="gallery_video.gallery">
            <GalleryPage />
          </RequirePermission>
        ),
      },
      {
        path: "gallery-video/video",
        element: (
          <RequirePermission moduleKey="gallery_video.video">
            <VideoPage />
          </RequirePermission>
        ),
      },

      // Notifications
      {
        path: "notifications",
        element: (
          <RequirePermission moduleKey="notifications">
            <NotificationsPage />
          </RequirePermission>
        ),
      },
      {
        path: "notifications/send",
        element: (
          <RequirePermission moduleKey="notifications">
            <SendNotificationPage />
          </RequirePermission>
        ),
      },

      // Inquiries (Contacts)
      {
        path: "inquiries/contacts",
        element: (
          <RequirePermission moduleKey="inquiries">
            <ContactList />
          </RequirePermission>
        ),
      },

      // Workflow Guide — Platform Super Admin playbook. Only super-admins
      // (or anyone explicitly granted `workflow.read`) can see it.
      // (Moved to SettingsPage)

      // Profile Management — accessible to all authenticated users
      {
        path: "profile",
        element: <YourProfile />,
      },
      {
        path: "profile/edit",
        element: <UpdateProfile />,
      },
      {
        path: "profile/password",
        element: <ChangePassword />,
      },

      // 404 — any unmatched URL inside the protected tree.
      { path: "*", element: <NotFound /> },
    ],
  },
]);
