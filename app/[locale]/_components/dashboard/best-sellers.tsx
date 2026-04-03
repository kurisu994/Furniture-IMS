"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function BestSellers({ className }: { className?: string }) {
  return (
    <Card className={`rounded-xl border-slate-200 shadow-sm dark:border-slate-800 dark:bg-slate-900/50 ${className || ""}`}>
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
  );
}
