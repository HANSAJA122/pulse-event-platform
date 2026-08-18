import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import Stripe from "stripe";



export async function POST(req: Request) {
  const body = await req.text();
  const headersList = await headers();
  const signature = headersList.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "No signature" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || "mock_webhook_secret";
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (error: any) {
    console.error(`Webhook Error: ${error.message}`);
    return NextResponse.json({ error: `Webhook Error: ${error.message}` }, { status: 400 });
  }

  // Handle the checkout.session.completed event
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    
    // Retrieve the rsvpId from metadata
    const rsvpId = session.metadata?.rsvpId;

    if (rsvpId) {
      try {
        // Mark RSVP as approved
        await prisma.rsvp.update({
          where: { id: rsvpId },
          data: { status: "APPROVED" }
        });

        // Here we could trigger the Resend email with the QR code.
        // For now, it's simulated in the checkin action, but in a real app
        // we'd dispatch an email service function here.
        console.log(`[Stripe Webhook] Marked RSVP ${rsvpId} as APPROVED!`);

      } catch (err) {
        console.error(`Error updating RSVP ${rsvpId}:`, err);
        return NextResponse.json({ error: "Failed to update DB" }, { status: 500 });
      }
    }
  }

  return NextResponse.json({ received: true });
}
