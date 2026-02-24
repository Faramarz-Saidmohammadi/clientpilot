import { NextResponse } from "next/server";
import React from "react";
import { Document, Page, Text, View, StyleSheet, renderToBuffer } from "@react-pdf/renderer";
import { connectDb } from "@/lib/db";
import { Invoice, InvoiceItem } from "@/models";

const styles = StyleSheet.create({
  page: { padding: 32 },
  title: { fontSize: 20, marginBottom: 12 },
  row: { flexDirection: "row", justifyContent: "space-between", marginBottom: 4 }
});

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await connectDb();
  const invoice = await Invoice.findById(id).lean();
  if (!invoice) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const items = await InvoiceItem.find({ invoiceId: invoice._id }).lean();

  const itemViews = items.map((item: { _id: string; description: string; amount: number }) =>
    React.createElement(
      View,
      { key: String(item._id), style: styles.row },
      React.createElement(Text, null, item.description),
      React.createElement(Text, null, `$${item.amount}`)
    )
  );

  const doc = React.createElement(
    Document,
    null,
    React.createElement(
      Page,
      { size: "A4", style: styles.page },
      React.createElement(Text, { style: styles.title }, `Invoice ${invoice.number}`),
      ...itemViews,
      React.createElement(Text, { style: { marginTop: 16 } }, `Total: $${invoice.total}`)
    )
  );

  const pdf = await renderToBuffer(doc);
  return new NextResponse(new Uint8Array(pdf), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename=${invoice.number}.pdf`
    }
  });
}

