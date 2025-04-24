import { AppSidebar } from "@/components/app-sidebar"
import { NewProductForm } from "@/components/new-product-form"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"

export default function NovoProdutoPage() {
  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <div className="px-4 lg:px-6">
                <h1 className="text-3xl font-bold tracking-tight">Novo Produto</h1>
                <p className="mt-2 text-muted-foreground">
                  Preencha as informações para adicionar um novo produto ao catálogo.
                </p>
              </div>

              <div className="px-4 lg:px-6">
                <NewProductForm />
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
