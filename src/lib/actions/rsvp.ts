"use server";

import { prisma } from "@/lib/prisma";
import { Resend } from "resend";
import QRCode from "qrcode";
import { revalidatePath } from "next/cache";

const resend = new Resend(process.env.RESEND_API_KEY || "re_mock_key_123");

export async function submitRsvp(eventId: string, formData: FormData) {
  const guestName = formData.get("guestName") as string;
  const guestEmail = formData.get("guestEmail") as string;
  const ticketTierId = formData.get("ticketTierId") as string | null;

  if (!guestName || !guestEmail) {
    return { error: "Name and email are required" };
  }

  // Find the event
  const event = await prisma.event.findUnique({
    where: { id: eventId }
  });

  if (!event) {
    return { error: "Event not found" };
  }

  // Find the ticket tier if provided, or default to the first free one
  let ticketTier = null;
  if (ticketTierId) {
    ticketTier = await prisma.ticketTier.findUnique({
      where: { id: ticketTierId }
    });
  } else {
    // Just find any ticket tier (useful if we haven't built ticket management yet)
    ticketTier = await prisma.ticketTier.findFirst({
      where: { eventId }
    });
  }

  // Force isPaid to false for testing
  const isPaid = false;

  // Check if they already RSVP'd
  const existingRsvp = await prisma.rsvp.findFirst({
    where: { eventId, guestEmail }
  });

  if (existingRsvp) {
    // If they have a pending paid RSVP, let them pay
    if (existingRsvp.status === "PENDING" && existingRsvp.ticketTierId) {
       return { success: true, requiresPayment: true, rsvpId: existingRsvp.id };
    }
    return { error: "You have already RSVP'd to this event!" };
  }

  // Create RSVP
  const rsvp = await prisma.rsvp.create({
    data: {
      eventId,
      guestName,
      guestEmail,
      ticketTierId: ticketTier?.id,
      status: isPaid ? "PENDING" : "APPROVED" 
    }
  });

  if (isPaid) {
    return { success: true, requiresPayment: true, rsvpId: rsvp.id };
  }

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
      const emailRes = await resend.emails.send({
        from: 'Pulse Tickets <onboarding@resend.dev>', // Resend's default testing email
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
      });
      
      // If Resend returns an error in the payload
      if (emailRes.error) {
        return { error: `Email failed to send: ${emailRes.error.message}` };
      }
    }
  } catch (error: any) {
    console.error("Failed to send email:", error);
    return { error: `Failed to send email. Check your Resend API Key or domain verification. Error: ${error.message || 'Unknown'}` };
  }

  // Revalidate the public event page
  revalidatePath(`/[locale]/event/[slug]`, 'page');
  
  return { success: true, requiresPayment: false, rsvpId: rsvp.id };
}
