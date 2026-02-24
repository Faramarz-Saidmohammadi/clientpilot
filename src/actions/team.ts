"use server";

import bcrypt from "bcryptjs";
import crypto from "crypto";
import { connectDb } from "@/lib/db";
import { sendEmail } from "@/lib/email/send";
import { getSession } from "@/lib/auth/session";
import { getWorkspaceContext } from "@/lib/workspace";
import { rateLimit } from "@/lib/rate-limit";
import { Invite, Membership, User, Workspace, Subscription } from "@/models";

export async function registerUser(input: { name: string; email: string; password: string }) {
  await connectDb();
  const existing = await User.findOne({ email: input.email.toLowerCase() }).lean();
  if (existing) throw new Error("User already exists");

  const passwordHash = await bcrypt.hash(input.password, 12);
  const user = await User.create({ name: input.name, email: input.email.toLowerCase(), passwordHash });
  return { id: String(user._id) };
}

export async function createWorkspace(input: { name: string; slug: string; plan: "free" | "pro" }) {
  const session = await getSession();
  if (!session?.user?.id) throw new Error("Sign in first");

  await connectDb();
  const workspace = await Workspace.create({ name: input.name, slug: input.slug });
  await Membership.create({ userId: session.user.id, workspaceId: workspace._id, role: "owner" });
  await Subscription.create({ workspaceId: workspace._id, plan: input.plan, status: input.plan === "free" ? "active" : "trialing" });
  return { id: String(workspace._id) };
}

export async function inviteMember(input: { email: string; role: "admin" | "member" | "viewer" }) {
  const ctx = await getWorkspaceContext("admin");
  const limited = rateLimit(`invite:${ctx.workspaceId}:${ctx.userId}`, 25, 60_000);
  if (!limited.ok) throw new Error("Too many invites, try again shortly.");

  await connectDb();
  const token = crypto.randomBytes(24).toString("hex");
  const invite = await Invite.create({
    workspaceId: ctx.workspaceId,
    email: input.email,
    role: input.role,
    token,
    invitedBy: ctx.userId,
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7)
  });

  const url = `${process.env.NEXT_PUBLIC_APP_URL}/api/invites/accept?token=${token}`;
  await sendEmail(input.email, "Workspace invite", `<p>You were invited to ClientPilot. <a href='${url}'>Accept invite</a></p>`);
  return { id: String(invite._id) };
}

export async function listMembers() {
  const ctx = await getWorkspaceContext();
  await connectDb();
  return Membership.find({ workspaceId: ctx.workspaceId }).populate("userId", "name email").lean();
}
