import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { connectDb } from "@/lib/db";
import { Membership, User } from "@/models";
import { rateLimit } from "@/lib/rate-limit";

const credentialsSchema = z.object({
  email: z.email(),
  password: z.string().min(8)
});

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  pages: {
    signIn: "/en/login"
  },
  providers: [
    CredentialsProvider({
      name: "Email/Password",
      credentials: { email: {}, password: {} },
      async authorize(credentials) {
        const parsed = credentialsSchema.safeParse(credentials);
        if (!parsed.success) return null;

        const limited = rateLimit(`login:${parsed.data.email.toLowerCase()}`, 10, 60_000);
        if (!limited.ok) return null;

        await connectDb();
        const user = await User.findOne({ email: parsed.data.email.toLowerCase() }).lean();
        if (!user || !user.passwordHash) return null;
        const ok = await bcrypt.compare(parsed.data.password, user.passwordHash);
        if (!ok) return null;
        return { id: String(user._id), email: user.email, name: user.name || undefined, image: user.image || undefined };
      }
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || ""
    })
  ],
  callbacks: {
    async signIn({ user }) {
      await connectDb();
      const existing = await User.findOne({ email: user.email }).lean();
      if (!existing) {
        await User.create({ email: user.email, name: user.name, image: user.image, emailVerified: new Date() });
      }
      return true;
    },
    async jwt({ token }) {
      if (!token.email) return token;
      await connectDb();
      const user = await User.findOne({ email: token.email }).lean();
      if (!user) return token;
      token.sub = String(user._id);
      const membership = await Membership.findOne({ userId: user._id }).lean();
      if (membership) {
        token.workspaceId = String(membership.workspaceId);
        token.role = membership.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub || "";
        session.user.workspaceId = token.workspaceId;
        session.user.role = token.role;
      }
      return session;
    }
  },
  secret: process.env.AUTH_SECRET
};
