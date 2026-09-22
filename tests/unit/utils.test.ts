import { describe, expect, it } from "vitest";
import { currency } from "@/lib/utils";

describe("currency", () => {
  it("formats dollars", () => {
    expect(currency(1200)).toBe("$1,200.00");
  });

  it("formats the workspace currency", () => {
    expect(currency(1200, "EUR", "en-US")).toBe("€1,200.00");
  });

  it("falls back safely for an invalid currency", () => {
    expect(currency(1200, "INVALID", "en-US")).toBe("$1,200.00");
  });
});
