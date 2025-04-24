import { AppSidebar } from "@/components/app-sidebar"
import { ProductsTable } from "@/components/products-table"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"

export default function MeusProdutosPage() {
  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <div className="px-4 lg:px-6">
                <h1 className="text-3xl font-bold tracking-tight">Meus Produtos</h1>
                <p className="mt-2 text-muted-foreground">Gerencie seu catálogo de produtos e estoque.</p>
              </div>

              <div className="px-4 lg:px-6">
                <ProductsTable />
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
