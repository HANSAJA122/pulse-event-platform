"use server";

import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

export async function createCheckoutSession(rsvpId: string) {
  // 1. Fetch RSVP and related TicketTier
  const rsvp = await prisma.rsvp.findUnique({
    where: { id: rsvpId },
    include: { ticketTier: true, event: true }
  });

  if (!rsvp || !rsvp.ticketTier) {
    throw new Error("Invalid RSVP or free ticket");
  }

  if (rsvp.status === "APPROVED") {
    // Already paid/approved
    redirect(`/en/event/${rsvp.event.slug}/success?rsvpId=${rsvp.id}`);
  }

  // 2. Determine base URL for success/cancel redirects
  const headersList = await headers();
  const host = headersList.get("host") || "localhost:3000";
  const protocol = host.includes("localhost") ? "http" : "https";
  const baseUrl = `${protocol}://${host}`;

  // 3. Create Stripe Checkout Session
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      success_url: `${baseUrl}/en/event/${rsvp.event.slug}/success?rsvpId=${rsvp.id}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/en/event/${rsvp.event.slug}`,
      customer_email: rsvp.guestEmail,
      client_reference_id: rsvp.id,
      metadata: {
        rsvpId: rsvp.id,
        eventId: rsvp.eventId,
      },
      line_items: [
        {
          price_data: {
            currency: rsvp.ticketTier.currency.toLowerCase(),
            product_data: {
              name: `${rsvp.event.title} - ${rsvp.ticketTier.name}`,
              description: `Ticket for ${rsvp.guestName}`,
              images: rsvp.event.coverImageUrl ? [rsvp.event.coverImageUrl] : undefined,
            },
            unit_amount: rsvp.ticketTier.priceCents,
          },
          quantity: 1,
        },
      ],
    });

    if (!session.url) {
      throw new Error("Failed to create Stripe session URL");
    }

    // 4. Save session ID to RSVP
    await prisma.rsvp.update({
      where: { id: rsvp.id },
      data: { stripeSessionId: session.id }
    });

    // 5. Redirect user to Stripe
    redirect(session.url);
  } catch (error: any) {
    console.error("Stripe Checkout Error:", error);
    // If redirect was thrown, re-throw it so Next.js handles it
    if (error.message === "NEXT_REDIRECT") {
      throw error;
    }
    throw new Error("Failed to initialize payment");
  }
}
