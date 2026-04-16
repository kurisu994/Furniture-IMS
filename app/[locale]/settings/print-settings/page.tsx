import { setRequestLocale } from 'next-intl/server'
import { PrintSettingsContent } from '../_components/print-settings-content'

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)
  return <PrintSettingsContent />
}
