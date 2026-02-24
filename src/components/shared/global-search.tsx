"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useState } from "react";
import { useTranslations } from "next-intl";

type SearchEntity = { _id: string; name?: string; number?: string };
type SearchResponse = { clients: SearchEntity[]; projects: SearchEntity[]; invoices: SearchEntity[] };
type SearchItem = { id: string; label: string; type: "client" | "project" | "invoice"; href: string };

export function GlobalSearch() {
  const router = useRouter();
  const pathname = usePathname();
  const [q, setQ] = useState("");
  const [results, setResults] = useState<SearchResponse | null>(null);
  const t = useTranslations("globalSearch");
  const parts = pathname.split("/").filter(Boolean);
  const locale = parts[0] === "fa" ? "fa" : "en";

  const items: SearchItem[] = results
    ? [
        ...results.clients.map((x) => ({ id: x._id, label: x.name || "-", type: "client" as const, href: `/${locale}/app/clients` })),
        ...results.projects.map((x) => ({ id: x._id, label: x.name || "-", type: "project" as const, href: `/${locale}/app/projects/${x._id}` })),
        ...results.invoices.map((x) => ({ id: x._id, label: x.number || "-", type: "invoice" as const, href: `/${locale}/app/invoices` }))
      ].slice(0, 8)
    : [];

  return (
    <div className="relative w-full max-w-md">
      <input
        value={q}
        onChange={async (e) => {
          const value = e.target.value;
          setQ(value);
          if (!value) {
            setResults(null);
            return;
          }
          const res = await fetch(`/api/search?q=${encodeURIComponent(value)}`);
          if (res.ok) setResults((await res.json()) as SearchResponse);
        }}
        onKeyDown={(e) => {
          if (e.key === "Escape") {
            setResults(null);
            return;
          }
          if (e.key === "Enter" && items[0]) {
            e.preventDefault();
            router.push(items[0].href);
            setResults(null);
          }
        }}
        placeholder={t("placeholder")}
        className="h-10 w-full rounded-xl border border-[var(--border)] bg-transparent px-3 text-sm outline-none focus-visible:border-[var(--primary)] focus-visible:ring-2 focus-visible:ring-[color-mix(in_oklab,var(--primary)_45%,transparent)]"
      />
      {results ? (
        <div className="absolute z-20 mt-2 max-h-64 w-full overflow-auto rounded-xl border border-[var(--border)] bg-[var(--card)] p-2 text-sm shadow-xl">
          {items.length === 0 ? <div className="px-2 py-1.5 text-[var(--muted)]">{t("noResults")}</div> : null}
          {items.map((item) => (
            <Link
              key={`${item.type}-${item.id}`}
              href={item.href}
              onClick={() => setResults(null)}
              className="flex items-center justify-between rounded-lg px-2 py-1.5 transition-colors hover:shadow-[0_8px_20px_-16px_rgba(0,0,0,0.45)]"
            >
              <span>{item.label}</span>
              <span className="text-xs text-[var(--muted)]">
                {item.type === "client" ? t("types.client") : item.type === "project" ? t("types.project") : t("types.invoice")}
              </span>
            </Link>
          ))}
        </div>
      ) : null}
    </div>
  );
}
