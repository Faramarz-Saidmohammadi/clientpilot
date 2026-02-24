"use client";

import { useTransition } from "react";
import { useTranslations } from "next-intl";
import { createProject } from "@/actions/projects";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function NewProjectForm({ clients }: { clients: Array<{ _id: string; name: string }> }) {
  const [pending, startTransition] = useTransition();
  const t = useTranslations("newProjectForm");

  return (
    <form
      className="mb-4 grid gap-2 md:grid-cols-5"
      onSubmit={(e) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        startTransition(async () => {
          await createProject({
            clientId: String(fd.get("clientId")),
            name: String(fd.get("name")),
            status: "active",
            budget: Number(fd.get("budget") || 0)
          });
          window.location.reload();
        });
      }}
    >
      <Input name="name" placeholder={t("namePlaceholder")} required />
      <Input name="budget" type="number" min={0} placeholder={t("budgetPlaceholder")} />
      <select name="clientId" className="h-10 rounded-md border bg-transparent px-2" required>
        <option value="">{t("selectClient")}</option>
        {clients.map((c) => (
          <option key={c._id} value={c._id}>
            {c.name}
          </option>
        ))}
      </select>
      <div className="md:col-span-2">
        <Button disabled={pending}>{pending ? t("creating") : t("submit")}</Button>
      </div>
    </form>
  );
}
