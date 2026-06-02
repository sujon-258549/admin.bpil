import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

type Status = "pending" | "in progress" | "completed" | "cancelled"

interface ServiceRequest {
  id: string
  client: string
  service: string
  status: Status
  date: string
}

const REQUESTS: ServiceRequest[] = [
  { id: "#SRV-9021", client: "ABC Plaza",     service: "Substation Maintenance", status: "completed", date: "Today" },
  { id: "#SRV-9020", client: "XYZ Ltd.",        service: "AC Installation",   status: "in progress",   date: "Today" },
  { id: "#SRV-9019", client: "Rahim Residence", service: "Wiring Repair",  status: "pending",   date: "Today" },
  { id: "#SRV-9018", client: "City Mall",         service: "Generator Servicing", status: "in progress",   date: "Yesterday" },
  { id: "#SRV-9017", client: "Hossain Tower",   service: "Meter Installation",  status: "cancelled", date: "Yesterday" },
]

const STATUS_TONE: Record<Status, string> = {
  pending: "bg-amber-500/15 text-amber-700 dark:text-amber-400",
  "in progress": "bg-sky-500/15 text-sky-700 dark:text-sky-400",
  completed: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400",
  cancelled: "bg-rose-500/15 text-rose-700 dark:text-rose-400",
}

export function RecentOrders() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Service Requests</CardTitle>
        <CardDescription>Latest 5 service jobs and maintenance requests.</CardDescription>
      </CardHeader>
      <CardContent className="px-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-border/70 bg-muted/40 text-[11px] uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-4 py-2.5 text-left font-semibold">Job ID</th>
                <th className="px-4 py-2.5 text-left font-semibold">Client</th>
                <th className="px-4 py-2.5 text-left font-semibold">Service Type</th>
                <th className="px-4 py-2.5 text-center font-semibold">Status</th>
                <th className="px-4 py-2.5 text-right font-semibold">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {REQUESTS.map((r) => (
                <tr key={r.id} className="hover:bg-muted/30">
                  <td className="px-4 py-3 whitespace-nowrap font-medium">{r.id}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{r.client}</td>
                  <td className="px-4 py-3 font-medium">{r.service}</td>
                  <td className="px-4 py-3 text-center">
                    <Badge
                      variant="secondary"
                      className={cn("capitalize", STATUS_TONE[r.status])}
                    >
                      {r.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-right text-muted-foreground">{r.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
