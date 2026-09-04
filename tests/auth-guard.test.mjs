import assert from 'node:assert/strict'
import test from 'node:test'

import { PENDING_ONLY_ROUTES, resolveAuthRedirect } from '../lib/auth-guard.ts'

/**
 * 认证路由守卫决策测试
 *
 * 守卫的输入是 isLoading × user × needsSetup × pathname 四维组合，历史上已因
 * 组合遗漏出过两次缺陷（不勾「记住我」被踢回登录页、首次改密误报「未登录」），
 * 故先用场景表锁住每个有意义的组合，再用不变量覆盖整个笛卡尔积。
 */

/** 构造认证态快照，未指定的维度取「已登录、无待办、在首页」这一稳态 */
function state(overrides = {}) {
  return {
    isLoading: false,
    user: { must_change_password: false },
    needsSetup: false,
    pathname: '/',
    ...overrides,
  }
}

/** 一条业务页面路由，代表所有「受保护的普通页面」 */
const BUSINESS_ROUTE = '/inventory'

test('加载中不做任何决策，交由 SplashScreen 兜住', () => {
  assert.equal(resolveAuthRedirect(state({ isLoading: true, user: null, pathname: BUSINESS_ROUTE })), null)
})

test('未登录访问受保护页面一律送回登录页', () => {
  // 改密页是 v0.3.3 的缺陷现场：曾被当作免鉴权页放行，提交时才报「未登录」
  for (const pathname of ['/change-password', '/setup-wizard', BUSINESS_ROUTE]) {
    assert.equal(resolveAuthRedirect(state({ user: null, pathname })), '/login', pathname)
  }
})

test('未登录且已在登录页则停留', () => {
  assert.equal(resolveAuthRedirect(state({ user: null, pathname: '/login' })), null)
})

test('需要强制改密时停留在改密页（首次登录的正常落点）', () => {
  const user = { must_change_password: true }
  assert.equal(resolveAuthRedirect(state({ user, pathname: '/change-password' })), null)
})

test('需要强制改密时从任何其他页面拉回改密页，且优先于向导', () => {
  const user = { must_change_password: true }
  for (const pathname of ['/login', '/setup-wizard', BUSINESS_ROUTE]) {
    assert.equal(resolveAuthRedirect(state({ user, needsSetup: true, pathname })), '/change-password', pathname)
  }
})

test('需要向导时停留在向导页', () => {
  assert.equal(resolveAuthRedirect(state({ needsSetup: true, pathname: '/setup-wizard' })), null)
})

test('需要向导时从其他页面拉回向导页', () => {
  for (const pathname of ['/login', BUSINESS_ROUTE]) {
    assert.equal(resolveAuthRedirect(state({ needsSetup: true, pathname })), '/setup-wizard', pathname)
  }
})

test('已登录且无待办时直达向导页会被送回首页', () => {
  // 修复前守卫只在 needsSetup=true 时把人推进向导、反向不拦，
  // 任何已登录用户都能打开首次使用向导
  assert.equal(resolveAuthRedirect(state({ pathname: '/setup-wizard' })), '/')
})

test('已登录且无待办时仍停在登录页会被送回首页', () => {
  assert.equal(resolveAuthRedirect(state({ pathname: '/login' })), '/')
})

test('已登录且无待办时停在改密页不推首页，避免与该页的 logout 跳转竞争', () => {
  assert.equal(resolveAuthRedirect(state({ pathname: '/change-password' })), null)
})

test('已登录且无待办时停在业务页则停留', () => {
  assert.equal(resolveAuthRedirect(state({ pathname: BUSINESS_ROUTE })), null)
})

/** 枚举 isLoading × user × needsSetup × pathname 的全部组合 */
function allStates() {
  const users = [null, { must_change_password: true }, { must_change_password: false }]
  const pathnames = ['/login', '/change-password', '/setup-wizard', '/', BUSINESS_ROUTE]
  const result = []
  for (const isLoading of [true, false]) {
    for (const user of users) {
      for (const needsSetup of [true, false]) {
        for (const pathname of pathnames) {
          result.push({ isLoading, user, needsSetup, pathname })
        }
      }
    }
  }
  return result
}

test('不变量：加载中一律不决策', () => {
  for (const s of allStates().filter(s => s.isLoading)) {
    assert.equal(resolveAuthRedirect(s), null, JSON.stringify(s))
  }
})

test('不变量：决策结果永不指向当前页，否则会自我重定向死循环', () => {
  for (const s of allStates()) {
    assert.notEqual(resolveAuthRedirect(s), s.pathname, JSON.stringify(s))
  }
})

test('不变量：未登录时只可能停留或去登录页，绝不放行到其他页面', () => {
  for (const s of allStates().filter(s => s.user === null)) {
    const target = resolveAuthRedirect(s)
    assert.ok(target === null || target === '/login', JSON.stringify(s))
  }
})

test('不变量：决策一次即收敛，跳转后的目标页面不再产生新的跳转', () => {
  for (const s of allStates()) {
    const target = resolveAuthRedirect(s)
    if (target === null) continue
    assert.equal(resolveAuthRedirect({ ...s, pathname: target }), null, JSON.stringify(s))
  }
})

test('待办专用页清单不含改密页，避免与该页的 logout 跳转竞争', () => {
  assert.ok(!PENDING_ONLY_ROUTES.includes('/change-password'))
})
