/**
 * Tauri IPC 通信封装
 *
 * 封装前端与 Rust 后端的通信接口。
 * 在浏览器环境下（开发模式无 Tauri）提供 mock 降级。
 */

/**
 * 判断是否运行在 Tauri 环境中
 */
export function isTauriEnv(): boolean {
  return typeof window !== "undefined" && "__TAURI__" in window;
}

/**
 * 调用 Tauri IPC 命令
 *
 * @param command - 命令名称（对应 Rust #[tauri::command] 函数名）
 * @param args - 传递给命令的参数
 * @returns 命令返回值
 */
export async function invoke<T>(command: string, args?: Record<string, unknown>): Promise<T> {
  if (!isTauriEnv()) {
    console.warn(`[Tauri] 非 Tauri 环境，跳过命令: ${command}`);
    throw new Error(`Command "${command}" is not available outside Tauri environment`);
  }

  // 动态导入 Tauri API（仅在 Tauri 环境下可用）
  const { invoke: tauriInvoke } = await import("@tauri-apps/api/core");
  return tauriInvoke<T>(command, args);
}

// ================================================================
// 通用命令
// ================================================================

/**
 * ping 测试 — 验证前后端通信链路
 */
export async function ping(): Promise<string> {
  return invoke<string>("ping");
}

/**
 * 获取数据库版本号
 */
export async function getDbVersion(): Promise<number> {
  return invoke<number>("get_db_version");
}
