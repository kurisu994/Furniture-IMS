import { Link, Outlet, useLocation } from "react-router-dom";
import clsx from "clsx";
import { useState } from "react";

export default function Layout() {
  const location = useLocation();
  const [isPurchaseMenuOpen, setIsPurchaseMenuOpen] = useState(true);
  const [isBasicDataMenuOpen, setIsBasicDataMenuOpen] = useState(true);

  const isActive = (path: string) => location.pathname.startsWith(path);

  return (
    <div className="bg-surface text-on-surface min-h-screen">
      {/* SideNavBar */}
      <aside className="fixed top-0 left-0 z-50 flex h-screen w-[260px] flex-col border-r border-slate-100 bg-white">
        <div className="flex h-16 flex-shrink-0 items-center border-b border-slate-50 px-6">
          <h1 className="text-xl font-bold tracking-tight text-[#4361be]">
            云枢 (CloudPivot IMS)
          </h1>
        </div>
        <nav className="no-scrollbar flex-1 space-y-1 overflow-y-auto px-3 py-4">
          <Link
            to="/dashboard"
            className={clsx(
              "group flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-semibold transition-colors",
              isActive("/dashboard")
                ? "bg-[#4c69c1] text-white shadow-sm"
                : "text-slate-600 hover:bg-slate-50"
            )}
          >
            <span
              className={clsx(
                "material-symbols-outlined text-[20px]",
                isActive("/dashboard")
                  ? ""
                  : "text-slate-400 group-hover:text-slate-600"
              )}
              style={{
                fontVariationSettings: isActive("/dashboard") ? "'FILL' 1" : "",
              }}
            >
              grid_view
            </span>
            <span>首页</span>
          </Link>

          {/* Basic Data - Parent */}
          <div className="space-y-1">
            <button
              onClick={() => setIsBasicDataMenuOpen(!isBasicDataMenuOpen)}
              className="group flex w-full items-center justify-between rounded-lg px-3 py-3 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-50"
            >
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[20px] text-slate-400 group-hover:text-slate-600">
                  database
                </span>
                <span>基础数据</span>
              </div>
              <span className="material-symbols-outlined text-sm text-slate-400">
                {isBasicDataMenuOpen ? "expand_less" : "expand_more"}
              </span>
            </button>
            {isBasicDataMenuOpen && (
              <div className="space-y-1 pl-10">
                <Link
                  to="/materials"
                  className={clsx(
                    "block flex items-center gap-3 py-2 text-sm font-medium",
                    isActive("/materials")
                      ? "font-bold text-[#4c69c1]"
                      : "text-slate-500 hover:text-[#4c69c1]"
                  )}
                >
                  <span className="material-symbols-outlined text-[18px]">
                    category
                  </span>{" "}
                  物料管理
                </Link>
                <a
                  href="#"
                  className="block flex items-center gap-3 py-2 text-sm font-medium text-slate-500 hover:text-[#4c69c1]"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    sell
                  </span>{" "}
                  分类管理
                </a>
                <a
                  href="#"
                  className="block flex items-center gap-3 py-2 text-sm font-medium text-slate-500 hover:text-[#4c69c1]"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    corporate_fare
                  </span>{" "}
                  供应商
                </a>
                <a
                  href="#"
                  className="block flex items-center gap-3 py-2 text-sm font-medium text-slate-500 hover:text-[#4c69c1]"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    group
                  </span>{" "}
                  客户
                </a>
                <a
                  href="#"
                  className="block flex items-center gap-3 py-2 text-sm font-medium text-slate-500 hover:text-[#4c69c1]"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    warehouse
                  </span>{" "}
                  仓库
                </a>
                <a
                  href="#"
                  className="block flex items-center gap-3 py-2 text-sm font-medium text-slate-500 hover:text-[#4c69c1]"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    straighten
                  </span>{" "}
                  单位管理
                </a>
              </div>
            )}
          </div>

          <a
            href="#"
            className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50"
          >
            <span className="material-symbols-outlined text-[20px] text-slate-400">
              account_tree
            </span>
            <span>BOM</span>
          </a>

          {/* Purchase Management - Parent */}
          <div className="space-y-1">
            <button
              onClick={() => setIsPurchaseMenuOpen(!isPurchaseMenuOpen)}
              className={clsx(
                "group flex w-full items-center justify-between rounded-lg px-3 py-3 text-sm transition-colors",
                isActive("/purchase-orders")
                  ? "bg-slate-100 font-bold text-slate-900"
                  : "font-semibold text-slate-600 hover:bg-slate-50"
              )}
            >
              <div className="flex items-center gap-3">
                <span
                  className={clsx(
                    "material-symbols-outlined text-[20px]",
                    isActive("/purchase-orders")
                      ? "text-[#294985]"
                      : "text-slate-400 group-hover:text-slate-600"
                  )}
                  style={{
                    fontVariationSettings: isActive("/purchase-orders")
                      ? "'FILL' 1"
                      : "",
                  }}
                >
                  shopping_cart
                </span>
                <span>采购管理</span>
              </div>
              <span className="material-symbols-outlined text-sm text-slate-400">
                {isPurchaseMenuOpen ? "expand_less" : "expand_more"}
              </span>
            </button>
            {isPurchaseMenuOpen && (
              <div className="space-y-1 pl-10">
                <Link
                  to="/purchase-orders"
                  className={clsx(
                    "block flex items-center gap-3 py-2 text-sm",
                    isActive("/purchase-orders")
                      ? "font-bold text-[#4c69c1]"
                      : "font-medium text-slate-500 hover:text-[#4c69c1]"
                  )}
                >
                  <span className="material-symbols-outlined text-[18px]">
                    receipt
                  </span>{" "}
                  采购单
                </Link>
                <a
                  href="#"
                  className="block flex items-center gap-3 py-2 text-sm font-medium text-slate-500 hover:text-[#4c69c1]"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    download
                  </span>{" "}
                  采购入库
                </a>
                <a
                  href="#"
                  className="block flex items-center gap-3 py-2 text-sm font-medium text-slate-500 hover:text-[#4c69c1]"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    upload
                  </span>{" "}
                  采购退货
                </a>
              </div>
            )}
          </div>

          {/* Sales Management - Parent */}
          <div className="space-y-1">
            <button className="group flex w-full items-center justify-between rounded-lg px-3 py-3 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-50">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[20px] text-slate-400 group-hover:text-slate-600">
                  wallet
                </span>
                <span>销售管理</span>
              </div>
              <span className="material-symbols-outlined text-sm text-slate-400">
                expand_more
              </span>
            </button>
          </div>

          {/* Inventory Management - Parent */}
          <div className="space-y-1">
            <button className="group flex w-full items-center justify-between rounded-lg px-3 py-3 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-50">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[20px] text-slate-400 group-hover:text-slate-600">
                  inventory_2
                </span>
                <span>库存管理</span>
              </div>
              <span className="material-symbols-outlined text-sm text-slate-400">
                expand_more
              </span>
            </button>
          </div>

          <a
            href="#"
            className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50"
          >
            <span className="material-symbols-outlined text-[20px] text-slate-400">
              assignment
            </span>
            <span>定制订单</span>
          </a>
          <a
            href="#"
            className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50"
          >
            <span className="material-symbols-outlined text-[20px] text-slate-400">
              factory
            </span>
            <span>生产工单</span>
          </a>
          <a
            href="#"
            className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50"
          >
            <span className="material-symbols-outlined text-[20px] text-slate-400">
              reorder
            </span>
            <span>智能补货</span>
          </a>

          {/* Finance Management - Parent */}
          <div className="space-y-1">
            <button className="group flex w-full items-center justify-between rounded-lg px-3 py-3 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-50">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[20px] text-slate-400 group-hover:text-slate-600">
                  payments
                </span>
                <span>财务管理</span>
              </div>
              <span className="material-symbols-outlined text-sm text-slate-400">
                expand_more
              </span>
            </button>
          </div>

          <a
            href="#"
            className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50"
          >
            <span className="material-symbols-outlined text-[20px] text-slate-400">
              assessment
            </span>
            <span>报表统计</span>
          </a>
          <a
            href="#"
            className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50"
          >
            <span className="material-symbols-outlined text-[20px] text-slate-400">
              settings
            </span>
            <span>系统设置</span>
          </a>
        </nav>
      </aside>

      {/* TopNavBar */}
      <header className="fixed top-0 right-0 left-[260px] z-40 flex h-16 items-center justify-between border-b border-slate-100 bg-white px-8">
        <div className="flex items-center gap-4 text-sm font-medium text-slate-500">
          <button className="hover:text-primary text-slate-400 transition-colors">
            <span
              className="material-symbols-outlined"
              style={{ fontSize: "20px" }}
            >
              menu
            </span>
          </button>
          <div className="flex items-center gap-2">
            {isActive("/dashboard") && (
              <span className="text-slate-900">首页</span>
            )}
            {isActive("/materials") && (
              <>
                <span>基础数据</span>
                <span className="text-slate-300">/</span>
                <span className="text-slate-900">物料管理</span>
              </>
            )}
            {isActive("/purchase-orders") && (
              <>
                <span>采购管理</span>
                <span className="text-slate-300">/</span>
                <span
                  className={
                    location.pathname === "/purchase-orders"
                      ? "text-slate-900"
                      : ""
                  }
                >
                  采购单
                </span>
                {location.pathname !== "/purchase-orders" && (
                  <>
                    <span className="text-slate-300">/</span>
                    <span className="text-slate-900">PO-20260326-001</span>
                  </>
                )}
              </>
            )}
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-4 text-slate-400">
            <button className="hover:text-primary transition-colors">
              <span className="material-symbols-outlined">language</span>
            </button>
            <div className="relative">
              <button className="hover:text-primary transition-colors">
                <span className="material-symbols-outlined">notifications</span>
              </button>
              <span className="bg-error absolute top-0 right-0 h-2 w-2 rounded-full border-2 border-white"></span>
            </div>
            <button className="hover:text-primary transition-colors">
              <span className="material-symbols-outlined">help</span>
            </button>
          </div>
          <div className="h-6 border-l border-slate-200"></div>
          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-xs leading-none font-bold">Admin User</p>
              <p className="mt-1 text-[10px] text-slate-400 uppercase">
                Super Administrator
              </p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border-2 border-slate-200 text-slate-400">
              <span
                className="material-symbols-outlined"
                style={{ fontSize: "28px" }}
              >
                account_circle
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="ml-[260px] min-h-screen bg-white px-8 pt-16 pb-24">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="fixed right-0 bottom-0 left-[260px] z-[60] flex items-center justify-between border-t border-slate-100 bg-[#fafafa] px-8 py-4">
        <p className="text-[11px] font-semibold tracking-widest text-slate-400 uppercase">
          © 2024 云枢 (CloudPivot IMS) v2.4.0. 保留所有权利。
        </p>
        <div className="flex gap-6">
          <a
            href="#"
            className="text-[11px] font-semibold tracking-widest text-slate-400 uppercase transition-colors hover:text-[#294985]"
          >
            服务条款
          </a>
          <a
            href="#"
            className="text-[11px] font-semibold tracking-widest text-slate-400 uppercase transition-colors hover:text-[#294985]"
          >
            隐私政策
          </a>
          <a
            href="#"
            className="text-[11px] font-semibold tracking-widest text-slate-400 uppercase transition-colors hover:text-[#294985]"
          >
            Support
          </a>
        </div>
      </footer>
    </div>
  );
}
