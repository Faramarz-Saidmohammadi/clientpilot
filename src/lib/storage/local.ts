import fs from "fs/promises";
import path from "path";

export async function saveLocalFile(file: File) {
  const uploadDir = path.join(process.cwd(), "uploads");
  await fs.mkdir(uploadDir, { recursive: true });
  const ext = file.name.split(".").pop() || "bin";
  const key = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const bytes = await file.arrayBuffer();
  const outputPath = path.join(uploadDir, key);
  await fs.writeFile(outputPath, Buffer.from(bytes));
  return { key, url: `/uploads/${key}` };
}
