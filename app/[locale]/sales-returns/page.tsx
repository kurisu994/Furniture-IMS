import { setRequestLocale } from 'next-intl/server'
import { SalesReturnsContent } from './_components/sales-returns-content'

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)
  return <SalesReturnsContent />
}
