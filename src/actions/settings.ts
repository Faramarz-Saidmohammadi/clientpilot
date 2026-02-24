"use server";

import { connectDb } from "@/lib/db";
import { logAudit } from "@/lib/audit";
import { workspaceSettingsSchema } from "@/lib/validators/schemas";
import { getWorkspaceContext } from "@/lib/workspace";
import { Workspace } from "@/models";

type WorkspaceSettings = {
  name: string;
  slug: string;
  timezone: string;
  currency: string;
  logoUrl: string;
};

export async function getWorkspaceSettings(): Promise<WorkspaceSettings> {
  const ctx = await getWorkspaceContext("viewer");
  await connectDb();
  const workspace = await Workspace.findById(ctx.workspaceId).lean();
  if (!workspace) throw new Error("Workspace not found");

  return {
    name: workspace.name || "",
    slug: workspace.slug || "",
    timezone: workspace.timezone || "UTC",
    currency: workspace.currency || "USD",
    logoUrl: workspace.logoUrl || ""
  };
}

export async function updateWorkspaceSettings(input: WorkspaceSettings) {
  const ctx = await getWorkspaceContext("admin");
  const parsed = workspaceSettingsSchema.safeParse(input);
  if (!parsed.success) throw new Error("Invalid settings data");

  await connectDb();
  const workspace = await Workspace.findById(ctx.workspaceId);
  if (!workspace) throw new Error("Workspace not found");

  const nextSlug = parsed.data.slug.toLowerCase();
  if (nextSlug !== workspace.slug) {
    const existing = await Workspace.findOne({ slug: nextSlug }).lean();
    if (existing) throw new Error("Slug already in use");
  }

  workspace.name = parsed.data.name;
  workspace.slug = nextSlug;
  workspace.timezone = parsed.data.timezone;
  workspace.currency = parsed.data.currency;
  workspace.logoUrl = parsed.data.logoUrl || undefined;
  await workspace.save();

  await logAudit({
    workspaceId: ctx.workspaceId,
    actorId: ctx.userId,
    action: "workspace.settings.updated",
    entity: "workspace",
    entityId: String(workspace._id)
  });

  return { ok: true };
}
