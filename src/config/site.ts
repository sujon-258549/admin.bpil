export const siteConfig = {
  name: "BPIL Admin",
  logo: "/logo/logo.png",
  description: "Industry standard ERP & CRM dashboard",
  url: "https://bpil-admin.local",
  author: "BPIL Team",
} as const

export type SiteConfig = typeof siteConfig
