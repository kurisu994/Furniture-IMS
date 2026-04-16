'use client'

import { ShieldAlert, Users2 } from 'lucide-react'
import { useTranslations } from 'next-intl'

export function UserManagementContent() {
  const t = useTranslations('settings.userManagement')

  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-slate-200 bg-white py-24 shadow-sm dark:border-slate-800 dark:bg-slate-950">
      <div className="flex size-16 items-center justify-center rounded-full bg-slate-50 text-slate-400 dark:bg-slate-900">
        <Users2 className="size-8" />
      </div>
      <h2 className="mt-6 text-xl font-bold text-slate-900 dark:text-slate-100">{t('title')}</h2>
      <p className="mt-2 max-w-md text-center text-sm leading-relaxed text-slate-500 dark:text-slate-400">{t('description')}</p>

      <div className="mt-8 flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-800 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-300">
        <ShieldAlert className="size-4 shrink-0" />
        <span>系统当前锁定为单管理员模式 (Single-Account Mode)</span>
      </div>
    </div>
  )
}
