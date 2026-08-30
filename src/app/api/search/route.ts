import { NextResponse } from "next/server";
import { connectDb } from "@/lib/db";
import { Client, Invoice, Project } from "@/models";
import { getWorkspaceContext } from "@/lib/workspace";
import { escapeRegex } from "@/lib/search";
import { errorResponse } from "@/lib/http";

export async function GET(req: Request) {
  try {
    const ctx = await getWorkspaceContext();
    const q = (new URL(req.url).searchParams.get("q") || "")
      .trim()
      .slice(0, 100);
    if (q.length < 2)
      return NextResponse.json({ clients: [], projects: [], invoices: [] });
    await connectDb();

    const regex = new RegExp(escapeRegex(q), "i");
    const [clients, projects, invoices] = await Promise.all([
      Client.find({ workspaceId: ctx.workspaceId, name: regex })
        .limit(5)
        .lean(),
      Project.find({ workspaceId: ctx.workspaceId, name: regex })
        .limit(5)
        .lean(),
      Invoice.find({ workspaceId: ctx.workspaceId, number: regex })
        .limit(5)
        .lean()
    ]);

    return NextResponse.json({ clients, projects, invoices });
  } catch (error) {
    return errorResponse(error, "Search failed");
  }
}
