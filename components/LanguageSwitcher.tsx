"use client";
import { useLocale, useTranslations } from "next-intl";
import { usePathname } from "@/i18n/routing";

export function LanguageSwitcher() {
  const locale = useLocale();
  const t = useTranslations("Locale");
  const pathname = usePathname();
  const nextLocale = locale === "en" ? "es" : "en";
  return (
    <a
      className="language-button"
      href={`/${nextLocale}${pathname === "/" ? "" : pathname}`}
      hrefLang={nextLocale}
      lang={nextLocale}
      aria-label={t("switch")}
      title={t("switch")}
      onClick={(event) => {
        // The locale owns the root document; reload it to initialize its theme script.
        event.currentTarget.href = `/${nextLocale}${pathname === "/" ? "" : pathname}${window.location.search}${window.location.hash}`;
      }}
    >{locale.toUpperCase()}<span aria-hidden="true"> / {nextLocale.toUpperCase()}</span></a>
  );
}
