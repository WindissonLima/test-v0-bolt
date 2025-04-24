import {
  DollarSignIcon,
  ShoppingCartIcon,
  UsersIcon,
  TrendingUpIcon,
  TrendingDownIcon,
  BarChart4Icon,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export function MetricsCards() {
  return (
    <div className="*:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @5xl/main:grid-cols-4 grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card lg:px-6">
      {/* Card de Faturamento */}
      <Card className="@container/card">
        <CardHeader className="relative">
          <CardDescription className="flex items-center gap-1">
            <DollarSignIcon className="h-4 w-4 text-muted-foreground" />
            Faturamento
          </CardDescription>
          <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">R$ 125.430,00</CardTitle>
          <div className="absolute right-4 top-4">
            <Badge variant="outline" className="flex gap-1 rounded-lg text-xs">
              <TrendingUpIcon className="size-3 text-emerald-600" />
              +15.3%
            </Badge>
          </div>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-sm">
          <div className="line-clamp-1 flex gap-2 font-normal">Crescimento em relação ao mês anterior</div>
          <div className="text-muted-foreground">Último trimestre: R$ 342.890,00</div>
        </CardFooter>
      </Card>

      {/* Card de Quantidade de Vendas */}
      <Card className="@container/card">
        <CardHeader className="relative">
          <CardDescription className="flex items-center gap-1">
            <ShoppingCartIcon className="h-4 w-4 text-muted-foreground" />
            Vendas
          </CardDescription>
          <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">1.234</CardTitle>
          <div className="absolute right-4 top-4">
            <Badge variant="outline" className="flex gap-1 rounded-lg text-xs">
              <TrendingUpIcon className="size-3 text-emerald-600" />
              +8.7%
            </Badge>
          </div>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-sm">
          <div className="line-clamp-1 flex gap-2 font-normal">Aumento de 98 vendas em relação ao mês anterior</div>
          <div className="text-muted-foreground">Meta mensal: 1.500 vendas</div>
        </CardFooter>
      </Card>

      {/* Card de Novos Clientes */}
      <Card className="@container/card">
        <CardHeader className="relative">
          <CardDescription className="flex items-center gap-1">
            <UsersIcon className="h-4 w-4 text-muted-foreground" />
            Novos Clientes
          </CardDescription>
          <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">327</CardTitle>
          <div className="absolute right-4 top-4">
            <Badge variant="outline" className="flex gap-1 rounded-lg text-xs">
              <TrendingDownIcon className="size-3 text-rose-500" />
              -4.2%
            </Badge>
          </div>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-sm">
          <div className="line-clamp-1 flex gap-2 font-normal">Redução em relação ao mês anterior</div>
          <div className="text-muted-foreground">Taxa de conversão: 2.8%</div>
        </CardFooter>
      </Card>

      {/* Card de Ticket Médio */}
      <Card className="@container/card">
        <CardHeader className="relative">
          <CardDescription className="flex items-center gap-1">
            <BarChart4Icon className="h-4 w-4 text-muted-foreground" />
            Ticket Médio
          </CardDescription>
          <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">R$ 101,64</CardTitle>
          <div className="absolute right-4 top-4">
            <Badge variant="outline" className="flex gap-1 rounded-lg text-xs">
              <TrendingUpIcon className="size-3 text-emerald-600" />
              +6.1%
            </Badge>
          </div>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-sm">
          <div className="line-clamp-1 flex gap-2 font-normal">Aumento de R$ 5,82 em relação ao mês anterior</div>
          <div className="text-muted-foreground">Ticket médio anual: R$ 97,35</div>
        </CardFooter>
      </Card>
    </div>
  )
}
