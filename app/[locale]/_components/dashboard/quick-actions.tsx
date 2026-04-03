"use client";

import { Button } from "@/components/ui/button";
import { Zap, ShoppingCart, ReceiptText, PackagePlus, PackageMinus } from "lucide-react";

export function QuickActions() {
  return (
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
  );
}
