"use server";

import { connectDb } from "@/lib/db";
import { invoiceSchema } from "@/lib/validators/schemas";
import { getWorkspaceContext } from "@/lib/workspace";
import { Invoice, InvoiceItem, TimeEntry } from "@/models";
import { logAudit } from "@/lib/audit";

function nextInvoiceNumber(n: number) {
  return `INV-${String(n).padStart(5, "0")}`;
}

export async function listInvoices() {
  const ctx = await getWorkspaceContext();
  await connectDb();
  return Invoice.find({ workspaceId: ctx.workspaceId }).sort({ createdAt: -1 }).lean();
}

export async function createInvoice(input: unknown) {
  const ctx = await getWorkspaceContext("member");
  const parsed = invoiceSchema.safeParse(input);
  if (!parsed.success) throw new Error(parsed.error.message);

  await connectDb();
  const count = await Invoice.countDocuments({ workspaceId: ctx.workspaceId });
  const subtotal = parsed.data.items.reduce((sum, i) => sum + i.quantity * i.unitPrice, 0);
  const total = subtotal + parsed.data.tax - parsed.data.discount;

  const invoice = await Invoice.create({
    workspaceId: ctx.workspaceId,
    clientId: parsed.data.clientId,
    projectId: parsed.data.projectId,
    dueDate: parsed.data.dueDate,
    number: nextInvoiceNumber(count + 1),
    subtotal,
    tax: parsed.data.tax,
    discount: parsed.data.discount,
    total
  });

  await InvoiceItem.insertMany(
    parsed.data.items.map((item) => ({
      invoiceId: invoice._id,
      description: item.description,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      amount: item.quantity * item.unitPrice
    }))
  );

  await logAudit({ workspaceId: ctx.workspaceId, actorId: ctx.userId, action: "invoice.create", entity: "Invoice", entityId: String(invoice._id) });
  return { id: String(invoice._id) };
}

export async function createInvoiceFromTimeEntries(input: { clientId: string; projectId: string; entryIds: string[]; hourlyRate: number; dueDate: Date }) {
  const ctx = await getWorkspaceContext("member");
  await connectDb();

  const entries = await TimeEntry.find({ _id: { $in: input.entryIds }, workspaceId: ctx.workspaceId, billed: false }).lean();
  const hours = entries.reduce((sum, e) => sum + e.duration / 60, 0);
  const amount = Number((hours * input.hourlyRate).toFixed(2));

  const created = await createInvoice({
    clientId: input.clientId,
    projectId: input.projectId,
    dueDate: input.dueDate,
    tax: 0,
    discount: 0,
    items: [{ description: `Time entries (${hours.toFixed(2)}h)`, quantity: 1, unitPrice: amount }]
  });

  await TimeEntry.updateMany({ _id: { $in: entries.map((e) => e._id) } }, { billed: true });
  return created;
}

export async function markInvoicePaid(invoiceId: string) {
  const ctx = await getWorkspaceContext("member");
  await connectDb();
  await Invoice.updateOne({ _id: invoiceId, workspaceId: ctx.workspaceId }, { status: "paid", paidAt: new Date() });
  await logAudit({ workspaceId: ctx.workspaceId, actorId: ctx.userId, action: "invoice.paid", entity: "Invoice", entityId: invoiceId });
}
