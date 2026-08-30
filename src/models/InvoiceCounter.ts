import mongoose, { Schema } from "mongoose";

const InvoiceCounterSchema = new Schema(
  {
    workspaceId: {
      type: Schema.Types.ObjectId,
      ref: "Workspace",
      required: true,
      unique: true
    },
    sequence: { type: Number, required: true, default: 0 }
  },
  { timestamps: true }
);

export const InvoiceCounter =
  mongoose.models.InvoiceCounter ||
  mongoose.model("InvoiceCounter", InvoiceCounterSchema);
