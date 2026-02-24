import { Card } from "@/components/ui/card";
import { listAuditLogs } from "@/actions/audit";
import { getTranslations } from "next-intl/server";

type RawAudit = { _id: string; action: string };

export default async function AppOverviewPage({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const safeLocale = locale === "fa" ? "fa" : "en";
  const t = await getTranslations({ locale: safeLocale, namespace: "dashboard" });
  const logs = (await listAuditLogs().catch(() => [])) as RawAudit[];

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <Card>
        <p className="text-sm text-[var(--muted)]">{t("monthlyRevenue")}</p>
        <p className="mt-2 text-3xl font-semibold">$8,420</p>
      </Card>
      <Card>
        <p className="text-sm text-[var(--muted)]">{t("trackedHours")}</p>
        <p className="mt-2 text-3xl font-semibold">94h</p>
      </Card>
      <Card>
        <p className="text-sm text-[var(--muted)]">{t("openInvoices")}</p>
        <p className="mt-2 text-3xl font-semibold">6</p>
      </Card>
      <Card className="lg:col-span-2">
        <h2 className="mb-3 text-lg font-semibold">{t("revenueTrend")}</h2>
        <p className="text-sm text-[var(--muted)]">{t("chartHint")}</p>
      </Card>
      <Card>
        <h2 className="mb-3 text-lg font-semibold">{t("recentActivity")}</h2>
        <div className="space-y-2 text-sm">
          {logs.length === 0 ? <p className="text-[var(--muted)]">{t("noActivity")}</p> : null}
          {logs.map((log) => (
            <div key={String(log._id)} className="rounded-md border p-2">{log.action}</div>
          ))}
        </div>
      </Card>
    </div>
  );
}
