import { NextResponse } from "next/server";
import { registerUser } from "@/actions/team";
import { rateLimit } from "@/lib/rate-limit";

export async function POST(req: Request) {
  try {
    const contentLength = Number(req.headers.get("content-length") || 0);
    if (contentLength > 16_384) {
      return NextResponse.json(
        { ok: false, error: "Request too large" },
        { status: 413 }
      );
    }

    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
    const limited = rateLimit(`register:${ip}`, 10, 60_000);
    if (!limited.ok)
      return NextResponse.json(
        { ok: false, error: "Too many requests" },
        { status: 429 }
      );

    const body = await req.json();
    await registerUser(body);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Registration failed" },
      { status: 400 }
    );
  }
}
