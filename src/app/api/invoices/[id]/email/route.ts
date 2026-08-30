import { NextResponse } from "next/server";
import { connectDb } from "@/lib/db";
import { Invoice, Client } from "@/models";
import { sendEmail } from "@/lib/email/send";
import { getWorkspaceContext } from "@/lib/workspace";
import { createInvoiceAccessToken } from "@/lib/invoices/public-link";
import { objectIdSchema } from "@/lib/validators/schemas";
import { errorResponse, HttpError } from "@/lib/http";
import { rateLimit } from "@/lib/rate-limit";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const ctx = await getWorkspaceContext("member");
    const { id } = await params;
    if (!objectIdSchema.safeParse(id).success)
      throw new HttpError(404, "Invoice not found");
    const limited = rateLimit(
      `invoice-email:${ctx.workspaceId}:${id}`,
      10,
      60_000
    );
    if (!limited.ok) throw new HttpError(429, "Too many email requests");

    await connectDb();
    const invoice = await Invoice.findOne({
      _id: id,
      workspaceId: ctx.workspaceId
    }).lean();
    if (!invoice) throw new HttpError(404, "Invoice not found");
    const client = await Client.findOne({
      _id: invoice.clientId,
      workspaceId: ctx.workspaceId
    }).lean();
    if (!client?.email) throw new HttpError(400, "Client has no email");

    const origin = process.env.NEXT_PUBLIC_APP_URL || new URL(req.url).origin;
    const link = new URL(`/api/invoices/${id}/pdf`, origin);
    link.searchParams.set("token", createInvoiceAccessToken(id));
    await sendEmail(
      client.email,
      `Invoice ${invoice.number}`,
      `<p>Your invoice is ready.</p><p><a href="${link.toString()}">Download PDF</a></p>`
    );

    await Invoice.updateOne(
      { _id: invoice._id, workspaceId: ctx.workspaceId },
      { status: "sent" }
    );

    return NextResponse.json({ ok: true });
  } catch (error) {
    return errorResponse(error, "Could not send invoice");
  }
}
