import { setRequestLocale } from 'next-intl/server'
import { StockTransfersContent } from './_components/stock-transfers-content'

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)
  return <StockTransfersContent />
}
