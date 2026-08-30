import fs from "fs/promises";
import path from "path";
import crypto from "crypto";

export const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;

const allowedTypes = new Map([
  ["application/pdf", "pdf"],
  ["image/jpeg", "jpg"],
  ["image/png", "png"],
  ["image/webp", "webp"],
  ["text/plain", "txt"]
]);

export function validateUpload(file: File) {
  if (file.size === 0) throw new Error("The selected file is empty");
  if (file.size > MAX_UPLOAD_BYTES)
    throw new Error("Files must be 5 MB or smaller");

  const extension = allowedTypes.get(file.type);
  if (!extension)
    throw new Error("Only PDF, JPEG, PNG, WebP, and text files are allowed");
  return { extension, contentType: file.type };
}

function resolveUploadPath(key: string) {
  if (!/^[a-f\d-]{36}\.(pdf|jpg|png|webp|txt)$/.test(key)) {
    throw new Error("Invalid upload key");
  }
  return path.join(process.cwd(), "uploads", key);
}

export async function saveLocalFile(file: File) {
  const { extension, contentType } = validateUpload(file);
  const uploadDir = path.join(process.cwd(), "uploads");
  await fs.mkdir(uploadDir, { recursive: true });
  const key = `${crypto.randomUUID()}.${extension}`;
  const bytes = await file.arrayBuffer();
  const outputPath = resolveUploadPath(key);
  await fs.writeFile(outputPath, Buffer.from(bytes));
  return { key, url: `/uploads/${key}`, contentType };
}

export function readLocalFile(key: string) {
  return fs.readFile(resolveUploadPath(key));
}

export async function deleteLocalFile(key: string) {
  try {
    await fs.unlink(resolveUploadPath(key));
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
  }
}
