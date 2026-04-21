import { setRequestLocale } from 'next-intl/server'
import { StockMovementsContent } from './_components/stock-movements-content'

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)
  return <StockMovementsContent />
}
