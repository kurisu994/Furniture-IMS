import { setRequestLocale } from 'next-intl/server'
import { CompanyInfoContent } from './_components/company-info-content'

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)
  return <CompanyInfoContent />
}
