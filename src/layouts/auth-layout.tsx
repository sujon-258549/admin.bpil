import type { ReactNode } from "react"
import { Outlet } from "react-router-dom"
import { Zap, Wrench, ClipboardCheck } from "lucide-react"
import { siteConfig } from "@/config/site"

interface AuthLayoutProps {
  // Optional — when used as a direct wrapper:
  //   <AuthLayout><Login /></AuthLayout>
  // If omitted, falls back to `<Outlet />` so the layout still works as a
  // nested-route element.
  children?: ReactNode
}

// Two-column auth shell — professional brand panel on the left, original form on the right.
export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Left: Professional brand panel */}
      <aside className="relative hidden flex-col justify-between overflow-hidden bg-zinc-950 p-12 text-zinc-50 lg:flex">
        {/* Dynamic Primary Color Gradient */}
        <div
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            background:
              "radial-gradient(circle at top left, hsl(var(--primary)) 0%, transparent 40%), radial-gradient(circle at bottom right, hsl(var(--primary)) 0%, transparent 50%)",
          }}
        />
        
        {/* Subtle noise texture for professional look */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay"></div>

        <div className="relative z-10 flex items-center gap-3 text-2xl font-bold tracking-tight">
          <div className="grid size-10 place-items-center rounded-xl bg-primary text-primary-foreground shadow-lg">
            <Zap className="size-5 fill-current" />
          </div>
          {siteConfig.name}
        </div>

        <div className="relative z-10 mt-auto mb-12 space-y-8 max-w-lg">
          <h1 className="text-4xl font-semibold leading-[1.15] tracking-tight text-white">
            Powering your electrical services business.
          </h1>
          
          <div className="space-y-5">
            <div className="flex items-start gap-4">
              <Wrench className="mt-1 size-5 shrink-0 text-primary" />
              <div>
                <h3 className="text-base font-medium text-white">Complete Service Management</h3>
                <p className="mt-1 text-sm leading-relaxed text-zinc-400">
                  Efficiently manage technicians, dispatch schedules, and track service requests in real-time.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <ClipboardCheck className="mt-1 size-5 shrink-0 text-primary" />
              <div>
                <h3 className="text-base font-medium text-white">Project & Inventory Tracking</h3>
                <p className="mt-1 text-sm leading-relaxed text-zinc-400">
                  Keep track of electrical components, equipment inventory, and ongoing project statuses seamlessly.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10 flex items-center justify-between border-t border-white/10 pt-6">
          <p className="text-sm font-medium text-zinc-300">Electrical Services Platform</p>
          <p className="text-sm text-zinc-500">© {new Date().getFullYear()} {siteConfig.author}</p>
        </div>
      </aside>

      {/* Right: form panel (Unchanged) */}
      <main className="flex items-center justify-center bg-background p-6 sm:p-10">
        <div className="w-full max-w-sm">{children ?? <Outlet />}</div>
      </main>
    </div>
  )
}
