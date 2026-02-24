import mongoose, { Schema } from "mongoose";

const TimeEntrySchema = new Schema(
  {
    workspaceId: { type: Schema.Types.ObjectId, ref: "Workspace", required: true, index: true },
    projectId: { type: Schema.Types.ObjectId, ref: "Project", required: true },
    taskId: { type: Schema.Types.ObjectId, ref: "Task" },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    start: { type: Date, required: true },
    end: { type: Date, required: true },
    duration: { type: Number, required: true },
    note: String,
    billed: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export const TimeEntry = mongoose.models.TimeEntry || mongoose.model("TimeEntry", TimeEntrySchema);
