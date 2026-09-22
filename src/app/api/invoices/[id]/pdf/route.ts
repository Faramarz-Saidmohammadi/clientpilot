import { NextResponse } from "next/server";
import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  renderToBuffer
} from "@react-pdf/renderer";
import { connectDb } from "@/lib/db";
import { Invoice, InvoiceItem, Workspace } from "@/models";
import { getWorkspaceContext } from "@/lib/workspace";
import { verifyInvoiceAccessToken } from "@/lib/invoices/public-link";
import { objectIdSchema } from "@/lib/validators/schemas";
import { errorResponse, HttpError } from "@/lib/http";
import { currency } from "@/lib/utils";

const styles = StyleSheet.create({
  page: { padding: 32 },
  title: { fontSize: 20, marginBottom: 12 },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4
  }
});

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!objectIdSchema.safeParse(id).success)
      throw new HttpError(404, "Invoice not found");

    const token = new URL(req.url).searchParams.get("token");
    const hasPublicAccess = verifyInvoiceAccessToken(id, token);
    let workspaceId: string | undefined;
    if (!hasPublicAccess) {
      workspaceId = (await getWorkspaceContext()).workspaceId;
    }

    await connectDb();
    const invoice = await Invoice.findOne({
      _id: id,
      ...(workspaceId ? { workspaceId } : {})
    }).lean();
    if (!invoice) throw new HttpError(404, "Invoice not found");
    const [items, workspace] = await Promise.all([
      InvoiceItem.find({ invoiceId: invoice._id }).lean(),
      Workspace.findById(invoice.workspaceId).select({ currency: 1 }).lean()
    ]);
    const currencyCode =
      typeof workspace?.currency === "string" ? workspace.currency : "USD";

    const itemViews = items.map(
      (item: { _id: string; description: string; amount: number }) =>
        React.createElement(
          View,
          { key: String(item._id), style: styles.row },
          React.createElement(Text, null, item.description),
          React.createElement(Text, null, currency(item.amount, currencyCode))
        )
    );

    const doc = React.createElement(
      Document,
      null,
      React.createElement(
        Page,
        { size: "A4", style: styles.page },
        React.createElement(
          Text,
          { style: styles.title },
          `Invoice ${invoice.number}`
        ),
        ...itemViews,
        React.createElement(
          Text,
          { style: { marginTop: 16 } },
          `Total: ${currency(invoice.total, currencyCode)}`
        )
      )
    );

    const pdf = await renderToBuffer(doc);
    return new NextResponse(new Uint8Array(pdf), {
      headers: {
        "Cache-Control": "private, no-store",
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="${invoice.number}.pdf"`,
        "X-Content-Type-Options": "nosniff"
      }
    });
  } catch (error) {
    return errorResponse(error, "Could not create invoice PDF");
  }
}
