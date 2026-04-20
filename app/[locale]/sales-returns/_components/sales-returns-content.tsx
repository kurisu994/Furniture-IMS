'use client'

import { useState } from 'react'
import { ReturnExecutePage } from './return-execute-page'
import { ReturnListPage } from './return-list-page'

/**
 * 销售退货主内容组件
 * 管理列表页和退货执行页之间的视图切换
 */
export function SalesReturnsContent() {
  const [view, setView] = useState<'list' | 'execute'>('list')
  /** 关联的出库单 ID（从出库单跳转退货时传入） */
  const [outboundId, setOutboundId] = useState<number | null>(null)

  /** 新建退货单（关联出库单） */
  const handleNewReturn = (id: number) => {
    setOutboundId(id)
    setView('execute')
  }

  /** 返回列表 */
  const handleBackToList = () => {
    setView('list')
    setOutboundId(null)
  }

  if (view === 'execute' && outboundId) {
    return <ReturnExecutePage outboundId={outboundId} onBack={handleBackToList} />
  }

  return <ReturnListPage onNewReturn={handleNewReturn} />
}
