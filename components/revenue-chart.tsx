"use client"

import * as React from "react"
import { Area, CartesianGrid, ComposedChart, Legend, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

// Dados fictícios para o gráfico
const generateChartData = () => {
  const data = []
  let accumulatedTarget = 0
  let accumulatedRevenue = 0
  const dailyTarget = 125000 / 30 // Meta mensal dividida por 30 dias

  for (let day = 1; day <= 30; day++) {
    // Acumula a meta diariamente (constante)
    accumulatedTarget += dailyTarget

    // Gera um valor aleatório para o faturamento diário
    // Com uma variação que faz o faturamento ficar próximo da meta
    const dailyRevenue = dailyTarget * (0.7 + Math.random() * 0.6)
    accumulatedRevenue += dailyRevenue

    // Formata os valores para exibição
    const formattedTarget = Math.round(accumulatedTarget)
    const formattedRevenue = Math.round(accumulatedRevenue)

    data.push({
      day: `${day}`,
      target: formattedTarget,
      revenue: day <= 22 ? formattedRevenue : null, // Assume que estamos no dia 22 do mês
    })
  }

  return data
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

// Componente personalizado para a legenda
const CustomLegend = (props: any) => {
  const { payload } = props

  // Verificar se payload existe e é um array
  if (!payload || !Array.isArray(payload) || payload.length === 0) {
    return (
      <div className="flex items-center justify-center gap-6 pt-2 text-sm">
        <div className="flex items-center gap-2">
          <div className="h-3 w-6 rounded-sm bg-gradient-to-r from-gray-700 to-gray-900"></div>
          <span className="text-xs text-muted-foreground">Faturamento Real</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-[2px] w-6 border-t-2 border-dashed border-muted-foreground"></div>
          <span className="text-xs text-muted-foreground">Meta Acumulada</span>
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center gap-6 pt-2 text-sm">
      {payload.map((entry: any, index: number) => {
        const isTarget = entry.dataKey === "target"
        return (
          <div key={`item-${index}`} className="flex items-center gap-2">
            {isTarget ? (
              <div className="h-[2px] w-6 border-t-2 border-dashed border-muted-foreground"></div>
            ) : (
              <div className="h-3 w-6 rounded-sm bg-gradient-to-r from-gray-700 to-gray-900"></div>
            )}
            <span className="text-xs text-muted-foreground">
              {entry.dataKey === "revenue" ? "Faturamento Real" : "Meta Acumulada"}
            </span>
          </div>
        )
      })}
    </div>
  )
}

export function RevenueChart() {
  const data = React.useMemo(() => generateChartData(), [])

  return (
    <Card className="col-span-full">
      <CardHeader>
        <CardTitle>Faturamento vs. Meta Acumulada</CardTitle>
        <CardDescription>Comparação entre o faturamento real e a meta acumulada do mês atual</CardDescription>
      </CardHeader>
      <CardContent>
        <style jsx global>{`
          .recharts-wrapper .recharts-surface {
            overflow: visible;
          }
        `}</style>
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={data}
              margin={{
                top: 20,
                right: 10, // Reduzido de 30 para 10
                left: 10, // Reduzido de 20 para 10
                bottom: 10,
              }}
            >
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="rgba(45, 45, 45, 0.8)" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="rgba(45, 45, 45, 0.1)" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
              <XAxis
                dataKey="day"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => `${value}`}
                tick={{ fontSize: 11 }}
                // Reduzir o número de ticks no eixo X para mobile
                interval="preserveStartEnd"
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => {
                  if (value >= 1000000) {
                    return `${(value / 1000000).toFixed(1)}M`
                  } else if (value >= 1000) {
                    return `${(value / 1000).toFixed(0)}K`
                  }
                  return value
                }}
                tick={{ fontSize: 11 }}
                // Reduzir o número de ticks no eixo Y
                interval={1}
                width={40} // Limitar a largura do eixo Y
              />
              <Tooltip
                formatter={(value) => formatCurrency(Number(value))}
                labelFormatter={(label) => `Dia ${label}`}
                contentStyle={{ borderRadius: "8px", border: "1px solid hsl(var(--border))" }}
              />
              <Legend content={<CustomLegend />} />

              {/* Área preenchida para o faturamento real */}
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="rgba(45, 45, 45, 0.9)"
                strokeWidth={2}
                fill="url(#colorRevenue)"
                fillOpacity={1}
                dot={false}
                activeDot={{ r: 6, fill: "rgba(45, 45, 45, 0.9)" }}
                animationDuration={1500}
                animationEasing="ease-out"
              />

              {/* Linha tracejada para a meta */}
              <Line
                type="monotone"
                dataKey="target"
                stroke="hsl(var(--muted-foreground))"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={false}
                animationDuration={1500}
                animationEasing="ease-out"
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
