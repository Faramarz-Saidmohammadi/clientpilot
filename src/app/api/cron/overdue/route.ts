import { NextResponse } from "next/server";
import { connectDb } from "@/lib/db";
import { Invoice } from "@/models";

export async function POST() {
  await connectDb();
  const now = new Date();
  const result = await Invoice.updateMany({ status: { $in: ["draft", "sent"] }, dueDate: { $lt: now } }, { status: "overdue" });
  return NextResponse.json({ updated: result.modifiedCount });
}
