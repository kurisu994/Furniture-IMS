import { setRequestLocale } from 'next-intl/server'
import { StockChecksContent } from './_components/stock-checks-content'

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)
  return <StockChecksContent />
}
