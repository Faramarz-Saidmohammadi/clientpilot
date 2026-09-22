"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Menu, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Brand } from "@/components/shared/brand";
import { cn } from "@/lib/utils";

type Item = { href: string; label: string };

export function MobileNav({
  items,
  locale
}: {
  items: Item[];
  locale: "en" | "fa";
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const t = useTranslations("topbar");

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <div className="md:hidden">
        <Dialog.Trigger asChild>
          <Button variant="ghost" size="icon" aria-label={t("openNavigation")}>
            <Menu className="h-5 w-5" />
          </Button>
        </Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-40 bg-[color-mix(in_oklab,var(--ink)_72%,transparent)] backdrop-blur-sm" />
          <Dialog.Content
            dir={locale === "fa" ? "rtl" : "ltr"}
            className="soft-enter fixed inset-y-0 start-0 z-50 w-72 border-e border-[var(--border)] bg-[var(--card)] p-4 shadow-[0_20px_50px_-24px_rgba(0,0,0,0.65)] backdrop-blur-md"
          >
            <Dialog.Title className="sr-only">{t("navigation")}</Dialog.Title>
            <Dialog.Description className="sr-only">
              {t("navigationDescription")}
            </Dialog.Description>
            <div className="mb-4 flex items-center justify-between border-b border-[var(--border)] pb-3">
              <Brand />
              <Dialog.Close asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label={t("closeNavigation")}
                >
                  <X className="h-5 w-5" />
                </Button>
              </Dialog.Close>
            </div>
            <nav className="max-h-[calc(100vh-6.5rem)] space-y-2 overflow-y-auto pe-1">
              {items.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "block rounded-xl border px-3 py-2.5 text-sm text-[var(--foreground)] transition-all duration-300",
                    pathname === item.href
                      ? "border-[color-mix(in_oklab,var(--primary)_55%,var(--border))] bg-[color-mix(in_oklab,var(--primary)_80%,transparent)] text-[var(--background)] shadow-[0_14px_30px_-18px_var(--glow)]"
                      : "border-[var(--border)] bg-[color-mix(in_oklab,var(--background)_70%,transparent)] hover:translate-x-1 hover:shadow-[0_10px_20px_-16px_rgba(0,0,0,0.45)] rtl:hover:-translate-x-1"
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </Dialog.Content>
        </Dialog.Portal>
      </div>
    </Dialog.Root>
  );
}
