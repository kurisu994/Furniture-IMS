"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from "react";
import { useRouter, usePathname } from "@/i18n/navigation";
import { isTauriEnv, type UserInfo } from "@/lib/tauri";
import * as tauriApi from "@/lib/tauri";

/** 认证状态 */
interface AuthState {
  /** 当前登录用户 */
  user: UserInfo | null;
  /** 是否正在加载认证状态 */
  isLoading: boolean;
  /** 是否已认证 */
  isAuthenticated: boolean;
}

/** 认证上下文接口 */
interface AuthContextValue extends AuthState {
  /** 登录 */
  login: (username: string, password: string) => Promise<LoginResult>;
  /** 修改密码 */
  changePassword: (newPassword: string) => Promise<void>;
  /** 登出 */
  logout: () => void;
}

/** 登录结果 */
interface LoginResult {
  success: boolean;
  mustChangePassword: boolean;
  error?: string;
}

/** localStorage 键名 */
const AUTH_STORAGE_KEY = "cloudpivot_auth";

/** 认证数据持久化结构 */
interface AuthStorage {
  userId: number;
  sessionVersion: number;
}

const AuthContext = createContext<AuthContextValue | null>(null);

/**
 * 认证 Provider
 *
 * 提供全局认证状态管理、路由守卫和会话持久化。
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  const [user, setUser] = useState<UserInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  /** 认证相关页面，不需要鉴权 */
  const authRoutes = ["/login", "/change-password"];
  const isAuthRoute = authRoutes.includes(pathname);

  /** 保存认证信息到 localStorage */
  const saveAuth = useCallback((userInfo: UserInfo) => {
    const data: AuthStorage = {
      userId: userInfo.id,
      sessionVersion: userInfo.session_version,
    };
    try {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(data));
    } catch {
      // localStorage 不可用（如隐私模式）
    }
  }, []);

  /** 清除认证信息 */
  const clearAuth = useCallback(() => {
    setUser(null);
    try {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    } catch {
      // 忽略
    }
  }, []);

  /** 登录 */
  const login = useCallback(
    async (username: string, password: string): Promise<LoginResult> => {
      if (!isTauriEnv()) {
        // 非 Tauri 环境：模拟登录（开发模式）
        const mockUser: UserInfo = {
          id: 1,
          username: "admin",
          display_name: "管理员",
          role: "admin",
          must_change_password: false,
          session_version: 1,
        };
        setUser(mockUser);
        saveAuth(mockUser);
        return { success: true, mustChangePassword: false };
      }

      try {
        const response = await tauriApi.login(username, password);
        setUser(response.user);
        saveAuth(response.user);

        return {
          success: true,
          mustChangePassword: response.must_change_password,
        };
      } catch (err) {
        return {
          success: false,
          mustChangePassword: false,
          error: err instanceof Error ? err.message : String(err),
        };
      }
    },
    [saveAuth],
  );

  /** 修改密码 */
  const changePassword = useCallback(
    async (newPassword: string) => {
      if (!user) {
        throw new Error("未登录");
      }

      if (isTauriEnv()) {
        await tauriApi.changePassword(user.id, newPassword);
        // 刷新用户信息（session_version 已递增）
        const updated = await tauriApi.getUserInfo(user.id);
        setUser(updated);
        saveAuth(updated);
      } else {
        // 非 Tauri 环境：模拟改密
        const updated = { ...user, must_change_password: false };
        setUser(updated);
        saveAuth(updated);
      }
    },
    [user, saveAuth],
  );

  /** 登出 */
  const logout = useCallback(() => {
    clearAuth();
    router.push("/login");
  }, [clearAuth, router]);

  /** 启动时恢复认证状态 */
  useEffect(() => {
    const restoreAuth = async () => {
      try {
        const stored = localStorage.getItem(AUTH_STORAGE_KEY);
        if (!stored) {
          setIsLoading(false);
          return;
        }

        const data: AuthStorage = JSON.parse(stored);

        if (isTauriEnv()) {
          // 从后端验证会话是否有效
          const userInfo = await tauriApi.getUserInfo(data.userId);
          if (userInfo.session_version === data.sessionVersion) {
            setUser(userInfo);
          } else {
            // session_version 不匹配（已改密），清除会话
            clearAuth();
          }
        } else {
          // 非 Tauri 开发环境：直接恢复 mock 用户
          setUser({
            id: data.userId,
            username: "admin",
            display_name: "管理员",
            role: "admin",
            must_change_password: false,
            session_version: data.sessionVersion,
          });
        }
      } catch {
        clearAuth();
      } finally {
        setIsLoading(false);
      }
    };

    restoreAuth();
  }, [clearAuth]);

  /** 路由守卫 */
  useEffect(() => {
    if (isLoading) return;

    if (!user && !isAuthRoute) {
      // 未登录访问受保护页面 → 跳转登录
      router.push("/login");
    } else if (user && user.must_change_password && pathname !== "/change-password") {
      // 需要改密但不在改密页 → 强制跳转
      router.push("/change-password");
    }
  }, [user, isLoading, isAuthRoute, pathname, router]);

  const value: AuthContextValue = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    changePassword,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * 获取认证上下文 Hook
 */
export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth 必须在 AuthProvider 内部使用");
  }
  return context;
}
