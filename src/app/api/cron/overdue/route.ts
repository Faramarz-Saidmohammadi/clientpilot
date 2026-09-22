import { NextResponse } from "next/server";
import { connectDb } from "@/lib/db";
import { Invoice } from "@/models";
import { hasValidBearerToken } from "@/lib/security/secrets";

export async function POST(req: Request) {
  if (
    !hasValidBearerToken(
      req.headers.get("authorization"),
      process.env.CRON_SECRET
    )
  ) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectDb();
  const now = new Date();
  const result = await Invoice.updateMany(
    { status: { $in: ["draft", "sent"] }, dueDate: { $lt: now } },
    { status: "overdue" }
  );
  return NextResponse.json({ updated: result.modifiedCount });
}
