// Source of truth for the role-permission modal.
// Action strings match RolePermission.permissions rows + the backend
// requirePermission(moduleKey, action) middleware — keep them in sync.

import { MODULES } from "@/config/modules"
import type { LucideIcon } from "lucide-react"

export const CRUD = ["read", "create", "update", "delete"] as const

// Backend key → human label for the UI.
export const ACTION_LABEL: Record<string, string> = {
  read: "View",
  create: "Create",
  update: "Update",
  delete: "Delete",
  permission: "Permission",
  change_password: "Change Password",
  view_own: "View Your",
  publish: "Publish",
  upload: "Upload",
}

// Per-module overrides. Anything not listed falls back to CRUD.
const ACTION_OVERRIDES: Record<string, readonly string[]> = {
  roles: [...CRUD, "permission"],
  employees: [...CRUD, "change_password"],
  dashboard: ["read", "view_own", "permission"],
  settings: ["read", "update"],
  // Media library — view + upload + delete (no in-place update).
  media: ["read", "create", "delete"],
  // Notifications — view + delete + create (for broadcasting).
  notifications: ["read", "create", "delete"],
  // Contacts — view + update status + delete
  contacts: ["read", "update", "delete"],
  // Blog — full CRUD with optional publish action.
  blog: [...CRUD, "publish"],
  // Workflow guide — read-only docs page, no other actions make sense.
  workflow: ["read"],
  // Logs — read-only audit trail pages.
  "logs.actions": ["read"],
  "logs.errors": ["read"],
  // Content management — view + update.
  "content.home": ["read", "update"],
  "content.home.hero-slider": ["read", "update"],
  "content.home.about": ["read", "update"],
  "content.home.products": ["read", "update"],
  "content.home.industries": ["read", "update"],
  "content.home.why-choose": ["read", "update"],
  "content.home.comprehensive": ["read", "update"],
  "content.home.services-video": ["read", "update"],
  "content.home.gallery": ["read", "update"],
  "content.home.contact": ["read", "update"],
  "content.home.faq": ["read", "update"],
  "content.home.cta": ["read", "update"],

  "content.about": ["read", "update"],
  "content.about.banner": ["read", "update"],
  "content.about.intro": ["read", "update"],
  "content.about.mission-vision": ["read", "update"],
  "content.about.values": ["read", "update"],
  "content.about.pillars": ["read", "update"],
  "content.about.stats": ["read", "update"],
  "content.about.md-speech": ["read", "update"],
  "content.about.office": ["read", "update"],
  "content.about.faq": ["read", "update"],
  "content.about.location": ["read", "update"],
  "content.about.cta": ["read", "update"],

  "content.services": ["read", "update"],
  "content.services.banner": ["read", "update"],
  "content.services.intro": ["read", "update"],
  "content.services.maintenance": ["read", "update"],
  "content.services.smart": ["read", "update"],
  "content.services.process": ["read", "update"],
  "content.services.highlights": ["read", "update"],
  "content.services.consult": ["read", "update"],
  "content.services.cta": ["read", "update"],

  "content.projects": ["read", "update"],
  "content.projects.banner": ["read", "update"],

  "content.image": ["read", "update"],
  "content.image.banner": ["read", "update"],
  "content.image.images": ["read", "update"],
  "content.image.videos": ["read", "update"],
  "content.image.categories": ["read", "update"],
  "content.image.cta": ["read", "update"],

  "gallery_video.gallery": ["read", "create", "update", "delete"],
  "gallery_video.video": ["read", "create", "update", "delete"],

  "products.list": ["read", "create", "update", "delete"],
  "products.create": ["read", "create"],

  "projects.project": ["read", "create", "update", "delete"],
  "projects.create": ["read", "create"],

  "content.blog": ["read", "update"],
  "content.blog.banner": ["read", "update"],

  "content.contact": ["read", "update"],
  "content.contact.banner": ["read", "update"],
  "content.contact.info": ["read", "update"],
  "content.contact.faq": ["read", "update"],
}

export interface PermissionCatalogItem {
  key: string
  label: string
  icon: LucideIcon
  parentLabel?: string
  group: string
  actions: readonly string[]
}

const resolveActions = (key: string): readonly string[] =>
  ACTION_OVERRIDES[key] ?? CRUD

// Format a key like "hero-slider" to "Hero Slider"
const formatLabel = (str: string) => {
  return str.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
}

// Parent with children → one item per child (parent dropped).
// Parent without children → one item using the parent's own key.
export const PERMISSION_CATALOG: PermissionCatalogItem[] = MODULES.filter((mod) => mod.key !== "profile").flatMap(
  (mod): PermissionCatalogItem[] =>
    mod.children && mod.children.length > 0
      ? mod.children.flatMap((child) => {
          const items: PermissionCatalogItem[] = [
            {
              key: child.key,
              label: child.label,
              icon: mod.icon,
              parentLabel: mod.label,
              group: mod.label,
              actions: resolveActions(child.key),
            }
          ];
          
          // Inject tabs from ACTION_OVERRIDES dynamically based on the child key (e.g. "content.home")
          Object.keys(ACTION_OVERRIDES).forEach(overrideKey => {
            if (overrideKey.startsWith(`${child.key}.`)) {
              const tabId = overrideKey.replace(`${child.key}.`, "");
              items.push({
                key: overrideKey,
                label: `↳ ${formatLabel(tabId)}`,
                icon: mod.icon,
                parentLabel: `${mod.label} / ${child.label}`,
                group: mod.label,
                actions: resolveActions(overrideKey),
              });
            }
          });

          return items;
        })
      : [
          {
            key: mod.key,
            label: mod.label,
            icon: mod.icon,
            group: mod.label,
            actions: resolveActions(mod.key),
          },
        ],
)

export const DISTINCT_ACTIONS: string[] = Array.from(
  new Set(PERMISSION_CATALOG.flatMap((item) => item.actions)),
)

export const TOTAL_PERMISSION_COUNT: number = PERMISSION_CATALOG.reduce(
  (sum, item) => sum + item.actions.length,
  0,
)

export const getModuleActions = (key: string): readonly string[] =>
  resolveActions(key)
