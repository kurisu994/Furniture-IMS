"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, FileCheck, Truck, AlertCircle } from "lucide-react";

export function PendingTasks({ className }: { className?: string }) {
  return (
    <Card className={`rounded-xl border-slate-200 shadow-sm dark:border-slate-800 dark:bg-slate-900/50 ${className || ""}`}>
      <CardHeader className="pb-4">
        <CardTitle className="text-sm font-bold tracking-wider text-slate-800 uppercase border-b border-slate-100 dark:border-slate-800 pb-3 dark:text-slate-100">
          待办事项 (Pending Tasks)
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-start gap-3 rounded border-l-4 border-l-red-500 bg-red-50 p-3 dark:bg-red-500/10">
          <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-500 mt-0.5" />
          <div>
            <p className="text-xs font-bold text-red-900 dark:text-red-400">12项库存安全预警</p>
            <p className="text-[10px] text-red-700 dark:text-red-500/80 mt-0.5">库存低于最低水位，请尽快补货</p>
          </div>
        </div>
        <div className="flex items-start gap-3 rounded border-l-4 border-l-orange-500 bg-orange-50 p-3 dark:bg-orange-500/10">
          <FileCheck className="h-5 w-5 text-orange-600 dark:text-orange-500 mt-0.5" />
          <div>
            <p className="text-xs font-bold text-orange-900 dark:text-orange-400">3笔采购单待审核</p>
            <p className="text-[10px] text-orange-700 dark:text-orange-500/80 mt-0.5">来自采购部，预计总额 $45,000</p>
          </div>
        </div>
        <div className="flex items-start gap-3 rounded border-l-4 border-l-blue-500 bg-blue-50 p-3 dark:bg-blue-500/10">
          <Truck className="h-5 w-5 text-blue-600 dark:text-blue-500 mt-0.5" />
          <div>
            <p className="text-xs font-bold text-blue-900 dark:text-blue-400">5笔出库确认</p>
            <p className="text-[10px] text-blue-700 dark:text-blue-500/80 mt-0.5">待仓库管理人员核对装车单</p>
          </div>
        </div>
        <div className="flex items-start gap-3 rounded border-l-4 border-l-slate-400 bg-slate-50 p-3 dark:bg-slate-800">
          <AlertCircle className="h-5 w-5 text-slate-600 dark:text-slate-400 mt-0.5" />
          <div>
            <p className="text-xs font-bold text-slate-900 dark:text-slate-300">2笔超期应收账款</p>
            <p className="text-[10px] text-slate-600 dark:text-slate-400 mt-0.5">账龄已超过45天，请及时跟催</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
