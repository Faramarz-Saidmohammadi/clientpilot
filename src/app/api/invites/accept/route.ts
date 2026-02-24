import { NextResponse } from "next/server";
import { connectDb } from "@/lib/db";
import { Invite, Membership, User } from "@/models";
import { getSession } from "@/lib/auth/session";

export async function GET(req: Request) {
  const session = await getSession();
  if (!session?.user?.id) return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/en/login`);

  const { searchParams } = new URL(req.url);
  const token = searchParams.get("token");
  if (!token) return NextResponse.json({ error: "Missing token" }, { status: 400 });

  await connectDb();
  const invite = await Invite.findOne({ token, expiresAt: { $gt: new Date() } }).lean();
  if (!invite) return NextResponse.json({ error: "Invalid invite" }, { status: 400 });

  const user = await User.findById(session.user.id).lean();
  if (!user || user.email?.toLowerCase() !== invite.email.toLowerCase()) {
    return NextResponse.json({ error: "Invite email mismatch" }, { status: 403 });
  }

  await Membership.updateOne(
    { userId: session.user.id, workspaceId: invite.workspaceId },
    { userId: session.user.id, workspaceId: invite.workspaceId, role: invite.role },
    { upsert: true }
  );
  await Invite.updateOne({ _id: invite._id }, { acceptedAt: new Date() });

  return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/en/app/team`);
}
