import { requireMembership } from "@/lib/auth/rbac";

export async function getWorkspaceContext(minRole: "viewer" | "member" | "admin" | "owner" = "viewer") {
  return requireMembership(minRole);
}
