import { getTranslations } from "next-intl/server";
import { Card } from "@/components/ui/card";
import { UpgradeButton } from "@/components/billing/upgrade-button";
import { getWorkspaceContext } from "@/lib/workspace";
import { canManageBilling } from "@/lib/auth/rbac";

export default async function BillingPage({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const safeLocale = locale === "fa" ? "fa" : "en";
  const t = await getTranslations({
    locale: safeLocale,
    namespace: "billingPage"
  });
  const context = await getWorkspaceContext();

  return (
    <Card>
      <h1 className="text-xl font-semibold">{t("title")}</h1>
      <p className="mt-2 text-[var(--muted)]">{t("description")}</p>
      <div className="mt-4">
        {canManageBilling(context.role) ? (
          <UpgradeButton />
        ) : (
          <p className="text-sm text-[var(--muted)]">{t("adminOnly")}</p>
        )}
      </div>
    </Card>
  );
}
