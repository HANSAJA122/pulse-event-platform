"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import nodemailer from "nodemailer";
import { generateGoogleWalletLink } from "@/lib/wallet";

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
  let isWaitlisted = false;
  if (event.capacity !== null) {
    const currentRsvpsCount = await prisma.rsvp.count({
      where: { 
        eventId: event.id,
        status: { in: ["APPROVED", "PENDING"] }
      }
    });

    if (currentRsvpsCount >= event.capacity) {
      isWaitlisted = true;
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
       return { success: true, requiresPayment: true, rsvpId: existingRsvp.id, status: existingRsvp.status };
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
      status: isWaitlisted ? "WAITLISTED" : (isPaid ? "PENDING" : "APPROVED") 
    }
  });

  if (isPaid && !isWaitlisted) {
    return { success: true, requiresPayment: true, rsvpId: rsvp.id, status: rsvp.status };
  }

  // Send Email with Nodemailer (Gmail)
  try {
    if (!process.env.SMTP_EMAIL || !process.env.SMTP_PASSWORD) {
      console.log("No SMTP credentials set. Email was not sent.");
      return { error: "SMTP credentials not configured. RSVP saved, but email not sent.", status: rsvp.status };
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    const googleWalletLink = generateGoogleWalletLink(
      { title: event.title, startAt: event.startAt, locationType: event.locationType },
      { id: rsvp.id, guestName: rsvp.guestName }
    );

    let htmlContent = "";
    let subject = "";

    if (isWaitlisted) {
      subject = `Waitlist Confirmation for ${event.title}`;
      htmlContent = `
        <div style="font-family: sans-serif; max-w: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #111;">You're on the waitlist!</h1>
          <p style="color: #666; font-size: 16px;">
            Hi ${guestName}, this event is currently at full capacity, but we've added you to the waitlist.
          </p>
          <p style="color: #666; font-size: 16px;">
            If a spot opens up, we will notify you immediately. Hang tight!
          </p>
          <p style="color: #999; font-size: 12px; text-align: center; margin-top: 40px;">
            Powered by Pulse Event Platform
          </p>
        </div>
      `;
    } else {
      subject = `Your Ticket to ${event.title}`;
      const walletBadgeHtml = googleWalletLink ? `
        <div style="margin-top: 20px;">
          <a href="${googleWalletLink}" target="_blank">
            <img src="https://wallet.google/images/assets/en_US/google-wallet-badge.png" alt="Add to Google Wallet" height="48" />
          </a>
        </div>
      ` : "";

      htmlContent = `
        <div style="font-family: sans-serif; max-w: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #111;">You're going to ${event.title}!</h1>
          <p style="color: #666; font-size: 16px;">
            Hi ${guestName}, we're excited to see you. Please present the QR code below at the door.
          </p>
          <div style="text-align: center; margin: 40px 0;">
            <img src="https://quickchart.io/qr?text=${rsvp.id}&size=400" width="200" height="200" alt="Your Ticket QR Code" style="border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.1);" />
            <p style="font-family: monospace; color: #888; margin-top: 10px;">${rsvp.id}</p>
            ${walletBadgeHtml}
          </div>
          <p style="color: #999; font-size: 12px; text-align: center;">
            Powered by Pulse Event Platform
          </p>
        </div>
      `;
    }

    await transporter.sendMail({
      from: `"Pulse Tickets" <${process.env.SMTP_EMAIL}>`,
      to: guestEmail,
      subject: subject,
      html: htmlContent,
    });

  } catch (error: any) {
    console.error("Failed to send email:", error);
    return { error: `Failed to send email. Check your SMTP credentials. Error: ${error.message || 'Unknown'}`, status: rsvp.status };
  }

  // Revalidate the public event page
  revalidatePath(`/[locale]/event/[slug]`, 'page');
  
  return { success: true, requiresPayment: false, rsvpId: rsvp.id, status: rsvp.status };
}
