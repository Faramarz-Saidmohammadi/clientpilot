import { describe, expect, it } from "vitest";
import {
  invoiceSchema,
  objectIdSchema,
  registerSchema,
  timeEntrySchema
} from "@/lib/validators/schemas";

const objectId = "507f1f77bcf86cd799439011";

describe("server-side validators", () => {
  it("normalizes registration data", () => {
    expect(
      registerSchema.parse({
        name: "  Faramarz  ",
        email: "USER@Example.com",
        password: "password123"
      })
    ).toEqual({
      name: "Faramarz",
      email: "user@example.com",
      password: "password123"
    });
  });

  it("rejects malformed database identifiers", () => {
    expect(objectIdSchema.safeParse("not-an-id").success).toBe(false);
  });

  it("normalizes an empty optional project on an invoice", () => {
    const invoice = invoiceSchema.parse({
      clientId: objectId,
      projectId: "",
      dueDate: "2026-09-01",
      tax: 0,
      discount: 0,
      items: [{ description: "Consulting", quantity: 1, unitPrice: 100 }]
    });

    expect(invoice.projectId).toBeUndefined();
  });

  it("rejects a discount larger than the invoice amount", () => {
    const result = invoiceSchema.safeParse({
      clientId: objectId,
      dueDate: "2026-09-01",
      tax: 0,
      discount: 101,
      items: [{ description: "Consulting", quantity: 1, unitPrice: 100 }]
    });

    expect(result.success).toBe(false);
  });

  it("rejects time entries whose end precedes their start", () => {
    const result = timeEntrySchema.safeParse({
      projectId: objectId,
      start: "2026-09-01T11:00:00Z",
      end: "2026-09-01T10:00:00Z"
    });

    expect(result.success).toBe(false);
  });
});
