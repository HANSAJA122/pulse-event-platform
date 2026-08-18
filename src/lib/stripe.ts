import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_mock", {
  // @ts-ignore - Stripe version mismatch in type definitions
  apiVersion: "2023-10-16",
});
