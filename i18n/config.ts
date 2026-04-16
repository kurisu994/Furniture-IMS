/** i18n 配置 — 支持的语言和默认语言 */
export const locales = ['zh', 'vi', 'en'] as const
export type Locale = (typeof locales)[number]
export const defaultLocale: Locale = 'zh'

/** 语言显示名称映射 */
export const localeNames: Record<Locale, string> = {
  zh: '中文',
  vi: 'Tiếng Việt',
  en: 'English',
}

/** 语言国旗 emoji 映射 */
export const localeFlags: Record<Locale, string> = {
  zh: '🇨🇳',
  vi: '🇻🇳',
  en: '🇺🇸',
}
