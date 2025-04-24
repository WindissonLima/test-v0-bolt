import { notFound } from "next/navigation"
import { AppSidebar } from "@/components/app-sidebar"
import { ProductDetailView } from "@/components/product-detail-view"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"

// Lista de IDs de produtos válidos para simulação
const validProductIds = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"]

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  // Verificar se o ID é válido - se não for, retornar 404
  if (!validProductIds.includes(params.id)) {
    notFound()
  }

  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <div className="px-4 lg:px-6">
                <h1 className="text-3xl font-bold tracking-tight">Detalhes do Produto</h1>
                <p className="mt-2 text-muted-foreground">Visualize e edite as informações do produto #{params.id}.</p>
              </div>

              <div className="px-4 lg:px-6">
                <ProductDetailView productId={params.id} />
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
