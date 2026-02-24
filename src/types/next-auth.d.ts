import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      workspaceId?: string;
      role?: "owner" | "admin" | "member" | "viewer";
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    workspaceId?: string;
    role?: "owner" | "admin" | "member" | "viewer";
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    workspaceId?: string;
    role?: "owner" | "admin" | "member" | "viewer";
  }
}
