import { setRequestLocale } from 'next-intl/server'
import { SalesDeliveriesContent } from './_components/sales-deliveries-content'

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)
  return <SalesDeliveriesContent />
}
