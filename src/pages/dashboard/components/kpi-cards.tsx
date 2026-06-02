import { SummaryCard, type SummaryCardTone } from "@/components/shared"

interface Kpi {
  title: string
  value: string | number
  trend?: string
  tone: SummaryCardTone
  data?: number[]
}

const KPIS: Kpi[] = [
  {
    title: "Total Service Revenue",
    value: "৳12,48,920",
    trend: "↑ 12.4% vs last month",
    tone: "violet",
    data: [10, 14, 11, 16, 12, 18, 22, 20, 24],
  },
  {
    title: "Active Service Contracts",
    value: "142",
    trend: "↑ 4 new this week",
    tone: "sky",
    data: [12, 13, 11, 15, 17, 18, 17, 20, 22],
  },
  {
    title: "Pending Service Requests",
    value: "38",
    trend: "↓ 5 completed today",
    tone: "teal",
    data: [25, 28, 30, 26, 35, 38, 42, 39, 38],
  },
  {
    title: "Technicians on Field",
    value: "24",
    trend: "↑ 3 more than yesterday",
    tone: "rose",
    data: [18, 19, 21, 20, 18, 22, 21, 20, 24],
  },
]

export function KpiCards() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {KPIS.map((k) => (
        <SummaryCard
          key={k.title}
          title={k.title}
          value={k.value}
          trend={k.trend}
          tone={k.tone}
          data={k.data}
        />
      ))}
    </div>
  )
}
