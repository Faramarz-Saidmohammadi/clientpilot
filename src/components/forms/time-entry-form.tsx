"use client";

import { useTransition } from "react";
import { useTranslations } from "next-intl";
import { createTimeEntry } from "@/actions/time";
import { Button } from "@/components/ui/button";

export function TimeEntryForm({ projects }: { projects: Array<{ _id: string; name: string }> }) {
  const [pending, startTransition] = useTransition();
  const t = useTranslations("timeEntryForm");

  return (
    <form
      className="mb-4 grid gap-2 md:grid-cols-5"
      onSubmit={(e) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        startTransition(async () => {
          await createTimeEntry({
            projectId: String(fd.get("projectId")),
            start: new Date(String(fd.get("start"))),
            end: new Date(String(fd.get("end"))),
            note: String(fd.get("note") || "")
          });
          window.location.reload();
        });
      }}
    >
      <select name="projectId" className="h-10 rounded-md border bg-transparent px-2" required>
        <option value="">{t("projectPlaceholder")}</option>
        {projects.map((p) => (
          <option key={p._id} value={p._id}>{p.name}</option>
        ))}
      </select>
      <input name="start" type="datetime-local" className="h-10 rounded-md border bg-transparent px-2" required />
      <input name="end" type="datetime-local" className="h-10 rounded-md border bg-transparent px-2" required />
      <input name="note" placeholder={t("notePlaceholder")} className="h-10 rounded-md border bg-transparent px-2" />
      <Button disabled={pending}>{pending ? t("saving") : t("submit")}</Button>
    </form>
  );
}
