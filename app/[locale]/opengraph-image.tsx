import { ImageResponse } from "next/og";
import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { getProfile } from "@/lib/data";
import { siteUrl } from "@/lib/seo";

export const alt = "Hernán Solano";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpenGraphImage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  const profile = getProfile(locale);
  return new ImageResponse(
    (
      <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", width: "100%", height: "100%", padding: "72px 88px", background: "#f6f5f1", color: "#222321", fontFamily: "sans-serif" }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 25 }}>
          <span style={{ fontWeight: 700 }}>HS.</span>
          <span style={{ color: "#626660" }}>{siteUrl.hostname}</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
          <span style={{ fontSize: 88, fontWeight: 700, letterSpacing: "-4px" }}>{profile.name}</span>
          <span style={{ fontSize: 36, color: "#626660" }}>{profile.title}</span>
        </div>
        <div style={{ display: "flex", height: 4, width: 92, background: "#48624a" }} />
      </div>
    ),
    size,
  );
}
