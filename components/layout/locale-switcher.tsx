"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { locales, localeFlags, localeNames, type Locale } from "@/i18n/config";
import { Languages } from "lucide-react";
import { useState, useRef, useEffect } from "react";

/**
 * 语言切换器组件
 *
 * 下拉菜单展示所有支持的语言，点击切换
 */
export function LocaleSwitcher() {
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // 点击外部关闭
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /** 切换语言 */
  function handleSwitch(newLocale: Locale) {
    router.replace(pathname, { locale: newLocale });
    setOpen(false);
  }

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="text-muted-foreground hover:bg-accent hover:text-accent-foreground flex h-9 items-center gap-1.5 rounded-lg px-2 text-sm transition-colors"
      >
        <Languages className="h-4 w-4" />
        <span className="text-xs font-medium">{localeFlags[locale]}</span>
      </button>

      {open && (
        <div className="border-border bg-popover absolute top-full right-0 mt-1 w-40 rounded-lg border p-1 shadow-lg">
          {locales.map((loc) => (
            <button
              key={loc}
              onClick={() => handleSwitch(loc)}
              className={`flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors ${
                loc === locale
                  ? "bg-accent text-accent-foreground font-medium"
                  : "text-popover-foreground hover:bg-accent"
              }`}
            >
              <span>{localeFlags[loc]}</span>
              <span>{localeNames[loc]}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
