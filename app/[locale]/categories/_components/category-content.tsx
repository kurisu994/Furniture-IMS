'use client'

import { FolderTree, Plus } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useCallback, useState } from 'react'
import { Button } from '@/components/ui/button'
import type { CategoryNode } from '@/lib/tauri'
import { CategoryEditModal } from './category-edit-modal'
import { CategoryTree } from './category-tree'

/**
 * 分类管理页面主内容组件
 *
 * 编排页面标题、操作按钮、树形列表和编辑弹窗。
 */
export function CategoryContent() {
  const t = useTranslations('categories')

  // 弹窗状态
  const [modalOpen, setModalOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<CategoryNode | null>(null)

  // 刷新树的计数器
  const [refreshKey, setRefreshKey] = useState(0)

  /** 打开新增弹窗 */
  const handleAdd = useCallback(() => {
    setEditingCategory(null)
    setModalOpen(true)
  }, [])

  /** 打开编辑弹窗 */
  const handleEdit = useCallback((category: CategoryNode | null) => {
    if (category) {
      setEditingCategory(category)
      setModalOpen(true)
    }
  }, [])

  /** 保存成功后刷新树 */
  const handleSuccess = useCallback(() => {
    setModalOpen(false)
    setRefreshKey(k => k + 1)
  }, [])

  return (
    <div className="flex flex-col gap-6">
      {/* 页面标题 */}
      <div className="flex items-center gap-3">
        <div className="bg-primary/10 flex size-10 items-center justify-center rounded-lg">
          <FolderTree className="text-primary size-5" />
        </div>
        <div>
          <h2 className="text-foreground text-2xl font-bold">{t('title')}</h2>
          <p className="text-muted-foreground mt-0.5 text-sm">{t('dragHint')}</p>
        </div>
      </div>

      {/* 操作按钮 */}
      <div className="flex items-center gap-2">
        <Button onClick={handleAdd}>
          <Plus data-icon="inline-start" />
          {t('addCategory')}
        </Button>
      </div>

      {/* 分类树 */}
      <div className="border-border bg-card rounded-xl border p-4 shadow-sm">
        <CategoryTree onEdit={handleEdit} refreshKey={refreshKey} />
      </div>

      {/* 编辑弹窗 */}
      <CategoryEditModal open={modalOpen} onOpenChange={setModalOpen} editingCategory={editingCategory} onSuccess={handleSuccess} />
    </div>
  )
}
