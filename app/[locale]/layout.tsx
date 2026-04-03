import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { locales } from "@/i18n/config";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { AppLayout } from "@/components/layout/app-layout";

/**
 * 为 SSG 模式生成所有语言的静态页面
 */
export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

/**
 * 带 i18n 的 Locale 布局
 *
 * 包含：
 * - next-intl Provider（注入翻译消息）
 * - ThemeProvider（主题切换）
 * - AppLayout（侧边栏 + 顶栏 + 主内容区）
 */
export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages}>
      <ThemeProvider>
        <AppLayout>{children}</AppLayout>
      </ThemeProvider>
    </NextIntlClientProvider>
  );
}
