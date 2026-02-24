import Stripe from "stripe";

export function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("Missing STRIPE_SECRET_KEY");
  return new Stripe(key, { apiVersion: "2026-01-28.clover" });
}

export const STRIPE_PRICE_IDS = {
  free: process.env.STRIPE_PRICE_FREE || "",
  pro: process.env.STRIPE_PRICE_PRO || ""
};
