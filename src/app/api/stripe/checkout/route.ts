import { NextResponse } from "next/server";
import { getStripe, STRIPE_PRICE_IDS } from "@/lib/billing/stripe";
import { connectDb } from "@/lib/db";
import { Subscription } from "@/models";
import { getWorkspaceContext } from "@/lib/workspace";
import { errorResponse, HttpError } from "@/lib/http";
import { rateLimit } from "@/lib/rate-limit";

export async function POST() {
  try {
    const ctx = await getWorkspaceContext("admin");
    if (!STRIPE_PRICE_IDS.pro)
      throw new HttpError(503, "Billing is not configured");
    const limited = rateLimit(
      `checkout:${ctx.workspaceId}:${ctx.userId}`,
      10,
      60_000
    );
    if (!limited.ok) throw new HttpError(429, "Too many checkout requests");

    await connectDb();
    const sub = await Subscription.findOne({
      workspaceId: ctx.workspaceId
    }).lean();
    const stripe = getStripe();

    const appUrl = process.env.NEXT_PUBLIC_APP_URL;
    if (!appUrl) throw new HttpError(503, "Application URL is not configured");

    const checkout = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price: STRIPE_PRICE_IDS.pro, quantity: 1 }],
      customer: sub?.stripeCustomerId || undefined,
      success_url: `${appUrl}/en/app/billing?success=1`,
      cancel_url: `${appUrl}/en/app/billing?cancel=1`,
      metadata: { workspaceId: ctx.workspaceId }
    });

    return NextResponse.json({ url: checkout.url });
  } catch (error) {
    return errorResponse(error, "Could not start checkout");
  }
}
