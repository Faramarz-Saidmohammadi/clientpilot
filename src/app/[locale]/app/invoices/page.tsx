import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { listInvoices } from "@/actions/invoices";
import { listClients } from "@/actions/clients";
import { listProjects } from "@/actions/projects";
import { Card } from "@/components/ui/card";
import {
  InvoiceForm,
  MarkPaidButton,
  SendInvoiceButton
} from "@/components/forms/invoice-form";
import { getWorkspaceSettings } from "@/actions/settings";
import { currency } from "@/lib/utils";

type RawInvoice = {
  _id: string;
  number: string;
  total: number;
  status: string;
  dueDate: Date;
};
type RawClient = { _id: string; name: string };
type RawProject = { _id: string; name: string };

export default async function InvoicesPage({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const safeLocale = locale === "fa" ? "fa" : "en";
  const t = await getTranslations({
    locale: safeLocale,
    namespace: "invoicesPage"
  });
  const [invoices, clients, projects, settings] = (await Promise.all([
    listInvoices(),
    listClients(),
    listProjects(),
    getWorkspaceSettings()
  ])) as unknown as [
    RawInvoice[],
    RawClient[],
    RawProject[],
    { currency: string }
  ];
  const statusLabels: Record<string, string> = {
    draft: t("status.draft"),
    sent: t("status.sent"),
    paid: t("status.paid"),
    overdue: t("status.overdue")
  };

  return (
    <Card>
      <h1 className="mb-4 text-xl font-semibold">{t("title")}</h1>
      <InvoiceForm
        clients={clients.map((c) => ({ _id: String(c._id), name: c.name }))}
        projects={projects.map((p) => ({ _id: String(p._id), name: p.name }))}
      />
      <div className="space-y-2">
        {invoices.map((inv) => (
          <div
            key={String(inv._id)}
            className="flex flex-col gap-3 rounded-md border p-3 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <div className="font-medium">
                {inv.number} -{" "}
                {currency(inv.total, settings.currency, safeLocale)}
              </div>
              <div className="text-sm text-[var(--muted)]">
                {statusLabels[inv.status] || inv.status} | {t("due")}{" "}
                {new Date(inv.dueDate).toLocaleDateString(safeLocale)}
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link
                href={`/api/invoices/${inv._id}/pdf`}
                className="rounded-md border px-3 py-2 text-sm"
              >
                {t("pdf")}
              </Link>
              <SendInvoiceButton id={String(inv._id)} />
              {inv.status !== "paid" ? (
                <MarkPaidButton id={String(inv._id)} />
              ) : null}
            </div>
          </div>
        ))}
      </div>
      <Link
        href={`/${locale}/app/reports`}
        className="mt-4 inline-block text-sm underline"
      >
        {t("seeReports")}
      </Link>
    </Card>
  );
}
