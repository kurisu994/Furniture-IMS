import { setRequestLocale } from 'next-intl/server'
import { locales } from '@/i18n/config'
import { DashboardContent } from './_components/dashboard-content'

export function generateStaticParams() {
  return locales.map(locale => ({ locale }))
}

/**
 * 首页看板 — 展示 KPI 指标和概览信息
 */
export default async function DashboardPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)

  return <DashboardContent />
}
