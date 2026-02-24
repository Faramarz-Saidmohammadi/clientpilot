import fs from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";

export async function GET(_: Request, { params }: { params: Promise<{ key: string }> }) {
  const { key } = await params;
  const filePath = path.join(process.cwd(), "uploads", key);
  try {
    const data = await fs.readFile(filePath);
    return new NextResponse(data);
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}
