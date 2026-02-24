"use client";

import { signOut } from "next-auth/react";
import { useTranslations } from "next-intl";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

export function LogoutButton({ locale }: { locale: "en" | "fa" }) {
  const t = useTranslations("topbar");

  return (
    <Button
      variant="outline"
      size="sm"
      className="gap-1.5 border-[color-mix(in_oklab,var(--danger)_55%,var(--border))] text-[var(--ink)] hover:text-[var(--foreground)]"
      onClick={() => signOut({ callbackUrl: `/${locale}/login` })}
      aria-label={t("logout")}
    >
      <LogOut className="h-3.5 w-3.5" />
      <span className="hidden md:inline">{t("logout")}</span>
    </Button>
  );
}
