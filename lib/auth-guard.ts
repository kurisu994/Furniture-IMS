/**
 * 认证路由守卫决策
 *
 * 把「当前认证态该跳到哪个页面」抽成纯函数，供 AuthProvider 的路由守卫 effect
 * 与防闪烁判断（isPendingRedirect）共用同一份逻辑。
 *
 * 抽出的原因：这两处此前各写了一遍相同的四个条件，必须手工保持同步，
 * 漏改一处就会出现「页面渲染了但守卫要跳转」或反之的错位（首次改密误报
 * 「未登录」就是这么来的）。现在只有这一个真相来源。
 */

/** 守卫只关心用户是否被强制改密，故用最小结构（UserInfo 结构化兼容） */
export interface AuthGuardUser {
  /** 是否必须先修改密码 */
  must_change_password: boolean
}

/** 做出守卫决策所需的认证态快照 */
export interface AuthGuardState {
  /** 认证状态是否仍在加载（加载期间不做任何重定向决策） */
  isLoading: boolean
  /** 当前登录用户，null 表示未登录 */
  user: AuthGuardUser | null
  /** 是否需要完成首次使用向导 */
  needsSetup: boolean
  /** 当前路由（已去掉 locale 前缀） */
  pathname: string
}

/**
 * 免鉴权页面：允许 user=null 时访问的路由白名单
 *
 * 仅登录页。改密页与向导页都依赖已登录的 user 状态，未登录访问时应被送回登录页。
 *
 * ⚠️ 勿与 `app-layout.tsx` 的 `bareLayoutRoutes` 混淆并"统一"：那份列表是
 * 「不套用主布局（侧边栏/顶栏）的页面」，包含改密页与向导页，两者语义不同。
 */
export const PUBLIC_ROUTES = ['/login']

/**
 * 仅服务于「待办」的页面：待办完成后不应再停留于此，需送回首页
 *
 * 不含 `/change-password`：该页改密成功后会自行调用 logout() 跳登录页，
 * 若守卫同时把它推向首页会产生跳转竞争。
 */
export const PENDING_ONLY_ROUTES = ['/login', '/setup-wizard']

/**
 * 计算当前认证态应重定向到的目标路由
 *
 * 优先级（从高到低）：
 * 1. 加载中 → 不决策
 * 2. 未登录且不在免鉴权页 → /login
 * 3. 需要改密 → /change-password
 * 4. 需要向导 → /setup-wizard
 * 5. 已登录且无待办，却停在只服务于待办的页面 → 首页
 *
 * @returns 目标路由；null 表示应停留在当前页
 */
export function resolveAuthRedirect(state: AuthGuardState): string | null {
  const { isLoading, user, needsSetup, pathname } = state

  if (isLoading) {
    return null
  }

  if (!user) {
    // 未登录访问受保护页面 → 跳转登录
    return PUBLIC_ROUTES.includes(pathname) ? null : '/login'
  }

  if (user.must_change_password) {
    // 需要改密但不在改密页 → 强制跳转
    return pathname === '/change-password' ? null : '/change-password'
  }

  if (needsSetup) {
    // 需要向导但不在向导页 → 强制跳转
    return pathname === '/setup-wizard' ? null : '/setup-wizard'
  }

  // 已登录且无待办事项，却停在只服务于待办的页面 → 跳转首页。
  // 覆盖向导页：守卫此前只在 needsSetup=true 时把人推进向导，反向不拦，
  // 任何已登录用户都能直达 /setup-wizard（写操作虽有后端权限兜底，但 UI 不该可达）。
  return PENDING_ONLY_ROUTES.includes(pathname) ? '/' : null
}
