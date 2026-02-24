import { getTranslations } from "next-intl/server";
import { Card } from "@/components/ui/card";
import { getProjectById } from "@/actions/projects";
import { connectDb } from "@/lib/db";
import { ProjectFile } from "@/models";
import { ProjectFileUpload } from "@/components/forms/project-file-upload";

type RawProject = { name: string; description?: string };
type RawFile = { _id: string; name: string; size: number; url: string };

export default async function ProjectDetailPage({ params }: { params: Promise<{ id: string; locale: string }> }) {
  const { id, locale } = await params;
  const safeLocale = locale === "fa" ? "fa" : "en";
  const t = await getTranslations({ locale: safeLocale, namespace: "projectDetailPage" });
  const project = (await getProjectById(id)) as unknown as RawProject | null;

  if (!project) {
    return <Card>{t("notFound")}</Card>;
  }

  await connectDb();
  const files = (await ProjectFile.find({ projectId: id }).sort({ createdAt: -1 }).lean()) as unknown as RawFile[];

  return (
    <div className="space-y-4">
      <Card>
        <h1 className="text-2xl font-semibold">{project.name}</h1>
        <p className="mt-2 text-[var(--muted)]">{project.description || t("noDescription")}</p>
      </Card>
      <Card>
        <h2 className="mb-3 text-lg font-semibold">{t("files")}</h2>
        <ProjectFileUpload projectId={id} />
        <div className="mt-3 space-y-2 text-sm">
          {files.map((f) => (
            <a key={String(f._id)} href={f.url} className="block rounded-md border p-2 hover:bg-[color-mix(in_oklab,var(--background)_45%,transparent)]">
              {f.name} ({Math.round(f.size / 1024)} {t("kb")})
            </a>
          ))}
        </div>
      </Card>
      <Card>
        <h2 className="mb-3 text-lg font-semibold">{t("tabsTitle")}</h2>
        <div className="grid gap-2 md:grid-cols-3">
          {[t("tabs.overview"), t("tabs.tasks"), t("tabs.time"), t("tabs.invoices"), t("tabs.files"), t("tabs.activity")].map((tab) => (
            <div key={tab} className="rounded-md border px-3 py-2 text-sm">{tab}</div>
          ))}
        </div>
      </Card>
    </div>
  );
}
