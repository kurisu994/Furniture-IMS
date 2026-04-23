import { setRequestLocale } from 'next-intl/server'
import { ReplenishmentPage } from './_components/replenishment-page'

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)
  return <ReplenishmentPage />
}
