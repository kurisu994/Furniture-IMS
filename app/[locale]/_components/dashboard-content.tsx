"use client";

import { useTranslations } from "next-intl";

/**
 * 首页看板内容组件
 *
 * TODO: 后续接入真实数据，添加 KPI 卡片、趋势图、待办事项等
 */
export function DashboardContent() {
  const t = useTranslations();

  return (
    <>
      {/* 页面标题 */}
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-foreground text-2xl font-bold">
          {t("dashboard.title")}
        </h1>
      </div>

      {/* KPI 卡片区域 */}
      <div className="mb-6 grid grid-cols-4 gap-4">
        {[
          { label: t("dashboard.todaySales"), value: "--", color: "text-chart-1" },
          { label: t("dashboard.monthSales"), value: "--", color: "text-chart-2" },
          { label: t("dashboard.todayPurchase"), value: "--", color: "text-chart-4" },
          { label: t("dashboard.lowStock"), value: "--", color: "text-chart-5" },
        ].map((item) => (
          <div
            key={item.label}
            className="border-border bg-card rounded-xl border p-5 shadow-sm"
          >
            <p className="text-muted-foreground mb-3 text-xs font-semibold tracking-wider">
              {item.label}
            </p>
            <p className={`text-2xl font-bold ${item.color}`}>{item.value}</p>
          </div>
        ))}
      </div>

      {/* 图表占位 */}
      <div className="grid grid-cols-12 gap-4">
        <div className="border-border bg-card col-span-8 rounded-xl border p-6 shadow-sm">
          <h3 className="text-foreground mb-4 font-bold">
            {t("dashboard.salesTrend")}
          </h3>
          <div className="text-muted-foreground flex h-48 items-center justify-center text-sm">
            图表区域 — 待接入 Recharts
          </div>
        </div>
        <div className="border-border bg-card col-span-4 rounded-xl border p-6 shadow-sm">
          <h3 className="text-foreground mb-4 font-bold">
            {t("dashboard.stockDistribution")}
          </h3>
          <div className="text-muted-foreground flex h-48 items-center justify-center text-sm">
            图表区域 — 待接入 Recharts
          </div>
        </div>
      </div>
    </>
  );
}
