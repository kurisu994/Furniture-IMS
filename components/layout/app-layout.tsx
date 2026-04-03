"use client";

import { useState } from "react";
import { usePathname } from "@/i18n/navigation";
import { Sidebar } from "./sidebar";
import { Header } from "./header";
import { AppFooter } from "./app-footer";
import { cn } from "@/lib/utils";

/**
 * 应用全局布局组件
 *
 * 组合侧边栏 + 顶栏 + 主内容区
 * 参考 demo/src/components/Layout.tsx 的结构和样式
 */
export function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  /** 认证相关页面（登录、改密码等）无需主布局，直接渲染 */
  const authRoutes = ["/login", "/change-password"];
  if (authRoutes.includes(pathname)) {
    return <>{children}</>;
  }

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
        <Header onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)} />

        {/* 页面内容主体（单独滚动） */}
        <main className="flex-1 overflow-y-auto bg-slate-50/50 p-6 dark:bg-slate-950/50">
          {children}
        </main>

        {/* 固定在底部的页脚（不参与滚动） */}
        <AppFooter />
      </div>
    </div>
  );
}
