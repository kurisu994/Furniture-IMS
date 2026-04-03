import {
  LayoutDashboard,
  Package,
  FolderTree,
  Truck,
  Users,
  Warehouse,
  Ruler,
  Layers,
  ShoppingCart,
  PackageCheck,
  Undo2,
  Receipt,
  PackageOpen,
  RotateCcw,
  Box,
  ArrowLeftRight,
  ClipboardList,
  ClipboardCheck,
  Palette,
  Lightbulb,
  Wallet,
  CreditCard,
  BarChart3,
  TrendingUp,
  PieChart,
  Settings,
  type LucideIcon,
} from "lucide-react";

/** 侧边栏导航项类型 */
export interface NavItem {
  /** i18n 翻译键 */
  titleKey: string;
  /** 路由路径 */
  href: string;
  /** 图标组件 */
  icon: LucideIcon;
  /** 子菜单 */
  children?: NavItem[];
}

/**
 * 侧边栏导航配置
 * 对应 UI 原型 §1.1 的 12 大模块
 */
export const navConfig: NavItem[] = [
  {
    titleKey: "nav.dashboard",
    href: "",
    icon: LayoutDashboard,
  },
  {
    titleKey: "nav.baseData",
    href: "/materials",
    icon: Package,
    children: [
      { titleKey: "nav.materials", href: "/materials", icon: Package },
      { titleKey: "nav.categories", href: "/categories", icon: FolderTree },
      { titleKey: "nav.suppliers", href: "/suppliers", icon: Truck },
      { titleKey: "nav.customers", href: "/customers", icon: Users },
      { titleKey: "nav.warehouses", href: "/warehouses", icon: Warehouse },
      { titleKey: "nav.units", href: "/units", icon: Ruler },
    ],
  },
  {
    titleKey: "nav.bom",
    href: "/bom",
    icon: Layers,
  },
  {
    titleKey: "nav.purchase",
    href: "/purchase-orders",
    icon: ShoppingCart,
    children: [
      {
        titleKey: "nav.purchaseOrders",
        href: "/purchase-orders",
        icon: ShoppingCart,
      },
      {
        titleKey: "nav.purchaseReceipts",
        href: "/purchase-receipts",
        icon: PackageCheck,
      },
      {
        titleKey: "nav.purchaseReturns",
        href: "/purchase-returns",
        icon: Undo2,
      },
    ],
  },
  {
    titleKey: "nav.sales",
    href: "/sales-orders",
    icon: Receipt,
    children: [
      { titleKey: "nav.salesOrders", href: "/sales-orders", icon: Receipt },
      {
        titleKey: "nav.salesDeliveries",
        href: "/sales-deliveries",
        icon: PackageOpen,
      },
      { titleKey: "nav.salesReturns", href: "/sales-returns", icon: RotateCcw },
    ],
  },
  {
    titleKey: "nav.inventory",
    href: "/inventory",
    icon: Box,
    children: [
      { titleKey: "nav.inventoryQuery", href: "/inventory", icon: Box },
      {
        titleKey: "nav.stockMovements",
        href: "/stock-movements",
        icon: ArrowLeftRight,
      },
      {
        titleKey: "nav.stockChecks",
        href: "/stock-checks",
        icon: ClipboardList,
      },
      {
        titleKey: "nav.stockTransfers",
        href: "/stock-transfers",
        icon: ClipboardCheck,
      },
    ],
  },
  {
    titleKey: "nav.customOrders",
    href: "/custom-orders",
    icon: Palette,
  },
  {
    titleKey: "nav.replenishment",
    href: "/replenishment",
    icon: Lightbulb,
  },
  {
    titleKey: "nav.finance",
    href: "/finance/payables",
    icon: Wallet,
    children: [
      { titleKey: "nav.payables", href: "/finance/payables", icon: Wallet },
      {
        titleKey: "nav.receivables",
        href: "/finance/receivables",
        icon: CreditCard,
      },
    ],
  },
  {
    titleKey: "nav.reports",
    href: "/reports/purchase",
    icon: BarChart3,
    children: [
      {
        titleKey: "nav.purchaseReport",
        href: "/reports/purchase",
        icon: BarChart3,
      },
      {
        titleKey: "nav.salesReport",
        href: "/reports/sales",
        icon: TrendingUp,
      },
      {
        titleKey: "nav.inventoryReport",
        href: "/reports/inventory",
        icon: PieChart,
      },
    ],
  },
  {
    titleKey: "nav.settings",
    href: "/settings",
    icon: Settings,
  },
];
