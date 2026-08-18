import { Link } from "@/i18n/routing";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Calendar, Plus, ChevronRight } from "lucide-react";

export default async function DashboardIndex() {
  const session = await auth();
  
  if (!session?.user?.id) {
    redirect("/login");
  }

  let events: any[] = [];
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

  return (
    <div className="max-w-6xl mx-auto space-y-12">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-display font-bold tracking-tight">Events</h1>
          <p className="text-pulse-text-muted mt-2">Manage your upcoming and past events.</p>
        </div>
        
        <Link 
          href="/dashboard/events/new" 
          className="px-6 py-3 rounded-xl bg-aurora-gradient text-white font-bold shadow-[0_0_30px_rgba(249,203,40,0.3)] hover:shadow-[0_0_40px_rgba(255,77,77,0.5)] transition-all flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Create Event
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.length === 0 ? (
          <div className="col-span-full glass-panel rounded-3xl p-12 text-center flex flex-col items-center justify-center">
            <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-4">
              <Calendar className="w-8 h-8 text-white/40" />
            </div>
            <h3 className="text-xl font-bold mb-2">No events yet</h3>
            <p className="text-pulse-text-muted">Create your first event to get started.</p>
          </div>
        ) : (
          events.map((event) => (
            <Link 
              key={event.id}
              href={`/dashboard/events/${event.id}`} 
              className="group glass-panel-interactive rounded-3xl p-6 flex flex-col h-64"
            >
              <div className="flex justify-between items-start mb-auto">
                <div className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs font-mono text-pulse-text-muted">
                  {new Date(event.startAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                </div>
                {event.status === 'PUBLISHED' && (
                  <div className="text-[#F9CB28] text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 px-2 py-1 rounded-full bg-[#F9CB28]/10 border border-[#F9CB28]/20">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#F9CB28] shadow-[0_0_8px_#F9CB28]" />
                    Live
                  </div>
                )}
              </div>
              
              <div className="mt-6">
                <h3 className="text-2xl font-bold font-display tracking-tight mb-2 group-hover:text-aurora-gradient transition-all">{event.title}</h3>
                <div className="flex items-center text-pulse-text-muted text-sm group-hover:text-white transition-colors">
                  Manage event <ChevronRight className="w-4 h-4 ml-1 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
