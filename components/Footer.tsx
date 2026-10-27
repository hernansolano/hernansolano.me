import { getLocale, getTranslations } from "next-intl/server";
import { getProfile, type Locale } from "@/lib/data";
import { Link } from "@/i18n/routing";

export async function Footer() {
  const locale = await getLocale();
  const profile = getProfile(locale as Locale);
  const t = await getTranslations("Footer");
  return (
    <footer className="site-footer">
      <div className="shell footer-row">
        <Link
          href="/"
          className="wordmark"
          aria-label={profile.name}
        >hs<span>.</span></Link>
        <p>© {new Date().getFullYear()} {profile.name}</p>
        <span className="footer-note">{t("note")}</span>
        <a href="#main-content" className="back-to-top">{t("top")} <span aria-hidden="true">↑</span></a>
      </div>
    </footer>
  );
}
