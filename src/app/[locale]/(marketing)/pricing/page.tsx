import { getTranslations } from "next-intl/server";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default async function PricingPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const safeLocale = locale === "fa" ? "fa" : "en";
  const t = await getTranslations({ locale: safeLocale, namespace: "pricingPage" });

  return (
    <section className="mx-auto grid max-w-6xl gap-6 px-4 py-16 md:grid-cols-2">
      <Card>
        <h2 className="text-2xl font-semibold">{t("freeTitle")}</h2>
        <p className="mt-2 text-[var(--muted)]">{t("freeDescription")}</p>
        <p className="mt-4 text-3xl font-bold">$0</p>
        <Button className="mt-4 w-full">{t("freeCta")}</Button>
      </Card>
      <Card>
        <h2 className="text-2xl font-semibold">{t("proTitle")}</h2>
        <p className="mt-2 text-[var(--muted)]">{t("proDescription")}</p>
        <p className="mt-4 text-3xl font-bold">$19/mo</p>
        <Button className="mt-4 w-full">{t("proCta")}</Button>
      </Card>
    </section>
  );
}
