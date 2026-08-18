"use server";

import { prisma } from "@/lib/prisma";
import { Resend } from "resend";
import QRCode from "qrcode";
import { revalidatePath } from "next/cache";

const resend = new Resend(process.env.RESEND_API_KEY || "re_mock_key_123");

export async function submitRsvp(eventId: string, formData: FormData) {
  const guestName = formData.get("guestName") as string;
  const guestEmail = formData.get("guestEmail") as string;

  if (!guestName || !guestEmail) {
    throw new Error("Name and email are required");
  }

  // Find the event
  const event = await prisma.event.findUnique({
    where: { id: eventId }
  });

  if (!event) {
    throw new Error("Event not found");
  }

  // Check if they already RSVP'd
  const existingRsvp = await prisma.rsvp.findFirst({
    where: { eventId, guestEmail }
  });

  if (existingRsvp) {
    throw new Error("You have already RSVP'd to this event!");
  }

  // Create RSVP
  const rsvp = await prisma.rsvp.create({
    data: {
      eventId,
      guestName,
      guestEmail,
      status: "APPROVED" // Auto-approve for free events
    }
  });

  // Generate Ticket QR Code
  // The QR code contains the secure RSVP ID for the scanner to verify
  const qrCodeDataUrl = await QRCode.toDataURL(rsvp.id, {
    width: 400,
    margin: 2,
    color: {
      dark: '#000000',
      light: '#ffffff'
    }
  });

  // Send Email with Resend
  // If the user hasn't set RESEND_API_KEY, this will fail gracefully
  try {
    if (!process.env.RESEND_API_KEY) {
      console.log("No RESEND_API_KEY set. Mocking email send...");
      console.log(`Mock Email sent to: ${guestEmail}`);
      console.log(`QR Code generated for RSVP ID: ${rsvp.id}`);
    } else {
      await resend.emails.send({
        from: 'Pulse Tickets <tickets@pulse.dev>', // Needs a verified domain in Resend
        to: guestEmail,
        subject: `Your Ticket to ${event.title}`,
        html: `
          <div style="font-family: sans-serif; max-w: 600px; margin: 0 auto; padding: 20px;">
            <h1 style="color: #111;">You're going to ${event.title}!</h1>
            <p style="color: #666; font-size: 16px;">
              Hi ${guestName}, we're excited to see you. Please present the QR code below at the door.
            </p>
            <div style="text-align: center; margin: 40px 0;">
              <img src="${qrCodeDataUrl}" alt="Your Ticket QR Code" style="border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.1);" />
              <p style="font-family: monospace; color: #888; margin-top: 10px;">${rsvp.id}</p>
            </div>
            <p style="color: #999; font-size: 12px; text-align: center;">
              Powered by Pulse Event Platform
            </p>
          </div>
        `
      });
    }
  } catch (error) {
    console.error("Failed to send email. Ensure you have a valid RESEND_API_KEY and verified domain.", error);
    // We don't throw here because we still want the user to know their RSVP succeeded
  }

  // Revalidate the public event page
  revalidatePath(`/[locale]/event/[slug]`, 'page');
  
  return { success: true, rsvpId: rsvp.id };
}
