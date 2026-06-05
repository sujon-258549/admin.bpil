import { Link } from "react-router-dom"
import {
  FilePlus,
  Wrench,
  Users,
  FileText,
  type LucideIcon,
} from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ROUTES } from "@/config/paths"
import { cn } from "@/lib/utils"

interface QuickAction {
  label: string
  description: string
  to: string
  icon: LucideIcon
  tone: string
}

const ACTIONS: QuickAction[] = [
  {
    label: "New Service Request",
    description: "Create a new service request",
    to: ROUTES.MODULES.DASHBOARD, // You can change this to actual service route later
    icon: FilePlus,
    tone: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  },
  {
    label: "Dispatch Technician",
    description: "Assign tech to pending request",
    to: ROUTES.MODULES.DASHBOARD,
    icon: Wrench,
    tone: "bg-sky-500/10 text-sky-600 dark:text-sky-400",
  },
  {
    label: "Add Customer",
    description: "Onboard new client",
    to: ROUTES.MODULES.DASHBOARD,
    icon: Users,
    tone: "bg-violet-500/10 text-violet-600 dark:text-violet-400",
  },
  {
    label: "Create Invoice",
    description: "Bill a completed request",
    to: ROUTES.MODULES.DASHBOARD,
    icon: FileText,
    tone: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  },
]

export function QuickActions() {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
        <CardDescription>Common service tasks one click away.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-2 flex-1">
        {ACTIONS.map((a) => {
          const Icon = a.icon
          return (
            <Link
              key={a.label}
              to={a.to}
              className="flex items-center gap-3 rounded-md border border-transparent p-2 transition-colors hover:border-primary/30 hover:bg-accent"
            >
              <div
                className={cn(
                  "grid size-9 shrink-0 place-items-center rounded-md",
                  a.tone,
                )}
              >
                <Icon className="size-4" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-medium">{a.label}</div>
                <div className="truncate text-xs text-muted-foreground">
                  {a.description}
                </div>
              </div>
            </Link>
          )
        })}
      </CardContent>
    </Card>
  )
}
