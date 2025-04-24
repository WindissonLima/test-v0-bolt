import { AppSidebar } from "../../components/app-sidebar"
import { MetricsCards } from "../../components/metrics-cards"
import { RevenueChart } from "../../components/revenue-chart"
import { SiteHeader } from "../../components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"

export default function DashboardV2Page() {
  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <div className="px-4 lg:px-6">
                <h1 className="text-3xl font-bold tracking-tight">Dashboard V.2</h1>
                <p className="mt-2 text-muted-foreground">Visão geral dos principais indicadores de desempenho.</p>
              </div>

              {/* Cards de métricas */}
              <MetricsCards />

              {/* Gráfico de faturamento vs meta */}
              <div className="grid grid-cols-1 gap-4 px-4 lg:px-6">
                <RevenueChart />
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
