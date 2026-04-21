'use client'

import { useState } from 'react'
import { StockCheckEditPage } from './stock-check-edit-page'
import { StockCheckListPage } from './stock-check-list-page'

/**
 * 库存盘点主内容组件
 * 管理列表页和编辑页之间的视图切换
 */
export function StockChecksContent() {
  const [view, setView] = useState<'list' | 'edit'>('list')
  const [editingCheckId, setEditingCheckId] = useState<number | null>(null)

  /** 查看/编辑盘点单 */
  const handleEdit = (id: number) => {
    setEditingCheckId(id)
    setView('edit')
  }

  /** 新建盘点单后进入编辑 */
  const handleCreated = (id: number) => {
    setEditingCheckId(id)
    setView('edit')
  }

  /** 返回列表 */
  const handleBackToList = () => {
    setView('list')
    setEditingCheckId(null)
  }

  if (view === 'edit') {
    return <StockCheckEditPage checkId={editingCheckId} onBack={handleBackToList} />
  }

  return <StockCheckListPage onEdit={handleEdit} onCreated={handleCreated} />
}
