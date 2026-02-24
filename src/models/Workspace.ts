import mongoose, { Schema } from "mongoose";

const WorkspaceSchema = new Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },
    logoUrl: String,
    timezone: { type: String, default: "UTC" },
    currency: { type: String, default: "USD" }
  },
  { timestamps: true }
);

export const Workspace = mongoose.models.Workspace || mongoose.model("Workspace", WorkspaceSchema);
