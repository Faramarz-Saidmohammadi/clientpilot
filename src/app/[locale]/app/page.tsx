import { BriefcaseBusiness, Clock3, FileText, WalletCards } from "lucide-react";
import { Card } from "@/components/ui/card";
import { RevenueChart } from "@/components/dashboard/revenue-chart";
import { listAuditLogs } from "@/actions/audit";
import { getDashboardMetrics } from "@/actions/dashboard";
import { getTranslations } from "next-intl/server";

type RawAudit = { _id: string; action: string; createdAt?: Date };

export default async function AppOverviewPage({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const safeLocale = locale === "fa" ? "fa" : "en";
  const t = await getTranslations({ locale: safeLocale, namespace: "dashboard" });
  const [metrics, logs] = await Promise.all([
    getDashboardMetrics(),
    listAuditLogs().catch(() => []) as Promise<RawAudit[]>
  ]);

  const money = new Intl.NumberFormat(safeLocale === "fa" ? "fa-AF" : "en-US", {
    style: "currency",
    currency: metrics.currency,
    maximumFractionDigits: 0
  });

  const cards = [
    {
      label: t("monthlyRevenue"),
      value: money.format(metrics.monthlyRevenue),
      icon: WalletCards
    },
    {
      label: t("trackedHours"),
      value: `${metrics.trackedHours}h`,
      icon: Clock3
    },
    {
      label: t("openInvoices"),
      value: String(metrics.openInvoices),
      icon: FileText
    },
    {
      label: t("activeProjects"),
      value: String(metrics.activeProjects),
      icon: BriefcaseBusiness
    }
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map(({ label, value, icon: Icon }) => (
          <Card key={label} className="overflow-hidden p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-[var(--muted)]">{label}</p>
                <p className="mt-2 text-3xl font-semibold tracking-tight">{value}</p>
              </div>
              <div className="rounded-2xl border border-[var(--border)] bg-[color-mix(in_oklab,var(--primary)_12%,transparent)] p-3 text-[var(--deep)] dark:text-[var(--accent)]">
                <Icon className="h-5 w-5" aria-hidden="true" />
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,2fr)_minmax(280px,1fr)]">
        <Card className="p-5 md:p-6">
          <div className="mb-5 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold">{t("revenueTrend")}</h2>
              <p className="mt-1 text-sm text-[var(--muted)]">{t("revenueTrendDescription")}</p>
            </div>
          </div>
          <RevenueChart data={metrics.revenueTrend} currency={metrics.currency} />
        </Card>

        <Card className="p-5 md:p-6">
          <h2 className="text-lg font-semibold">{t("recentActivity")}</h2>
          <div className="mt-4 space-y-3 text-sm">
            {logs.length === 0 ? <p className="text-[var(--muted)]">{t("noActivity")}</p> : null}
            {logs.slice(0, 8).map((log) => (
              <div key={String(log._id)} className="rounded-xl border border-[var(--border)] p-3">
                <p className="font-medium">{log.action}</p>
                {log.createdAt ? (
                  <p className="mt-1 text-xs text-[var(--muted)]">
                    {new Intl.DateTimeFormat(safeLocale === "fa" ? "fa-AF" : "en-US", {
                      dateStyle: "medium",
                      timeStyle: "short"
                    }).format(new Date(log.createdAt))}
                  </p>
                ) : null}
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
