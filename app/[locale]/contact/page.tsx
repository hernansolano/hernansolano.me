import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { getProfile } from "@/lib/data";
import { getPageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  return getPageMetadata((await params).locale, "contact");
}
export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const t = await getTranslations("Contact");
  const profile = getProfile(locale);
  const channels = [
    { label: t("emailLabel"), value: profile.email, href: profile.email ? "mailto:" + profile.email : "", description: t("emailDescription"), external: false },
    { label: t("professionalLabel"), value: "LinkedIn", href: profile.social.linkedin, description: t("linkedinDescription"), external: true },
    { label: t("codeLabel"), value: "GitHub", href: profile.social.github, description: t("githubDescription"), external: true },
  ];
  return (
    <div className="shell contact-page">
      <header className="page-heading"><p className="eyebrow">{t("location")}</p><h1>{t("title")}</h1><p className="page-description">{t("description")}</p></header>
      <div className="contact-channels">
        {channels.filter((channel) => channel.href).map((channel) => (
          <a key={channel.label} className="contact-channel" href={channel.href} target={channel.external ? "_blank" : undefined} rel={channel.external ? "noopener noreferrer" : undefined}>
            <span className="eyebrow">{channel.label}</span>
            <div><h2>{channel.value}</h2><p className="muted">{channel.description}</p></div>
            <span className="channel-arrow" aria-hidden="true">↗</span>
          </a>
        ))}
      </div>
    </div>
  );
}
