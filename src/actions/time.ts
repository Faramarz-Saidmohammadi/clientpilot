"use server";

import { connectDb } from "@/lib/db";
import { timeEntrySchema } from "@/lib/validators/schemas";
import { getWorkspaceContext } from "@/lib/workspace";
import { Project, Task, TimeEntry } from "@/models";
import { logAudit } from "@/lib/audit";

export async function listTimeEntries() {
  const ctx = await getWorkspaceContext();
  await connectDb();
  return TimeEntry.find({ workspaceId: ctx.workspaceId })
    .sort({ start: -1 })
    .lean();
}

export async function createTimeEntry(input: unknown) {
  const ctx = await getWorkspaceContext("member");
  const parsed = timeEntrySchema.safeParse(input);
  if (!parsed.success) throw new Error(parsed.error.message);
  await connectDb();

  const projectExists = await Project.exists({
    _id: parsed.data.projectId,
    workspaceId: ctx.workspaceId
  });
  if (!projectExists) throw new Error("Project not found in this workspace");

  if (parsed.data.taskId) {
    const taskExists = await Task.exists({
      _id: parsed.data.taskId,
      projectId: parsed.data.projectId,
      workspaceId: ctx.workspaceId
    });
    if (!taskExists) throw new Error("Task not found in this project");
  }

  const overlap = await TimeEntry.findOne({
    workspaceId: ctx.workspaceId,
    userId: ctx.userId,
    start: { $lt: parsed.data.end },
    end: { $gt: parsed.data.start }
  }).lean();

  if (overlap) throw new Error("Time entry overlaps with an existing entry.");

  const duration = Math.round(
    (parsed.data.end.getTime() - parsed.data.start.getTime()) / 60000
  );
  const created = await TimeEntry.create({
    ...parsed.data,
    duration,
    workspaceId: ctx.workspaceId,
    userId: ctx.userId
  });
  await logAudit({
    workspaceId: ctx.workspaceId,
    actorId: ctx.userId,
    action: "time.create",
    entity: "TimeEntry",
    entityId: String(created._id)
  });
  return { id: String(created._id) };
}
