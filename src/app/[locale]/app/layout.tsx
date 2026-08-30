import Link from "next/link";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { getCurrentMembership } from "@/lib/auth/rbac";
import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";

export default async function AppLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const safeLocale = locale === "fa" ? "fa" : "en";
  const current = await getCurrentMembership();
  if (!current) redirect(`/${safeLocale}/login`);
  if (!current.membership) redirect(`/${safeLocale}/onboarding`);

  const t = await getTranslations({ locale: safeLocale, namespace: "app" });
  const items = [
    ["", t("overview")],
    ["/clients", t("clients")],
    ["/projects", t("projects")],
    ["/tasks", t("tasks")],
    ["/time", t("time")],
    ["/invoices", t("invoices")],
    ["/reports", t("reports")],
    ["/team", t("team")],
    ["/settings", t("settings")],
    ["/billing", t("billing")]
  ].map(([href, label]) => ({ href: `/${safeLocale}/app${href}`, label }));

  return (
    <div className="soft-enter flex min-h-screen">
      <Sidebar items={items} />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar title={t("overview")} items={items} locale={safeLocale} />
        <main className="flex-1 p-4 md:p-6">
          <div className="soft-enter">{children}</div>
        </main>
      </div>
      <Link href={`/${safeLocale}`} className="sr-only">Home</Link>
    </div>
  );
}
