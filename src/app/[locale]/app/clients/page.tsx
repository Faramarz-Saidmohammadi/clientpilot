import { ColumnDef } from "@tanstack/react-table";
import { getTranslations } from "next-intl/server";
import { listClients } from "@/actions/clients";
import { Card } from "@/components/ui/card";
import { NewClientForm } from "@/components/forms/new-client-form";
import { DataTable } from "@/components/tables/data-table";

type ClientRow = { id: string; name: string; email: string; createdAt: string };
type RawClient = { _id: string; name: string; email?: string; createdAt: Date };

export default async function ClientsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const safeLocale = locale === "fa" ? "fa" : "en";
  const t = await getTranslations({ locale: safeLocale, namespace: "clientsPage" });
  const clients = (await listClients()) as unknown as RawClient[];
  const columns: ColumnDef<ClientRow>[] = [
    { accessorKey: "name", header: t("columns.name") },
    { accessorKey: "email", header: t("columns.email") },
    { accessorKey: "createdAt", header: t("columns.createdAt") }
  ];

  const rows: ClientRow[] = clients.map((c) => ({
    id: String(c._id),
    name: c.name,
    email: c.email || "-",
    createdAt: new Date(c.createdAt).toLocaleDateString(safeLocale)
  }));

  return (
    <Card>
      <h1 className="mb-4 text-xl font-semibold">{t("title")}</h1>
      <NewClientForm />
      <DataTable columns={columns} data={rows} />
    </Card>
  );
}
