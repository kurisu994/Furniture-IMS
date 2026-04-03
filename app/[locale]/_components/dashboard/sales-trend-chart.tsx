"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

const salesData = [
  { week: "Week 1", current: 240000, previous: 180000 },
  { week: "Week 2", current: 860000, previous: 280000 },
  { week: "Week 3", current: 1240000, previous: 350000 },
  { week: "Week 4", current: 680000, previous: 420000 },
];

const salesConfig = {
  current: { label: "当前周期", color: "#294985" },
  previous: { label: "上一个周期", color: "#6b85c1" },
} satisfies ChartConfig;

export function SalesTrendChart({ className }: { className?: string }) {
  return (
    <Card className={`rounded-xl border-slate-200 shadow-sm dark:border-slate-800 dark:bg-slate-900/50 ${className || ""}`}>
      <CardHeader className="flex flex-row items-center justify-between pb-6">
        <CardTitle className="text-base font-bold text-slate-800 dark:text-slate-100">
          近30天销售趋势 (Sales Trend)
        </CardTitle>
        <span className="text-xs text-slate-400">单位: USD</span>
      </CardHeader>
      <CardContent>
        <ChartContainer config={salesConfig} className="h-[250px] min-h-[250px] w-full min-w-full">
          <BarChart accessibilityLayer data={salesData} margin={{ top: 20, left: -20, right: 10 }}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" opacity={0.5} />
            <XAxis
              dataKey="week"
              tickLine={false}
              tickMargin={15}
              axisLine={false}
              fontSize={12}
              fontWeight={600}
              className="text-slate-400 uppercase tracking-wider"
            />
            <YAxis 
              tickLine={false}
              axisLine={false}
              tickMargin={10}
              fontSize={11}
              className="text-slate-400"
              tickFormatter={(value) => `$${value/1000}k`}
            />
            <ChartTooltip
              cursor={{ fill: "rgba(0,0,0,0.05)" }}
              content={<ChartTooltipContent indicator="dashed" className="w-[180px]" />}
            />
            <Bar dataKey="previous" fill="var(--color-previous)" radius={[4, 4, 0, 0]} />
            <Bar dataKey="current" fill="var(--color-current)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
