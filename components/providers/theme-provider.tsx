"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";

/**
 * 主题 Provider — 封装 next-themes
 *
 * 支持 light/dark/system 三种模式
 */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="light"
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </NextThemesProvider>
  );
}
