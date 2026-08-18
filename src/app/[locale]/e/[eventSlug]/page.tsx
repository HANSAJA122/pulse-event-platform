import { notFound } from "next/navigation";
import { PrismaClient } from "@prisma/client";
import { Link } from "@/i18n/routing";

const prisma = new PrismaClient();

export async function generateMetadata({ params }: { params: Promise<{ eventSlug: string }> }) {
  const { eventSlug } = await params;
  return {
    title: `${eventSlug} | Pulse Events`,
    description: "Join this event on Pulse.",
  };
}

export default async function PublicEventPage({
  params,
  searchParams,
}: {
  params: Promise<{ eventSlug: string; locale: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { eventSlug, locale } = await params;
  const { rsvp } = await searchParams;
  const isSuccess = rsvp === 'success';
  
  // Mock data since DB is not connected yet
  const event = {
    title: "Frontend Founders Meetup",
    slug: eventSlug,
    startAt: new Date(Date.now() + 86400000 * 5),
    endAt: new Date(Date.now() + 86400000 * 5 + 7200000),
    locationType: "PHYSICAL",
    address: "123 Tech Hub, San Francisco, CA",
    description: "An evening of talks and networking for founders building the next generation of frontend tools.",
    coverImageUrl: null,
    owner: {
      name: "Demo Host",
      username: "demo",
      avatarUrl: null
    }
  };

  return (
    <div className="min-h-screen bg-pulse-bg">
      <header className="border-b border-pulse-slate/30 bg-pulse-bg/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="font-display font-bold text-xl text-pulse-cyan">Pulse</Link>
          <div className="flex gap-4">
            <Link href="/login" className="text-sm font-medium hover:text-pulse-cyan transition-colors">Log In</Link>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12">
        {/* Cover Image Placeholder */}
        <div className="w-full h-64 md:h-96 rounded-3xl bg-pulse-slate/20 mb-12 relative overflow-hidden flex items-center justify-center">
           <div className="absolute inset-0 bg-gradient-to-tr from-pulse-bg to-transparent opacity-80 z-10" />
           <span className="z-20 text-pulse-text/30 font-display font-bold text-4xl">No Cover Image</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="md:col-span-2">
            <h1 className="text-4xl md:text-6xl font-bold font-display mb-6">{event.title}</h1>
            
            <div className="flex items-center gap-4 mb-8 p-4 rounded-2xl bg-pulse-slate/10 border border-pulse-slate/30">
               <div className="w-12 h-12 rounded-full bg-pulse-slate/50 flex items-center justify-center font-display font-bold shrink-0">
                 {event.owner.avatarUrl ? (
                   <img src={event.owner.avatarUrl} alt="" className="w-full h-full object-cover rounded-full" />
                 ) : (
                   event.owner.name[0]
                 )}
               </div>
               <div>
                 <p className="text-sm text-pulse-text/70">Hosted by</p>
                 <Link href={`/${event.owner.username}`} className="font-bold hover:text-pulse-cyan transition-colors">
                   {event.owner.name}
                 </Link>
               </div>
            </div>

            <div className="prose prose-invert max-w-none mb-16">
              <p className="text-lg text-pulse-text/80 leading-relaxed">
                {event.description}
              </p>
            </div>

            {/* Event Schedule / Agenda */}
            <div className="mb-16">
              <h2 className="text-3xl font-display font-bold mb-8">Schedule</h2>
              {/* ... Agenda code ... */}
              <div className="flex flex-col gap-6 relative">
                 <div className="absolute left-[7px] md:left-6 top-4 bottom-4 w-px bg-pulse-slate/30" />
                 
                 {/* Mock Session 1 */}
                 <div className="relative pl-8 md:pl-16 group">
                   <div className="absolute left-[2px] md:left-[21px] top-6 w-3 h-3 rounded-full bg-pulse-cyan border-4 border-pulse-bg" />
                   <div className="border border-pulse-slate/30 rounded-2xl p-6 bg-pulse-slate/5 hover:border-pulse-cyan/50 transition-colors">
                     <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                       <h3 className="font-bold text-xl">Opening Keynote</h3>
                       <div className="flex items-center gap-3 text-pulse-cyan font-mono text-sm">
                         <span>09:00</span>
                         <span>-</span>
                         <span>10:00</span>
                       </div>
                     </div>
                     <p className="text-pulse-text/70 mb-4">Welcome to the future of frontend.</p>
                     <div className="flex items-center gap-2 text-xs uppercase tracking-widest font-bold text-pulse-text/50">
                       <span className="w-2 h-2 rounded-full bg-pulse-slate/50" />
                       Main Stage
                     </div>
                   </div>
                 </div>

                 {/* Mock Session 2 */}
                 <div className="relative pl-8 md:pl-16 group">
                   <div className="absolute left-[2px] md:left-[21px] top-6 w-3 h-3 rounded-full bg-pulse-slate/50 border-4 border-pulse-bg" />
                   <div className="border border-pulse-slate/30 rounded-2xl p-6 bg-pulse-slate/5 hover:border-pulse-cyan/50 transition-colors">
                     <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                       <h3 className="font-bold text-xl">Building for the Edge</h3>
                       <div className="flex items-center gap-3 text-pulse-text/60 font-mono text-sm">
                         <span>10:15</span>
                         <span>-</span>
                         <span>11:00</span>
                       </div>
                     </div>
                     <p className="text-pulse-text/70 mb-4">Deep dive into edge computing and serverless architectures.</p>
                     <div className="flex items-center gap-2 text-xs uppercase tracking-widest font-bold text-pulse-text/50">
                       <span className="w-2 h-2 rounded-full bg-pulse-slate/50" />
                       Stage B
                     </div>
                   </div>
                 </div>
              </div>
            </div>

            {/* Event Sponsors */}
            <div>
              <h2 className="text-3xl font-display font-bold mb-8 text-center md:text-left">Supported By</h2>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-8">
                <div className="px-8 py-4 border border-pulse-slate/30 rounded-xl bg-pulse-slate/5 hover:bg-pulse-slate/10 transition-colors">
                  <span className="text-xl font-bold text-pulse-text/80 tracking-widest uppercase">Vercel</span>
                </div>
                <div className="px-8 py-4 border border-pulse-slate/30 rounded-xl bg-pulse-slate/5 hover:bg-pulse-slate/10 transition-colors">
                  <span className="text-xl font-bold text-pulse-text/80 tracking-widest uppercase">Stripe</span>
                </div>
              </div>
            </div>
          </div>

          {/* Registration Sidebar */}
          <div className="relative">
            <div className="sticky top-24 border border-pulse-slate/50 bg-pulse-bg p-6 rounded-3xl shadow-2xl">
              {/* Event "Tear" / Ticket visual motif */}
              <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-pulse-bg rounded-full border-r border-pulse-slate/50 shadow-[inset_0_0_10px_rgba(0,0,0,0.5)] z-10" style={{ clipPath: 'inset(0 0 0 50%)' }} />
              <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-pulse-bg rounded-full border-l border-pulse-slate/50 shadow-[inset_0_0_10px_rgba(0,0,0,0.5)] z-10" style={{ clipPath: 'inset(0 50% 0 0)' }} />
              <div className="absolute top-1/2 left-4 right-4 h-px border-t-2 border-dashed border-pulse-slate/30 z-0" />

              <div className="mb-8 relative z-10">
                <div className="text-xs uppercase tracking-widest text-pulse-cyan font-bold mb-2">Date & Time</div>
                <div className="font-mono mb-1">{event.startAt.toLocaleDateString()}</div>
                <div className="text-pulse-text/70">{event.startAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
              </div>

              <div className="mb-12 relative z-10 pt-8">
                <div className="text-xs uppercase tracking-widest text-pulse-cyan font-bold mb-2">Location</div>
                <div className="font-medium mb-1">{event.locationType === 'PHYSICAL' ? 'In Person' : 'Virtual'}</div>
                {event.address && <div className="text-pulse-text/70 text-sm">{event.address}</div>}
              </div>

              <div className="relative z-10">
                {isSuccess ? (
                  <div className="w-full py-4 text-center rounded-xl bg-pulse-slate/20 text-pulse-cyan font-bold border border-pulse-cyan/50">
                    <span className="w-2 h-2 rounded-full bg-pulse-cyan inline-block mr-2 animate-pulse-wave" />
                    You're registered!
                  </div>
                ) : (
                  <Link 
                    href={`/e/${event.slug}/checkout`}
                    className="block w-full py-4 text-center rounded-xl bg-pulse-gradient text-pulse-bg font-bold shadow-[0_0_20px_rgba(94,234,212,0.15)] hover:shadow-[0_0_30px_rgba(94,234,212,0.3)] hover:-translate-y-1 transition-all"
                  >
                    Register Now
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
