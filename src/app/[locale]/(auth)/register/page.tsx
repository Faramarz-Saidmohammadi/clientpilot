import { getTranslations } from "next-intl/server";
import { Card } from "@/components/ui/card";
import { RegisterForm } from "@/components/forms/register-form";

export default async function RegisterPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const safeLocale = locale === "fa" ? "fa" : "en";
  const t = await getTranslations({ locale: safeLocale, namespace: "authPages" });

  return (
    <section className="mx-auto max-w-md px-4 py-16">
      <Card>
        <h1 className="mb-4 text-2xl font-semibold">{t("createAccount")}</h1>
        <RegisterForm locale={locale} />
      </Card>
    </section>
  );
}
