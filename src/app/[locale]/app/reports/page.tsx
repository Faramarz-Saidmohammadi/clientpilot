import { getTranslations } from "next-intl/server";
import { Card } from "@/components/ui/card";

export default async function ReportsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const safeLocale = locale === "fa" ? "fa" : "en";
  const t = await getTranslations({ locale: safeLocale, namespace: "reportsPage" });

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <h2 className="text-lg font-semibold">{t("earnings")}</h2>
        <p className="mt-2 text-3xl font-bold">$24,400</p>
      </Card>
      <Card>
        <h2 className="text-lg font-semibold">{t("utilization")}</h2>
        <p className="mt-2 text-3xl font-bold">72%</p>
      </Card>
    </div>
  );
}
