"use server";

import { connectDb } from "@/lib/db";
import { taskSchema } from "@/lib/validators/schemas";
import { getWorkspaceContext } from "@/lib/workspace";
import { Task } from "@/models";
import { logAudit } from "@/lib/audit";

export async function listTasks() {
  const ctx = await getWorkspaceContext();
  await connectDb();
  return Task.find({ workspaceId: ctx.workspaceId }).sort({ order: 1, createdAt: -1 }).lean();
}

export async function createTask(input: unknown) {
  const ctx = await getWorkspaceContext("member");
  const parsed = taskSchema.safeParse(input);
  if (!parsed.success) throw new Error(parsed.error.message);
  await connectDb();
  const task = await Task.create({ ...parsed.data, workspaceId: ctx.workspaceId });
  await logAudit({ workspaceId: ctx.workspaceId, actorId: ctx.userId, action: "task.create", entity: "Task", entityId: String(task._id) });
  return { id: String(task._id) };
}
