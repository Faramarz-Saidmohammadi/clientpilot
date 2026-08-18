import Link from "next/link";
import {
  ArrowRight,
  BriefcaseBusiness,
  CheckCircle2,
  Clock3,
  FileText,
  Layers3,
  ReceiptText,
  ShieldCheck,
  UsersRound
} from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const featureIcons = [UsersRound, BriefcaseBusiness, ReceiptText, UsersRound, Layers3, ShieldCheck];

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
    <div className="overflow-hidden">
      <section className="relative mx-auto max-w-7xl px-4 pb-20 pt-14 sm:px-6 lg:px-8 lg:pb-28 lg:pt-24">
        <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 mx-auto h-[520px] max-w-5xl rounded-full bg-[radial-gradient(circle_at_center,color-mix(in_oklab,var(--primary)_22%,transparent),transparent_68%)] blur-3xl" />

        <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
          <div className="max-w-3xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--card)] px-3 py-1.5 text-sm font-medium text-[var(--muted)] shadow-sm backdrop-blur">
              <CheckCircle2 className="h-4 w-4 text-[var(--primary)]" aria-hidden="true" />
              {t("home.features.subtitle")}
            </div>
            <h1 className="max-w-4xl text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">
              {t("hero.title")}
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-[var(--muted)] sm:text-xl">
              {t("hero.subtitle")}
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href={`/${safeLocale}/register`}>
                <Button size="lg" className="w-full gap-2 sm:w-auto">
                  {t("hero.cta")}
                  <ArrowRight className="h-4 w-4 rtl:rotate-180" aria-hidden="true" />
                </Button>
              </Link>
              <Link href={`/${safeLocale}/pricing`}>
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  {t("nav.pricing")}
                </Button>
              </Link>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-6 -z-10 rounded-[2.5rem] bg-[color-mix(in_oklab,var(--primary)_12%,transparent)] blur-2xl" />
            <Card className="overflow-hidden p-0 shadow-2xl">
              <div className="flex items-center justify-between border-b border-[var(--border)] px-5 py-4">
                <div>
                  <p className="text-sm font-semibold">{t("marketing.previewTitle")}</p>
                  <p className="mt-1 text-xs text-[var(--muted)]">{t("home.workflow.title")}</p>
                </div>
                <div className="flex gap-1.5" aria-hidden="true">
                  <span className="h-2.5 w-2.5 rounded-full bg-[var(--border)]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[var(--border)]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[var(--primary)]" />
                </div>
              </div>

              <div className="grid gap-4 p-5 sm:grid-cols-2">
                <div className="rounded-2xl border border-[var(--border)] bg-[color-mix(in_oklab,var(--primary)_7%,transparent)] p-4">
                  <div className="flex items-center gap-2 text-sm text-[var(--muted)]">
                    <BriefcaseBusiness className="h-4 w-4" aria-hidden="true" />
                    {t("app.projects")}
                  </div>
                  <div className="mt-5 space-y-2">
                    <div className="h-2.5 w-4/5 rounded-full bg-[color-mix(in_oklab,var(--primary)_45%,transparent)]" />
                    <div className="h-2.5 w-3/5 rounded-full bg-[var(--border)]" />
                  </div>
                </div>
                <div className="rounded-2xl border border-[var(--border)] p-4">
                  <div className="flex items-center gap-2 text-sm text-[var(--muted)]">
                    <Clock3 className="h-4 w-4" aria-hidden="true" />
                    {t("app.time")}
                  </div>
                  <div className="mt-5 flex items-end gap-2" aria-hidden="true">
                    {[38, 62, 46, 78, 58, 88].map((height, index) => (
                      <span
                        key={height + index}
                        className="min-w-0 flex-1 rounded-t-md bg-[color-mix(in_oklab,var(--primary)_68%,transparent)]"
                        style={{ height }}
                      />
                    ))}
                  </div>
                </div>
                <div className="rounded-2xl border border-[var(--border)] p-4 sm:col-span-2">
                  <div className="mb-4 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <FileText className="h-4 w-4 text-[var(--primary)]" aria-hidden="true" />
                      {t("app.invoices")}
                    </div>
                    <span className="rounded-full bg-[color-mix(in_oklab,var(--primary)_12%,transparent)] px-2.5 py-1 text-xs text-[var(--muted)]">
                      {t("invoicesPage.status.paid")}
                    </span>
                  </div>
                  <div className="grid gap-2 sm:grid-cols-3" aria-hidden="true">
                    <div className="h-9 rounded-xl bg-[var(--border)]/40" />
                    <div className="h-9 rounded-xl bg-[var(--border)]/40" />
                    <div className="h-9 rounded-xl bg-[color-mix(in_oklab,var(--primary)_18%,transparent)]" />
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      <section className="border-y border-[var(--border)] bg-[color-mix(in_oklab,var(--card)_72%,transparent)]">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">{t("home.features.title")}</h2>
            <p className="mt-3 text-lg text-[var(--muted)]">{t("home.features.subtitle")}</p>
          </div>
          <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => {
              const Icon = featureIcons[index];
              return (
                <Card key={feature} className="group p-5 transition-transform duration-300 hover:-translate-y-1">
                  <div className="mb-5 inline-flex rounded-2xl border border-[var(--border)] bg-[color-mix(in_oklab,var(--primary)_10%,transparent)] p-3 text-[var(--deep)] dark:text-[var(--accent)]">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <p className="font-medium leading-7">{feature}</p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-20 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:items-start lg:px-8 lg:py-28">
        <div className="lg:sticky lg:top-28">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">{t("home.workflow.title")}</h2>
          <p className="mt-4 max-w-lg text-lg leading-8 text-[var(--muted)]">{t("hero.subtitle")}</p>
        </div>
        <div className="space-y-4">
          {steps.map((step, index) => (
            <Card key={step} className="p-5 sm:p-6">
              <div className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[var(--primary)] font-semibold text-[var(--background)]">
                  {index + 1}
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">
                    {t("home.workflow.stepLabel")} {index + 1}
                  </p>
                  <p className="mt-2 text-lg font-medium leading-7">{step}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8 lg:pb-28">
        <Card className="overflow-hidden p-6 sm:p-8 lg:p-10">
          <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <div className="mb-4 inline-flex rounded-2xl border border-[var(--border)] bg-[color-mix(in_oklab,var(--primary)_10%,transparent)] p-3 text-[var(--deep)] dark:text-[var(--accent)]">
                <ShieldCheck className="h-5 w-5" aria-hidden="true" />
              </div>
              <h2 className="text-3xl font-semibold tracking-tight">{t("home.finalCta.title")}</h2>
              <p className="mt-3 max-w-2xl text-lg text-[var(--muted)]">{t("home.finalCta.subtitle")}</p>
            </div>
            <Link href={`/${safeLocale}/register`}>
              <Button size="lg" className="w-full gap-2 lg:w-auto">
                {t("home.finalCta.button")}
                <ArrowRight className="h-4 w-4 rtl:rotate-180" aria-hidden="true" />
              </Button>
            </Link>
          </div>
        </Card>
      </section>
    </div>
  );
}
