"use client";

import { useState } from "react";
import { Sidebar } from "./sidebar";
import { Header } from "./header";
import { cn } from "@/lib/utils";

/**
 * 应用全局布局组件
 *
 * 组合侧边栏 + 顶栏 + 主内容区
 * 参考 demo/src/components/Layout.tsx 的结构和样式
 */
export function AppLayout({ children }: { children: React.ReactNode }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="bg-background flex h-screen overflow-hidden">
      {/* 侧边栏 */}
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      {/* 主内容区 */}
      <div
        className={cn(
          "flex flex-1 flex-col transition-all duration-200 ease-in-out",
          sidebarCollapsed ? "ml-16" : "ml-60"
        )}
      >
        {/* 顶部工具栏 */}
        <Header />

        {/* 页面内容 */}
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
