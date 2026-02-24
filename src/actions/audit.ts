"use server";

import { connectDb } from "@/lib/db";
import { getWorkspaceContext } from "@/lib/workspace";
import { AuditLog } from "@/models";

export async function listAuditLogs() {
  const ctx = await getWorkspaceContext();
  await connectDb();
  return AuditLog.find({ workspaceId: ctx.workspaceId }).sort({ createdAt: -1 }).limit(20).lean();
}
