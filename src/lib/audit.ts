import { AuditLog } from "@/models";

export async function logAudit(input: {
  workspaceId: string;
  actorId: string;
  action: string;
  entity: string;
  entityId?: string;
  metadata?: unknown;
}) {
  await AuditLog.create(input);
}
