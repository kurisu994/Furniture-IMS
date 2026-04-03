"use client";

import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  RefreshCcw,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Wallet,
  CreditCard,
  RefreshCw,
  Zap,
  ShoppingCart,
  ReceiptText,
  PackagePlus,
  PackageMinus,
  FileCheck,
  Truck,
  AlertCircle
} from "lucide-react";
import { 
  Bar, 
  BarChart, 
  CartesianGrid, 
  XAxis, 
  Pie, 
  PieChart, 
  Cell, 
  Label, 
  Area, 
  AreaChart, 
  YAxis
} from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

// === Mock Data Section === //

const salesData = [
  { week: "Week 1", current: 240000, previous: 180000 },
  { week: "Week 2", current: 860000, previous: 280000 },
  { week: "Week 3", current: 1240000, previous: 350000 },
  { week: "Week 4", current: 680000, previous: 420000 },
];

const salesConfig = {
  current: {
    label: "当前周期",
    color: "#294985",
  },
  previous: {
    label: "上一个周期",
    color: "#6b85c1", // 浅一层的蓝色
  },
} satisfies ChartConfig;


const inventoryData = [
  { name: "实木板材", value: 1200000, fill: "#294985" },
  { name: "成品家具", value: 980000, fill: "#43619f" },
  { name: "五金配件", value: 750000, fill: "#944a00" },
  { name: "其他耗材", value: 520000, fill: "#cbd5e1" }, // slate-300
];

const inventoryConfig = {
  value: {
    label: "资产预估 (USD)",
  },
} satisfies ChartConfig;


const purchaseData = [
  { date: "03-01", value: 1200000000 },
  { date: "03-04", value: 1600000000 },
  { date: "03-08", value: 850000000 },
  { date: "03-12", value: 2150000000 },
  { date: "03-15", value: 3250000000 },
  { date: "03-20", value: 2800000000 },
  { date: "03-22", value: 4250000000 },
  { date: "03-28", value: 3600000000 },
  { date: "03-31", value: 2800000000 },
];

const purchaseConfig = {
  value: {
    label: "采购额 (VND ₫)",
    color: "#944a00",
  },
} satisfies ChartConfig;

// ========================= //


export function DashboardContent() {
  const t = useTranslations();

  return (
    <div className="space-y-6 pb-8">
      {/* Dashboard Header */}
      <div className="mt-2 flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight text-slate-800 dark:text-slate-100">首页看板</h2>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="gap-2 bg-slate-100 border-none hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
            <RefreshCcw className="h-4 w-4" />
            刷新数据
          </Button>
        </div>
      </div>

      {/* Row 1: Primary KPIs */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="rounded-xl border-slate-200 shadow-sm dark:border-slate-800 dark:bg-slate-900/50">
          <CardHeader className="flex flex-row items-start justify-between space-y-0 p-5 pb-3">
            <span className="text-xs font-semibold tracking-wider text-slate-500">
              今日销售额
            </span>
            <Badge className="bg-emerald-50 hover:bg-emerald-50 text-emerald-600 shadow-none border-none font-bold px-2 py-0.5 dark:bg-emerald-500/10 dark:text-emerald-400">
              +5.2% <TrendingUp className="ml-0.5 h-3.5 w-3.5" />
            </Badge>
          </CardHeader>
          <CardContent className="p-5 pt-0">
            <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100">$125,800</h3>
            <p className="mt-2 text-[10px] text-slate-400">较昨日上涨</p>
          </CardContent>
        </Card>

        <Card className="rounded-xl border-slate-200 shadow-sm dark:border-slate-800 dark:bg-slate-900/50">
          <CardHeader className="flex flex-row items-start justify-between space-y-0 p-5 pb-3">
            <span className="text-xs font-semibold tracking-wider text-slate-500">
              本月累计销售
            </span>
            <Badge className="bg-emerald-50 hover:bg-emerald-50 text-emerald-600 shadow-none border-none font-bold px-2 py-0.5 dark:bg-emerald-500/10 dark:text-emerald-400">
              +12.8% <TrendingUp className="ml-0.5 h-3.5 w-3.5" />
            </Badge>
          </CardHeader>
          <CardContent className="p-5 pt-0">
            <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100">$3,582,000</h3>
            <p className="mt-2 text-[10px] text-slate-400">
              进度：85% (目标 $4.2M)
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-xl border-slate-200 shadow-sm dark:border-slate-800 dark:bg-slate-900/50">
          <CardHeader className="flex flex-row items-start justify-between space-y-0 p-5 pb-3">
            <span className="text-xs font-semibold tracking-wider text-slate-500">
              今日采购额
            </span>
            <Badge className="bg-rose-50 hover:bg-rose-50 text-rose-600 shadow-none border-none font-bold px-2 py-0.5 dark:bg-rose-500/10 dark:text-rose-400">
              -3.1% <TrendingDown className="ml-0.5 h-3.5 w-3.5" />
            </Badge>
          </CardHeader>
          <CardContent className="p-5 pt-0">
            <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100">$83,200</h3>
            <p className="mt-2 text-[10px] text-slate-400">主要为木材原材料</p>
          </CardContent>
        </Card>

        <Card className="rounded-xl border-slate-200 border-l-4 border-l-[#944a00] shadow-sm dark:border-slate-800 dark:bg-slate-900/50">
          <CardHeader className="flex flex-row items-start justify-between space-y-0 p-5 pb-3">
            <span className="text-xs font-semibold tracking-wider text-slate-500">
              库存预警
            </span>
            <Badge className="bg-orange-50 hover:bg-orange-50 text-orange-600 shadow-none border-none font-bold px-2 py-0.5 dark:bg-orange-500/10 dark:text-orange-400">
              +3 <AlertTriangle className="ml-0.5 h-3.5 w-3.5" />
            </Badge>
          </CardHeader>
          <CardContent className="p-5 pt-0">
            <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100">12 项</h3>
            <p className="mt-2 text-[10px] text-slate-400">低于安全库存水位</p>
          </CardContent>
        </Card>
      </div>

      {/* Row 2: Secondary KPIs */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="flex items-center gap-4 rounded-xl bg-slate-50 p-4 dark:bg-slate-900/50">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
            <Wallet className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[11px] font-bold tracking-tight text-slate-500 uppercase">
              待收款 (A/R)
            </p>
            <p className="text-lg font-bold text-slate-800 dark:text-slate-200">$865,000</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4 rounded-xl bg-slate-50 p-4 dark:bg-slate-900/50">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400">
            <CreditCard className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[11px] font-bold tracking-tight text-slate-500 uppercase">
              待付款 (A/P)
            </p>
            <p className="text-lg font-bold text-slate-800 dark:text-slate-200">$423,000</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4 rounded-xl bg-slate-50 p-4 dark:bg-slate-900/50">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
            <RefreshCw className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[11px] font-bold tracking-tight text-slate-500 uppercase">
              补货项 (Pending)
            </p>
            <p className="text-lg font-bold text-slate-800 dark:text-slate-200">8 项目</p>
          </div>
        </div>
      </div>

      {/* Quick Action Bar */}
      <div className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 p-4 dark:bg-slate-900/50 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <Zap className="h-5 w-5 text-slate-400" />
          <span className="text-xs font-bold tracking-widest text-slate-600 uppercase dark:text-slate-400">
            快捷操作 Quick Actions
          </span>
        </div>
        <div className="flex flex-wrap gap-4">
          <Button className="bg-[#294985] hover:bg-[#294985]/90 text-white border-none shadow-md gap-2 rounded-lg font-semibold h-[40px] px-4">
            <ShoppingCart className="h-[18px] w-[18px]" />
            新建采购单
          </Button>
          <Button variant="outline" className="bg-white border-slate-200 text-slate-700 hover:bg-slate-50 shadow-sm gap-2 rounded-lg font-semibold h-[40px] px-4 dark:bg-slate-950 dark:border-slate-800 dark:text-slate-300">
            <ReceiptText className="h-[18px] w-[18px] text-[#294985] dark:text-[#43619f]" />
            新建销售单
          </Button>
          <Button variant="outline" className="bg-white border-slate-200 text-slate-700 hover:bg-slate-50 shadow-sm gap-2 rounded-lg font-semibold h-[40px] px-4 dark:bg-slate-950 dark:border-slate-800 dark:text-slate-300">
            <PackagePlus className="h-[18px] w-[18px] text-[#944a00] dark:text-orange-500" />
            采购入库
          </Button>
          <Button variant="outline" className="bg-white border-slate-200 text-slate-700 hover:bg-slate-50 shadow-sm gap-2 rounded-lg font-semibold h-[40px] px-4 dark:bg-slate-950 dark:border-slate-800 dark:text-slate-300">
            <PackageMinus className="h-[18px] w-[18px] text-[#944a00] dark:text-orange-500" />
            销售出库
          </Button>
        </div>
      </div>

      {/* Row 3: Sales Trend & Inventory Distribution */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Sales Trend Bar Chart */}
        <Card className="col-span-1 md:col-span-8 rounded-xl border-slate-200 shadow-sm dark:border-slate-800 dark:bg-slate-900/50">
          <CardHeader className="flex flex-row items-center justify-between pb-6">
            <CardTitle className="text-base font-bold text-slate-800 dark:text-slate-100">
              近30天销售趋势 (Sales Trend)
            </CardTitle>
            <span className="text-xs text-slate-400">单位: USD</span>
          </CardHeader>
          <CardContent>
            <ChartContainer config={salesConfig} className="h-[250px] w-full">
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

        {/* Inventory Distribution Pie Chart */}
        <Card className="col-span-1 md:col-span-4 rounded-xl border-slate-200 shadow-sm dark:border-slate-800 dark:bg-slate-900/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-bold text-slate-800 dark:text-slate-100">
              库存分布 (Inventory Distribution)
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center p-0 pb-6">
            <ChartContainer
              config={inventoryConfig}
              className="mx-auto w-full h-[220px]"
            >
              <PieChart>
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Pie
                  data={inventoryData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={50}
                  outerRadius={90}
                  strokeWidth={2}
                  paddingAngle={2}
                >
                  <Label
                    content={({ viewBox }) => {
                      if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                        return (
                          <text
                            x={viewBox.cx}
                            y={viewBox.cy}
                            textAnchor="middle"
                            dominantBaseline="middle"
                          >
                            <tspan
                              x={viewBox.cx}
                              y={viewBox.cy}
                              className="fill-slate-800 dark:fill-slate-100 text-2xl font-bold"
                            >
                              100%
                            </tspan>
                            <tspan
                              x={viewBox.cx}
                              y={(viewBox.cy || 0) + 20}
                              className="fill-slate-500 dark:fill-slate-400 text-xs font-medium"
                            >
                              总库存
                            </tspan>
                          </text>
                        );
                      }
                    }}
                  />
                </Pie>
              </PieChart>
            </ChartContainer>
            
            <div className="w-full px-6 space-y-2.5 mt-2">
              {inventoryData.map((item) => (
                <div key={item.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5 text-slate-600 dark:text-slate-300">
                    <span 
                      className="h-2.5 w-2.5 rounded-sm" 
                      style={{ backgroundColor: item.fill }}
                    />
                    {item.name}
                  </div>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    ${(item.value / 1000).toFixed(0)}K
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Row 4: Top 10 Best Sellers & Pending Tasks */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Best Sellers */}
        <Card className="col-span-1 md:col-span-8 rounded-xl border-slate-200 shadow-sm dark:border-slate-800 dark:bg-slate-900/50">
          <CardHeader className="pb-6">
            <CardTitle className="text-base font-bold text-slate-800 dark:text-slate-100">
              热销产品 TOP 10 (Best Sellers)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-slate-700 dark:text-slate-300">橡木A级板材 (Oak Wood Panel A-Grade)</span>
                <span className="text-[#294985] dark:text-[#6b85c1] font-bold">842 Units</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                <div className="bg-[#294985] dark:bg-[#6b85c1] h-full rounded-full" style={{ width: "92%" }}></div>
              </div>
            </div>
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-slate-700 dark:text-slate-300">45mm 不锈钢支架 (Steel Bracket 45mm)</span>
                <span className="text-[#294985] dark:text-[#6b85c1] font-bold">756 Units</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                <div className="bg-[#294985] dark:bg-[#6b85c1] h-full rounded-full" style={{ width: "81%" }}></div>
              </div>
            </div>
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-slate-700 dark:text-slate-300">标准餐桌套装 (Standard Dining Table Set)</span>
                <span className="text-[#294985] dark:text-[#6b85c1] font-bold">620 Units</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                <div className="bg-[#294985] dark:bg-[#6b85c1] h-full rounded-full" style={{ width: "65%" }}></div>
              </div>
            </div>
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-slate-700 dark:text-slate-300">工业胶水 X2 (Industrial Adhesive X2)</span>
                <span className="text-[#294985] dark:text-[#6b85c1] font-bold">544 Units</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                <div className="bg-[#294985] dark:bg-[#6b85c1] h-full rounded-full" style={{ width: "58%" }}></div>
              </div>
            </div>
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-slate-700 dark:text-slate-300">皮革沙发套装 (Leather Sofa Set)</span>
                <span className="text-[#294985] dark:text-[#6b85c1] font-bold">410 Units</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                <div className="bg-[#294985] dark:bg-[#6b85c1] h-full rounded-full" style={{ width: "44%" }}></div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pending Tasks */}
        <Card className="col-span-1 md:col-span-4 rounded-xl border-slate-200 shadow-sm dark:border-slate-800 dark:bg-slate-900/50">
          <CardHeader className="pb-4">
            <CardTitle className="text-sm font-bold tracking-wider text-slate-800 uppercase border-b border-slate-100 dark:border-slate-800 pb-3 dark:text-slate-100">
              待办事项 (Pending Tasks)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start gap-3 rounded border-l-4 border-l-red-500 bg-red-50 p-3 dark:bg-red-500/10">
              <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-500 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-red-900 dark:text-red-400">
                  12项库存安全预警
                </p>
                <p className="text-[10px] text-red-700 dark:text-red-500/80 mt-0.5">
                  库存低于最低水位，请尽快补货
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded border-l-4 border-l-orange-500 bg-orange-50 p-3 dark:bg-orange-500/10">
              <FileCheck className="h-5 w-5 text-orange-600 dark:text-orange-500 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-orange-900 dark:text-orange-400">
                  3笔采购单待审核
                </p>
                <p className="text-[10px] text-orange-700 dark:text-orange-500/80 mt-0.5">
                  来自采购部，预计总额 $45,000
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded border-l-4 border-l-blue-500 bg-blue-50 p-3 dark:bg-blue-500/10">
              <Truck className="h-5 w-5 text-blue-600 dark:text-blue-500 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-blue-900 dark:text-blue-400">5笔出库确认</p>
                <p className="text-[10px] text-blue-700 dark:text-blue-500/80 mt-0.5">
                  待仓库管理人员核对装车单
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded border-l-4 border-l-slate-400 bg-slate-50 p-3 dark:bg-slate-800">
              <AlertCircle className="h-5 w-5 text-slate-600 dark:text-slate-400 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-slate-300">
                  2笔超期应收账款
                </p>
                <p className="text-[10px] text-slate-600 dark:text-slate-400 mt-0.5">
                  账龄已超过45天，请及时跟催
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Row 5: Purchase Trend Area Chart */}
      <Card className="rounded-xl border-slate-200 shadow-sm dark:border-slate-800 dark:bg-slate-900/50 mt-6">
        <CardHeader className="flex flex-row items-center justify-between pb-6">
          <CardTitle className="text-base font-bold text-slate-800 dark:text-slate-100">
            近30天采购趋势 (Purchase Trend)
          </CardTitle>
          <span className="text-xs text-slate-400">单位: 越南盾 (₫)</span>
        </CardHeader>
        <CardContent>
          <ChartContainer config={purchaseConfig} className="h-[250px] w-full">
            <AreaChart accessibilityLayer data={purchaseData} margin={{ top: 10, left: 0, right: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="fillPurchase" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-value)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="var(--color-value)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} strokeDasharray="3 3" opacity={0.3} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={12}
                fontSize={11}
                className="font-bold text-slate-400"
              />
              <YAxis 
                tickLine={false}
                axisLine={false}
                tickMargin={12}
                fontSize={11}
                className="text-slate-400"
                tickFormatter={(val) => `${(val / 1000000000).toFixed(1)}B`}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent className="min-w-[150px]" />}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke="var(--color-value)"
                strokeWidth={2}
                fill="url(#fillPurchase)"
                fillOpacity={1}
                activeDot={{ r: 6, strokeWidth: 0, fill: "var(--color-value)" }}
              />
            </AreaChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}
