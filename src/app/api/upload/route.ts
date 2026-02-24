import { NextResponse } from "next/server";
import { saveLocalFile } from "@/lib/storage/local";
import { connectDb } from "@/lib/db";
import { ProjectFile } from "@/models";
import { getWorkspaceContext } from "@/lib/workspace";

export async function POST(req: Request) {
  const ctx = await getWorkspaceContext("member");
  const formData = await req.formData();
  const file = formData.get("file");
  const projectId = String(formData.get("projectId") || "");

  if (!(file instanceof File) || !projectId) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const uploaded = await saveLocalFile(file);
  await connectDb();
  const record = await ProjectFile.create({
    workspaceId: ctx.workspaceId,
    projectId,
    uploaderId: ctx.userId,
    url: uploaded.url,
    key: uploaded.key,
    name: file.name,
    size: file.size
  });

  return NextResponse.json({ id: String(record._id), url: uploaded.url });
}
