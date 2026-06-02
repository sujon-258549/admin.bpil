import {
  DashboardHeader,
  DepartmentDonut,
  InventoryAlerts,
  KpiCards,
  QuickActions,
  RecentActivities,
  RecentOrders,
  RevenueChart,
  SatisfactionGauge,
  SystemStatus,
  TasksCard,
  TopEmployees,
  TopProducts,
  UpcomingEvents,
  WeeklySales,
} from "./components"

// Dashboard is a thin shell — each card is a self-contained component in
// ./components. Add or rearrange sections by editing the JSX below; the
// component files own their own data + styles.
export default function DashboardPage() {
  return (
    <div className="space-y-5">
      <DashboardHeader />

      <KpiCards />

      {/* Row 1: revenue chart (wide) + job status donut */}
      <div className="grid gap-5 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RevenueChart />
        </div>
        <DepartmentDonut />
      </div>

      {/* Row 2: weekly service requests + equipment alerts */}
      <div className="grid gap-5 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <WeeklySales />
        </div>
        <InventoryAlerts />
      </div>

      {/* Row 3: recent service requests */}
      <div className="grid gap-5">
        <RecentOrders />
      </div>

      {/* Row 4: quick actions */}
      <div className="grid gap-5 lg:grid-cols-1">
        <QuickActions />
      </div>
    </div>
  )
}
