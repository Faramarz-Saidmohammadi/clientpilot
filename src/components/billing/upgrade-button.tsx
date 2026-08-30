"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export function UpgradeButton() {
  const t = useTranslations("upgradeButton");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  return (
    <div>
      <Button
        disabled={loading}
        onClick={async () => {
          setLoading(true);
          setError("");
          try {
            const res = await fetch("/api/stripe/checkout", { method: "POST" });
            const data = (await res.json().catch(() => null)) as {
              url?: string;
              error?: string;
            } | null;
            if (!res.ok || !data?.url) {
              setError(data?.error || t("failed"));
              return;
            }
            window.location.href = data.url;
          } catch {
            setError(t("failed"));
          } finally {
            setLoading(false);
          }
        }}
      >
        {loading ? t("loading") : t("label")}
      </Button>
      {error ? (
        <p className="mt-2 text-sm text-[var(--danger)]" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
