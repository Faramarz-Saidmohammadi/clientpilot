import { NextResponse } from "next/server";
import { connectDb } from "@/lib/db";
import { Invite, Membership, User } from "@/models";
import { getSession } from "@/lib/auth/session";
import { errorResponse, HttpError } from "@/lib/http";

export async function GET(req: Request) {
  try {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || new URL(req.url).origin;
    const session = await getSession();
    if (!session?.user?.id)
      return NextResponse.redirect(new URL("/en/login", appUrl));

    const { searchParams } = new URL(req.url);
    const token = searchParams.get("token");
    if (!token) throw new HttpError(400, "Missing token");

    await connectDb();
    const invite = await Invite.findOne({
      token,
      acceptedAt: null,
      expiresAt: { $gt: new Date() }
    }).lean();
    if (!invite) throw new HttpError(400, "Invalid invite");

    const user = await User.findById(session.user.id).lean();
    if (!user || user.email?.toLowerCase() !== invite.email.toLowerCase()) {
      throw new HttpError(403, "Invite email mismatch");
    }

    await Membership.updateOne(
      { userId: session.user.id, workspaceId: invite.workspaceId },
      {
        $setOnInsert: {
          userId: session.user.id,
          workspaceId: invite.workspaceId,
          role: invite.role
        }
      },
      { upsert: true }
    );
    const accepted = await Invite.updateOne(
      { _id: invite._id, acceptedAt: null },
      { acceptedAt: new Date() }
    );
    if (accepted.modifiedCount === 0)
      throw new HttpError(400, "Invite already accepted");

    return NextResponse.redirect(new URL("/en/app/team", appUrl));
  } catch (error) {
    return errorResponse(error, "Could not accept invite");
  }
}
