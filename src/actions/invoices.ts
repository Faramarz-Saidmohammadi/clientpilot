"use server";

import { connectDb } from "@/lib/db";
import {
  invoiceFromTimeEntriesSchema,
  invoiceSchema,
  objectIdSchema
} from "@/lib/validators/schemas";
import { getWorkspaceContext } from "@/lib/workspace";
import {
  Client,
  Invoice,
  InvoiceCounter,
  InvoiceItem,
  Project,
  TimeEntry
} from "@/models";
import { logAudit } from "@/lib/audit";

function nextInvoiceNumber(n: number) {
  return `INV-${String(n).padStart(5, "0")}`;
}

async function reserveInvoiceNumber(workspaceId: string) {
  let counter = await InvoiceCounter.findOneAndUpdate(
    { workspaceId },
    { $inc: { sequence: 1 } },
    { new: true }
  ).lean();

  if (!counter) {
    const latestInvoice = await Invoice.findOne({ workspaceId })
      .sort({ createdAt: -1 })
      .select({ number: 1 })
      .lean();
    const latestSequence = /^INV-(\d+)$/.exec(latestInvoice?.number || "")?.[1];

    try {
      await InvoiceCounter.create({
        workspaceId,
        sequence: latestSequence ? Number(latestSequence) : 0
      });
    } catch (error) {
      if ((error as { code?: number }).code !== 11_000) throw error;
    }

    counter = await InvoiceCounter.findOneAndUpdate(
      { workspaceId },
      { $inc: { sequence: 1 } },
      { new: true }
    ).lean();
  }

  if (!counter) throw new Error("Could not reserve an invoice number");
  return nextInvoiceNumber(counter.sequence);
}

export async function listInvoices() {
  const ctx = await getWorkspaceContext();
  await connectDb();
  return Invoice.find({ workspaceId: ctx.workspaceId })
    .sort({ createdAt: -1 })
    .lean();
}

export async function createInvoice(input: unknown) {
  const ctx = await getWorkspaceContext("member");
  const parsed = invoiceSchema.safeParse(input);
  if (!parsed.success) throw new Error(parsed.error.message);

  await connectDb();
  const client = await Client.exists({
    _id: parsed.data.clientId,
    workspaceId: ctx.workspaceId
  });
  if (!client) throw new Error("Client not found in this workspace");

  if (parsed.data.projectId) {
    const project = await Project.exists({
      _id: parsed.data.projectId,
      clientId: parsed.data.clientId,
      workspaceId: ctx.workspaceId
    });
    if (!project)
      throw new Error("Project not found for this client and workspace");
  }

  const subtotal = parsed.data.items.reduce(
    (sum, i) => sum + i.quantity * i.unitPrice,
    0
  );
  const total = subtotal + parsed.data.tax - parsed.data.discount;
  const number = await reserveInvoiceNumber(ctx.workspaceId);

  const invoice = await Invoice.create({
    workspaceId: ctx.workspaceId,
    clientId: parsed.data.clientId,
    projectId: parsed.data.projectId,
    dueDate: parsed.data.dueDate,
    number,
    subtotal,
    tax: parsed.data.tax,
    discount: parsed.data.discount,
    total
  });

  try {
    await InvoiceItem.insertMany(
      parsed.data.items.map((item) => ({
        invoiceId: invoice._id,
        description: item.description,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        amount: item.quantity * item.unitPrice
      }))
    );
  } catch (error) {
    await Invoice.deleteOne({ _id: invoice._id, workspaceId: ctx.workspaceId });
    throw error;
  }

  await logAudit({
    workspaceId: ctx.workspaceId,
    actorId: ctx.userId,
    action: "invoice.create",
    entity: "Invoice",
    entityId: String(invoice._id)
  });
  return { id: String(invoice._id) };
}

export async function createInvoiceFromTimeEntries(input: {
  clientId: string;
  projectId: string;
  entryIds: string[];
  hourlyRate: number;
  dueDate: Date;
}) {
  const ctx = await getWorkspaceContext("member");
  const parsed = invoiceFromTimeEntriesSchema.safeParse(input);
  if (!parsed.success) throw new Error(parsed.error.message);
  await connectDb();

  const entryIds = [...new Set(parsed.data.entryIds)];
  const entries = await TimeEntry.find({
    _id: { $in: entryIds },
    projectId: parsed.data.projectId,
    workspaceId: ctx.workspaceId,
    billed: false
  }).lean();
  if (entries.length !== entryIds.length) {
    throw new Error("One or more time entries are unavailable in this project");
  }

  const hours = entries.reduce((sum, e) => sum + e.duration / 60, 0);
  const amount = Number((hours * parsed.data.hourlyRate).toFixed(2));

  const created = await createInvoice({
    clientId: parsed.data.clientId,
    projectId: parsed.data.projectId,
    dueDate: parsed.data.dueDate,
    tax: 0,
    discount: 0,
    items: [
      {
        description: `Time entries (${hours.toFixed(2)}h)`,
        quantity: 1,
        unitPrice: amount
      }
    ]
  });

  await TimeEntry.updateMany(
    {
      _id: { $in: entries.map((e) => e._id) },
      workspaceId: ctx.workspaceId,
      billed: false
    },
    { billed: true }
  );
  return created;
}

export async function markInvoicePaid(invoiceId: string) {
  const ctx = await getWorkspaceContext("member");
  const parsedId = objectIdSchema.safeParse(invoiceId);
  if (!parsedId.success) throw new Error("Invalid invoice identifier");
  await connectDb();
  const result = await Invoice.updateOne(
    { _id: parsedId.data, workspaceId: ctx.workspaceId },
    { status: "paid", paidAt: new Date() }
  );
  if (result.matchedCount === 0) throw new Error("Invoice not found");
  await logAudit({
    workspaceId: ctx.workspaceId,
    actorId: ctx.userId,
    action: "invoice.paid",
    entity: "Invoice",
    entityId: invoiceId
  });
}
