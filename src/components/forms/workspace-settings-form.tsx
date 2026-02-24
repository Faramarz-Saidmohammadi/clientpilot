"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { updateWorkspaceSettings } from "@/actions/settings";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const timezones = ["UTC", "Asia/Kabul", "Asia/Dubai", "Europe/Berlin", "America/New_York", "America/Los_Angeles"];
const currencies = ["USD", "EUR", "GBP", "AED", "AFN", "CAD"];

export function WorkspaceSettingsForm({
  initial
}: {
  initial: { name: string; slug: string; timezone: string; currency: string; logoUrl: string };
}) {
  const t = useTranslations("settingsForm");
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  return (
    <form
      className="mt-5 grid gap-4 md:grid-cols-2"
      onSubmit={(e) => {
        e.preventDefault();
        setError(null);
        setSaved(false);
        const fd = new FormData(e.currentTarget);
        startTransition(async () => {
          try {
            await updateWorkspaceSettings({
              name: String(fd.get("name") || ""),
              slug: String(fd.get("slug") || ""),
              timezone: String(fd.get("timezone") || "UTC"),
              currency: String(fd.get("currency") || "USD"),
              logoUrl: String(fd.get("logoUrl") || "")
            });
            setSaved(true);
          } catch (err) {
            setError(err instanceof Error ? err.message : t("saveFailed"));
          }
        });
      }}
    >
      <div>
        <Label htmlFor="name">{t("name")}</Label>
        <Input id="name" name="name" defaultValue={initial.name} required />
      </div>
      <div>
        <Label htmlFor="slug">{t("slug")}</Label>
        <Input id="slug" name="slug" defaultValue={initial.slug} required />
      </div>
      <div>
        <Label htmlFor="timezone">{t("timezone")}</Label>
        <select id="timezone" name="timezone" defaultValue={initial.timezone} className="h-10 w-full rounded-md border bg-transparent px-3">
          {timezones.map((tz) => (
            <option key={tz} value={tz}>
              {tz}
            </option>
          ))}
        </select>
      </div>
      <div>
        <Label htmlFor="currency">{t("currency")}</Label>
        <select id="currency" name="currency" defaultValue={initial.currency} className="h-10 w-full rounded-md border bg-transparent px-3">
          {currencies.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>
      <div className="md:col-span-2">
        <Label htmlFor="logoUrl">{t("logoUrl")}</Label>
        <Input id="logoUrl" name="logoUrl" defaultValue={initial.logoUrl} placeholder="https://example.com/logo.png" />
      </div>
      <div className="md:col-span-2 flex items-center gap-3">
        <Button disabled={pending}>{pending ? t("saving") : t("save")}</Button>
        {saved ? <p className="text-sm text-[var(--muted)]">{t("saved")}</p> : null}
        {error ? <p className="text-sm text-[var(--danger)]">{error}</p> : null}
      </div>
    </form>
  );
}
