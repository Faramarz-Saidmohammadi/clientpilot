import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function currency(
  value: number,
  currencyCode = "USD",
  locale = "en-US"
) {
  try {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: currencyCode
    }).format(value);
  } catch {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD"
    }).format(value);
  }
}
