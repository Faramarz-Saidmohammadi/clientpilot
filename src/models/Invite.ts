import mongoose, { Schema } from "mongoose";

const InviteSchema = new Schema(
  {
    workspaceId: {
      type: Schema.Types.ObjectId,
      ref: "Workspace",
      required: true
    },
    email: { type: String, required: true, lowercase: true },
    role: {
      type: String,
      enum: ["admin", "member", "viewer"],
      default: "member"
    },
    token: { type: String, required: true, unique: true },
    expiresAt: { type: Date, required: true },
    invitedBy: { type: Schema.Types.ObjectId, ref: "User" },
    acceptedAt: Date
  },
  { timestamps: true }
);

InviteSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const Invite =
  mongoose.models.Invite || mongoose.model("Invite", InviteSchema);
