import { getTranslations } from "next-intl/server";
import { Card } from "@/components/ui/card";
import { LoginForm } from "@/components/forms/login-form";

export default async function LoginPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const safeLocale = locale === "fa" ? "fa" : "en";
  const t = await getTranslations({ locale: safeLocale, namespace: "authPages" });

  return (
    <section className="mx-auto max-w-md px-4 py-16">
      <Card>
        <h1 className="mb-4 text-2xl font-semibold">{t("welcomeBack")}</h1>
        <LoginForm locale={locale} />
      </Card>
    </section>
  );
}
