import { BarChart3, WalletCards } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { getReportsMetrics } from "@/actions/reports";
import { Card } from "@/components/ui/card";

export default async function ReportsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const safeLocale = locale === "fa" ? "fa" : "en";
  const t = await getTranslations({ locale: safeLocale, namespace: "reportsPage" });
  const metrics = await getReportsMetrics();
  const money = new Intl.NumberFormat(safeLocale === "fa" ? "fa-AF" : "en-US", {
    style: "currency",
    currency: metrics.currency,
    maximumFractionDigits: 0
  });

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card className="p-5 md:p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-sm font-medium text-[var(--muted)]">{t("earnings")}</h2>
            <p className="mt-2 text-3xl font-semibold tracking-tight">{money.format(metrics.earnings)}</p>
          </div>
          <div className="rounded-2xl border border-[var(--border)] bg-[color-mix(in_oklab,var(--primary)_12%,transparent)] p-3 text-[var(--deep)] dark:text-[var(--accent)]">
            <WalletCards className="h-5 w-5" aria-hidden="true" />
          </div>
        </div>
      </Card>
      <Card className="p-5 md:p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-sm font-medium text-[var(--muted)]">{t("utilization")}</h2>
            <p className="mt-2 text-3xl font-semibold tracking-tight">{metrics.utilization}%</p>
          </div>
          <div className="rounded-2xl border border-[var(--border)] bg-[color-mix(in_oklab,var(--primary)_12%,transparent)] p-3 text-[var(--deep)] dark:text-[var(--accent)]">
            <BarChart3 className="h-5 w-5" aria-hidden="true" />
          </div>
        </div>
      </Card>
    </div>
  );
}
