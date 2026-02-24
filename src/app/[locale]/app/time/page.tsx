import { getTranslations } from "next-intl/server";
import { listTimeEntries } from "@/actions/time";
import { listProjects } from "@/actions/projects";
import { Card } from "@/components/ui/card";
import { TimeEntryForm } from "@/components/forms/time-entry-form";

type RawEntry = { _id: string; start: Date; end: Date; duration: number };
type RawProject = { _id: string; name: string };

export default async function TimePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const safeLocale = locale === "fa" ? "fa" : "en";
  const t = await getTranslations({ locale: safeLocale, namespace: "timePage" });
  const [entries, projects] = (await Promise.all([listTimeEntries(), listProjects()])) as unknown as [RawEntry[], RawProject[]];

  return (
    <Card>
      <h1 className="mb-4 text-xl font-semibold">{t("title")}</h1>
      <TimeEntryForm projects={projects.map((p) => ({ _id: String(p._id), name: p.name }))} />
      <div className="space-y-2">
        {entries.map((entry) => (
          <div key={String(entry._id)} className="rounded-md border p-3 text-sm">
            <div>{new Date(entry.start).toLocaleString(safeLocale)} - {new Date(entry.end).toLocaleString(safeLocale)}</div>
            <div className="text-[var(--muted)]">{t("duration")}: {entry.duration} {t("minutes")}</div>
          </div>
        ))}
      </div>
    </Card>
  );
}
