import { getTranslations } from "next-intl/server";
import { Card } from "@/components/ui/card";
import { WorkspaceSettingsForm } from "@/components/forms/workspace-settings-form";
import { getWorkspaceSettings } from "@/actions/settings";

export default async function SettingsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const safeLocale = locale === "fa" ? "fa" : "en";
  const t = await getTranslations({ locale: safeLocale, namespace: "settingsPage" });
  const settings = await getWorkspaceSettings();

  return (
    <Card>
      <h1 className="text-xl font-semibold">{t("title")}</h1>
      <p className="mt-2 text-[var(--muted)]">{t("description")}</p>
      <WorkspaceSettingsForm initial={settings} />
    </Card>
  );
}
