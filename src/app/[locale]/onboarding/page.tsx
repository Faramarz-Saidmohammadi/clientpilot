"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { createWorkspace } from "@/actions/team";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function OnboardingPage() {
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const t = useTranslations("onboardingPage");

  return (
    <section className="mx-auto max-w-lg px-4 py-16">
      <Card>
        <h1 className="mb-5 text-2xl font-semibold">{t("title")}</h1>
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            const fd = new FormData(e.currentTarget);
            startTransition(async () => {
              try {
                await createWorkspace({
                  name: String(fd.get("name")),
                  slug: String(fd.get("slug")),
                  plan: String(fd.get("plan")) === "pro" ? "pro" : "free"
                });
                window.location.href = `${window.location.pathname.replace("/onboarding", "/app")}`;
              } catch (err) {
                setError(err instanceof Error ? err.message : t("failed"));
              }
            });
          }}
        >
          <div>
            <Label htmlFor="name">{t("workspaceName")}</Label>
            <Input id="name" name="name" required />
          </div>
          <div>
            <Label htmlFor="slug">{t("workspaceSlug")}</Label>
            <Input id="slug" name="slug" required />
          </div>
          <div>
            <Label htmlFor="plan">{t("plan")}</Label>
            <select id="plan" name="plan" className="h-10 w-full rounded-md border bg-transparent px-3">
              <option value="free">{t("free")}</option>
              <option value="pro">{t("pro")}</option>
            </select>
          </div>
          {error ? <p className="text-sm text-[var(--danger)]">{error}</p> : null}
          <Button disabled={pending} className="w-full">
            {pending ? t("creating") : t("continue")}
          </Button>
        </form>
      </Card>
    </section>
  );
}
