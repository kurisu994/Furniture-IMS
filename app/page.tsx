import { redirect } from "next/navigation";
import { defaultLocale } from "@/i18n/config";

/**
 * 根路由重定向 — 自动跳转到默认语言
 */
export default function RootPage() {
  redirect(`/${defaultLocale}`);
}
