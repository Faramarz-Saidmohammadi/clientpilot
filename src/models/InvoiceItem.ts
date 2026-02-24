import mongoose, { Schema } from "mongoose";

const InvoiceItemSchema = new Schema(
  {
    invoiceId: { type: Schema.Types.ObjectId, ref: "Invoice", required: true, index: true },
    description: { type: String, required: true },
    quantity: { type: Number, required: true, default: 1 },
    unitPrice: { type: Number, required: true, default: 0 },
    amount: { type: Number, required: true, default: 0 }
  },
  { timestamps: true }
);

export const InvoiceItem = mongoose.models.InvoiceItem || mongoose.model("InvoiceItem", InvoiceItemSchema);
