import { getTranslations } from "next-intl/server";

export default async function TermsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const safeLocale = locale === "fa" ? "fa" : "en";
  const t = await getTranslations({ locale: safeLocale, namespace: "legal" });

  return (
    <section className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="text-3xl font-bold">{t("termsTitle")}</h1>
      <p className="mt-4 text-[var(--muted)]">{t("termsBody")}</p>
    </section>
  );
}
