import { useState } from "react";
import { Link } from "react-router-dom";

export default function PurchaseOrderList() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-on-surface text-2xl font-bold">采购单</h2>
          <p className="mt-1 text-sm text-slate-500">
            管理采购订单 (Purchase Orders)
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-50">
            <span className="material-symbols-outlined text-base">
              download
            </span>
            导出
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-primary hover:bg-primary/90 flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors"
          >
            <span className="material-symbols-outlined text-base">add</span>
            新建采购单
          </button>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 bg-slate-50/50 p-4">
          <div className="flex min-w-[300px] flex-1 items-center gap-3">
            <div className="relative max-w-md flex-1">
              <span className="material-symbols-outlined absolute top-1/2 left-3 -translate-y-1/2 text-[20px] text-slate-400">
                search
              </span>
              <input
                type="text"
                placeholder="搜索单号、供应商、采购员..."
                className="focus:ring-primary/20 focus:border-primary w-full rounded-lg border border-slate-200 bg-white py-2 pr-4 pl-10 text-sm transition-all focus:ring-2 focus:outline-none"
              />
            </div>
            <button className="hover:text-primary hover:bg-primary-50 rounded-lg border border-slate-200 bg-white p-2 text-slate-500 transition-colors">
              <span className="material-symbols-outlined text-[20px]">
                filter_list
              </span>
            </button>
          </div>

          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-slate-500">日期:</span>
              <input
                type="date"
                className="focus:border-primary rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-slate-700 focus:outline-none"
              />
              <span className="text-slate-400">-</span>
              <input
                type="date"
                className="focus:border-primary rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-slate-700 focus:outline-none"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-slate-500">状态:</span>
              <select className="focus:border-primary rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-slate-700 focus:outline-none">
                <option>全部状态 (All)</option>
                <option>待审核 (Pending)</option>
                <option>已审核 (Approved)</option>
                <option>部分入库 (Partial)</option>
                <option>已完成 (Completed)</option>
                <option>已取消 (Cancelled)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="border-b border-slate-200 bg-slate-50 text-xs tracking-wider text-slate-500 uppercase">
              <tr>
                <th className="w-12 px-6 py-4 text-center font-semibold">
                  <input
                    type="checkbox"
                    className="text-primary focus:ring-primary rounded border-slate-300"
                  />
                </th>
                <th className="sticky-col-1 sticky-shadow sticky-col-header bg-slate-50 px-6 py-4 font-semibold">
                  单据编号
                </th>
                <th className="px-6 py-4 font-semibold">单据日期</th>
                <th className="px-6 py-4 font-semibold">供应商</th>
                <th className="px-6 py-4 text-right font-semibold">总金额</th>
                <th className="px-6 py-4 font-semibold">采购员</th>
                <th className="px-6 py-4 text-center font-semibold">状态</th>
                <th className="px-6 py-4 text-right font-semibold">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {[
                {
                  id: "PO-20260326-001",
                  date: "2026-03-26",
                  supplier: "越南木材进出口公司",
                  amount: "$45,200.00",
                  buyer: "张建国",
                  status: "pending",
                },
                {
                  id: "PO-20260325-002",
                  date: "2026-03-25",
                  supplier: "胡志明五金配件厂",
                  amount: "$12,850.00",
                  buyer: "李明",
                  status: "approved",
                },
                {
                  id: "PO-20260324-001",
                  date: "2026-03-24",
                  supplier: "环球包装材料有限公司",
                  amount: "$3,400.00",
                  buyer: "王芳",
                  status: "partial",
                },
                {
                  id: "PO-20260322-003",
                  date: "2026-03-22",
                  supplier: "东南亚皮革供应商",
                  amount: "$28,600.00",
                  buyer: "张建国",
                  status: "completed",
                },
                {
                  id: "PO-20260320-001",
                  date: "2026-03-20",
                  supplier: "越南木材进出口公司",
                  amount: "$52,000.00",
                  buyer: "李明",
                  status: "completed",
                },
                {
                  id: "PO-20260318-002",
                  date: "2026-03-18",
                  supplier: "化工原料厂",
                  amount: "$8,500.00",
                  buyer: "王芳",
                  status: "cancelled",
                },
              ].map((item, i) => (
                <tr
                  key={i}
                  className="group transition-colors hover:bg-slate-50/80"
                >
                  <td className="px-6 py-4 text-center">
                    <input
                      type="checkbox"
                      className="text-primary focus:ring-primary rounded border-slate-300"
                    />
                  </td>
                  <td className="text-primary sticky-col-1 sticky-shadow bg-white px-6 py-4 font-medium transition-colors group-hover:bg-slate-50/80">
                    <Link
                      to={`/purchase-orders/${item.id}`}
                      className="hover:underline"
                    >
                      {item.id}
                    </Link>
                  </td>
                  <td className="px-6 py-4 text-slate-500">{item.date}</td>
                  <td className="px-6 py-4 font-medium text-slate-900">
                    {item.supplier}
                  </td>
                  <td className="px-6 py-4 text-right font-bold text-slate-700">
                    {item.amount}
                  </td>
                  <td className="px-6 py-4 text-slate-500">{item.buyer}</td>
                  <td className="px-6 py-4 text-center">
                    {item.status === "pending" && (
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-orange-200/50 bg-orange-50 px-2.5 py-1 text-xs font-medium text-orange-700">
                        <span className="h-1.5 w-1.5 rounded-full bg-orange-500"></span>
                        待审核
                      </span>
                    )}
                    {item.status === "approved" && (
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-200/50 bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700">
                        <span className="h-1.5 w-1.5 rounded-full bg-blue-500"></span>
                        已审核
                      </span>
                    )}
                    {item.status === "partial" && (
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-purple-200/50 bg-purple-50 px-2.5 py-1 text-xs font-medium text-purple-700">
                        <span className="h-1.5 w-1.5 rounded-full bg-purple-500"></span>
                        部分入库
                      </span>
                    )}
                    {item.status === "completed" && (
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200/50 bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                        已完成
                      </span>
                    )}
                    {item.status === "cancelled" && (
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                        <span className="h-1.5 w-1.5 rounded-full bg-slate-400"></span>
                        已取消
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                      <Link
                        to={`/purchase-orders/${item.id}`}
                        className="hover:text-primary hover:bg-primary-50 rounded p-1.5 text-slate-400 transition-colors"
                        title="查看详情"
                      >
                        <span className="material-symbols-outlined text-[18px]">
                          visibility
                        </span>
                      </Link>
                      {item.status === "pending" && (
                        <>
                          <button
                            className="hover:text-primary hover:bg-primary-50 rounded p-1.5 text-slate-400 transition-colors"
                            title="编辑"
                          >
                            <span className="material-symbols-outlined text-[18px]">
                              edit
                            </span>
                          </button>
                          <button
                            className="hover:text-error hover:bg-error-container/30 rounded p-1.5 text-slate-400 transition-colors"
                            title="删除"
                          >
                            <span className="material-symbols-outlined text-[18px]">
                              delete
                            </span>
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/50 p-4">
          <div className="text-sm text-slate-500">
            显示 <span className="font-medium text-slate-900">1</span> 到{" "}
            <span className="font-medium text-slate-900">6</span> 条，共{" "}
            <span className="font-medium text-slate-900">48</span> 条
          </div>
          <div className="flex items-center gap-2">
            <button
              className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-500 transition-colors hover:bg-white hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
              disabled
            >
              上一页
            </button>
            <div className="flex items-center gap-1">
              <button className="bg-primary flex h-8 w-8 items-center justify-center rounded-lg text-sm font-medium text-white shadow-sm">
                1
              </button>
              <button className="flex h-8 w-8 items-center justify-center rounded-lg text-sm font-medium text-slate-600 transition-colors hover:bg-slate-200">
                2
              </button>
              <button className="flex h-8 w-8 items-center justify-center rounded-lg text-sm font-medium text-slate-600 transition-colors hover:bg-slate-200">
                3
              </button>
              <span className="px-1 text-slate-400">...</span>
              <button className="flex h-8 w-8 items-center justify-center rounded-lg text-sm font-medium text-slate-600 transition-colors hover:bg-slate-200">
                8
              </button>
            </div>
            <button className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-600 shadow-sm transition-colors hover:bg-white hover:text-slate-900">
              下一页
            </button>
          </div>
        </div>
      </div>

      {/* New Purchase Order Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
          <div className="flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/50 px-6 py-4">
              <h3 className="text-lg font-bold text-slate-900">
                新建采购单 (New Purchase Order)
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 transition-colors hover:text-slate-600"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <form className="space-y-8">
                {/* Header Info */}
                <div>
                  <h4 className="mb-4 border-b border-slate-100 pb-2 text-sm font-bold tracking-wider text-slate-900 uppercase">
                    基本信息 (Basic Info)
                  </h4>
                  <div className="grid grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-slate-700">
                        供应商 <span className="text-error">*</span>
                      </label>
                      <select className="focus:ring-primary/20 focus:border-primary w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:ring-2 focus:outline-none">
                        <option value="">请选择供应商</option>
                        <option>越南木材进出口公司</option>
                        <option>胡志明五金配件厂</option>
                        <option>环球包装材料有限公司</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-slate-700">
                        单据日期 <span className="text-error">*</span>
                      </label>
                      <input
                        type="date"
                        defaultValue="2026-04-01"
                        className="focus:ring-primary/20 focus:border-primary w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:ring-2 focus:outline-none"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-slate-700">
                        交货日期 <span className="text-error">*</span>
                      </label>
                      <input
                        type="date"
                        className="focus:ring-primary/20 focus:border-primary w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:ring-2 focus:outline-none"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-slate-700">
                        采购员 <span className="text-error">*</span>
                      </label>
                      <select className="focus:ring-primary/20 focus:border-primary w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:ring-2 focus:outline-none">
                        <option value="">请选择采购员</option>
                        <option>张建国</option>
                        <option>李明</option>
                        <option>王芳</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-slate-700">
                        结算方式
                      </label>
                      <select className="focus:ring-primary/20 focus:border-primary w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:ring-2 focus:outline-none">
                        <option>月结30天</option>
                        <option>款到发货</option>
                        <option>货到付款</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-slate-700">
                        币种
                      </label>
                      <select className="focus:ring-primary/20 focus:border-primary w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:ring-2 focus:outline-none">
                        <option>USD - 美元</option>
                        <option>VND - 越南盾</option>
                        <option>CNY - 人民币</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Line Items */}
                <div>
                  <div className="mb-4 flex items-center justify-between border-b border-slate-100 pb-2">
                    <h4 className="text-sm font-bold tracking-wider text-slate-900 uppercase">
                      采购明细 (Line Items)
                    </h4>
                    <button
                      type="button"
                      className="text-primary hover:text-primary/80 flex items-center gap-1 text-sm font-medium"
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        add_circle
                      </span>
                      添加物料
                    </button>
                  </div>

                  <div className="overflow-hidden rounded-lg border border-slate-200">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                      <thead className="border-b border-slate-200 bg-slate-50 text-xs text-slate-500">
                        <tr>
                          <th className="w-10 px-4 py-3 font-semibold">序号</th>
                          <th className="px-4 py-3 font-semibold">
                            物料编码/名称
                          </th>
                          <th className="px-4 py-3 font-semibold">规格型号</th>
                          <th className="w-24 px-4 py-3 font-semibold">单位</th>
                          <th className="w-32 px-4 py-3 text-right font-semibold">
                            数量
                          </th>
                          <th className="w-32 px-4 py-3 text-right font-semibold">
                            单价
                          </th>
                          <th className="w-32 px-4 py-3 text-right font-semibold">
                            金额
                          </th>
                          <th className="w-12 px-4 py-3 text-center font-semibold">
                            操作
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        <tr>
                          <td className="px-4 py-3 text-slate-500">1</td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <input
                                type="text"
                                placeholder="选择物料..."
                                className="focus:border-primary w-full rounded border border-slate-200 px-2 py-1.5 text-sm focus:outline-none"
                              />
                              <button
                                type="button"
                                className="hover:text-primary p-1 text-slate-400"
                              >
                                <span className="material-symbols-outlined text-[18px]">
                                  search
                                </span>
                              </button>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-slate-500">-</td>
                          <td className="px-4 py-3 text-slate-500">-</td>
                          <td className="px-4 py-3">
                            <input
                              type="number"
                              placeholder="0"
                              className="focus:border-primary w-full rounded border border-slate-200 px-2 py-1.5 text-right text-sm focus:outline-none"
                            />
                          </td>
                          <td className="px-4 py-3">
                            <input
                              type="number"
                              placeholder="0.00"
                              className="focus:border-primary w-full rounded border border-slate-200 px-2 py-1.5 text-right text-sm focus:outline-none"
                            />
                          </td>
                          <td className="px-4 py-3 text-right font-medium text-slate-700">
                            $0.00
                          </td>
                          <td className="px-4 py-3 text-center">
                            <button
                              type="button"
                              className="hover:text-error text-slate-400"
                            >
                              <span className="material-symbols-outlined text-[18px]">
                                delete
                              </span>
                            </button>
                          </td>
                        </tr>
                      </tbody>
                      <tfoot className="border-t border-slate-200 bg-slate-50">
                        <tr>
                          <td
                            colSpan={6}
                            className="px-4 py-3 text-right font-semibold text-slate-700"
                          >
                            合计金额 (Total Amount):
                          </td>
                          <td className="text-primary px-4 py-3 text-right text-base font-bold">
                            $0.00
                          </td>
                          <td></td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>

                {/* Remarks */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">
                    备注说明 (Remarks)
                  </label>
                  <textarea
                    rows={3}
                    placeholder="添加采购单备注..."
                    className="focus:ring-primary/20 focus:border-primary w-full resize-none rounded-lg border border-slate-200 px-3 py-2 text-sm focus:ring-2 focus:outline-none"
                  ></textarea>
                </div>
              </form>
            </div>

            <div className="flex justify-end gap-3 border-t border-slate-100 bg-slate-50 px-6 py-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50"
              >
                取消 (Cancel)
              </button>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-primary bg-primary-50 border-primary-200 hover:bg-primary-100 rounded-lg border px-4 py-2 text-sm font-medium transition-colors"
              >
                保存草稿 (Save Draft)
              </button>
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-primary hover:bg-primary/90 rounded-lg px-6 py-2 text-sm font-medium text-white shadow-sm transition-colors"
              >
                提交审核 (Submit)
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
