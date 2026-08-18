import { Link } from "@/i18n/routing";
import { prisma } from "@/lib/prisma";

export default async function DiscoverPage() {
  const events = await prisma.event.findMany({
    where: { status: 'PUBLISHED' },
    orderBy: { startAt: 'asc' },
    include: { ticketTiers: true }
  });

  return (
    <div className="min-h-screen bg-pulse-bg text-pulse-text">
      {/* Header */}
      <header className="border-b border-pulse-slate/20 bg-pulse-bg/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="font-display font-bold text-xl tracking-tight text-pulse-cyan">Pulse</Link>
          <nav className="flex items-center gap-6">
            <Link href="/discover" className="text-pulse-cyan font-medium text-sm transition-colors">Discover</Link>
            <Link href="/dashboard" className="text-pulse-text/70 hover:text-pulse-text text-sm font-medium transition-colors">Dashboard</Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <div className="py-20 px-6 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-2xl h-64 bg-pulse-cyan/10 blur-[100px] pointer-events-none" />
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <h1 className="text-5xl md:text-7xl font-display font-bold tracking-tight mb-6">Discover Extraordinary Events</h1>
          <p className="text-xl text-pulse-text/70 max-w-2xl mx-auto">
            Find the best tech conferences, exclusive meetups, and creative workshops happening around the world.
          </p>
          
          <div className="mt-10 max-w-xl mx-auto relative hidden">
            <input 
              type="text" 
              placeholder="Search events, cities, or topics..." 
              className="w-full bg-pulse-slate/10 border border-pulse-slate/30 rounded-2xl px-6 py-4 text-lg focus:outline-none focus:border-pulse-cyan focus:ring-1 focus:ring-pulse-cyan transition-all placeholder:text-pulse-text/30"
            />
            <button className="absolute right-2 top-2 bottom-2 px-6 bg-pulse-cyan text-pulse-bg font-bold rounded-xl hover:bg-pulse-cyan/90 transition-colors">
              Search
            </button>
          </div>
        </div>
      </div>

      {/* Feed */}
      <div className="max-w-6xl mx-auto px-6 pb-24">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold">Upcoming Events</h2>
        </div>
        
        {events.length === 0 ? (
          <div className="text-center py-20 bg-white/5 rounded-3xl border border-white/10">
            <h3 className="text-xl font-bold mb-2">No upcoming events found</h3>
            <p className="text-pulse-text/60">Check back later for exciting new experiences!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map(event => {
              const formattedDate = new Intl.DateTimeFormat('en-US', {
                month: 'short', day: 'numeric', year: 'numeric'
              }).format(new Date(event.startAt));

              // Determine pricing
              let priceLabel = "Free";
              if (event.ticketTiers && event.ticketTiers.length > 0) {
                const lowestPrice = Math.min(...event.ticketTiers.map(t => t.priceCents));
                if (lowestPrice > 0) {
                  priceLabel = `$${(lowestPrice / 100).toFixed(2)}`;
                }
              }

              // Default gradient backgrounds if no coverImage
              const fallbackGradients = [
                "linear-gradient(to bottom right, #0F172A, #064E3B)",
                "linear-gradient(to bottom right, #312E81, #1E1B4B)",
                "linear-gradient(to bottom right, #701A75, #4C1D95)",
                "linear-gradient(to bottom right, #7f1d1d, #450a0a)",
                "linear-gradient(to bottom right, #064e3b, #022c22)",
              ];
              const bgGradient = fallbackGradients[event.title.length % fallbackGradients.length];

              return (
                <Link href={`/event/${event.slug}`} key={event.id} className="group flex flex-col bg-pulse-slate/5 border border-pulse-slate/20 rounded-2xl overflow-hidden hover:border-pulse-cyan/50 transition-all hover:-translate-y-1 hover:shadow-[0_10px_40px_-10px_rgba(94,234,212,0.15)]">
                  {/* Event Image */}
                  <div 
                    className="w-full h-48 relative overflow-hidden bg-cover bg-center"
                    style={{ 
                      background: event.coverImageUrl ? `url(${event.coverImageUrl})` : bgGradient,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center'
                    }}
                  >
                    <div className="absolute top-4 right-4 bg-pulse-bg/80 backdrop-blur text-xs font-bold px-3 py-1.5 rounded-lg border border-white/10 shadow-lg">
                      {priceLabel}
                    </div>
                  </div>
                  
                  {/* Event Details */}
                  <div className="p-6 flex flex-col flex-grow">
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-pulse-cyan mb-3">
                      <span>{formattedDate}</span>
                    </div>
                    <h3 className="text-xl font-bold mb-2 group-hover:text-pulse-cyan transition-colors line-clamp-2">{event.title}</h3>
                    <p className="text-sm text-pulse-text/60 mb-6 flex items-center gap-1.5 line-clamp-1">
                      <svg className="w-4 h-4 opacity-70 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {event.locationType === 'PHYSICAL' ? event.address : event.locationType}
                    </p>
                    
                    <div className="mt-auto flex gap-2">
                      <span className="text-[10px] uppercase tracking-widest font-bold bg-pulse-slate/20 text-pulse-text/70 px-2 py-1 rounded">
                        RSVP Open
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
