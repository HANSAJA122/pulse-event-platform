"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import nodemailer from "nodemailer";

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

  // Check capacity if one is set
  if (event.capacity !== null) {
    const currentRsvpsCount = await prisma.rsvp.count({
      where: { 
        eventId: event.id,
        status: { in: ["APPROVED", "PENDING"] }
      }
    });

    if (currentRsvpsCount >= event.capacity) {
      return { error: "Limit reached! This event is at full capacity." };
    }
  }

  // Find the ticket tier if provided, or default to the first free one
  let ticketTier = null;
  if (ticketTierId) {
    ticketTier = await prisma.ticketTier.findUnique({
      where: { id: ticketTierId }
    });
  } else {
    ticketTier = await prisma.ticketTier.findFirst({
      where: { eventId }
    });
  }

  const isPaid = false;

  // Check if they already RSVP'd
  const existingRsvp = await prisma.rsvp.findFirst({
    where: { eventId, guestEmail }
  });

  if (existingRsvp) {
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

  // Send Email with Nodemailer (Gmail)
  try {
    if (!process.env.SMTP_EMAIL || !process.env.SMTP_PASSWORD) {
      console.log("No SMTP credentials set. Email was not sent.");
      return { error: "SMTP credentials not configured. RSVP saved, but email not sent." };
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    const htmlContent = `
      <div style="font-family: sans-serif; max-w: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #111;">You're going to ${event.title}!</h1>
        <p style="color: #666; font-size: 16px;">
          Hi ${guestName}, we're excited to see you. Please present the QR code below at the door.
        </p>
        <div style="text-align: center; margin: 40px 0;">
          <img src="https://quickchart.io/qr?text=${rsvp.id}&size=400" width="200" height="200" alt="Your Ticket QR Code" style="border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.1);" />
          <p style="font-family: monospace; color: #888; margin-top: 10px;">${rsvp.id}</p>
        </div>
        <p style="color: #999; font-size: 12px; text-align: center;">
          Powered by Pulse Event Platform
        </p>
      </div>
    `;

    await transporter.sendMail({
      from: `"Pulse Tickets" <${process.env.SMTP_EMAIL}>`,
      to: guestEmail,
      subject: `Your Ticket to ${event.title}`,
      html: htmlContent,
    });

  } catch (error: any) {
    console.error("Failed to send email:", error);
    return { error: `Failed to send email. Check your SMTP credentials. Error: ${error.message || 'Unknown'}` };
  }

  // Revalidate the public event page
  revalidatePath(`/[locale]/event/[slug]`, 'page');
  
  return { success: true, requiresPayment: false, rsvpId: rsvp.id };
}
