import { notFound } from "next/navigation";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages } from "next-intl/server";
import { locales, localeDirection } from "@/lib/i18n/config";
import { AuthProvider } from "@/components/shared/auth-provider";

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(locales, locale)) notFound();
  const messages = await getMessages({ locale });

  return (
    <html lang={locale} dir={localeDirection[locale]} suppressHydrationWarning>
      <body className="app-shell antialiased">
        <AuthProvider>
          <NextIntlClientProvider locale={locale} messages={messages}>
            {children}
          </NextIntlClientProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
