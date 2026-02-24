"use client";

import { useTransition } from "react";
import { useTranslations } from "next-intl";
import { createInvoice, markInvoicePaid } from "@/actions/invoices";
import { Button } from "@/components/ui/button";

export function InvoiceForm({ clients, projects }: { clients: Array<{ _id: string; name: string }>; projects: Array<{ _id: string; name: string }> }) {
  const [pending, startTransition] = useTransition();
  const t = useTranslations("invoiceForm");

  return (
    <form
      className="mb-4 grid gap-2 md:grid-cols-6"
      onSubmit={(e) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        startTransition(async () => {
          await createInvoice({
            clientId: String(fd.get("clientId")),
            projectId: String(fd.get("projectId") || ""),
            dueDate: new Date(String(fd.get("dueDate"))),
            tax: Number(fd.get("tax") || 0),
            discount: Number(fd.get("discount") || 0),
            items: [{ description: String(fd.get("description")), quantity: Number(fd.get("quantity")), unitPrice: Number(fd.get("unitPrice")) }]
          });
          window.location.reload();
        });
      }}
    >
      <select name="clientId" className="h-10 rounded-md border bg-transparent px-2" required>
        <option value="">{t("clientPlaceholder")}</option>
        {clients.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
      </select>
      <select name="projectId" className="h-10 rounded-md border bg-transparent px-2">
        <option value="">{t("projectPlaceholder")}</option>
        {projects.map((p) => <option key={p._id} value={p._id}>{p.name}</option>)}
      </select>
      <input name="description" className="h-10 rounded-md border bg-transparent px-2" placeholder={t("itemPlaceholder")} required />
      <input name="quantity" type="number" min={1} defaultValue={1} className="h-10 rounded-md border bg-transparent px-2" required />
      <input name="unitPrice" type="number" min={0} defaultValue={0} className="h-10 rounded-md border bg-transparent px-2" required />
      <input name="dueDate" type="date" className="h-10 rounded-md border bg-transparent px-2" required />
      <input name="tax" type="number" min={0} defaultValue={0} className="h-10 rounded-md border bg-transparent px-2" />
      <input name="discount" type="number" min={0} defaultValue={0} className="h-10 rounded-md border bg-transparent px-2" />
      <div className="md:col-span-6"><Button disabled={pending}>{pending ? t("creating") : t("submit")}</Button></div>
    </form>
  );
}

export function MarkPaidButton({ id }: { id: string }) {
  const [pending, startTransition] = useTransition();
  const t = useTranslations("invoiceForm");
  return (
    <Button variant="outline" size="sm" disabled={pending} onClick={() => startTransition(async () => { await markInvoicePaid(id); window.location.reload(); })}>
      {pending ? "..." : t("markPaid")}
    </Button>
  );
}
