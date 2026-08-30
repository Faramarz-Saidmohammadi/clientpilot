"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function LoginForm({
  locale,
  googleEnabled
}: {
  locale: string;
  googleEnabled: boolean;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const t = useTranslations("loginForm");

  return (
    <form
      className="space-y-4"
      onSubmit={async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        const fd = new FormData(e.currentTarget);
        try {
          const res = await signIn("credentials", {
            email: fd.get("email"),
            password: fd.get("password"),
            redirect: false
          });
          if (res?.error) {
            setError(t("invalidCredentials"));
            return;
          }
          window.location.href = `/${locale}/app`;
        } catch {
          setError(t("invalidCredentials"));
        } finally {
          setLoading(false);
        }
      }}
    >
      <div>
        <Label htmlFor="email">{t("email")}</Label>
        <Input id="email" name="email" type="email" required />
      </div>
      <div>
        <Label htmlFor="password">{t("password")}</Label>
        <Input id="password" name="password" type="password" required />
      </div>
      {error ? <p className="text-sm text-[var(--danger)]">{error}</p> : null}
      <Button disabled={loading} className="w-full">
        {loading ? t("signingIn") : t("submit")}
      </Button>
      {googleEnabled ? (
        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={() => signIn("google", { callbackUrl: `/${locale}/app` })}
        >
          {t("google")}
        </Button>
      ) : null}
    </form>
  );
}
