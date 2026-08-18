import { notFound } from "next/navigation";
import { Link } from "@/i18n/routing";

export default async function EditEventPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  
  // Placeholder data since DB is not connected yet
  const event = {
    id,
    title: "Frontend Founders Meetup",
    startAt: new Date().toISOString().slice(0, 16),
    endAt: new Date(Date.now() + 7200000).toISOString().slice(0, 16),
    locationType: "PHYSICAL",
    description: "An evening of talks and networking."
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/dashboard" className="text-pulse-text/50 hover:text-pulse-text transition-colors">
          &larr; Back
        </Link>
        <h1 className="text-3xl font-display font-bold">Edit Event</h1>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 flex flex-col gap-8">
          {/* Basics Form */}
          <section className="bg-pulse-bg border border-pulse-slate/50 p-6 rounded-2xl">
            <h2 className="text-xl font-bold font-display mb-4 text-pulse-cyan">Basics</h2>
            <form className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <label className="font-medium text-pulse-text/80">Event Title</label>
                <input 
                  type="text" 
                  defaultValue={event.title}
                  className="w-full py-3 px-4 rounded-xl bg-pulse-bg border border-pulse-slate focus:outline-none focus:border-pulse-cyan transition-colors"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="font-medium text-pulse-text/80">Start Date & Time</label>
                  <input 
                    type="datetime-local" 
                    defaultValue={event.startAt}
                    className="w-full py-3 px-4 rounded-xl bg-pulse-bg border border-pulse-slate focus:outline-none focus:border-pulse-cyan transition-colors"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="font-medium text-pulse-text/80">End Date & Time</label>
                  <input 
                    type="datetime-local" 
                    defaultValue={event.endAt}
                    className="w-full py-3 px-4 rounded-xl bg-pulse-bg border border-pulse-slate focus:outline-none focus:border-pulse-cyan transition-colors"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="font-medium text-pulse-text/80">Description</label>
                <textarea 
                  rows={5}
                  defaultValue={event.description}
                  className="w-full py-3 px-4 rounded-xl bg-pulse-bg border border-pulse-slate focus:outline-none focus:border-pulse-cyan transition-colors resize-none"
                />
              </div>
              
              <div className="flex justify-end">
                <button type="button" className="px-6 py-2 rounded-xl bg-pulse-slate/20 hover:bg-pulse-slate/40 transition-colors font-medium">
                  Save Basics
                </button>
              </div>
            </form>
          </section>
        </div>

        {/* Sidebar settings */}
        <div className="flex flex-col gap-4">
           <Link href={`/dashboard/events/${id}/form`} className="p-4 border border-pulse-slate/50 bg-pulse-slate/10 rounded-xl hover:border-pulse-cyan/50 hover:bg-pulse-slate/20 transition-all flex justify-between items-center group">
            <div>
              <h3 className="font-bold">Registration Form</h3>
              <p className="text-sm text-pulse-text/50">Custom questions</p>
            </div>
            <span className="text-pulse-cyan group-hover:translate-x-1 transition-transform">&rarr;</span>
          </Link>

           <Link href={`/dashboard/events/${id}/schedule`} className="p-4 border border-pulse-slate/50 bg-pulse-slate/10 rounded-xl hover:border-pulse-cyan/50 hover:bg-pulse-slate/20 transition-all flex justify-between items-center group">
            <div>
              <h3 className="font-bold">Event Schedule</h3>
              <p className="text-sm text-pulse-text/50">Agenda & tracks</p>
            </div>
            <span className="text-pulse-cyan group-hover:translate-x-1 transition-transform">&rarr;</span>
          </Link>

           <Link href={`/dashboard/events/${id}/sponsors`} className="p-4 border border-pulse-slate/50 bg-pulse-slate/10 rounded-xl hover:border-pulse-cyan/50 hover:bg-pulse-slate/20 transition-all flex justify-between items-center group">
            <div>
              <h3 className="font-bold">Sponsors</h3>
              <p className="text-sm text-pulse-text/50">Manage partners</p>
            </div>
            <span className="text-pulse-cyan group-hover:translate-x-1 transition-transform">&rarr;</span>
          </Link>

           <Link href={`/dashboard/events/${id}/analytics`} className="p-4 border border-pulse-slate/50 bg-pulse-slate/10 rounded-xl hover:border-pulse-cyan/50 hover:bg-pulse-slate/20 transition-all flex justify-between items-center group">
            <div>
              <h3 className="font-bold">Analytics</h3>
              <p className="text-sm text-pulse-text/50">Views & sales</p>
            </div>
            <span className="text-pulse-cyan group-hover:translate-x-1 transition-transform">&rarr;</span>
          </Link>

           <Link href={`/dashboard/events/${id}/promoters`} className="p-4 border border-pulse-slate/50 bg-pulse-slate/10 rounded-xl hover:border-pulse-cyan/50 hover:bg-pulse-slate/20 transition-all flex justify-between items-center group">
            <div>
              <h3 className="font-bold">Promoters</h3>
              <p className="text-sm text-pulse-text/50">Affiliate tracking</p>
            </div>
            <span className="text-pulse-cyan group-hover:translate-x-1 transition-transform">&rarr;</span>
          </Link>

           <Link href={`/dashboard/events/${id}/guests`} className="p-4 border border-pulse-slate/50 bg-pulse-slate/10 rounded-xl hover:border-pulse-cyan/50 hover:bg-pulse-slate/20 transition-all flex justify-between items-center group">
            <div>
              <h3 className="font-bold">Guest List</h3>
              <p className="text-sm text-pulse-text/50">Manage RSVPs</p>
            </div>
            <span className="text-pulse-cyan group-hover:translate-x-1 transition-transform">&rarr;</span>
          </Link>
          
          <Link href={`/dashboard/events/${id}/checkin`} className="p-4 border border-pulse-slate/50 bg-pulse-slate/10 rounded-xl hover:border-pulse-cyan/50 hover:bg-pulse-slate/20 transition-all flex justify-between items-center group">
            <div>
              <h3 className="font-bold">Check-in Mode</h3>
              <p className="text-sm text-pulse-text/50">Offline scanner</p>
            </div>
            <span className="text-pulse-cyan group-hover:translate-x-1 transition-transform">&rarr;</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
