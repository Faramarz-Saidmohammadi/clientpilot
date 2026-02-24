import { NextResponse } from "next/server";
import { registerUser } from "@/actions/team";
import { rateLimit } from "@/lib/rate-limit";

export async function POST(req: Request) {
  try {
    const ip = req.headers.get("x-forwarded-for") || "local";
    const limited = rateLimit(`register:${ip}`, 10, 60_000);
    if (!limited.ok) return NextResponse.json({ ok: false, error: "Too many requests" }, { status: 429 });

    const body = await req.json();
    await registerUser(body);
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ ok: false, error: e instanceof Error ? e.message : "Failed" }, { status: 400 });
  }
}
