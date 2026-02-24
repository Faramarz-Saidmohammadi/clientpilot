"use server";

import { connectDb } from "@/lib/db";
import { projectSchema } from "@/lib/validators/schemas";
import { getWorkspaceContext } from "@/lib/workspace";
import { Project } from "@/models";
import { logAudit } from "@/lib/audit";

export async function listProjects() {
  const ctx = await getWorkspaceContext();
  await connectDb();
  return Project.find({ workspaceId: ctx.workspaceId }).sort({ createdAt: -1 }).lean();
}

export async function createProject(input: unknown) {
  const ctx = await getWorkspaceContext("member");
  const parsed = projectSchema.safeParse(input);
  if (!parsed.success) throw new Error(parsed.error.message);
  await connectDb();
  const project = await Project.create({ ...parsed.data, workspaceId: ctx.workspaceId });
  await logAudit({ workspaceId: ctx.workspaceId, actorId: ctx.userId, action: "project.create", entity: "Project", entityId: String(project._id) });
  return { id: String(project._id) };
}

export async function getProjectById(id: string) {
  const ctx = await getWorkspaceContext();
  await connectDb();
  return Project.findOne({ _id: id, workspaceId: ctx.workspaceId }).lean();
}
