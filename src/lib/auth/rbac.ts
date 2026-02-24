import { getSession } from "@/lib/auth/session";
import { connectDb } from "@/lib/db";
import { Membership } from "@/models";

const hierarchy = ["viewer", "member", "admin", "owner"] as const;

type Role = (typeof hierarchy)[number];

export async function requireMembership(minRole: Role = "viewer") {
  const session = await getSession();
  if (!session?.user?.id) throw new Error("Unauthorized");

  await connectDb();
  const membership = await Membership.findOne({
    userId: session.user.id,
    workspaceId: session.user.workspaceId
  }).lean();

  if (!membership) throw new Error("No workspace membership");

  const allowed = hierarchy.indexOf(membership.role as Role) >= hierarchy.indexOf(minRole);
  if (!allowed) throw new Error("Forbidden");

  return {
    userId: session.user.id,
    workspaceId: String(membership.workspaceId),
    role: membership.role as Role
  };
}

export function canManageBilling(role?: string) {
  return role === "owner" || role === "admin";
}
