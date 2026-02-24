import { getRequestConfig } from "next-intl/server";
import { hasLocale } from "next-intl";
import { defaultLocale, locales } from "@/lib/i18n/config";

export default getRequestConfig(async ({ requestLocale }) => {
  const locale = (await requestLocale) || defaultLocale;
  const safeLocale = hasLocale(locales, locale) ? locale : defaultLocale;

  return {
    locale: safeLocale,
    messages: (await import(`@/messages/${safeLocale}.json`)).default
  };
});
