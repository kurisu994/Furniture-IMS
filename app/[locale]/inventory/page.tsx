import { setRequestLocale } from 'next-intl/server'
import { InventoryContent } from './_components/inventory-content'

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)
  return <InventoryContent />
}
