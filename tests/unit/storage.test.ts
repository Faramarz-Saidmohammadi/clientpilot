import { describe, expect, it } from "vitest";
import { MAX_UPLOAD_BYTES, validateUpload } from "@/lib/storage/local";

describe("project upload validation", () => {
  it("accepts an approved file type", () => {
    const file = new File(["hello"], "notes.txt", { type: "text/plain" });
    expect(validateUpload(file)).toEqual({
      extension: "txt",
      contentType: "text/plain"
    });
  });

  it("rejects executable and oversized files", () => {
    const executable = new File(["binary"], "payload.exe", {
      type: "application/x-msdownload"
    });
    expect(() => validateUpload(executable)).toThrow(/Only PDF/);

    const oversized = {
      name: "large.pdf",
      type: "application/pdf",
      size: MAX_UPLOAD_BYTES + 1
    } as File;
    expect(() => validateUpload(oversized)).toThrow(/5 MB/);
  });
});
