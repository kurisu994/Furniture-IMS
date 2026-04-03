export default function Dashboard() {
  return (
    <>
      {/* Dashboard Header */}
      <div className="mt-6 mb-6 flex items-center justify-between">
        <h2 className="text-on-surface text-2xl font-bold">首页看板</h2>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 rounded-lg bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-200">
            <span className="material-symbols-outlined text-base">refresh</span>
            刷新数据
          </button>
        </div>
      </div>

      {/* Row 1: Primary KPIs */}
      <div className="mb-6 grid grid-cols-4 gap-6">
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-3 flex items-start justify-between">
            <span className="text-xs font-semibold tracking-wider text-slate-500">
              今日销售额
            </span>
            <span className="flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-bold text-emerald-600">
              +5.2%{" "}
              <span className="material-symbols-outlined ml-0.5 text-[14px]">
                trending_up
              </span>
            </span>
          </div>
          <h3 className="text-on-surface text-2xl font-bold">$125,800</h3>
          <p className="mt-2 text-[10px] text-slate-400">较昨日上涨</p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-3 flex items-start justify-between">
            <span className="text-xs font-semibold tracking-wider text-slate-500">
              本月累计销售
            </span>
            <span className="flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-bold text-emerald-600">
              +12.8%{" "}
              <span className="material-symbols-outlined ml-0.5 text-[14px]">
                trending_up
              </span>
            </span>
          </div>
          <h3 className="text-on-surface text-2xl font-bold">$3,582,000</h3>
          <p className="mt-2 text-[10px] text-slate-400">
            进度：85% (目标 $4.2M)
          </p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-3 flex items-start justify-between">
            <span className="text-xs font-semibold tracking-wider text-slate-500">
              今日采购额
            </span>
            <span className="flex items-center rounded-full bg-rose-50 px-2 py-0.5 text-xs font-bold text-rose-600">
              -3.1%{" "}
              <span className="material-symbols-outlined ml-0.5 text-[14px]">
                trending_down
              </span>
            </span>
          </div>
          <h3 className="text-on-surface text-2xl font-bold">$83,200</h3>
          <p className="mt-2 text-[10px] text-slate-400">主要为木材原材料</p>
        </div>
        <div className="border-secondary rounded-lg border border-l-4 border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-3 flex items-start justify-between">
            <span className="text-xs font-semibold tracking-wider text-slate-500">
              库存预警
            </span>
            <span className="text-secondary flex items-center rounded-full bg-orange-50 px-2 py-0.5 text-xs font-bold">
              +3{" "}
              <span className="material-symbols-outlined ml-0.5 text-[14px]">
                warning
              </span>
            </span>
          </div>
          <h3 className="text-on-surface text-2xl font-bold">12 项</h3>
          <p className="mt-2 text-[10px] text-slate-400">低于安全库存水位</p>
        </div>
      </div>

      {/* Row 2: Secondary KPIs */}
      <div className="mb-8 grid grid-cols-3 gap-6">
        <div className="flex items-center gap-4 rounded-lg bg-slate-50 p-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-700">
            <span className="material-symbols-outlined text-xl">
              account_balance_wallet
            </span>
          </div>
          <div>
            <p className="text-[11px] font-bold tracking-tight text-slate-500 uppercase">
              待收款 (A/R)
            </p>
            <p className="text-on-surface text-lg font-bold">$865,000</p>
          </div>
        </div>
        <div className="flex items-center gap-4 rounded-lg bg-slate-50 p-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 text-orange-700">
            <span className="material-symbols-outlined text-xl">payments</span>
          </div>
          <div>
            <p className="text-[11px] font-bold tracking-tight text-slate-500 uppercase">
              待付款 (A/P)
            </p>
            <p className="text-on-surface text-lg font-bold">$423,000</p>
          </div>
        </div>
        <div className="flex items-center gap-4 rounded-lg bg-slate-50 p-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
            <span className="material-symbols-outlined text-xl">autorenew</span>
          </div>
          <div>
            <p className="text-[11px] font-bold tracking-tight text-slate-500 uppercase">
              补货项 (Pending)
            </p>
            <p className="text-on-surface text-lg font-bold">8 项目</p>
          </div>
        </div>
      </div>

      {/* Quick Action Bar */}
      <div className="mb-8 flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 p-4">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-primary/60">
            bolt
          </span>
          <span className="text-xs font-bold tracking-widest text-slate-600 uppercase">
            快捷操作 Quick Actions
          </span>
        </div>
        <div className="flex gap-4">
          <button className="flex items-center gap-2 rounded-lg bg-[#294985] px-4 py-2.5 text-sm font-semibold text-white shadow-md transition-all hover:opacity-90 active:scale-95">
            <span className="material-symbols-outlined text-[18px]">
              add_shopping_cart
            </span>
            新建采购单
          </button>
          <button className="text-on-surface flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold shadow-sm transition-all hover:bg-slate-50 active:scale-95">
            <span className="material-symbols-outlined text-primary text-[18px]">
              receipt_long
            </span>
            新建销售单
          </button>
          <button className="text-on-surface flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold shadow-sm transition-all hover:bg-slate-50 active:scale-95">
            <span className="material-symbols-outlined text-secondary text-[18px]">
              move_to_inbox
            </span>
            采购入库
          </button>
          <button className="text-on-surface flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold shadow-sm transition-all hover:bg-slate-50 active:scale-95">
            <span className="material-symbols-outlined text-secondary text-[18px]">
              outbox
            </span>
            销售出库
          </button>
        </div>
      </div>

      {/* Row 3: Sales Trend & Inventory Distribution */}
      <div className="mb-6 grid grid-cols-12 gap-6">
        {/* Sales Trend */}
        <div className="col-span-8 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center justify-between">
            <h4 className="text-on-surface font-bold">
              近30天销售趋势 (Sales Trend)
            </h4>
            <span className="text-xs text-slate-400">单位: USD</span>
          </div>
          <div className="flex h-64 items-end gap-2 px-2">
            <div className="hover:bg-primary-container/20 h-[25%] flex-1 rounded-t-sm bg-slate-100 transition-all"></div>
            <div className="hover:bg-primary-container/20 h-[40%] flex-1 rounded-t-sm bg-slate-100 transition-all"></div>
            <div className="hover:bg-primary-container/20 h-[35%] flex-1 rounded-t-sm bg-slate-100 transition-all"></div>
            <div className="bg-primary-container hover:bg-primary h-[65%] flex-1 rounded-t-sm transition-all"></div>
            <div className="bg-primary h-[85%] flex-1 rounded-t-sm transition-all"></div>
            <div className="bg-primary-container hover:bg-primary h-[70%] flex-1 rounded-t-sm transition-all"></div>
            <div className="hover:bg-primary-container/20 h-[45%] flex-1 rounded-t-sm bg-slate-100 transition-all"></div>
            <div className="bg-primary h-[95%] flex-1 rounded-t-sm transition-all"></div>
            <div className="hover:bg-primary-container/20 h-[30%] flex-1 rounded-t-sm bg-slate-100 transition-all"></div>
            <div className="hover:bg-primary-container/40 h-[55%] flex-1 rounded-t-sm bg-slate-200 transition-all"></div>
          </div>
          <div className="mt-4 flex justify-between border-t pt-2 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
            <span>Week 1</span>
            <span>Week 2</span>
            <span>Week 3</span>
            <span>Week 4</span>
          </div>
        </div>

        {/* Inventory Distribution */}
        <div className="col-span-4 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <h4 className="text-on-surface mb-6 font-bold">
            库存分布 (Inventory Distribution)
          </h4>
          <div className="relative flex flex-col items-center justify-center">
            <div className="relative h-40 w-40 rounded-full border-[18px] border-slate-100">
              <div
                className="border-primary absolute inset-[-18px] rounded-full border-[18px]"
                style={{
                  clipPath: "polygon(50% 50%, 100% 0, 100% 100%, 70% 100%)",
                }}
              ></div>
              <div
                className="border-primary-container absolute inset-[-18px] rounded-full border-[18px]"
                style={{
                  clipPath: "polygon(50% 50%, 70% 100%, 0 100%, 0 40%)",
                }}
              ></div>
              <div
                className="border-secondary absolute inset-[-18px] rounded-full border-[18px]"
                style={{ clipPath: "polygon(50% 50%, 0 40%, 0 0, 100% 0)" }}
              ></div>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-xs font-medium text-slate-400">
                  总库存
                </span>
                <span className="text-lg font-bold">100%</span>
              </div>
            </div>
            <div className="mt-6 w-full space-y-2">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="bg-primary h-2.5 w-2.5 rounded-sm"></span>
                  实木板材 (35%)
                </div>
                <span className="font-medium">$1.2M</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="bg-primary-container h-2.5 w-2.5 rounded-sm"></span>
                  成品家具 (28%)
                </div>
                <span className="font-medium">$980K</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="bg-secondary h-2.5 w-2.5 rounded-sm"></span>
                  五金配件 (22%)
                </div>
                <span className="font-medium">$750K</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-sm bg-slate-300"></span>
                  其他耗材 (15%)
                </div>
                <span className="font-medium">$520K</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Row 4: Top 10 Best Sellers & Pending Tasks */}
      <div className="mb-6 grid grid-cols-12 gap-6">
        {/* Best Sellers */}
        <div className="col-span-8 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <h4 className="text-on-surface mb-6 font-bold">
            热销产品 TOP 10 (Best Sellers)
          </h4>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-slate-700">
                  橡木A级板材 (Oak Wood Panel A-Grade)
                </span>
                <span className="text-primary font-bold">842 Units</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                <div className="bg-primary h-full w-[92%] rounded-full"></div>
              </div>
            </div>
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-slate-700">
                  45mm 不锈钢支架 (Steel Bracket 45mm)
                </span>
                <span className="text-primary font-bold">756 Units</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                <div className="bg-primary h-full w-[81%] rounded-full"></div>
              </div>
            </div>
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-slate-700">
                  标准餐桌套装 (Standard Dining Table Set)
                </span>
                <span className="text-primary font-bold">620 Units</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                <div className="bg-primary h-full w-[65%] rounded-full"></div>
              </div>
            </div>
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-slate-700">
                  工业胶水 X2 (Industrial Adhesive X2)
                </span>
                <span className="text-primary font-bold">544 Units</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                <div className="bg-primary h-full w-[58%] rounded-full"></div>
              </div>
            </div>
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-slate-700">
                  皮革沙发套装 (Leather Sofa Set)
                </span>
                <span className="text-primary font-bold">410 Units</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                <div className="bg-primary h-full w-[44%] rounded-full"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Pending Tasks */}
        <div className="col-span-4 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <h4 className="text-on-surface mb-6 border-b pb-3 text-sm font-bold tracking-wider uppercase">
            待办事项 (Pending Tasks)
          </h4>
          <div className="space-y-3">
            <div className="flex items-center gap-3 rounded border-l-4 border-red-500 bg-red-50 p-3">
              <span className="material-symbols-outlined text-red-600">
                inventory
              </span>
              <div>
                <p className="text-xs font-bold text-red-900">
                  12项库存安全预警
                </p>
                <p className="text-[10px] text-red-700">
                  库存低于最低水位，请尽快补货
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded border-l-4 border-orange-500 bg-orange-50 p-3">
              <span className="material-symbols-outlined text-orange-600">
                rule
              </span>
              <div>
                <p className="text-xs font-bold text-orange-900">
                  3笔采购单待审核
                </p>
                <p className="text-[10px] text-orange-700">
                  来自采购部，预计总额 $45,000
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded border-l-4 border-blue-500 bg-blue-50 p-3">
              <span className="material-symbols-outlined text-blue-600">
                local_shipping
              </span>
              <div>
                <p className="text-xs font-bold text-blue-900">5笔出库确认</p>
                <p className="text-[10px] text-blue-700">
                  待仓库管理人员核对装车单
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded border-l-4 border-slate-400 bg-slate-50 p-3">
              <span className="material-symbols-outlined text-slate-600">
                error_outline
              </span>
              <div>
                <p className="text-xs font-bold text-slate-900">
                  2笔超期应收账款
                </p>
                <p className="text-[10px] text-slate-600">
                  账龄已超过45天，请及时跟催
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Row 5: Full Width Purchase Trend */}
      <div className="mb-8 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-center justify-between">
          <h4 className="text-on-surface font-bold">
            近30天采购趋势 (Purchase Trend)
          </h4>
          <span className="text-xs text-slate-400">单位: 越南盾 (₫)</span>
        </div>
        <div className="relative h-64 w-full">
          <svg
            className="h-full w-full"
            preserveAspectRatio="none"
            viewBox="0 0 100 40"
          >
            <defs>
              <linearGradient
                id="purchaseGrad"
                x1="0%"
                x2="0%"
                y1="0%"
                y2="100%"
              >
                <stop
                  offset="0%"
                  style={{ stopColor: "#944a00", stopOpacity: 0.2 }}
                ></stop>
                <stop
                  offset="100%"
                  style={{ stopColor: "#944a00", stopOpacity: 0 }}
                ></stop>
              </linearGradient>
            </defs>
            <path
              d="M0,35 L10,32 L20,38 L30,25 L40,28 L50,15 L60,18 L70,5 L80,12 L90,8 L100,20"
              fill="none"
              stroke="#944a00"
              strokeWidth="0.75"
              vectorEffect="non-scaling-stroke"
            ></path>
            <path
              d="M0,35 L10,32 L20,38 L30,25 L40,28 L50,15 L60,18 L70,5 L80,12 L90,8 L100,20 V40 H0 Z"
              fill="url(#purchaseGrad)"
            ></path>
          </svg>
          <div className="bg-on-surface absolute top-[10%] left-[68%] -translate-x-1/2 rounded p-2 text-[10px] text-white shadow-xl">
            <p className="font-bold">2024-03-15</p>
            <p>采购: 4,250,000,000 ₫</p>
          </div>
        </div>
        <div className="mt-4 flex justify-between text-[10px] font-bold text-slate-400">
          <span>03-01</span>
          <span>03-08</span>
          <span>03-15</span>
          <span>03-22</span>
          <span>03-31</span>
        </div>
      </div>
    </>
  );
}
