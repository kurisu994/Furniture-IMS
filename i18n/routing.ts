import { defineRouting } from 'next-intl/routing'
import { defaultLocale, locales } from './config'

/** next-intl 路由配置 — 定义 URL 中的 locale 前缀 */
export const routing = defineRouting({
  locales,
  defaultLocale,
})
