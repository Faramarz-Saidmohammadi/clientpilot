import mongoose, { Schema } from "mongoose";

const SubscriptionSchema = new Schema(
  {
    workspaceId: { type: Schema.Types.ObjectId, ref: "Workspace", required: true, unique: true },
    stripeCustomerId: { type: String, index: true },
    stripeSubId: { type: String, index: true },
    plan: { type: String, enum: ["free", "pro"], default: "free" },
    status: { type: String, default: "inactive" }
  },
  { timestamps: true }
);

export const Subscription = mongoose.models.Subscription || mongoose.model("Subscription", SubscriptionSchema);
