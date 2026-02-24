"use server";

import { connectDb } from "@/lib/db";
import { clientSchema } from "@/lib/validators/schemas";
import { getWorkspaceContext } from "@/lib/workspace";
import { Client } from "@/models";
import { logAudit } from "@/lib/audit";

export async function listClients() {
  const ctx = await getWorkspaceContext();
  await connectDb();
  return Client.find({ workspaceId: ctx.workspaceId }).sort({ createdAt: -1 }).lean();
}

export async function createClient(input: unknown) {
  const ctx = await getWorkspaceContext("member");
  const parsed = clientSchema.safeParse(input);
  if (!parsed.success) throw new Error(parsed.error.message);
  await connectDb();
  const client = await Client.create({ ...parsed.data, workspaceId: ctx.workspaceId });
  await logAudit({ workspaceId: ctx.workspaceId, actorId: ctx.userId, action: "client.create", entity: "Client", entityId: String(client._id) });
  return { id: String(client._id) };
}
