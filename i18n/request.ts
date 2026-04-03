import { getRequestConfig } from "next-intl/server";
import { defaultLocale, locales, type Locale } from "./config";

/** next-intl 请求级配置 — 动态加载翻译文件 */
export default getRequestConfig(async ({ requestLocale }) => {
  let locale = (await requestLocale) as Locale;

  if (!locale || !locales.includes(locale)) {
    locale = defaultLocale;
  }

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
