"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";

export function UpgradeButton() {
  const t = useTranslations("upgradeButton");

  return (
    <Button
      onClick={async () => {
        const res = await fetch("/api/stripe/checkout", { method: "POST" });
        const data = await res.json();
        if (data.url) window.location.href = data.url;
      }}
    >
      {t("label")}
    </Button>
  );
}
