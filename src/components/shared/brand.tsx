import { cn } from "@/lib/utils";

export function Brand({
  label = "ClientPilot",
  className
}: {
  label?: string;
  className?: string;
}) {
  return (
    <div className={cn("inline-flex items-center gap-2", className)}>
      <svg
        viewBox="0 0 48 48"
        aria-hidden="true"
        className="h-8 w-8 shrink-0"
        role="img"
      >
        <defs>
          <linearGradient id="cp-logo-g" x1="6" x2="42" y1="8" y2="40" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#73E6CB" />
            <stop offset="0.52" stopColor="#3EBB9E" />
            <stop offset="1" stopColor="#00674F" />
          </linearGradient>
        </defs>
        <rect x="3" y="3" width="42" height="42" rx="12" fill="url(#cp-logo-g)" />
        <path
          d="M31.5 14.5h-7.8c-6 0-10.2 4.5-10.2 9.9 0 5.4 4.2 9.9 10.2 9.9h7.8v-4.6h-7.4c-3.2 0-5.2-2.4-5.2-5.3s2-5.3 5.2-5.3h7.4v-4.6Zm3 0v19.8h4V14.5h-4Z"
          fill="#EEF6EE"
        />
      </svg>
      <span className="text-lg font-semibold tracking-tight">{label}</span>
    </div>
  );
}
