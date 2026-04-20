'use client'

import { useState } from 'react'
import { SalesOrderEditPage } from './sales-order-edit-page'
import { SalesOrderListPage } from './sales-order-list-page'

/**
 * 销售单管理主内容组件
 * 管理列表页和编辑页之间的视图切换
 */
export function SalesOrdersContent() {
  const [view, setView] = useState<'list' | 'edit'>('list')
  const [editingOrderId, setEditingOrderId] = useState<number | null>(null)

  /** 编辑销售单 */
  const handleEdit = (id: number) => {
    setEditingOrderId(id)
    setView('edit')
  }

  /** 新建销售单 */
  const handleNew = () => {
    setEditingOrderId(null)
    setView('edit')
  }

  /** 返回列表 */
  const handleBackToList = () => {
    setView('list')
    setEditingOrderId(null)
  }

  if (view === 'edit') {
    return <SalesOrderEditPage orderId={editingOrderId} onBack={handleBackToList} />
  }

  return <SalesOrderListPage onEdit={handleEdit} onNew={handleNew} />
}
