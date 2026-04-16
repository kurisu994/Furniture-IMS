import { createNavigation } from 'next-intl/navigation'
import { routing } from './routing'

/** 封装 next-intl 导航工具 — 在组件中使用 */
export const { Link, redirect, usePathname, useRouter, getPathname } = createNavigation(routing)
