import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const safeLocale = locale === "fa" ? "fa" : "en";
  const t = await getTranslations({ locale: safeLocale });

  return (
    <section className="mx-auto max-w-6xl px-4 py-20">
      <div className="grid items-center gap-10 lg:grid-cols-2">
        <div>
          <h1 className="text-4xl font-bold leading-tight md:text-5xl">{t("hero.title")}</h1>
          <p className="mt-5 max-w-xl text-lg text-[var(--muted)]">{t("hero.subtitle")}</p>
          <div className="mt-8 flex gap-3">
            <Link href={`/${locale}/register`}>
              <Button size="lg">{t("hero.cta")}</Button>
            </Link>
            <Link href={`/${locale}/pricing`}>
              <Button size="lg" variant="outline">
                {t("nav.pricing")}
              </Button>
            </Link>
          </div>
        </div>
        <Card className="p-0">
          <div className="rounded-lg border p-6">
            <p className="text-sm text-[var(--muted)]">{t("marketing.previewTitle")}</p>
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div className="card p-4">
                <div className="text-xs text-[var(--muted)]">{t("marketing.previewRevenue")}</div>
                <div className="mt-1 text-2xl font-semibold">$18,200</div>
              </div>
              <div className="card p-4">
                <div className="text-xs text-[var(--muted)]">{t("marketing.previewHours")}</div>
                <div className="mt-1 text-2xl font-semibold">146h</div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}
