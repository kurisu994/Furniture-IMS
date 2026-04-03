import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

/**
 * Next.js 配置
 *
 * 注意：Tauri 生产构建需要 SSG（output: export），但开发模式不需要。
 * 构建时通过 package.json 的 build 脚本自动处理。
 */
const nextConfig: NextConfig = {
  // 仅在 Tauri 生产构建时启用 SSG
  output: process.env.TAURI_ENV_PLATFORM ? "export" : undefined,
  images: {
    unoptimized: true,
  },
};

export default withNextIntl(nextConfig);
