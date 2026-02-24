import { NextResponse } from "next/server";
import { getStripe, STRIPE_PRICE_IDS } from "@/lib/billing/stripe";
import { getSession } from "@/lib/auth/session";
import { connectDb } from "@/lib/db";
import { Membership, Subscription } from "@/models";

export async function POST() {
  const session = await getSession();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectDb();
  const membership = await Membership.findOne({ userId: session.user.id }).lean();
  if (!membership) return NextResponse.json({ error: "No workspace" }, { status: 400 });

  const sub = await Subscription.findOne({ workspaceId: membership.workspaceId }).lean();
  const stripe = getStripe();

  const checkout = await stripe.checkout.sessions.create({
    mode: "subscription",
    line_items: [{ price: STRIPE_PRICE_IDS.pro, quantity: 1 }],
    customer: sub?.stripeCustomerId,
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/en/app/billing?success=1`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/en/app/billing?cancel=1`,
    metadata: { workspaceId: String(membership.workspaceId) }
  });

  return NextResponse.json({ url: checkout.url });
}
