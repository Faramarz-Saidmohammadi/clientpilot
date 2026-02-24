import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const safeLocale = locale === "fa" ? "fa" : "en";
  const t = await getTranslations({ locale: safeLocale });
  const features = [
    t("home.features.items.clients"),
    t("home.features.items.projects"),
    t("home.features.items.invoices"),
    t("home.features.items.team"),
    t("home.features.items.billing"),
    t("home.features.items.audit")
  ];
  const steps = [t("home.workflow.steps.step1"), t("home.workflow.steps.step2"), t("home.workflow.steps.step3")];

  return (
    <section className="mx-auto max-w-6xl space-y-16 px-4 py-20">
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

      <div>
        <h2 className="text-2xl font-semibold">{t("home.features.title")}</h2>
        <p className="mt-2 text-[var(--muted)]">{t("home.features.subtitle")}</p>
        <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <Card key={feature}>
              <p className="font-medium">{feature}</p>
            </Card>
          ))}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <h3 className="text-xl font-semibold">{t("home.workflow.title")}</h3>
          <div className="mt-4 space-y-3">
            {steps.map((step, i) => (
              <div key={step} className="rounded-md border p-3">
                <p className="text-sm text-[var(--muted)]">{t("home.workflow.stepLabel")} {i + 1}</p>
                <p className="mt-1 font-medium">{step}</p>
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <h3 className="text-xl font-semibold">{t("home.trust.title")}</h3>
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div className="rounded-md border p-3">
              <p className="text-sm text-[var(--muted)]">{t("home.trust.stats.activeWorkspaces")}</p>
              <p className="mt-1 text-2xl font-semibold">1,200+</p>
            </div>
            <div className="rounded-md border p-3">
              <p className="text-sm text-[var(--muted)]">{t("home.trust.stats.invoicesMonthly")}</p>
              <p className="mt-1 text-2xl font-semibold">48k+</p>
            </div>
            <div className="rounded-md border p-3">
              <p className="text-sm text-[var(--muted)]">{t("home.trust.stats.avgTimeSaved")}</p>
              <p className="mt-1 text-2xl font-semibold">7h</p>
            </div>
            <div className="rounded-md border p-3">
              <p className="text-sm text-[var(--muted)]">{t("home.trust.stats.uptime")}</p>
              <p className="mt-1 text-2xl font-semibold">99.9%</p>
            </div>
          </div>
        </Card>
      </div>

      <Card>
        <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h3 className="text-2xl font-semibold">{t("home.finalCta.title")}</h3>
            <p className="mt-2 text-[var(--muted)]">{t("home.finalCta.subtitle")}</p>
          </div>
          <Link href={`/${locale}/register`}>
            <Button size="lg">{t("home.finalCta.button")}</Button>
          </Link>
        </div>
      </Card>
    </section>
  );
}
