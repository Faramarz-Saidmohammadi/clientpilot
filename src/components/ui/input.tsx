import * as React from "react";
import { cn } from "@/lib/utils";

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(({ className, ...props }, ref) => (
  <input
    ref={ref}
    className={cn(
      "flex h-10 w-full rounded-md border border-[var(--border)] bg-transparent px-3 py-2 text-sm outline-none placeholder:text-[var(--muted)] focus-visible:border-[var(--primary)] focus-visible:ring-2 focus-visible:ring-[color-mix(in_oklab,var(--primary)_45%,transparent)]",
      className
    )}
    {...props}
  />
));
Input.displayName = "Input";
