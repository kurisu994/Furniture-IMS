import { setRequestLocale } from 'next-intl/server'
import { ProductionOrdersContent } from './_components/production-orders-content'

/** 生产工单页面 — SSG 必需 */
export default async function ProductionOrdersPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)
  return <ProductionOrdersContent />
}
