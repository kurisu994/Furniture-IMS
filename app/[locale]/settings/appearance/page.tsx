import { setRequestLocale } from 'next-intl/server'
import { AppearanceContent } from '../_components/appearance-content'

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)
  return <AppearanceContent />
}
