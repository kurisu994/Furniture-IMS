import { setRequestLocale } from 'next-intl/server'
import { PayablesPage } from './_components/payables-page'

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)
  return <PayablesPage />
}
