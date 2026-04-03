"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { usePathname } from "@/i18n/navigation";
import { Link } from "@/i18n/navigation";
import { ChevronDown, PanelLeftClose, PanelLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { navConfig, type NavItem } from "@/config/nav";

interface SidebarProps {
  /** 侧边栏是否折叠 */
  collapsed: boolean;
  /** 切换折叠状态 */
  onToggle: () => void;
}

/**
 * 侧边栏组件
 *
 * 参考 demo/src/components/Layout.tsx 样式实现
 * 支持折叠（64px）/ 展开（240px）两种模式
 */
export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const t = useTranslations();
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "border-sidebar-border bg-sidebar fixed top-0 left-0 z-30 flex h-full flex-col border-r transition-all duration-200 ease-in-out",
        collapsed ? "w-16" : "w-60"
      )}
    >
      {/* Logo 区域 */}
      <div className="border-sidebar-border flex h-14 items-center border-b px-4">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="bg-primary text-primary-foreground flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-sm font-bold">
            CP
          </div>
          {!collapsed && (
            <span className="text-sidebar-foreground truncate text-sm font-bold">
              CloudPivot IMS
            </span>
          )}
        </div>
      </div>

      {/* 导航菜单 */}
      <nav className="flex-1 overflow-x-hidden overflow-y-auto px-2 py-3">
        <ul className="space-y-0.5">
          {navConfig.map((item) => (
            <NavMenuItem
              key={item.titleKey}
              item={item}
              collapsed={collapsed}
              pathname={pathname}
              t={t}
            />
          ))}
        </ul>
      </nav>

      {/* 折叠按钮 */}
      <div className="border-sidebar-border border-t p-2">
        <button
          onClick={onToggle}
          className="text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground flex w-full items-center justify-center gap-2 rounded-lg p-2 transition-colors"
          title={collapsed ? t("sidebar.expand") : t("sidebar.collapse")}
        >
          {collapsed ? (
            <PanelLeft className="h-4 w-4" />
          ) : (
            <>
              <PanelLeftClose className="h-4 w-4" />
              <span className="text-xs font-medium">
                {t("sidebar.collapse")}
              </span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
}

/** 导航菜单项组件 */
function NavMenuItem({
  item,
  collapsed,
  pathname,
  t,
}: {
  item: NavItem;
  collapsed: boolean;
  pathname: string;
  t: ReturnType<typeof useTranslations>;
}) {
  const hasChildren = item.children && item.children.length > 0;

  // 判断当前项或其子项是否激活
  const isActive = hasChildren
    ? item.children!.some((child) => pathname === child.href)
    : pathname === (item.href || "/");

  const [expanded, setExpanded] = useState(isActive);

  const Icon = item.icon;
  const label = t(item.titleKey);

  // 有子菜单
  if (hasChildren) {
    return (
      <li>
        <button
          onClick={() => !collapsed && setExpanded((prev) => !prev)}
          className={cn(
            "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
            isActive
              ? "text-sidebar-primary"
              : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          )}
          title={collapsed ? label : undefined}
        >
          <Icon className="h-4 w-4 shrink-0" />
          {!collapsed && (
            <>
              <span className="flex-1 truncate text-left">{label}</span>
              <ChevronDown
                className={cn(
                  "h-3.5 w-3.5 shrink-0 transition-transform duration-200",
                  expanded && "rotate-180"
                )}
              />
            </>
          )}
        </button>
        {!collapsed && expanded && (
          <ul className="border-sidebar-border mt-0.5 ml-4 space-y-0.5 border-l pl-3">
            {item.children!.map((child) => {
              const ChildIcon = child.icon;
              const childActive = pathname === child.href;
              return (
                <li key={child.titleKey}>
                  <Link
                    href={child.href}
                    className={cn(
                      "flex items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-[13px] font-medium transition-colors",
                      childActive
                        ? "bg-sidebar-accent text-sidebar-primary"
                        : "text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                    )}
                  >
                    <ChildIcon className="h-3.5 w-3.5 shrink-0" />
                    <span className="truncate">{t(child.titleKey)}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </li>
    );
  }

  // 无子菜单
  const href = item.href || "/";
  const active = pathname === href;

  return (
    <li>
      <Link
        href={href}
        className={cn(
          "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
          active
            ? "bg-sidebar-accent text-sidebar-primary"
            : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
        )}
        title={collapsed ? label : undefined}
      >
        <Icon className="h-4 w-4 shrink-0" />
        {!collapsed && <span className="truncate">{label}</span>}
      </Link>
    </li>
  );
}
