"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

type SearchEntity = { _id: string; name?: string; number?: string };
type SearchResponse = { clients: SearchEntity[]; projects: SearchEntity[]; invoices: SearchEntity[] };

export function GlobalSearch() {
  const [q, setQ] = useState("");
  const [results, setResults] = useState<SearchResponse | null>(null);
  const t = useTranslations("globalSearch");

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
        placeholder={t("placeholder")}
        className="h-10 w-full rounded-xl border border-[var(--border)] bg-transparent px-3 text-sm outline-none focus-visible:border-[var(--primary)] focus-visible:ring-2 focus-visible:ring-[color-mix(in_oklab,var(--primary)_45%,transparent)]"
      />
      {results ? (
        <div className="absolute z-20 mt-2 max-h-64 w-full overflow-auto rounded-xl border border-[var(--border)] bg-[var(--card)] p-2 text-sm shadow-xl">
          {[...results.clients, ...results.projects, ...results.invoices].slice(0, 8).map((x) => (
            <div key={x._id} className="rounded-lg px-2 py-1.5 transition-colors hover:shadow-[0_8px_20px_-16px_rgba(0,0,0,0.45)]">{x.name || x.number}</div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
