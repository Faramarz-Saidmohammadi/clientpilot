import { cn } from "@/lib/utils";

export function Textarea({ className, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        "min-h-[100px] w-full rounded-md border border-[var(--border)] bg-transparent p-3 text-sm outline-none placeholder:text-[var(--muted)] focus-visible:border-[var(--primary)] focus-visible:ring-2 focus-visible:ring-[color-mix(in_oklab,var(--primary)_45%,transparent)]",
        className
      )}
      {...props}
    />
  );
}
