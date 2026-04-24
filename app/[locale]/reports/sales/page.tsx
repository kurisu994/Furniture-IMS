import { setRequestLocale } from 'next-intl/server'
import { BusinessReportPage } from '../_components/business-report-page'

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)
  return <BusinessReportPage kind="sales" />
}
