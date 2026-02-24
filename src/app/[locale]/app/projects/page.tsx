import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { listProjects } from "@/actions/projects";
import { listClients } from "@/actions/clients";
import { Card } from "@/components/ui/card";
import { NewProjectForm } from "@/components/forms/new-project-form";

type RawProject = { _id: string; name: string; status: string; budget: number };
type RawClient = { _id: string; name: string };

export default async function ProjectsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const safeLocale = locale === "fa" ? "fa" : "en";
  const t = await getTranslations({ locale: safeLocale, namespace: "projectsPage" });
  const [projects, clients] = (await Promise.all([listProjects(), listClients()])) as unknown as [RawProject[], RawClient[]];
  const statusLabels: Record<string, string> = {
    active: t("status.active"),
    completed: t("status.completed"),
    archived: t("status.archived"),
    on_hold: t("status.onHold")
  };

  return (
    <Card>
      <h1 className="mb-4 text-xl font-semibold">{t("title")}</h1>
      <NewProjectForm clients={clients.map((c) => ({ _id: String(c._id), name: c.name }))} />
      <div className="space-y-2">
        {projects.map((project) => (
          <Link key={String(project._id)} href={`/${locale}/app/projects/${project._id}`} className="block rounded-md border p-3 hover:bg-[color-mix(in_oklab,var(--background)_45%,transparent)]">
            <div className="font-medium">{project.name}</div>
            <div className="text-sm text-[var(--muted)]">
              {t("statusLabel")}: {statusLabels[project.status] || project.status} | {t("budgetLabel")}: ${project.budget}
            </div>
          </Link>
        ))}
      </div>
    </Card>
  );
}
