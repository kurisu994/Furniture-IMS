"use client";

import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import { Bell, Search, Sun, Moon, User } from "lucide-react";
import { LocaleSwitcher } from "./locale-switcher";

/**
 * 顶部工具栏组件
 *
 * 包含搜索框、语言切换、主题切换、通知和用户信息
 */
export function Header() {
  const t = useTranslations("header");
  const { theme, setTheme } = useTheme();

  return (
    <header className="border-border bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-20 flex h-14 items-center justify-between border-b px-6 backdrop-blur">
      {/* 搜索框 */}
      <div className="relative max-w-md flex-1">
        <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
        <input
          type="text"
          placeholder={t("search")}
          className="border-input bg-background text-foreground placeholder:text-muted-foreground focus:ring-ring/20 focus:border-ring h-9 w-full rounded-lg border pr-4 pl-9 text-sm transition-all focus:ring-2 focus:outline-none"
        />
      </div>

      {/* 右侧工具区 */}
      <div className="flex items-center gap-1">
        {/* 语言切换器 */}
        <LocaleSwitcher />

        {/* 主题切换 */}
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="text-muted-foreground hover:bg-accent hover:text-accent-foreground flex h-9 w-9 items-center justify-center rounded-lg transition-colors"
          title={t("theme")}
        >
          <Sun className="h-4 w-4 scale-100 rotate-0 transition-transform dark:scale-0 dark:-rotate-90" />
          <Moon className="absolute h-4 w-4 scale-0 rotate-90 transition-transform dark:scale-100 dark:rotate-0" />
        </button>

        {/* 通知 */}
        <button
          className="text-muted-foreground hover:bg-accent hover:text-accent-foreground relative flex h-9 w-9 items-center justify-center rounded-lg transition-colors"
          title={t("notifications")}
        >
          <Bell className="h-4 w-4" />
          {/* 通知红点 */}
          <span className="bg-destructive absolute top-2 right-2 h-2 w-2 rounded-full" />
        </button>

        {/* 分隔线 */}
        <div className="bg-border mx-2 h-6 w-px" />

        {/* 用户信息 */}
        <button className="text-foreground hover:bg-accent flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm font-medium transition-colors">
          <div className="bg-primary text-primary-foreground flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold">
            <User className="h-3.5 w-3.5" />
          </div>
          <span className="hidden text-sm md:block">Admin</span>
        </button>
      </div>
    </header>
  );
}
