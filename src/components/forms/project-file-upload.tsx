"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";

export function ProjectFileUpload({ projectId }: { projectId: string }) {
  const [loading, setLoading] = useState(false);
  const t = useTranslations("projectFileUpload");

  return (
    <form
      className="flex items-center gap-2"
      onSubmit={async (e) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        fd.append("projectId", projectId);
        setLoading(true);
        await fetch("/api/upload", { method: "POST", body: fd });
        setLoading(false);
        window.location.reload();
      }}
    >
      <input type="file" name="file" required className="text-sm" />
      <Button disabled={loading}>{loading ? t("uploading") : t("submit")}</Button>
    </form>
  );
}
