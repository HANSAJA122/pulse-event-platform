import { notFound } from "next/navigation";
import { Link } from "@/i18n/routing";
import { prisma } from "@/lib/prisma";
import { updateEvent } from "@/lib/actions/event";
import { CopyLinkButton } from "@/components/dashboard/CopyLinkButton";

export default async function EditEventPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  
  const event = await prisma.event.findUnique({
    where: { id }
  });

  if (!event) {
    notFound();
  }

  const updateWithId = updateEvent.bind(null, event.id);

  // Helper to format Date for datetime-local input
  const formatForInput = (d: Date) => {
    return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
  };

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-8">
      <div>
        <Link href="/dashboard" className="text-pulse-text-muted hover:text-white transition-colors text-sm font-medium mb-4 inline-block">
          &larr; Back to Events
        </Link>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h1 className="text-4xl font-display font-bold tracking-tight">Edit Event</h1>
          <div className="flex items-center gap-3">
            <Link 
              href={`/event/${event.slug}`} 
              target="_blank" 
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium transition-colors flex items-center gap-2 text-sm border border-white/10"
            >
              View Public Page
            </Link>
            <CopyLinkButton slug={event.slug} />
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 flex flex-col gap-8">
          {/* Basics Form */}
          <section className="glass-panel p-6 md:p-8 rounded-3xl">
            <h2 className="text-xl font-bold font-display mb-6">Basics</h2>
            <form action={updateWithId} className="flex flex-col gap-6">
              <div className="flex flex-col gap-3">
                <label className="font-bold text-white tracking-tight">Event Title</label>
                <input 
                  type="text" 
                  name="title"
                  defaultValue={event.title}
                  required
                  className="w-full py-3 px-4 rounded-xl bg-black/50 border border-white/10 focus:outline-none focus:border-white/30 transition-colors text-white/90"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-3">
                  <label className="font-bold text-white tracking-tight">Start Date & Time</label>
                  <input 
                    type="datetime-local" 
                    name="startAt"
                    defaultValue={formatForInput(event.startAt)}
                    required
                    className="w-full py-3 px-4 rounded-xl bg-black/50 border border-white/10 focus:outline-none focus:border-white/30 transition-colors text-white/90"
                  />
                </div>
                <div className="flex flex-col gap-3">
                  <label className="font-bold text-white tracking-tight">End Date & Time</label>
                  <input 
                    type="datetime-local" 
                    name="endAt"
                    defaultValue={formatForInput(event.endAt)}
                    required
                    className="w-full py-3 px-4 rounded-xl bg-black/50 border border-white/10 focus:outline-none focus:border-white/30 transition-colors text-white/90"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <label className="font-bold text-white tracking-tight">Description</label>
                <textarea 
                  name="description"
                  rows={5}
                  defaultValue={event.description || ""}
                  className="w-full py-3 px-4 rounded-xl bg-black/50 border border-white/10 focus:outline-none focus:border-white/30 transition-colors resize-none text-white/90 placeholder:text-white/20"
                />
              </div>
              
              <div className="pt-6 mt-2 border-t border-white/10 flex justify-end">
                <button type="submit" className="px-8 py-3 rounded-xl bg-white text-black hover:bg-gray-200 transition-colors font-bold shadow-lg">
                  Save Changes
                </button>
              </div>
            </form>
          </section>
        </div>

        {/* Sidebar settings */}
        <div className="flex flex-col gap-4">
           <Link href={`/dashboard/events/${id}/form`} className="p-5 border border-white/10 bg-white/5 rounded-2xl hover:bg-white/10 transition-all flex justify-between items-center group">
            <div>
              <h3 className="font-bold">Registration Form</h3>
              <p className="text-sm text-pulse-text-muted">Custom questions</p>
            </div>
            <span className="text-white/50 group-hover:text-white group-hover:translate-x-1 transition-all">&rarr;</span>
          </Link>

           <Link href={`/dashboard/events/${id}/schedule`} className="p-5 border border-white/10 bg-white/5 rounded-2xl hover:bg-white/10 transition-all flex justify-between items-center group">
            <div>
              <h3 className="font-bold">Event Schedule</h3>
              <p className="text-sm text-pulse-text-muted">Agenda & tracks</p>
            </div>
            <span className="text-white/50 group-hover:text-white group-hover:translate-x-1 transition-all">&rarr;</span>
          </Link>

           <Link href={`/dashboard/events/${id}/sponsors`} className="p-5 border border-white/10 bg-white/5 rounded-2xl hover:bg-white/10 transition-all flex justify-between items-center group">
            <div>
              <h3 className="font-bold">Sponsors</h3>
              <p className="text-sm text-pulse-text-muted">Manage partners</p>
            </div>
            <span className="text-white/50 group-hover:text-white group-hover:translate-x-1 transition-all">&rarr;</span>
          </Link>

           <Link href={`/dashboard/events/${id}/analytics`} className="p-5 border border-white/10 bg-white/5 rounded-2xl hover:bg-white/10 transition-all flex justify-between items-center group">
            <div>
              <h3 className="font-bold">Analytics</h3>
              <p className="text-sm text-pulse-text-muted">Views & sales</p>
            </div>
            <span className="text-white/50 group-hover:text-white group-hover:translate-x-1 transition-all">&rarr;</span>
          </Link>

           <Link href={`/dashboard/events/${id}/promoters`} className="p-5 border border-white/10 bg-white/5 rounded-2xl hover:bg-white/10 transition-all flex justify-between items-center group">
            <div>
              <h3 className="font-bold">Promoters</h3>
              <p className="text-sm text-pulse-text-muted">Affiliate tracking</p>
            </div>
            <span className="text-white/50 group-hover:text-white group-hover:translate-x-1 transition-all">&rarr;</span>
          </Link>

           <Link href={`/dashboard/events/${id}/guests`} className="p-5 border border-white/10 bg-white/5 rounded-2xl hover:bg-white/10 transition-all flex justify-between items-center group">
            <div>
              <h3 className="font-bold">Guest List</h3>
              <p className="text-sm text-pulse-text-muted">Manage RSVPs</p>
            </div>
            <span className="text-white/50 group-hover:text-white group-hover:translate-x-1 transition-all">&rarr;</span>
          </Link>
          
          <Link href={`/dashboard/events/${id}/checkin`} className="p-5 border border-white/10 bg-white/5 rounded-2xl hover:bg-white/10 transition-all flex justify-between items-center group">
            <div>
              <h3 className="font-bold">Check-in Mode</h3>
              <p className="text-sm text-pulse-text-muted">Offline scanner</p>
            </div>
            <span className="text-white/50 group-hover:text-white group-hover:translate-x-1 transition-all">&rarr;</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
