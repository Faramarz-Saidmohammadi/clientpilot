"use client";

import { useTransition } from "react";
import { useTranslations } from "next-intl";
import { createTask } from "@/actions/tasks";
import { Button } from "@/components/ui/button";

export function NewTaskForm({ projects }: { projects: Array<{ _id: string; name: string }> }) {
  const [pending, startTransition] = useTransition();
  const t = useTranslations("newTaskForm");

  return (
    <form
      className="mb-4 grid gap-2 md:grid-cols-4"
      onSubmit={(e) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        startTransition(async () => {
          await createTask({
            projectId: String(fd.get("projectId")),
            title: String(fd.get("title")),
            status: String(fd.get("status") || "todo")
          });
          window.location.reload();
        });
      }}
    >
      <input name="title" className="h-10 rounded-md border bg-transparent px-3" placeholder={t("titlePlaceholder")} required />
      <select name="projectId" className="h-10 rounded-md border bg-transparent px-2" required>
        <option value="">{t("projectPlaceholder")}</option>
        {projects.map((p) => (
          <option key={p._id} value={p._id}>{p.name}</option>
        ))}
      </select>
      <select name="status" className="h-10 rounded-md border bg-transparent px-2">
        <option value="todo">{t("status.todo")}</option>
        <option value="in_progress">{t("status.inProgress")}</option>
        <option value="done">{t("status.done")}</option>
      </select>
      <Button disabled={pending}>{pending ? t("adding") : t("submit")}</Button>
    </form>
  );
}
