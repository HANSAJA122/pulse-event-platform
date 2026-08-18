"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export async function checkInGuest(rsvpId: string, eventId: string) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Unauthorized" };
  }

  // Verify the user owns this event
  const event = await prisma.event.findUnique({
    where: { id: eventId, ownerId: session.user.id }
  });

  if (!event) {
    return { error: "Event not found or unauthorized" };
  }

  // Find the RSVP
  const rsvp = await prisma.rsvp.findUnique({
    where: { id: rsvpId, eventId }
  });

  if (!rsvp) {
    return { error: "Invalid ticket for this event!" };
  }

  if (rsvp.checkedInAt) {
    return { 
      error: `Ticket already used! Checked in on ${new Date(rsvp.checkedInAt).toLocaleString()}` 
    };
  }

  // Check in the guest
  await prisma.rsvp.update({
    where: { id: rsvpId },
    data: { 
      checkedInAt: new Date(),
      checkedInOffline: true // Just a flag if we want it
    }
  });

  // Revalidate the dashboard
  revalidatePath(`/dashboard/events/${eventId}`);

  return { success: true, guestName: rsvp.guestName };
}
