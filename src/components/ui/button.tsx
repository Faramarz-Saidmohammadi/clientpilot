import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "border border-[color-mix(in_oklab,var(--primary)_55%,transparent)] bg-[var(--primary)] text-[var(--background)] shadow-[0_10px_26px_-14px_rgba(0,0,0,0.45)] hover:-translate-y-0.5 hover:brightness-105",
        outline:
          "border border-[var(--border)] bg-transparent hover:-translate-y-0.5 hover:shadow-[0_8px_20px_-16px_rgba(0,0,0,0.45)]",
        ghost:
          "hover:-translate-y-0.5 hover:shadow-[0_8px_20px_-16px_rgba(0,0,0,0.45)]"
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8 px-3",
        lg: "h-11 px-8",
        icon: "h-10 w-10"
      }
    },
    defaultVariants: { variant: "default", size: "default" }
  }
);

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({ className, variant, size, ...props }, ref) => (
  <button className={cn(buttonVariants({ variant, size }), className)} ref={ref} {...props} />
));
Button.displayName = "Button";
