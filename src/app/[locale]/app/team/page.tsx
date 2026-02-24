import { getTranslations } from "next-intl/server";
import { listMembers } from "@/actions/team";
import { Card } from "@/components/ui/card";
import { InviteForm } from "@/components/forms/invite-form";

type RawMember = { _id: string; role: string; userId?: { name?: string; email?: string } };

export default async function TeamPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const safeLocale = locale === "fa" ? "fa" : "en";
  const t = await getTranslations({ locale: safeLocale, namespace: "teamPage" });
  const roleLabels: Record<string, string> = {
    owner: t("roles.owner"),
    admin: t("roles.admin"),
    member: t("roles.member"),
    viewer: t("roles.viewer")
  };
  const members = (await listMembers()) as unknown as RawMember[];
  return (
    <Card>
      <h1 className="mb-4 text-xl font-semibold">{t("title")}</h1>
      <InviteForm />
      <div className="space-y-2">
        {members.map((m) => (
          <div key={String(m._id)} className="flex items-center justify-between rounded-md border p-3">
            <div>
              <p>{m.userId?.name || m.userId?.email || t("memberFallback")}</p>
              <p className="text-sm text-[var(--muted)]">{m.userId?.email}</p>
            </div>
            <span className="rounded-full border px-2 py-1 text-xs">{roleLabels[m.role] || m.role}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}
