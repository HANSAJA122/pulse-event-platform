"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { LocationType } from "@prisma/client";

export async function createEvent(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const startAt = new Date(formData.get("startAt") as string);
  const endAt = new Date(formData.get("endAt") as string);
  const locationType = formData.get("locationType") as LocationType;

  // Generate a basic slug
  const baseSlug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  const randomSuffix = Math.random().toString(36).substring(2, 8);
  const slug = `${baseSlug}-${randomSuffix}`;

  const event = await prisma.event.create({
    data: {
      title,
      description,
      slug,
      startAt,
      endAt,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone, // Default to server timezone for now
      locationType,
      ownerId: session.user.id,
      status: "PUBLISHED" // Default to published so they see it immediately for testing
    }
  });

  revalidatePath("/dashboard");
  redirect(`/dashboard/events/${event.id}/edit`);
}

export async function updateEvent(eventId: string, formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const startAt = new Date(formData.get("startAt") as string);
  const endAt = new Date(formData.get("endAt") as string);

  await prisma.event.update({
    where: { id: eventId },
    data: {
      title,
      description,
      startAt,
      endAt,
    }
  });

  revalidatePath(`/dashboard/events/${eventId}/edit`);
  revalidatePath("/dashboard");
}
