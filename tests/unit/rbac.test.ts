import { beforeEach, describe, expect, it, vi } from "vitest";

const { getSession, connectDb, lean, findOne } = vi.hoisted(() => {
  const getSession = vi.fn();
  const connectDb = vi.fn();
  const lean = vi.fn();
  const findOne = vi.fn(() => ({ lean }));
  return { getSession, connectDb, lean, findOne };
});

vi.mock("@/lib/auth/session", () => ({ getSession }));
vi.mock("@/lib/db", () => ({ connectDb }));
vi.mock("@/models", () => ({ Membership: { findOne } }));

import { requireMembership } from "@/lib/auth/rbac";

describe("workspace authorization", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    getSession.mockResolvedValue({
      user: { id: "user-1", workspaceId: "507f1f77bcf86cd799439011" }
    });
  });

  it("rejects requests without an authenticated workspace", async () => {
    getSession.mockResolvedValue(null);
    await expect(requireMembership()).rejects.toMatchObject({ status: 401 });
    expect(findOne).not.toHaveBeenCalled();
  });

  it("checks both user and workspace membership", async () => {
    lean.mockResolvedValue({
      role: "admin",
      workspaceId: "507f1f77bcf86cd799439011"
    });
    await expect(requireMembership("member")).resolves.toMatchObject({
      role: "admin"
    });
    expect(findOne).toHaveBeenCalledWith({
      userId: "user-1",
      workspaceId: "507f1f77bcf86cd799439011"
    });
  });

  it("enforces the minimum role", async () => {
    lean.mockResolvedValue({
      role: "viewer",
      workspaceId: "507f1f77bcf86cd799439011"
    });
    await expect(requireMembership("member")).rejects.toMatchObject({
      status: 403
    });
  });
});
