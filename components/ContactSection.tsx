import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import type { Locale } from "@/lib/data";

export async function ContactSection({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: "Contact" });
  return (
    <section id="contact" className="contact-preview shell" aria-labelledby="contact-title">
      <div><h2 id="contact-title">{t("previewTitle")}</h2><p className="muted">{t("description")}</p></div>
      <Link className="button button-secondary" href="/contact">{t("action")} <span aria-hidden="true">↗</span></Link>
    </section>
  );
}
