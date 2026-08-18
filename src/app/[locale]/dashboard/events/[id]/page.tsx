import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Link } from "@/i18n/routing";
import { Users, QrCode, Settings, Clock, ArrowLeft, CheckCircle2 } from "lucide-react";
import { CopyLinkButton } from "@/components/CopyLinkButton";

export default async function EventDashboard({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  const { id } = await params;

  // Fetch event and RSVPs
  const event = await prisma.event.findUnique({
    where: { id, ownerId: session.user.id },
    include: {
      rsvps: {
        orderBy: { createdAt: 'desc' }
      },
      ticketTiers: true,
    }
  });

  if (!event) {
    redirect("/dashboard");
  }

  const totalRsvps = event.rsvps.length;
  const checkedInCount = event.rsvps.filter(r => r.checkedInAt !== null).length;
  const checkInRate = totalRsvps > 0 ? Math.round((checkedInCount / totalRsvps) * 100) : 0;

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link href="/dashboard" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-display font-bold tracking-tight">{event.title}</h1>
          <div className="flex items-center gap-3 text-pulse-text-muted text-sm mt-1">
            <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> {new Date(event.startAt).toLocaleDateString()}</span>
            <span className="w-1 h-1 rounded-full bg-white/20" />
            <span className="flex items-center gap-1.5 capitalize">{event.status.toLowerCase()}</span>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-4">
        <Link 
          href={`/dashboard/events/${event.id}/scan`}
          className="px-6 py-3 rounded-xl bg-aurora-gradient text-white font-bold shadow-[0_0_20px_rgba(249,203,40,0.2)] hover:shadow-[0_0_30px_rgba(255,77,77,0.4)] transition-all flex items-center gap-2 transform hover:scale-105 active:scale-95"
        >
          <QrCode className="w-5 h-5" />
          Launch Scanner
        </Link>
        
        <Link 
          href={`/dashboard/events/${event.id}/edit`}
          className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-bold hover:bg-white/10 transition-colors flex items-center gap-2"
        >
          <Settings className="w-5 h-5" />
          Edit Details
        </Link>
        
        <Link 
          href={`/event/${event.slug}`}
          target="_blank"
          className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-bold hover:bg-white/10 transition-colors flex items-center gap-2"
        >
          View Public Page
        </Link>
        
        <CopyLinkButton urlPath={`/en/event/${event.slug}`} />
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-panel rounded-3xl p-6">
          <div className="flex items-center gap-3 mb-2 text-pulse-cyan">
            <Users className="w-5 h-5" />
            <h3 className="font-bold text-sm uppercase tracking-widest">Total RSVPs</h3>
          </div>
          <div className="text-5xl font-display font-bold">{totalRsvps}</div>
        </div>
        
        <div className="glass-panel rounded-3xl p-6">
          <div className="flex items-center gap-3 mb-2 text-green-400">
            <CheckCircle2 className="w-5 h-5" />
            <h3 className="font-bold text-sm uppercase tracking-widest">Checked In</h3>
          </div>
          <div className="text-5xl font-display font-bold">{checkedInCount}</div>
        </div>
        
        <div className="glass-panel rounded-3xl p-6">
          <div className="flex items-center gap-3 mb-2 text-[#F9CB28]">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
            <h3 className="font-bold text-sm uppercase tracking-widest">Check-in Rate</h3>
          </div>
          <div className="text-5xl font-display font-bold">{checkInRate}%</div>
        </div>
      </div>

      {/* Recent RSVPs */}
      <div className="glass-panel rounded-3xl overflow-hidden">
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <h2 className="text-xl font-bold">Recent Registrations</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-white/5 text-pulse-text-muted text-xs uppercase tracking-widest">
              <tr>
                <th className="px-6 py-4 font-bold">Name</th>
                <th className="px-6 py-4 font-bold">Email</th>
                <th className="px-6 py-4 font-bold">Status</th>
                <th className="px-6 py-4 font-bold">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {event.rsvps.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-pulse-text-muted">
                    No registrations yet.
                  </td>
                </tr>
              ) : (
                event.rsvps.slice(0, 20).map(rsvp => (
                  <tr key={rsvp.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 font-medium">{rsvp.guestName}</td>
                    <td className="px-6 py-4 text-pulse-text-muted">{rsvp.guestEmail}</td>
                    <td className="px-6 py-4">
                      {rsvp.checkedInAt ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-green-500/20 text-green-400 text-xs font-bold">
                          <CheckCircle2 className="w-3 h-3" /> Checked In
                        </span>
                      ) : rsvp.status === "WAITLISTED" ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#F9CB28]/20 text-[#F9CB28] text-xs font-bold">
                          Waitlisted
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/10 text-white/70 text-xs font-bold">
                          Registered
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-pulse-text-muted">
                      {new Date(rsvp.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
