import { NextResponse } from "next/server";
import { connectDb } from "@/lib/db";
import { Client, Invoice, Project } from "@/models";
import { getWorkspaceContext } from "@/lib/workspace";

export async function GET(req: Request) {
  const ctx = await getWorkspaceContext();
  const q = new URL(req.url).searchParams.get("q") || "";
  await connectDb();

  const regex = new RegExp(q, "i");
  const [clients, projects, invoices] = await Promise.all([
    Client.find({ workspaceId: ctx.workspaceId, name: regex }).limit(5).lean(),
    Project.find({ workspaceId: ctx.workspaceId, name: regex }).limit(5).lean(),
    Invoice.find({ workspaceId: ctx.workspaceId, number: regex }).limit(5).lean()
  ]);

  return NextResponse.json({ clients, projects, invoices });
}
