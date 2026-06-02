import type { ReactNode } from "react"
import { Outlet } from "react-router-dom"
import { Building2, Sparkles, LayoutDashboard, Activity } from "lucide-react"
import { siteConfig } from "@/config/site"

interface AuthLayoutProps {
  // Optional — when used as a direct wrapper:
  //   <AuthLayout><Login /></AuthLayout>
  // If omitted, falls back to `<Outlet />` so the layout still works as a
  // nested-route element.
  children?: ReactNode
}

// Two-column premium auth shell
export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background selection:bg-primary/30">
      {/* Premium Dynamic Background */}
      <div className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center">
        {/* Animated gradients */}
        <div className="absolute top-0 right-0 h-[80vh] w-[80vw] translate-x-1/3 -translate-y-1/4 rounded-full bg-primary/20 opacity-50 blur-[120px]" />
        <div className="absolute bottom-0 left-0 h-[60vh] w-[60vw] -translate-x-1/3 translate-y-1/3 rounded-full bg-chart-2/20 opacity-50 blur-[100px]" />
        
        {/* Grain overlay */}
        <div 
          className="absolute inset-0 opacity-[0.03] mix-blend-overlay"
          style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}
        />
      </div>

      <div className="relative z-10 w-full max-w-[1200px] p-4 sm:p-8 md:p-12">
        <div className="group flex overflow-hidden rounded-[2.5rem] border border-border/50 bg-background/60 shadow-2xl backdrop-blur-2xl transition-all duration-500 hover:shadow-primary/5 min-h-[700px]">
          
          {/* Left: Glassmorphism Brand Panel */}
          <aside className="relative hidden w-1/2 flex-col justify-between overflow-hidden bg-zinc-950 p-12 lg:flex xl:p-16">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-zinc-950 to-zinc-950 mix-blend-multiply" />
            <div
              className="pointer-events-none absolute inset-0 opacity-50"
              style={{
                background:
                  "radial-gradient(circle at 20% 0%, rgba(var(--primary), 0.15) 0%, transparent 50%), radial-gradient(circle at 80% 100%, rgba(var(--chart-2), 0.15) 0%, transparent 50%)",
              }}
            />
            
            {/* Top Brand */}
            <div className="relative z-10 flex items-center gap-3">
              <div className="relative flex size-12 items-center justify-center rounded-2xl bg-gradient-to-b from-white/10 to-white/5 border border-white/10 shadow-inner backdrop-blur-md">
                <Building2 className="size-6 text-white" />
              </div>
              <span className="text-2xl font-bold tracking-tight text-white">{siteConfig.name}</span>
            </div>

            {/* Middle Graphic/Content */}
            <div className="relative z-10 mt-auto mb-16 max-w-md space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm font-medium text-zinc-300 backdrop-blur-md">
                <Sparkles className="size-4 text-primary" />
                <span>Next-generation Workspace</span>
              </div>
              
              <h2 className="text-4xl font-medium leading-tight tracking-tight text-white">
                Everything you need to manage your business.
              </h2>
              <p className="text-lg text-zinc-400">
                Streamline customers, orders, inventory and reports in one intelligent, unified workspace.
              </p>
            </div>

            {/* Bottom Floating Stats/Cards */}
            <div className="relative z-10 flex gap-4 mt-auto">
              <div className="flex flex-1 items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-md transition-transform hover:-translate-y-1">
                <div className="rounded-full bg-primary/20 p-2">
                  <LayoutDashboard className="size-5 text-primary" />
                </div>
                <div>
                  <div className="text-sm font-medium text-white">Dashboard</div>
                  <div className="text-xs text-zinc-400">Real-time stats</div>
                </div>
              </div>
              <div className="flex flex-1 items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-md transition-transform hover:-translate-y-1">
                <div className="rounded-full bg-chart-2/20 p-2">
                  <Activity className="size-5 text-chart-2" />
                </div>
                <div>
                  <div className="text-sm font-medium text-white">Analytics</div>
                  <div className="text-xs text-zinc-400">Insights driven</div>
                </div>
              </div>
            </div>
          </aside>

          {/* Right: Form panel */}
          <main className="relative flex w-full flex-col items-center justify-center bg-background/40 p-8 sm:p-12 lg:w-1/2 lg:p-16 xl:p-20">
            {/* Top right floating logo for mobile */}
            <div className="absolute top-8 left-8 flex lg:hidden items-center gap-2 mb-8">
              <div className="grid size-10 place-items-center rounded-xl bg-primary/10 text-primary">
                <Building2 className="size-5" />
              </div>
              <span className="text-xl font-bold tracking-tight">{siteConfig.name}</span>
            </div>
            
            <div className="w-full max-w-sm mt-8 lg:mt-0">
              {children ?? <Outlet />}
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}
