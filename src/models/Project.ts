import mongoose, { Schema } from "mongoose";

const ProjectSchema = new Schema(
  {
    workspaceId: { type: Schema.Types.ObjectId, ref: "Workspace", required: true, index: true },
    clientId: { type: Schema.Types.ObjectId, ref: "Client", required: true },
    name: { type: String, required: true },
    status: { type: String, enum: ["planned", "active", "completed", "on_hold"], default: "active" },
    budget: { type: Number, default: 0 },
    description: String
  },
  { timestamps: true }
);

export const Project = mongoose.models.Project || mongoose.model("Project", ProjectSchema);
