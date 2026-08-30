import Link from "next/link";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { LocaleSwitcher } from "@/components/shared/locale-switcher";
import { Suspense } from "react";
import { Brand } from "@/components/shared/brand";
import { getTranslations } from "next-intl/server";

export async function MarketingHeader({ locale }: { locale: string }) {
  const safeLocale = locale === "fa" ? "fa" : "en";
  const t = await getTranslations({ locale: safeLocale });

  return (
    <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-6">
      <Link href={`/${safeLocale}`}>
        <Brand label={t("brand")} />
      </Link>
      <nav className="glass-nav flex items-center gap-1 rounded-2xl border border-[var(--border)] px-2 py-1.5">
        <Link
          href={`/${safeLocale}/pricing`}
          className="rounded-lg px-3 py-1.5 text-sm transition-all hover:-translate-y-0.5 hover:shadow-[0_10px_20px_-16px_rgba(0,0,0,0.45)]"
        >
          {t("nav.pricing")}
        </Link>
        <Link
          href={`/${safeLocale}/login`}
          className="rounded-lg px-3 py-1.5 text-sm transition-all hover:-translate-y-0.5 hover:shadow-[0_10px_20px_-16px_rgba(0,0,0,0.45)]"
        >
          {t("nav.login")}
        </Link>
        <ThemeToggle />
        <Suspense fallback={<span className="h-8 w-11" aria-hidden="true" />}>
          <LocaleSwitcher locale={safeLocale} />
        </Suspense>
      </nav>
    </header>
  );
}
