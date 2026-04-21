'use client'

import { useState } from 'react'
import { StockTransferEditPage } from './stock-transfer-edit-page'
import { StockTransferListPage } from './stock-transfer-list-page'

/**
 * 库存调拨主内容组件
 * 管理列表页和编辑页之间的视图切换
 */
export function StockTransfersContent() {
  const [view, setView] = useState<'list' | 'edit'>('list')
  const [editingId, setEditingId] = useState<number | null>(null)

  /** 编辑调拨单 */
  const handleEdit = (id: number) => {
    setEditingId(id)
    setView('edit')
  }

  /** 新建调拨单 */
  const handleNew = () => {
    setEditingId(null)
    setView('edit')
  }

  /** 返回列表 */
  const handleBackToList = () => {
    setView('list')
    setEditingId(null)
  }

  if (view === 'edit') {
    return <StockTransferEditPage transferId={editingId} onBack={handleBackToList} />
  }

  return <StockTransferListPage onEdit={handleEdit} onNew={handleNew} />
}
