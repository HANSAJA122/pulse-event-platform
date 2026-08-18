import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Image from "next/image";

export default async function PublicEventPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  
  const event = await prisma.event.findUnique({
    where: { slug }
  });

  if (!event) {
    notFound();
  }

  // Format date nicely
  const startDate = new Date(event.startAt).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });
  
  const startTime = new Date(event.startAt).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit'
  });

  return (
    <div className="min-h-screen bg-black text-white selection:bg-white/30 relative">
      {/* Aurora Background Effect */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-purple-600/20 blur-[120px] rounded-full mix-blend-screen" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[60%] bg-pink-600/10 blur-[100px] rounded-full mix-blend-screen" />
        <div className="absolute top-[20%] right-[10%] w-[30%] h-[40%] bg-orange-500/10 blur-[80px] rounded-full mix-blend-screen" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay"></div>
      </div>

      <main className="relative z-10 max-w-4xl mx-auto px-4 py-12 md:py-24">
        <div className="glass-panel rounded-[2rem] md:rounded-[3rem] p-6 md:p-12 shadow-2xl">
          
          <div className="flex flex-col md:flex-row gap-8 justify-between items-start md:items-end mb-12">
            <div className="max-w-2xl space-y-4">
              <h1 className="text-4xl md:text-6xl font-display font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-white to-white/60">
                {event.title}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-white/70">
                <div className="flex items-center gap-2">
                  <span className="bg-white/10 p-2 rounded-full">📅</span>
                  <span>{startDate} at {startTime}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="bg-white/10 p-2 rounded-full">📍</span>
                  <span className="capitalize">{event.locationType.toLowerCase()} Event</span>
                </div>
              </div>
            </div>

            <button className="w-full md:w-auto px-8 py-4 rounded-2xl bg-aurora-gradient text-white font-bold text-lg shadow-[0_0_30px_rgba(255,77,77,0.3)] hover:shadow-[0_0_40px_rgba(121,40,202,0.4)] transition-all transform hover:scale-105 active:scale-95 text-center">
              RSVP Now
            </button>
          </div>

          <div className="prose prose-invert max-w-none border-t border-white/10 pt-12">
            <h3 className="text-2xl font-bold mb-4">About this event</h3>
            <p className="text-lg text-white/70 leading-relaxed whitespace-pre-wrap">
              {event.description || "No description provided."}
            </p>
          </div>

        </div>
      </main>
    </div>
  );
}
