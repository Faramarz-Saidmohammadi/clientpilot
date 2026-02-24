"use client";

import { useTransition } from "react";
import { useTranslations } from "next-intl";
import { inviteMember } from "@/actions/team";
import { Button } from "@/components/ui/button";

type Role = "admin" | "member" | "viewer";

export function InviteForm() {
  const [pending, startTransition] = useTransition();
  const t = useTranslations("inviteForm");
  return (
    <form
      className="mb-4 grid gap-2 md:grid-cols-3"
      onSubmit={(e) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        startTransition(async () => {
          await inviteMember({ email: String(fd.get("email")), role: String(fd.get("role")) as Role });
          window.location.reload();
        });
      }}
    >
      <input name="email" className="h-10 rounded-md border bg-transparent px-3" placeholder={t("emailPlaceholder")} required />
      <select name="role" className="h-10 rounded-md border bg-transparent px-2">
        <option value="member">{t("roles.member")}</option>
        <option value="admin">{t("roles.admin")}</option>
        <option value="viewer">{t("roles.viewer")}</option>
      </select>
      <Button disabled={pending}>{pending ? t("inviting") : t("submit")}</Button>
    </form>
  );
}
