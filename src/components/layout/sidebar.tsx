"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Brand } from "@/components/shared/brand";
import { cn } from "@/lib/utils";

type Item = { href: string; label: string };

export function Sidebar({ items }: { items: Item[] }) {
  const pathname = usePathname();

  return (
    <aside className="glass-nav hidden w-72 border-r border-[var(--border)] p-4 md:block">
      <div className="mb-4">
        <Brand />
      </div>
      <div className="space-y-1">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "block rounded-xl px-3 py-2.5 text-sm transition-all duration-300",
              pathname === item.href
                ? "bg-[color-mix(in_oklab,var(--primary)_80%,transparent)] text-[var(--background)] shadow-[0_14px_30px_-18px_var(--glow)]"
                : "hover:translate-x-1 hover:shadow-[0_10px_20px_-16px_rgba(0,0,0,0.45)]"
            )}
          >
            {item.label}
          </Link>
        ))}
      </div>
    </aside>
  );
}
