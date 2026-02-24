import { getTranslations } from "next-intl/server";
import { listTasks } from "@/actions/tasks";
import { listProjects } from "@/actions/projects";
import { Card } from "@/components/ui/card";
import { NewTaskForm } from "@/components/forms/new-task-form";

type RawTask = { _id: string; title: string; status: "todo" | "in_progress" | "done" };
type RawProject = { _id: string; name: string };

export default async function TasksPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const safeLocale = locale === "fa" ? "fa" : "en";
  const t = await getTranslations({ locale: safeLocale, namespace: "tasksPage" });
  const [tasks, projects] = (await Promise.all([listTasks(), listProjects()])) as unknown as [RawTask[], RawProject[]];
  const labels: Record<RawTask["status"], string> = {
    todo: t("status.todo"),
    in_progress: t("status.inProgress"),
    done: t("status.done")
  };

  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <Card className="lg:col-span-3">
        <h1 className="mb-4 text-xl font-semibold">{t("title")}</h1>
        <NewTaskForm projects={projects.map((p) => ({ _id: String(p._id), name: p.name }))} />
      </Card>
      {(["todo", "in_progress", "done"] as const).map((col) => (
        <Card key={col}>
          <h2 className="mb-2 text-sm font-semibold uppercase">{labels[col]}</h2>
          <div className="space-y-2">
            {tasks.filter((t) => t.status === col).map((task) => (
              <div key={String(task._id)} className="rounded-md border p-2 text-sm">{task.title}</div>
            ))}
          </div>
        </Card>
      ))}
    </div>
  );
}
