"use server";

import { connectDb } from "@/lib/db";
import { objectIdSchema, projectSchema } from "@/lib/validators/schemas";
import { getWorkspaceContext } from "@/lib/workspace";
import { Client, Project, ProjectFile } from "@/models";
import { logAudit } from "@/lib/audit";

export async function listProjects() {
  const ctx = await getWorkspaceContext();
  await connectDb();
  return Project.find({ workspaceId: ctx.workspaceId })
    .sort({ createdAt: -1 })
    .lean();
}

export async function createProject(input: unknown) {
  const ctx = await getWorkspaceContext("member");
  const parsed = projectSchema.safeParse(input);
  if (!parsed.success) throw new Error(parsed.error.message);
  await connectDb();
  const clientExists = await Client.exists({
    _id: parsed.data.clientId,
    workspaceId: ctx.workspaceId
  });
  if (!clientExists) throw new Error("Client not found in this workspace");

  const project = await Project.create({
    ...parsed.data,
    workspaceId: ctx.workspaceId
  });
  await logAudit({
    workspaceId: ctx.workspaceId,
    actorId: ctx.userId,
    action: "project.create",
    entity: "Project",
    entityId: String(project._id)
  });
  return { id: String(project._id) };
}

export async function getProjectById(id: string) {
  const ctx = await getWorkspaceContext();
  if (!objectIdSchema.safeParse(id).success) return null;
  await connectDb();
  return Project.findOne({ _id: id, workspaceId: ctx.workspaceId }).lean();
}

export async function listProjectFiles(projectId: string) {
  const ctx = await getWorkspaceContext();
  if (!objectIdSchema.safeParse(projectId).success) return [];
  await connectDb();
  const project = await Project.exists({
    _id: projectId,
    workspaceId: ctx.workspaceId
  });
  if (!project) return [];
  return ProjectFile.find({ projectId, workspaceId: ctx.workspaceId })
    .sort({ createdAt: -1 })
    .lean();
}
