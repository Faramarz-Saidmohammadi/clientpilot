import mongoose, { Schema } from "mongoose";

const InvoiceSchema = new Schema(
  {
    workspaceId: { type: Schema.Types.ObjectId, ref: "Workspace", required: true, index: true },
    clientId: { type: Schema.Types.ObjectId, ref: "Client", required: true },
    projectId: { type: Schema.Types.ObjectId, ref: "Project" },
    status: { type: String, enum: ["draft", "sent", "paid", "overdue"], default: "draft" },
    number: { type: String, required: true },
    subtotal: { type: Number, default: 0 },
    tax: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    total: { type: Number, default: 0 },
    dueDate: { type: Date, required: true },
    issuedAt: { type: Date, default: Date.now },
    paidAt: Date,
    stripePaymentLink: String
  },
  { timestamps: true }
);

InvoiceSchema.index({ workspaceId: 1, number: 1 }, { unique: true });

export const Invoice = mongoose.models.Invoice || mongoose.model("Invoice", InvoiceSchema);
