import { useParams, Link } from "react-router-dom";

export default function PurchaseOrderDetail() {
  const { id } = useParams();

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            to="/purchase-orders"
            className="hover:text-primary hover:bg-primary-50 rounded-full p-2 text-slate-400 transition-colors"
          >
            <span className="material-symbols-outlined text-xl">
              arrow_back
            </span>
          </Link>
          <div>
            <h2 className="text-on-surface flex items-center gap-3 text-2xl font-bold">
              采购单详情
              <span className="text-lg font-normal text-slate-400">
                ({id || "PO-20260326-001"})
              </span>
            </h2>
            <div className="mt-1 flex items-center gap-3">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-orange-200/50 bg-orange-50 px-2.5 py-1 text-xs font-medium text-orange-700">
                <span className="h-1.5 w-1.5 rounded-full bg-orange-500"></span>
                待审核 (Pending)
              </span>
              <span className="text-xs text-slate-500">
                创建时间: 2026-03-26 10:30:45
              </span>
              <span className="text-xs text-slate-500">创建人: 张建国</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-50">
            <span className="material-symbols-outlined text-base">print</span>
            打印
          </button>
          <button className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-50">
            <span className="material-symbols-outlined text-base">edit</span>
            编辑
          </button>
          <div className="mx-1 h-6 w-px bg-slate-200"></div>
          <button className="text-error flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium shadow-sm transition-colors hover:bg-slate-50">
            <span className="material-symbols-outlined text-base">cancel</span>
            驳回
          </button>
          <button className="bg-primary hover:bg-primary/90 flex items-center gap-2 rounded-lg px-6 py-2 text-sm font-medium text-white shadow-sm transition-colors">
            <span className="material-symbols-outlined text-base">
              check_circle
            </span>
            审核通过
          </button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Left Column: Details */}
        <div className="col-span-8 space-y-6">
          {/* Basic Info Card */}
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/50 px-6 py-4">
              <h3 className="flex items-center gap-2 text-sm font-bold tracking-wider text-slate-900 uppercase">
                <span className="material-symbols-outlined text-primary text-[20px]">
                  info
                </span>
                基本信息 (Basic Info)
              </h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 gap-x-12 gap-y-6">
                <div>
                  <p className="mb-1 text-xs font-semibold tracking-wider text-slate-400 uppercase">
                    供应商 (Supplier)
                  </p>
                  <p className="text-sm font-medium text-slate-900">
                    越南木材进出口公司 (Vietnam Wood Import & Export Co.)
                  </p>
                </div>
                <div>
                  <p className="mb-1 text-xs font-semibold tracking-wider text-slate-400 uppercase">
                    采购员 (Buyer)
                  </p>
                  <p className="text-sm font-medium text-slate-900">
                    张建国 (JianGuo Zhang)
                  </p>
                </div>
                <div>
                  <p className="mb-1 text-xs font-semibold tracking-wider text-slate-400 uppercase">
                    单据日期 (PO Date)
                  </p>
                  <p className="text-sm font-medium text-slate-900">
                    2026-03-26
                  </p>
                </div>
                <div>
                  <p className="mb-1 text-xs font-semibold tracking-wider text-slate-400 uppercase">
                    交货日期 (Delivery Date)
                  </p>
                  <p className="text-sm font-medium text-slate-900">
                    2026-04-10
                  </p>
                </div>
                <div>
                  <p className="mb-1 text-xs font-semibold tracking-wider text-slate-400 uppercase">
                    结算方式 (Payment Terms)
                  </p>
                  <p className="text-sm font-medium text-slate-900">
                    月结30天 (Net 30)
                  </p>
                </div>
                <div>
                  <p className="mb-1 text-xs font-semibold tracking-wider text-slate-400 uppercase">
                    币种 (Currency)
                  </p>
                  <p className="text-sm font-medium text-slate-900">
                    USD - 美元
                  </p>
                </div>
              </div>

              <div className="mt-6 border-t border-slate-100 pt-6">
                <p className="mb-2 text-xs font-semibold tracking-wider text-slate-400 uppercase">
                  备注说明 (Remarks)
                </p>
                <p className="rounded-lg border border-slate-100 bg-slate-50 p-3 text-sm text-slate-700">
                  请务必在4月10日前送达平阳省一号仓库。木材需提供FSC认证文件。
                </p>
              </div>
            </div>
          </div>

          {/* Line Items Card */}
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/50 px-6 py-4">
              <h3 className="flex items-center gap-2 text-sm font-bold tracking-wider text-slate-900 uppercase">
                <span className="material-symbols-outlined text-primary text-[20px]">
                  list_alt
                </span>
                采购明细 (Line Items)
              </h3>
              <span className="rounded-md border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-500">
                共 3 项物料
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="border-b border-slate-200 bg-slate-50 text-xs text-slate-500">
                  <tr>
                    <th className="w-12 px-6 py-3 text-center font-semibold">
                      序号
                    </th>
                    <th className="px-6 py-3 font-semibold">物料编码</th>
                    <th className="px-6 py-3 font-semibold">物料名称</th>
                    <th className="px-6 py-3 font-semibold">规格型号</th>
                    <th className="px-6 py-3 text-center font-semibold">
                      单位
                    </th>
                    <th className="px-6 py-3 text-right font-semibold">数量</th>
                    <th className="px-6 py-3 text-right font-semibold">
                      单价 (USD)
                    </th>
                    <th className="px-6 py-3 text-right font-semibold">
                      金额 (USD)
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr className="transition-colors hover:bg-slate-50/50">
                    <td className="px-6 py-4 text-center text-slate-500">1</td>
                    <td className="text-primary px-6 py-4 font-medium">
                      MAT-2024-001
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-900">
                      A级橡木实木板
                    </td>
                    <td className="px-6 py-4 text-slate-500">2400x1200x18mm</td>
                    <td className="px-6 py-4 text-center text-slate-500">张</td>
                    <td className="px-6 py-4 text-right font-medium text-slate-700">
                      500
                    </td>
                    <td className="px-6 py-4 text-right text-slate-500">
                      $45.00
                    </td>
                    <td className="px-6 py-4 text-right font-medium text-slate-900">
                      $22,500.00
                    </td>
                  </tr>
                  <tr className="transition-colors hover:bg-slate-50/50">
                    <td className="px-6 py-4 text-center text-slate-500">2</td>
                    <td className="text-primary px-6 py-4 font-medium">
                      MAT-2024-004
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-900">
                      北欧风餐椅框架
                    </td>
                    <td className="px-6 py-4 text-slate-500">白蜡木材质</td>
                    <td className="px-6 py-4 text-center text-slate-500">套</td>
                    <td className="px-6 py-4 text-right font-medium text-slate-700">
                      200
                    </td>
                    <td className="px-6 py-4 text-right text-slate-500">
                      $85.00
                    </td>
                    <td className="px-6 py-4 text-right font-medium text-slate-900">
                      $17,000.00
                    </td>
                  </tr>
                  <tr className="transition-colors hover:bg-slate-50/50">
                    <td className="px-6 py-4 text-center text-slate-500">3</td>
                    <td className="text-primary px-6 py-4 font-medium">
                      MAT-2024-007
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-900">
                      高密度海绵垫
                    </td>
                    <td className="px-6 py-4 text-slate-500">
                      45D 500x500x50mm
                    </td>
                    <td className="px-6 py-4 text-center text-slate-500">块</td>
                    <td className="px-6 py-4 text-right font-medium text-slate-700">
                      300
                    </td>
                    <td className="px-6 py-4 text-right text-slate-500">
                      $19.00
                    </td>
                    <td className="px-6 py-4 text-right font-medium text-slate-900">
                      $5,700.00
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="flex justify-end bg-slate-50 p-6">
              <div className="w-64 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">合计数量:</span>
                  <span className="font-medium text-slate-900">1,000</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">不含税金额:</span>
                  <span className="font-medium text-slate-900">$45,200.00</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">税额 (0%):</span>
                  <span className="font-medium text-slate-900">$0.00</span>
                </div>
                <div className="flex items-center justify-between border-t border-slate-200 pt-3">
                  <span className="text-sm font-bold text-slate-900">
                    价税合计:
                  </span>
                  <span className="text-primary text-xl font-bold">
                    $45,200.00
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Timeline & Summary */}
        <div className="col-span-4 space-y-6">
          {/* Summary Card */}
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="mb-4 flex items-center gap-2 text-sm font-bold tracking-wider text-slate-900 uppercase">
              <span className="material-symbols-outlined text-primary text-[20px]">
                analytics
              </span>
              单据汇总 (Summary)
            </h3>
            <div className="space-y-4">
              <div className="flex items-center gap-4 rounded-lg border border-slate-100 bg-slate-50 p-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-700">
                  <span className="material-symbols-outlined text-xl">
                    payments
                  </span>
                </div>
                <div>
                  <p className="text-[10px] font-bold tracking-tight text-slate-500 uppercase">
                    总金额 (Total Amount)
                  </p>
                  <p className="text-on-surface text-lg font-bold">
                    $45,200.00
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4 rounded-lg border border-slate-100 bg-slate-50 p-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                  <span className="material-symbols-outlined text-xl">
                    inventory_2
                  </span>
                </div>
                <div>
                  <p className="text-[10px] font-bold tracking-tight text-slate-500 uppercase">
                    已入库数量 (Received)
                  </p>
                  <p className="text-on-surface text-lg font-bold">0 / 1,000</p>
                </div>
              </div>
              <div className="flex items-center gap-4 rounded-lg border border-slate-100 bg-slate-50 p-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 text-orange-700">
                  <span className="material-symbols-outlined text-xl">
                    receipt_long
                  </span>
                </div>
                <div>
                  <p className="text-[10px] font-bold tracking-tight text-slate-500 uppercase">
                    已开票金额 (Invoiced)
                  </p>
                  <p className="text-on-surface text-lg font-bold">$0.00</p>
                </div>
              </div>
            </div>
          </div>

          {/* Timeline Card */}
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="mb-6 flex items-center gap-2 text-sm font-bold tracking-wider text-slate-900 uppercase">
              <span className="material-symbols-outlined text-primary text-[20px]">
                history
              </span>
              审批流程 (Approval Flow)
            </h3>
            <div className="relative space-y-6 pl-4 before:absolute before:inset-y-0 before:left-[11px] before:w-0.5 before:bg-slate-100">
              <div className="relative">
                <div className="absolute top-1 -left-[25px] z-10 flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-orange-100">
                  <span className="h-2 w-2 rounded-full bg-orange-500"></span>
                </div>
                <div className="pl-4">
                  <p className="text-sm font-bold text-slate-900">
                    部门经理审批
                  </p>
                  <p className="mt-0.5 text-xs text-slate-500">
                    待处理 (Pending)
                  </p>
                  <div className="mt-2 rounded-lg border border-slate-100 bg-slate-50 p-3 text-xs text-slate-600">
                    <p className="mb-1 font-medium text-slate-800">
                      当前审批人: 王经理 (Manager Wang)
                    </p>
                    <p>等待审批中...</p>
                  </div>
                </div>
              </div>

              <div className="relative">
                <div className="absolute top-1 -left-[25px] z-10 flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-emerald-100">
                  <span className="material-symbols-outlined text-[14px] text-emerald-600">
                    check
                  </span>
                </div>
                <div className="pl-4">
                  <p className="text-sm font-bold text-slate-900">提交采购单</p>
                  <p className="mt-0.5 text-xs text-slate-500">
                    2026-03-26 10:30:45
                  </p>
                  <div className="mt-2 flex items-center gap-2">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-200 text-[10px] font-bold text-slate-500">
                      张
                    </div>
                    <span className="text-xs font-medium text-slate-700">
                      张建国 (JianGuo Zhang)
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
