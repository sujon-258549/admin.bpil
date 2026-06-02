import { ArrowUpRight, Wrench } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface Row {
  name: string
  category: string
  jobs: number
  revenue: string
  trend: number
}

const ROWS: Row[] = [
  { name: "General Maintenance", category: "Commercial", jobs: 112, revenue: "৳2,87,200", trend: 18 },
  { name: "Wiring Installation", category: "Residential", jobs: 84, revenue: "৳1,49,000", trend: 12 },
  { name: "AC Servicing", category: "Residential", jobs: 96, revenue: "৳1,17,600", trend: 9 },
  { name: "Substation Repair", category: "Industrial", jobs: 14, revenue: "৳3,04,400", trend: -4 },
  { name: "Circuit Troubleshooting", category: "Commercial", jobs: 42, revenue: "৳56,800", trend: 22 },
]

export function TopProducts() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Requested Services</CardTitle>
        <CardDescription>
          Most frequent service jobs this month.
        </CardDescription>
      </CardHeader>
      <CardContent className="px-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-border/70 bg-muted/40 text-[11px] uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-4 py-2.5 text-left font-semibold">Service</th>
                <th className="px-4 py-2.5 text-left font-semibold">Category</th>
                <th className="px-4 py-2.5 text-right font-semibold">Jobs Completed</th>
                <th className="px-4 py-2.5 text-right font-semibold">Revenue</th>
                <th className="px-4 py-2.5 text-right font-semibold">Trend</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {ROWS.map((r) => (
                <tr key={r.name} className="hover:bg-muted/30">
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <div className="grid size-8 place-items-center rounded-md bg-primary/10 text-primary">
                        <Wrench className="size-4" />
                      </div>
                      <span className="font-medium">{r.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                    {r.category}
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums">
                    {r.jobs}
                  </td>
                  <td className="px-4 py-3 text-right font-medium tabular-nums">
                    {r.revenue}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Badge
                      variant="secondary"
                      className={cn(
                        "tabular-nums",
                        r.trend >= 0
                          ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400"
                          : "bg-rose-500/15 text-rose-700 dark:text-rose-400",
                      )}
                    >
                      <ArrowUpRight
                        className={cn(
                          "size-3",
                          r.trend < 0 && "rotate-90",
                        )}
                      />
                      {r.trend >= 0 ? "+" : ""}
                      {r.trend}%
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
