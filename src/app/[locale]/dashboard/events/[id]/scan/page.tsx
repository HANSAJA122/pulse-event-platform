import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import ScannerClient from "./ScannerClient";

export default async function ScanPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  const { id } = await params;

  // Verify the user owns this event
  const event = await prisma.event.findUnique({
    where: { id, ownerId: session.user.id }
  });

  if (!event) {
    redirect("/dashboard");
  }

  return (
    <div className="pt-8 pb-24">
      <ScannerClient eventId={event.id} eventTitle={event.title} />
    </div>
  );
}
