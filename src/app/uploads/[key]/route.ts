import { NextResponse } from "next/server";
import { connectDb } from "@/lib/db";
import { errorResponse, HttpError } from "@/lib/http";
import { readLocalFile } from "@/lib/storage/local";
import { getWorkspaceContext } from "@/lib/workspace";
import { ProjectFile } from "@/models";

export async function GET(
  _: Request,
  { params }: { params: Promise<{ key: string }> }
) {
  try {
    const ctx = await getWorkspaceContext();
    const { key } = await params;
    await connectDb();
    const record = await ProjectFile.findOne({
      key,
      workspaceId: ctx.workspaceId
    }).lean();
    if (!record) throw new HttpError(404, "File not found");

    let data: Buffer;
    try {
      data = await readLocalFile(key);
    } catch {
      throw new HttpError(404, "File not found");
    }

    return new NextResponse(new Uint8Array(data), {
      headers: {
        "Cache-Control": "private, no-store",
        "Content-Disposition": `attachment; filename*=UTF-8''${encodeURIComponent(record.name)}`,
        "Content-Type": record.mimeType || "application/octet-stream",
        "X-Content-Type-Options": "nosniff"
      }
    });
  } catch (error) {
    return errorResponse(error, "Could not load file");
  }
}
