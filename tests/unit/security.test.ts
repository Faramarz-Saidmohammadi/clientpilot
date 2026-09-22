import { describe, expect, it } from "vitest";
import {
  createInvoiceAccessToken,
  verifyInvoiceAccessToken
} from "@/lib/invoices/public-link";
import { hasValidBearerToken, secureCompare } from "@/lib/security/secrets";
import { escapeRegex } from "@/lib/search";

const invoiceId = "507f1f77bcf86cd799439011";
const secret = "a-test-secret-that-is-long-enough";

describe("security helpers", () => {
  it("creates a valid time-limited invoice token", () => {
    const token = createInvoiceAccessToken(invoiceId, {
      now: 1_000,
      ttlMs: 5_000,
      secret
    });
    expect(
      verifyInvoiceAccessToken(invoiceId, token, { now: 5_999, secret })
    ).toBe(true);
  });

  it("rejects expired, altered, and cross-invoice tokens", () => {
    const token = createInvoiceAccessToken(invoiceId, {
      now: 1_000,
      ttlMs: 5_000,
      secret
    });
    expect(
      verifyInvoiceAccessToken(invoiceId, token, { now: 6_000, secret })
    ).toBe(false);
    expect(
      verifyInvoiceAccessToken("507f1f77bcf86cd799439012", token, {
        now: 2_000,
        secret
      })
    ).toBe(false);
    expect(
      verifyInvoiceAccessToken(invoiceId, `${token}x`, { now: 2_000, secret })
    ).toBe(false);
  });

  it("validates bearer secrets without accepting malformed headers", () => {
    expect(hasValidBearerToken(`Bearer ${secret}`, secret)).toBe(true);
    expect(hasValidBearerToken(secret, secret)).toBe(false);
    expect(hasValidBearerToken("Bearer wrong", secret)).toBe(false);
    expect(secureCompare("same", "same")).toBe(true);
    expect(secureCompare("short", "longer")).toBe(false);
  });

  it("escapes regex metacharacters in user search input", () => {
    expect(escapeRegex("a.*(b)+[c]")).toBe("a\\.\\*\\(b\\)\\+\\[c\\]");
  });
});
