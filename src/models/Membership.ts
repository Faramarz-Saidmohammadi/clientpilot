import mongoose, { Schema } from "mongoose";

export const roles = ["owner", "admin", "member", "viewer"] as const;

const MembershipSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    workspaceId: { type: Schema.Types.ObjectId, ref: "Workspace", required: true, index: true },
    role: { type: String, enum: roles, default: "member" }
  },
  { timestamps: true }
);

MembershipSchema.index({ userId: 1, workspaceId: 1 }, { unique: true });

export const Membership = mongoose.models.Membership || mongoose.model("Membership", MembershipSchema);
