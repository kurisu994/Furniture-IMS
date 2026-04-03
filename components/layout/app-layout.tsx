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

        {/* 页面内容主体（单独滚动） */}
        <main className="flex-1 overflow-y-auto bg-slate-50/50 p-6 dark:bg-slate-950/50">
          {children}
        </main>

        {/* 固定在底部的页脚（不参与滚动） */}
        <footer className="flex shrink-0 flex-col items-center justify-between border-t border-slate-200 bg-white/50 px-6 py-4 text-xs font-medium text-slate-400 md:flex-row dark:border-slate-800 dark:bg-slate-900/50">
          <div>© 2024 云枢 (CLOUDPIVOT IMS) V2.4.0. 保留所有权利。</div>
          <div className="mt-2 flex items-center gap-6 text-[10px] tracking-widest md:mt-0">
            <a
              href="#"
              className="transition-colors hover:text-slate-600 dark:hover:text-slate-200"
            >
              服务条款
            </a>
            <a
              href="#"
              className="transition-colors hover:text-slate-600 dark:hover:text-slate-200"
            >
              隐私政策
            </a>
            <a
              href="#"
              className="transition-colors hover:text-slate-600 dark:hover:text-slate-200"
            >
              技术支持
            </a>
          </div>
        </footer>
      </div>
    </div>
  );
}
