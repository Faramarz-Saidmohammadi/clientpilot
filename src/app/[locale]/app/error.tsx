"use client";

import { useTranslations } from "next-intl";

export default function AppError({ error }: { error: Error }) {
  const t = useTranslations("appError");

  return (
    <div className="p-6">
      <h2 className="text-lg font-semibold">{t("title")}</h2>
      <p className="mt-2 text-sm text-[var(--danger)]">{error.message}</p>
    </div>
  );
}
