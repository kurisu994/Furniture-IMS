import { setRequestLocale } from "next-intl/server";
import { EncodingRulesContent } from "../_components/encoding-rules-content";

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <EncodingRulesContent />;
}
