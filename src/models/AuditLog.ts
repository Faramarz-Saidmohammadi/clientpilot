import mongoose, { Schema } from "mongoose";

const AuditLogSchema = new Schema(
  {
    workspaceId: { type: Schema.Types.ObjectId, ref: "Workspace", required: true, index: true },
    actorId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    action: { type: String, required: true },
    entity: { type: String, required: true },
    entityId: { type: String },
    metadata: Schema.Types.Mixed
  },
  { timestamps: true }
);

export const AuditLog = mongoose.models.AuditLog || mongoose.model("AuditLog", AuditLogSchema);
