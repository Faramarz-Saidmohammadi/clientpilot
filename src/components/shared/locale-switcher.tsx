"use client";

import { useRouter } from "next/navigation";
import { usePathname, useSearchParams } from "next/navigation";
import { startTransition } from "react";

export function LocaleSwitcher({ locale }: { locale: "en" | "fa" }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const next = locale === "en" ? "fa" : "en";
  const parts = pathname.split("/").filter(Boolean);

  // Handle both cases:
  // 1) Path already includes locale prefix: /en/app/clients
  // 2) Path is locale-stripped by routing: /app/clients
  const hasLocalePrefix = parts[0] === "en" || parts[0] === "fa";
  const localizedPath = hasLocalePrefix
    ? `/${[next, ...parts.slice(1)].join("/")}`
    : `/${next}${pathname.startsWith("/") ? pathname : `/${pathname}`}`;
  const query = searchParams.toString();
  const href = query ? `${localizedPath}?${query}` : localizedPath;

  return (
    <button
      type="button"
      className="inline-flex h-8 items-center justify-center rounded-lg border border-[var(--border)] bg-transparent px-3 text-sm font-medium transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_20px_-16px_rgba(0,0,0,0.45)]"
      onClick={() => {
        // Keep middleware locale detection in sync across subsequent navigations.
        document.cookie = `NEXT_LOCALE=${next}; path=/; max-age=31536000; samesite=lax`;
        startTransition(() => {
          router.push(href);
          router.refresh();
        });
      }}
    >
      {next.toUpperCase()}
    </button>
  );
}
