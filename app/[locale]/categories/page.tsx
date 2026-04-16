import { getTranslations, setRequestLocale } from 'next-intl/server'
import { CategoryContent } from './_components/category-content'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'categories' })
  return {
    title: `${t('title')} - CloudPivot IMS`,
  }
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)

  return <CategoryContent />
}
