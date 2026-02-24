import mongoose, { Schema } from "mongoose";

const TaskSchema = new Schema(
  {
    workspaceId: { type: Schema.Types.ObjectId, ref: "Workspace", required: true, index: true },
    projectId: { type: Schema.Types.ObjectId, ref: "Project", required: true },
    title: { type: String, required: true },
    status: { type: String, enum: ["todo", "in_progress", "done"], default: "todo" },
    order: { type: Number, default: 0 },
    dueDate: Date,
    assigneeId: { type: Schema.Types.ObjectId, ref: "User" }
  },
  { timestamps: true }
);

export const Task = mongoose.models.Task || mongoose.model("Task", TaskSchema);
