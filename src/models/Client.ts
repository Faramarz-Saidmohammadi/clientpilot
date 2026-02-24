import mongoose, { Schema } from "mongoose";

const ClientSchema = new Schema(
  {
    workspaceId: { type: Schema.Types.ObjectId, ref: "Workspace", required: true, index: true },
    name: { type: String, required: true },
    email: String,
    company: String,
    notes: String
  },
  { timestamps: true }
);

export const Client = mongoose.models.Client || mongoose.model("Client", ClientSchema);
