import { setRequestLocale } from 'next-intl/server'
import { UserManagementContent } from '../_components/user-management-content'

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)
  return <UserManagementContent />
}
