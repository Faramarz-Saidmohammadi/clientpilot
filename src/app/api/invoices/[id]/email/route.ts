import { NextResponse } from "next/server";
import { connectDb } from "@/lib/db";
import { Invoice, Client } from "@/models";
import { sendEmail } from "@/lib/email/send";

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await connectDb();
  const invoice = await Invoice.findById(id).lean();
  if (!invoice) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const client = await Client.findById(invoice.clientId).lean();
  if (!client?.email) return NextResponse.json({ error: "Client has no email" }, { status: 400 });

  const link = `${process.env.NEXT_PUBLIC_APP_URL}/api/invoices/${id}/pdf`;
  await sendEmail(client.email, `Invoice ${invoice.number}`, `<p>Your invoice is ready.</p><p><a href='${link}'>Download PDF</a></p>`);

  await Invoice.updateOne({ _id: invoice._id }, { status: "sent" });

  return NextResponse.json({ ok: true });
}
