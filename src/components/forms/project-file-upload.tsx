"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";

export function ProjectFileUpload({ projectId }: { projectId: string }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const t = useTranslations("projectFileUpload");

  return (
    <form
      className="flex items-center gap-2"
      onSubmit={async (e) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        fd.append("projectId", projectId);
        setLoading(true);
        setError("");
        try {
          const response = await fetch("/api/upload", {
            method: "POST",
            body: fd
          });
          if (!response.ok) {
            const body = (await response.json().catch(() => null)) as {
              error?: string;
            } | null;
            setError(body?.error || t("failed"));
            return;
          }
          window.location.reload();
        } finally {
          setLoading(false);
        }
      }}
    >
      <input
        type="file"
        name="file"
        accept=".pdf,.jpg,.jpeg,.png,.webp,.txt,application/pdf,image/jpeg,image/png,image/webp,text/plain"
        required
        className="min-w-0 text-sm"
      />
      <Button disabled={loading}>
        {loading ? t("uploading") : t("submit")}
      </Button>
      {error ? (
        <p className="text-sm text-[var(--danger)]" role="alert">
          {error}
        </p>
      ) : null}
    </form>
  );
}
