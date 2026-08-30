import { cache } from "react";
import { getSession } from "@/lib/auth/session";
import { connectDb } from "@/lib/db";
import { Membership } from "@/models";
import { HttpError } from "@/lib/http";

const hierarchy = ["viewer", "member", "admin", "owner"] as const;

type Role = (typeof hierarchy)[number];

export const getCurrentMembership = cache(async () => {
  const session = await getSession();
  if (!session?.user?.id) return null;

  await connectDb();
  const membership = await Membership.findOne({
    userId: session.user.id,
    ...(session.user.workspaceId
      ? { workspaceId: session.user.workspaceId }
      : {})
  }).lean();

  return {
    userId: session.user.id,
    membership: membership
      ? {
          workspaceId: String(membership.workspaceId),
          role: membership.role as Role
        }
      : null
  };
});

export async function requireMembership(minRole: Role = "viewer") {
  const current = await getCurrentMembership();
  if (!current) throw new HttpError(401, "Unauthorized");
  if (!current.membership) throw new HttpError(403, "No workspace membership");

  const allowed =
    hierarchy.indexOf(current.membership.role) >= hierarchy.indexOf(minRole);
  if (!allowed) throw new HttpError(403, "Forbidden");

  return {
    userId: current.userId,
    workspaceId: current.membership.workspaceId,
    role: current.membership.role
  };
}

export function canManageBilling(role?: string) {
  return role === "owner" || role === "admin";
}
