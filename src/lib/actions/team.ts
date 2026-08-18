"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export async function getDefaultTeam() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Not authenticated");

  // See if user owns a team
  let team = await prisma.team.findFirst({
    where: { ownerId: session.user.id },
    include: {
      members: {
        include: { user: true }
      },
      invitations: true
    }
  });

  // If not, create a default team
  if (!team) {
    team = await prisma.team.create({
      data: {
        name: "My Workspace",
        slug: `workspace-${session.user.id.substring(0, 8)}`,
        ownerId: session.user.id
      },
      include: {
        members: { include: { user: true } },
        invitations: true
      }
    });
  }

  return team;
}

export async function inviteMember(teamId: string, email: string, role: "ADMIN" | "COHOST" | "CHECKIN_STAFF") {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Not authenticated");

  // Ensure caller is owner or admin of team
  const team = await prisma.team.findUnique({ where: { id: teamId } });
  if (!team || team.ownerId !== session.user.id) {
    throw new Error("Unauthorized: Only the owner can invite members right now.");
  }

  // Create an invitation token
  const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

  await prisma.teamInvitation.create({
    data: {
      teamId,
      email,
      role,
      token,
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
    }
  });

  // In a real app, send an email to the user with the token link
  // e.g. sendInviteEmail(email, token);

  revalidatePath("/[locale]/dashboard/team", "page");
  return { success: true };
}

export async function removeMember(teamId: string, memberId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Not authenticated");

  // Ensure caller is owner
  const team = await prisma.team.findUnique({ where: { id: teamId } });
  if (!team || team.ownerId !== session.user.id) {
    throw new Error("Unauthorized");
  }

  await prisma.teamMember.delete({
    where: { id: memberId }
  });

  revalidatePath("/[locale]/dashboard/team", "page");
  return { success: true };
}

export async function removeInvitation(id: string) {
  await prisma.teamInvitation.delete({
    where: { id }
  });
  revalidatePath("/[locale]/dashboard/team", "page");
}
