import { NextResponse } from "next/server";
import {
  deleteLocalFile,
  MAX_UPLOAD_BYTES,
  saveLocalFile
} from "@/lib/storage/local";
import { connectDb } from "@/lib/db";
import { Project, ProjectFile } from "@/models";
import { getWorkspaceContext } from "@/lib/workspace";
import { objectIdSchema } from "@/lib/validators/schemas";
import { errorResponse, HttpError } from "@/lib/http";

export async function POST(req: Request) {
  try {
    const ctx = await getWorkspaceContext("member");
    const contentLength = Number(req.headers.get("content-length") || 0);
    if (contentLength > MAX_UPLOAD_BYTES + 64 * 1024) {
      throw new HttpError(413, "Files must be 5 MB or smaller");
    }
    const formData = await req.formData();
    const file = formData.get("file");
    const projectId = String(formData.get("projectId") || "");

    if (
      !(file instanceof File) ||
      !objectIdSchema.safeParse(projectId).success
    ) {
      throw new HttpError(400, "Invalid upload payload");
    }

    await connectDb();
    const project = await Project.exists({
      _id: projectId,
      workspaceId: ctx.workspaceId
    });
    if (!project) throw new HttpError(404, "Project not found");

    const uploaded = await saveLocalFile(file);
    try {
      const record = await ProjectFile.create({
        workspaceId: ctx.workspaceId,
        projectId,
        uploaderId: ctx.userId,
        url: uploaded.url,
        key: uploaded.key,
        name: file.name.slice(0, 255),
        size: file.size,
        mimeType: uploaded.contentType
      });

      return NextResponse.json({ id: String(record._id), url: uploaded.url });
    } catch (error) {
      await deleteLocalFile(uploaded.key);
      throw error;
    }
  } catch (error) {
    return errorResponse(error, "Upload failed");
  }
}
