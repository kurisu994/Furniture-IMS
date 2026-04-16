import { setRequestLocale } from 'next-intl/server'
import { DataManagementContent } from '../_components/data-management-content'

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)
  return <DataManagementContent />
}
