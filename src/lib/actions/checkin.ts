"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function checkinGuest(eventId: string, rsvpId: string) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized: Must be logged in to check-in guests.");
  }

  // 1. Verify the RSVP exists and belongs to this event
  const rsvp = await prisma.rsvp.findUnique({
    where: { id: rsvpId }
  });

  if (!rsvp) {
    throw new Error("Invalid Ticket: Ticket not found in the database.");
  }

  if (rsvp.eventId !== eventId) {
    throw new Error("Invalid Ticket: This ticket is for a different event.");
  }

  // 2. Verify they aren't already checked in
  if (rsvp.checkedInAt) {
    // Format the time they checked in
    const time = new Date(rsvp.checkedInAt).toLocaleTimeString();
    throw new Error(`Already Checked In at ${time}`);
  }

  // 3. Mark as checked in
  await prisma.rsvp.update({
    where: { id: rsvpId },
    data: { 
      checkedInAt: new Date(),
      checkedInOffline: false
    }
  });

  // 4. Log the scan (optional auditing)
  await prisma.checkinLog.create({
    data: {
      rsvpId,
      deviceId: "web-scanner",
      timestamp: new Date()
    }
  });

  return { 
    success: true, 
    guestName: rsvp.guestName,
    guestEmail: rsvp.guestEmail
  };
}
