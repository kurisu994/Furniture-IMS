"use client";

import { useTranslations } from "next-intl";
import { Construction } from "lucide-react";

interface PagePlaceholderProps {
  /** 页面标题的 i18n 翻译键 */
  titleKey: string;
}

/**
 * 页面占位组件 — 开发中页面统一展示
 */
export function PagePlaceholder({ titleKey }: PagePlaceholderProps) {
  const t = useTranslations();

  return (
    <div className="flex flex-1 flex-col items-center justify-center py-20">
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="bg-muted flex h-16 w-16 items-center justify-center rounded-2xl">
          <Construction className="text-muted-foreground h-8 w-8" />
        </div>
        <div>
          <h2 className="text-foreground text-xl font-bold">{t(titleKey)}</h2>
          <p className="text-muted-foreground mt-2 text-sm">
            {t("common.developingDesc")}
          </p>
        </div>
      </div>
    </div>
  );
}
