import { notFound } from "next/navigation";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  
  // Since we haven't set up the database locally yet, this will error if executed,
  // but it's the correct Prisma fetching logic.
  let user = null;
  try {
    user = await prisma.user.findUnique({
      where: { username },
    });
  } catch (e) {
    // Graceful fallback during dev without DB
  }

  // Placeholder for dev without DB
  if (!user) {
    user = {
      name: "Demo Host",
      username: username,
      bio: "Hosting the best tech events in SF.",
      image: null,
      id: "demo",
      email: "demo@example.com",
      createdAt: new Date(),
    };
  }

  return (
    <div className="min-h-screen bg-pulse-bg">
      <header className="border-b border-pulse-slate/30 bg-pulse-bg/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="font-display font-bold text-xl text-pulse-cyan">Pulse</div>
          {/* Add a follow/contact button here eventually */}
        </div>
      </header>
      
      <main className="max-w-5xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row gap-8 items-start mb-16">
          <div className="w-24 h-24 rounded-full bg-pulse-slate/50 overflow-hidden shrink-0 flex items-center justify-center text-3xl font-display font-bold">
            {user.image ? (
              <img src={user.image} alt={user.name || ""} className="w-full h-full object-cover" />
            ) : (
              (user.name || username)[0].toUpperCase()
            )}
          </div>
          <div>
            <h1 className="text-4xl font-bold font-display">{user.name || username}</h1>
            <p className="text-pulse-text/50 font-mono mt-1">@{user.username}</p>
            <p className="mt-4 text-lg max-w-2xl text-pulse-text/80">{user.bio || "No bio yet."}</p>
          </div>
        </div>
        
        <h2 className="text-2xl font-bold font-display mb-6">Upcoming Events</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Placeholder Event Card */}
          <div className="group border border-pulse-slate/50 bg-pulse-slate/10 rounded-2xl p-6 hover:border-pulse-cyan/50 hover:bg-pulse-slate/20 transition-all cursor-pointer relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-pulse-cyan/10 blur-3xl group-hover:bg-pulse-cyan/20 transition-all pointer-events-none" />
            <div className="flex justify-between items-start mb-4">
              <div className="px-3 py-1 rounded-md bg-pulse-bg border border-pulse-slate text-xs font-mono">
                OCT 24
              </div>
              <div className="text-pulse-cyan text-xs font-bold uppercase tracking-wider flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-pulse-cyan animate-pulse-wave" />
                Selling Fast
              </div>
            </div>
            <h3 className="text-xl font-bold font-display mb-2">Frontend Founders Meetup</h3>
            <p className="text-pulse-text/70 line-clamp-2">An evening of talks and networking for founders building the next generation of frontend tools.</p>
          </div>
          
          <div className="group border border-pulse-slate/50 bg-pulse-slate/10 rounded-2xl p-6 hover:border-pulse-cyan/50 hover:bg-pulse-slate/20 transition-all cursor-pointer">
             <div className="flex justify-between items-start mb-4">
              <div className="px-3 py-1 rounded-md bg-pulse-bg border border-pulse-slate text-xs font-mono">
                NOV 12
              </div>
            </div>
            <h3 className="text-xl font-bold font-display mb-2">Design Systems Conf</h3>
            <p className="text-pulse-text/70 line-clamp-2">A full-day conference dedicated to design systems at scale.</p>
          </div>
        </div>
      </main>
    </div>
  );
}
