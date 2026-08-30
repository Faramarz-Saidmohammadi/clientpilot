import { ThemeToggle } from "@/components/shared/theme-toggle";
import { GlobalSearch } from "@/components/shared/global-search";
import { LocaleSwitcher } from "@/components/shared/locale-switcher";
import { LogoutButton } from "@/components/shared/logout-button";
import { MobileNav } from "@/components/layout/mobile-nav";
import { Suspense } from "react";

type Item = { href: string; label: string };

export function Topbar({
  title,
  items,
  locale
}: {
  title: string;
  items: Item[];
  locale: "en" | "fa";
}) {
  return (
    <div className="glass-nav soft-enter sticky top-0 z-30 flex flex-wrap items-center justify-between gap-3 border-b border-[var(--border)] px-4 py-3">
      <div className="flex items-center gap-2">
        <MobileNav items={items} />
        <h1 className="text-lg font-semibold">{title}</h1>
      </div>
      <div className="ml-auto flex min-w-0 items-center gap-2">
        <div className="hidden md:block">
          <GlobalSearch />
        </div>
        <Suspense fallback={<span className="h-8 w-11" aria-hidden="true" />}>
          <LocaleSwitcher locale={locale} />
        </Suspense>
        <LogoutButton locale={locale} />
        <ThemeToggle />
      </div>
    </div>
  );
}
