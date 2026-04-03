import { useState } from "react";
import clsx from "clsx";

export default function MaterialList() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-on-surface text-2xl font-bold">物料管理</h2>
          <p className="mt-1 text-sm text-slate-500">
            管理所有基础物料数据 (Material Management)
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
            新建物料
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
                placeholder="搜索物料编码、名称、规格..."
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
              <span className="text-slate-500">分类:</span>
              <select className="focus:border-primary rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-slate-700 focus:outline-none">
                <option>全部 (All)</option>
                <option>原材料 (Raw Materials)</option>
                <option>半成品 (Semi-Finished)</option>
                <option>成品 (Finished Goods)</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-slate-500">状态:</span>
              <select className="focus:border-primary rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-slate-700 focus:outline-none">
                <option>全部 (All)</option>
                <option>启用 (Active)</option>
                <option>停用 (Inactive)</option>
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
                  物料编码
                </th>
                <th className="px-6 py-4 font-semibold">物料名称</th>
                <th className="px-6 py-4 font-semibold">规格型号</th>
                <th className="px-6 py-4 font-semibold">分类</th>
                <th className="px-6 py-4 font-semibold">基本单位</th>
                <th className="px-6 py-4 text-right font-semibold">安全库存</th>
                <th className="px-6 py-4 text-center font-semibold">状态</th>
                <th className="px-6 py-4 text-right font-semibold">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {[
                {
                  id: "MAT-2024-001",
                  name: "A级橡木实木板",
                  spec: "2400x1200x18mm",
                  category: "原材料",
                  unit: "张",
                  safeStock: 50,
                  status: "active",
                },
                {
                  id: "MAT-2024-002",
                  name: "工业级环保胶水",
                  spec: "20kg/桶",
                  category: "辅料",
                  unit: "桶",
                  safeStock: 20,
                  status: "active",
                },
                {
                  id: "MAT-2024-003",
                  name: "不锈钢隐藏式铰链",
                  spec: "110度阻尼",
                  category: "五金件",
                  unit: "个",
                  safeStock: 500,
                  status: "active",
                },
                {
                  id: "MAT-2024-004",
                  name: "北欧风餐椅框架",
                  spec: "白蜡木材质",
                  category: "半成品",
                  unit: "套",
                  safeStock: 30,
                  status: "active",
                },
                {
                  id: "MAT-2024-005",
                  name: "真皮沙发面料",
                  spec: "头层牛皮 棕色",
                  category: "原材料",
                  unit: "平方米",
                  safeStock: 100,
                  status: "warning",
                },
                {
                  id: "MAT-2024-006",
                  name: "定制衣柜拉手",
                  spec: "铝合金 哑光黑 200mm",
                  category: "五金件",
                  unit: "个",
                  safeStock: 200,
                  status: "inactive",
                },
                {
                  id: "MAT-2024-007",
                  name: "高密度海绵垫",
                  spec: "45D 500x500x50mm",
                  category: "原材料",
                  unit: "块",
                  safeStock: 150,
                  status: "active",
                },
                {
                  id: "MAT-2024-008",
                  name: "包装纸箱",
                  spec: "五层瓦楞 800x600x400mm",
                  category: "包材",
                  unit: "个",
                  safeStock: 1000,
                  status: "active",
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
                    <a href="#" className="hover:underline">
                      {item.id}
                    </a>
                  </td>
                  <td className="px-6 py-4 font-medium text-slate-900">
                    {item.name}
                  </td>
                  <td className="px-6 py-4 text-slate-500">{item.spec}</td>
                  <td className="px-6 py-4">
                    <span className="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                      {item.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-500">{item.unit}</td>
                  <td className="px-6 py-4 text-right font-medium text-slate-700">
                    {item.safeStock}
                  </td>
                  <td className="px-6 py-4 text-center">
                    {item.status === "active" && (
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200/50 bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                        启用
                      </span>
                    )}
                    {item.status === "warning" && (
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-orange-200/50 bg-orange-50 px-2.5 py-1 text-xs font-medium text-orange-700">
                        <span className="h-1.5 w-1.5 rounded-full bg-orange-500"></span>
                        预警
                      </span>
                    )}
                    {item.status === "inactive" && (
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                        <span className="h-1.5 w-1.5 rounded-full bg-slate-400"></span>
                        停用
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 transition-opacity group-hover:opacity-100">
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
            <span className="font-medium text-slate-900">8</span> 条，共{" "}
            <span className="font-medium text-slate-900">124</span> 条
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
                16
              </button>
            </div>
            <button className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-600 shadow-sm transition-colors hover:bg-white hover:text-slate-900">
              下一页
            </button>
          </div>
        </div>
      </div>

      {/* New Material Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
          <div className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/50 px-6 py-4">
              <h3 className="text-lg font-bold text-slate-900">
                新建物料 (New Material)
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 transition-colors hover:text-slate-600"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <form className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">
                      物料编码 <span className="text-error">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="系统自动生成或手动输入"
                      className="focus:ring-primary/20 focus:border-primary w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:ring-2 focus:outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">
                      物料名称 <span className="text-error">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="请输入物料名称"
                      className="focus:ring-primary/20 focus:border-primary w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:ring-2 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">
                      物料分类 <span className="text-error">*</span>
                    </label>
                    <select className="focus:ring-primary/20 focus:border-primary w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:ring-2 focus:outline-none">
                      <option value="">请选择分类</option>
                      <option>原材料</option>
                      <option>半成品</option>
                      <option>成品</option>
                      <option>五金件</option>
                      <option>包材</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">
                      规格型号
                    </label>
                    <input
                      type="text"
                      placeholder="例如: 2400x1200x18mm"
                      className="focus:ring-primary/20 focus:border-primary w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:ring-2 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">
                      基本单位 <span className="text-error">*</span>
                    </label>
                    <select className="focus:ring-primary/20 focus:border-primary w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:ring-2 focus:outline-none">
                      <option value="">请选择单位</option>
                      <option>件 (pcs)</option>
                      <option>个 (ea)</option>
                      <option>张 (sheet)</option>
                      <option>千克 (kg)</option>
                      <option>米 (m)</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">
                      安全库存
                    </label>
                    <input
                      type="number"
                      placeholder="0"
                      className="focus:ring-primary/20 focus:border-primary w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:ring-2 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">
                    备注说明
                  </label>
                  <textarea
                    rows={3}
                    placeholder="添加物料的详细描述或特殊要求..."
                    className="focus:ring-primary/20 focus:border-primary w-full resize-none rounded-lg border border-slate-200 px-3 py-2 text-sm focus:ring-2 focus:outline-none"
                  ></textarea>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="checkbox"
                    id="status"
                    className="text-primary focus:ring-primary rounded border-slate-300"
                    defaultChecked
                  />
                  <label
                    htmlFor="status"
                    className="cursor-pointer text-sm text-slate-700"
                  >
                    立即启用该物料
                  </label>
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
                className="bg-primary hover:bg-primary/90 rounded-lg px-6 py-2 text-sm font-medium text-white shadow-sm transition-colors"
              >
                保存 (Save)
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
