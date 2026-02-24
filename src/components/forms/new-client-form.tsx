"use client";

import { useTransition } from "react";
import { useTranslations } from "next-intl";
import { createClient } from "@/actions/clients";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function NewClientForm() {
  const [pending, startTransition] = useTransition();
  const t = useTranslations("newClientForm");

  return (
    <form
      className="mb-4 grid gap-2 md:grid-cols-4"
      onSubmit={(e) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        startTransition(async () => {
          await createClient({
            name: String(fd.get("name")),
            email: String(fd.get("email") || "")
          });
          window.location.reload();
        });
      }}
    >
      <Input name="name" placeholder={t("namePlaceholder")} required />
      <Input name="email" placeholder={t("emailPlaceholder")} type="email" />
      <div className="md:col-span-2">
        <Button disabled={pending}>{pending ? t("adding") : t("submit")}</Button>
      </div>
    </form>
  );
}
