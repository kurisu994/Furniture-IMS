'use client'

import { useState } from 'react'
import { ProductionOrderDetailPage } from './production-order-detail'
import { ProductionOrderListPage } from './production-order-list-page'

/**
 * 生产工单管理主内容组件
 * 管理列表页和详情/执行页之间的视图切换
 */
export function ProductionOrdersContent() {
  const [view, setView] = useState<'list' | 'detail'>('list')
  const [editingOrderId, setEditingOrderId] = useState<number | null>(null)

  /** 查看/编辑工单 */
  const handleEdit = (id: number) => {
    setEditingOrderId(id)
    setView('detail')
  }

  /** 新建工单 */
  const handleNew = () => {
    setEditingOrderId(null)
    setView('detail')
  }

  /** 返回列表 */
  const handleBackToList = () => {
    setView('list')
    setEditingOrderId(null)
  }

  if (view === 'detail') {
    return <ProductionOrderDetailPage orderId={editingOrderId} onBack={handleBackToList} />
  }

  return <ProductionOrderListPage onEdit={handleEdit} onNew={handleNew} />
}
