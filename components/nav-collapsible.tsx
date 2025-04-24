"use client"

import * as React from "react"
import { ChevronDown, type LucideIcon } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { cn } from "@/lib/utils"
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"

interface NavItem {
  title: string
  url: string
  icon?: LucideIcon
  items?: {
    title: string
    url: string
    isActive?: boolean
  }[]
}

export function NavCollapsible({
  items,
  ...props
}: {
  items: NavItem[]
} & React.ComponentPropsWithoutRef<typeof SidebarGroup>) {
  const pathname = usePathname()

  // Usar um objeto para rastrear o estado de cada menu colapsável
  const [openItems, setOpenItems] = React.useState<Record<string, boolean>>(() => {
    // Inicializar com os itens que têm subitens ativos ou que correspondem ao caminho atual
    const initialState: Record<string, boolean> = {}
    items.forEach((item) => {
      // Verificar se algum subitem corresponde ao caminho atual
      const hasActiveSubItem = item.items?.some((subItem) => {
        // Verificar se o caminho atual é exatamente igual à URL do subitem
        // ou se o caminho atual começa com a URL do subitem (para rotas aninhadas)
        return pathname === subItem.url || pathname.startsWith(subItem.url + "/")
      })
      initialState[item.title] = hasActiveSubItem || false
    })
    return initialState
  })

  const toggleItem = (title: string) => {
    setOpenItems((prev) => ({
      ...prev,
      [title]: !prev[title],
    }))
  }

  return (
    <SidebarGroup {...props}>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => {
            // Verificar se este item tem algum subitem ativo
            const hasActiveSubItem = item.items?.some(
              (subItem) => pathname === subItem.url || pathname.startsWith(subItem.url + "/"),
            )

            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  onClick={() => toggleItem(item.title)}
                  className={cn(
                    "w-full justify-between",
                    (openItems[item.title] || hasActiveSubItem) && "bg-sidebar-accent text-sidebar-accent-foreground",
                  )}
                >
                  <div className="flex items-center gap-2">
                    {item.icon && <item.icon className="h-4 w-4" />}
                    <span>{item.title}</span>
                  </div>
                  {item.items && item.items.length > 0 && (
                    <ChevronDown
                      className={cn(
                        "ml-auto h-4 w-4 shrink-0 transition-transform duration-200",
                        openItems[item.title] && "rotate-180",
                      )}
                    />
                  )}
                </SidebarMenuButton>
                {item.items && item.items.length > 0 && openItems[item.title] && (
                  <SidebarMenuSub>
                    {item.items.map((subItem) => {
                      // Verificar se este subitem está ativo
                      const isActive = pathname === subItem.url || pathname.startsWith(subItem.url + "/")

                      return (
                        <SidebarMenuSubItem key={subItem.title}>
                          <SidebarMenuSubButton asChild isActive={isActive}>
                            <Link href={subItem.url}>{subItem.title}</Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      )
                    })}
                  </SidebarMenuSub>
                )}
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
