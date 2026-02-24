import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getStripe } from "@/lib/billing/stripe";
import { connectDb } from "@/lib/db";
import { Subscription } from "@/models";

export async function POST(req: Request) {
  const sig = req.headers.get("stripe-signature");
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!sig || !secret) return NextResponse.json({ error: "Missing webhook secret" }, { status: 400 });

  const body = await req.text();
  let event: Stripe.Event;
  try {
    const stripe = getStripe();
    event = stripe.webhooks.constructEvent(body, sig, secret);
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  await connectDb();

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const workspaceId = session.metadata?.workspaceId;
    if (workspaceId) {
      await Subscription.updateOne(
        { workspaceId },
        {
          stripeCustomerId: String(session.customer || ""),
          stripeSubId: String(session.subscription || ""),
          plan: "pro",
          status: "active"
        },
        { upsert: true }
      );
    }
  }

  if (event.type === "customer.subscription.deleted") {
    const sub = event.data.object as Stripe.Subscription;
    await Subscription.updateOne({ stripeSubId: sub.id }, { plan: "free", status: "canceled" });
  }

  return NextResponse.json({ received: true });
}
