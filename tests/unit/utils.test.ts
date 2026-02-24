import { describe, expect, it } from "vitest";
import { currency } from "@/lib/utils";

describe("currency", () => {
  it("formats dollars", () => {
    expect(currency(1200)).toBe("$1,200.00");
  });
});
