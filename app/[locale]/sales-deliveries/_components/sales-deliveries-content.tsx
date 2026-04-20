'use client'

import { useState } from 'react'
import { OutboundExecutePage } from './outbound-execute-page'
import { OutboundListPage } from './outbound-list-page'

/**
 * 销售出库主内容组件
 * 管理列表页和出库执行页之间的视图切换
 */
export function SalesDeliveriesContent() {
  const [view, setView] = useState<'list' | 'execute'>('list')
  /** 关联的销售单 ID（从销售单跳转出库时传入） */
  const [salesId, setSalesId] = useState<number | null>(null)

  /** 新建出库单（关联销售单） */
  const handleNewOutbound = (id: number) => {
    setSalesId(id)
    setView('execute')
  }

  /** 返回列表 */
  const handleBackToList = () => {
    setView('list')
    setSalesId(null)
  }

  if (view === 'execute' && salesId) {
    return <OutboundExecutePage salesId={salesId} onBack={handleBackToList} />
  }

  return <OutboundListPage onNewOutbound={handleNewOutbound} />
}
