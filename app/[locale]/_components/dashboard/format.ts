import { type Currency, formatAmount } from '@/lib/currency'

/** 格式化看板中的 USD 金额 */
export function formatDashboardUsd(amount: number) {
  return formatAmount(amount, 'USD' as Currency)
}

/** 格式化看板图表中的紧凑 USD 金额 */
export function formatDashboardUsdCompact(amount: number) {
  const value = amount / 100
  const absValue = Math.abs(value)

  if (absValue >= 1_000_000) {
    return `$${(value / 1_000_000).toFixed(1)}M`
  }

  if (absValue >= 1_000) {
    return `$${(value / 1_000).toFixed(0)}K`
  }

  return formatDashboardUsd(amount)
}

/** 格式化本地日期为后端查询使用的 YYYY-MM-DD */
export function formatLocalDate(date: Date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

/** 基于本地日期增减天数，避免 UTC 日期造成跨日偏差 */
export function addDays(date: Date, days: number) {
  const next = new Date(date)
  next.setDate(next.getDate() + days)
  return next
}
