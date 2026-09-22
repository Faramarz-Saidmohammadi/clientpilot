"use server";

import bcrypt from "bcryptjs";
import crypto from "crypto";
import { connectDb } from "@/lib/db";
import { sendEmail } from "@/lib/email/send";
import { getSession } from "@/lib/auth/session";
import { getWorkspaceContext } from "@/lib/workspace";
import { rateLimit } from "@/lib/rate-limit";
import { Invite, Membership, User, Workspace, Subscription } from "@/models";
import {
  inviteMemberSchema,
  registerSchema,
  workspaceCreateSchema
} from "@/lib/validators/schemas";

export async function registerUser(input: {
  name: string;
  email: string;
  password: string;
}) {
  const parsed = registerSchema.safeParse(input);
  if (!parsed.success) throw new Error("Invalid registration data");

  await connectDb();
  const existing = await User.findOne({ email: parsed.data.email }).lean();
  if (existing) throw new Error("User already exists");

  const passwordHash = await bcrypt.hash(parsed.data.password, 12);
  const user = await User.create({
    name: parsed.data.name,
    email: parsed.data.email,
    passwordHash
  });
  return { id: String(user._id) };
}

export async function createWorkspace(input: {
  name: string;
  slug: string;
  plan: "free" | "pro";
}) {
  const parsed = workspaceCreateSchema.safeParse(input);
  if (!parsed.success) throw new Error("Invalid workspace data");

  const session = await getSession();
  if (!session?.user?.id) throw new Error("Sign in first");

  await connectDb();
  const workspace = await Workspace.create({
    name: parsed.data.name,
    slug: parsed.data.slug
  });
  try {
    await Membership.create({
      userId: session.user.id,
      workspaceId: workspace._id,
      role: "owner"
    });
    await Subscription.create({
      workspaceId: workspace._id,
      plan: parsed.data.plan,
      status: parsed.data.plan === "free" ? "active" : "trialing"
    });
  } catch (error) {
    await Promise.all([
      Membership.deleteMany({ workspaceId: workspace._id }),
      Subscription.deleteMany({ workspaceId: workspace._id }),
      Workspace.deleteOne({ _id: workspace._id })
    ]);
    throw error;
  }
  return { id: String(workspace._id) };
}

export async function inviteMember(input: {
  email: string;
  role: "admin" | "member" | "viewer";
}) {
  const parsed = inviteMemberSchema.safeParse(input);
  if (!parsed.success) throw new Error("Invalid invitation data");

  const ctx = await getWorkspaceContext("admin");
  const limited = rateLimit(
    `invite:${ctx.workspaceId}:${ctx.userId}`,
    25,
    60_000
  );
  if (!limited.ok) throw new Error("Too many invites, try again shortly.");

  await connectDb();
  const existingUser = await User.findOne({ email: parsed.data.email })
    .select({ _id: 1 })
    .lean();
  if (existingUser) {
    const existingMembership = await Membership.exists({
      userId: existingUser._id,
      workspaceId: ctx.workspaceId
    });
    if (existingMembership)
      throw new Error("This user is already a workspace member");
  }

  const token = crypto.randomBytes(24).toString("hex");
  const invite = await Invite.create({
    workspaceId: ctx.workspaceId,
    email: parsed.data.email,
    role: parsed.data.role,
    token,
    invitedBy: ctx.userId,
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7)
  });

  const url = `${process.env.NEXT_PUBLIC_APP_URL}/api/invites/accept?token=${token}`;
  try {
    await sendEmail(
      parsed.data.email,
      "Workspace invite",
      `<p>You were invited to ClientPilot. <a href='${url}'>Accept invite</a></p>`
    );
  } catch (error) {
    await Invite.deleteOne({ _id: invite._id, workspaceId: ctx.workspaceId });
    throw error;
  }
  return { id: String(invite._id) };
}

export async function listMembers() {
  const ctx = await getWorkspaceContext();
  await connectDb();
  return Membership.find({ workspaceId: ctx.workspaceId })
    .populate("userId", "name email")
    .lean();
}
