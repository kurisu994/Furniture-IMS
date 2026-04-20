import { setRequestLocale } from 'next-intl/server'
import { SalesOrdersContent } from './_components/sales-orders-content'

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)
  return <SalesOrdersContent />
}
