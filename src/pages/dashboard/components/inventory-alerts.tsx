import { AlertTriangle, Wrench } from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface Item {
  name: string
  sku: string
  stock: number
  threshold: number
}

const ITEMS: Item[] = [
  { name: "10mm Copper Wire", sku: "CW-10MM", stock: 4,  threshold: 20 },
  { name: "Circuit Breaker 32A", sku: "CB-32A", stock: 7,  threshold: 25 },
  { name: "Industrial Socket 16A",   sku: "IS-16A", stock: 12, threshold: 30 },
  { name: "Insulation Tape",   sku: "IT-9034", stock: 0,  threshold: 15 },
]

export function InventoryAlerts() {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="size-4 text-amber-500" /> Equipment Alerts
        </CardTitle>
        <CardDescription>Parts running low — order soon.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2.5 flex-1">
        {ITEMS.map((it) => {
          const pct = Math.min(100, (it.stock / it.threshold) * 100)
          const isOut = it.stock === 0
          return (
            <div
              key={it.sku}
              className="rounded-md border border-border/60 p-3"
            >
              <div className="flex items-center gap-3">
                <div className="grid size-8 place-items-center rounded-md bg-amber-500/10 text-amber-600">
                  <Wrench className="size-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium">{it.name}</div>
                  <div className="text-[11px] text-muted-foreground">
                    SKU {it.sku}
                  </div>
                </div>
                <div className="text-right text-sm font-semibold tabular-nums">
                  {it.stock}
                  <span className="ml-1 text-[10px] font-normal text-muted-foreground">
                    / {it.threshold}
                  </span>
                </div>
              </div>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
                <div
                  className={cn(
                    "h-full rounded-full transition-all",
                    isOut
                      ? "bg-rose-500"
                      : pct < 30
                        ? "bg-amber-500"
                        : "bg-emerald-500",
                  )}
                  style={{ width: `${isOut ? 100 : pct}%` }}
                />
              </div>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
