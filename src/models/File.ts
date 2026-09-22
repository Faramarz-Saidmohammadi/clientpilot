import mongoose, { Schema } from "mongoose";

const FileSchema = new Schema(
  {
    workspaceId: {
      type: Schema.Types.ObjectId,
      ref: "Workspace",
      required: true,
      index: true
    },
    projectId: { type: Schema.Types.ObjectId, ref: "Project", required: true },
    uploaderId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    url: { type: String, required: true },
    key: { type: String, required: true },
    name: { type: String, required: true },
    size: { type: Number, required: true },
    mimeType: { type: String, default: "application/octet-stream" }
  },
  { timestamps: true }
);

FileSchema.index({ workspaceId: 1, key: 1 }, { unique: true });

export const ProjectFile =
  mongoose.models.ProjectFile || mongoose.model("ProjectFile", FileSchema);
