"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, AlertTriangle, Wallet, CreditCard, RefreshCw } from "lucide-react";

export function MetricsCards() {
  return (
    <>
      {/* Primary KPIs */}
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
            <p className="mt-2 text-[10px] text-slate-400">进度：85% (目标 $4.2M)</p>
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

      {/* Secondary KPIs */}
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
    </>
  );
}
