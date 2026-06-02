import ReactApexChart from "react-apexcharts"
import type { ApexOptions } from "apexcharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

const labels = [
  "Pending",
  "In Progress",
  "Completed",
  "On Hold",
  "Cancelled",
]
const series = [38, 22, 118, 14, 9]

const options: ApexOptions = {
  chart: { type: "donut", fontFamily: "inherit" },
  labels,
  colors: ["#f59e0b", "#0ea5e9", "#10b981", "#8b5cf6", "#ec4899"],
  legend: { position: "bottom", fontSize: "12px" },
  dataLabels: { enabled: false },
  stroke: { width: 2, colors: ["#ffffff"] },
  plotOptions: {
    pie: {
      donut: {
        size: "70%",
        labels: {
          show: true,
          total: {
            show: true,
            label: "Total Requests",
            fontSize: "12px",
            color: "#6b7280",
          },
        },
      },
    },
  },
  tooltip: { theme: "light", y: { formatter: (v: number) => `${v} requests` } },
}

export function DepartmentDonut() {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>Request Status Distribution</CardTitle>
        <CardDescription>
          Current breakdown of all active service requests.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        <ReactApexChart
          options={options}
          series={series}
          type="donut"
          height={300}
        />
      </CardContent>
    </Card>
  )
}
