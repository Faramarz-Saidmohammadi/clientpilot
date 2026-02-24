import { cn } from "@/lib/utils";

export function Separator({ className }: { className?: string }) {
  return <div className={cn("my-2 h-px w-full bg-[var(--border)]", className)} />;
}
