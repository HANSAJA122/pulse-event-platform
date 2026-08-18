import { Link } from "@/i18n/routing";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function DashboardIndex() {
  const session = await auth();
  
  // Since we don't have a live DB connection in this dev phase, 
  // we'll mock the events list if the query fails.
  let events: any[] = [];
  
  if (session?.user?.id) {
    try {
      events = await prisma.event.findMany({
        where: { ownerId: session.user.id },
        orderBy: { startAt: 'asc' }
      });
    } catch (e) {
      // Mock data fallback
      events = [
        {
          id: "1",
          slug: "frontend-founders",
          title: "Frontend Founders Meetup",
          startAt: new Date(Date.now() + 86400000 * 5),
          status: "PUBLISHED"
        }
      ];
    }
  } else {
    // If no session, we might want to redirect, but for dev we'll just mock
    events = [
      {
        id: "1",
        slug: "frontend-founders",
        title: "Frontend Founders Meetup (Mock)",
        startAt: new Date(Date.now() + 86400000 * 5),
        status: "PUBLISHED"
      }
    ];
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-display font-bold">Your Events</h1>
        <Link 
          href="/dashboard/events/new" 
          className="px-6 py-3 rounded-xl bg-pulse-gradient text-pulse-bg font-bold shadow-[0_0_20px_rgba(94,234,212,0.15)] hover:shadow-[0_0_30px_rgba(94,234,212,0.3)] transition-all"
        >
          Create Event
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {events.length === 0 ? (
          <div className="col-span-full border border-dashed border-pulse-slate/50 rounded-2xl p-12 text-center text-pulse-text/50">
            You haven't created any events yet.
          </div>
        ) : (
          events.map((event) => (
            <Link 
              key={event.id}
              href={`/dashboard/events/${event.id}/edit`} 
              className="group border border-pulse-slate/50 bg-pulse-slate/10 rounded-2xl p-6 hover:border-pulse-cyan/50 hover:bg-pulse-slate/20 transition-all block relative overflow-hidden"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="px-3 py-1 rounded-md bg-pulse-bg border border-pulse-slate text-xs font-mono">
                  {new Date(event.startAt).toLocaleDateString()}
                </div>
                {event.status === 'PUBLISHED' && (
                  <div className="text-pulse-cyan text-xs font-bold uppercase tracking-wider flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-pulse-cyan animate-pulse-wave" />
                    Live
                  </div>
                )}
              </div>
              <h3 className="text-xl font-bold font-display mb-2">{event.title}</h3>
              <p className="text-pulse-text/50 text-sm mt-4">Click to edit or manage guests →</p>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
