"use client";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/routing";

export function LanguageSwitcher() {
  const locale = useLocale();
  const t = useTranslations("Locale");
  const router = useRouter();
  const pathname = usePathname();
  const nextLocale = locale === "en" ? "es" : "en";
  return (
    <button
      className="language-button"
      aria-label={t("switch")}
      title={t("switch")}
      onClick={() => router.replace(pathname + window.location.search + window.location.hash, { locale: nextLocale })}
    >{locale.toUpperCase()}<span aria-hidden="true"> / {nextLocale.toUpperCase()}</span></button>
  );
}
