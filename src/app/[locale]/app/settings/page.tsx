import { getTranslations } from "next-intl/server";
import { Card } from "@/components/ui/card";
import { WorkspaceSettingsForm } from "@/components/forms/workspace-settings-form";
import { getWorkspaceSettings } from "@/actions/settings";
import { getWorkspaceContext } from "@/lib/workspace";

export default async function SettingsPage({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const safeLocale = locale === "fa" ? "fa" : "en";
  const t = await getTranslations({
    locale: safeLocale,
    namespace: "settingsPage"
  });
  const [settings, context] = await Promise.all([
    getWorkspaceSettings(),
    getWorkspaceContext()
  ]);

  return (
    <Card>
      <h1 className="text-xl font-semibold">{t("title")}</h1>
      <p className="mt-2 text-[var(--muted)]">{t("description")}</p>
      {context.role === "admin" || context.role === "owner" ? (
        <WorkspaceSettingsForm initial={settings} />
      ) : (
        <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-[var(--muted)]">{t("name")}</dt>
            <dd>{settings.name}</dd>
          </div>
          <div>
            <dt className="text-[var(--muted)]">{t("timezone")}</dt>
            <dd>{settings.timezone}</dd>
          </div>
          <div>
            <dt className="text-[var(--muted)]">{t("currency")}</dt>
            <dd>{settings.currency}</dd>
          </div>
          <div>
            <dt className="text-[var(--muted)]">{t("adminOnly")}</dt>
          </div>
        </dl>
      )}
    </Card>
  );
}
