import { MarketingHeader } from "@/components/layout/marketing-header";
import { getTranslations } from "next-intl/server";

export default async function MarketingLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const safeLocale = locale === "fa" ? "fa" : "en";
  const t = await getTranslations({ locale: safeLocale, namespace: "marketing" });

  return (
    <div className="soft-enter min-h-screen">
      <MarketingHeader locale={locale} />
      <main>{children}</main>
      <footer className="mx-auto mt-16 max-w-6xl border-t border-[var(--border)] px-4 py-8 text-sm text-[var(--muted)]">{t("footer")}</footer>
    </div>
  );
}
