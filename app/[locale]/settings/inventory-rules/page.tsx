import { setRequestLocale } from "next-intl/server";
import { InventoryRulesContent } from "../_components/inventory-rules-content";

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <InventoryRulesContent />;
}
