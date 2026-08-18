"use client";

import { useState } from "react";
import { Link } from "@/i18n/routing";

interface Session {
  id: string;
  title: string;
  startAt: string;
  endAt: string;
  location: string;
  description: string;
}

export default function EventSchedulePage() {
  // Mock sessions state
  const [sessions, setSessions] = useState<Session[]>([
    {
      id: "1",
      title: "Opening Keynote",
      startAt: "09:00",
      endAt: "10:00",
      location: "Main Stage",
      description: "Welcome to the future of frontend."
    }
  ]);
  
  const [isAdding, setIsAdding] = useState(false);
  const [newSession, setNewSession] = useState<Partial<Session>>({});

  const handleAdd = () => {
    if (newSession.title && newSession.startAt) {
      setSessions([...sessions, { ...newSession, id: Math.random().toString(36).substring(7) } as Session].sort((a, b) => a.startAt.localeCompare(b.startAt)));
      setNewSession({});
      setIsAdding(false);
    }
  };

  const removeSession = (id: string) => {
    setSessions(sessions.filter(s => s.id !== id));
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <Link href={`/dashboard`} className="text-pulse-text/50 hover:text-pulse-text transition-colors">
          &larr; Back to Events
        </Link>
        <h1 className="text-3xl font-display font-bold">Event Schedule</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="bg-pulse-bg border border-pulse-slate/50 p-6 rounded-2xl">
             <div className="flex items-center justify-between mb-6">
               <h2 className="font-bold text-lg text-pulse-cyan">Agenda Tracks</h2>
             </div>
             
             {sessions.length === 0 && !isAdding ? (
               <div className="text-pulse-text/50 text-center py-12 border border-dashed border-pulse-slate/30 rounded-xl">
                  <p className="mb-4">No sessions added yet.</p>
                  <button onClick={() => setIsAdding(true)} className="text-pulse-cyan font-bold hover:underline">
                    Add First Session
                  </button>
               </div>
             ) : (
               <div className="flex flex-col gap-4 relative">
                 {/* Timeline line */}
                 <div className="absolute left-6 top-4 bottom-4 w-px bg-pulse-slate/30" />
                 
                 {sessions.map((session) => (
                   <div key={session.id} className="relative pl-14 group">
                     {/* Timeline dot */}
                     <div className="absolute left-[21px] top-4 w-3 h-3 rounded-full bg-pulse-cyan border-4 border-pulse-bg" />
                     
                     <div className="border border-pulse-slate/50 rounded-xl p-4 bg-pulse-slate/5 relative transition-colors group-hover:border-pulse-cyan/50">
                       <button onClick={() => removeSession(session.id)} className="absolute top-4 right-4 text-pulse-text/40 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity">
                         Remove
                       </button>
                       <div className="flex items-center gap-3 text-pulse-text/60 font-mono text-sm mb-1">
                         <span>{session.startAt} - {session.endAt}</span>
                         {session.location && (
                           <>
                             <span>&bull;</span>
                             <span className="text-pulse-text/80">{session.location}</span>
                           </>
                         )}
                       </div>
                       <h3 className="font-bold text-lg mb-2">{session.title}</h3>
                       <p className="text-pulse-text/70 text-sm">{session.description}</p>
                     </div>
                   </div>
                 ))}

                 {isAdding && (
                   <div className="relative pl-14 mt-4">
                     <div className="absolute left-[21px] top-4 w-3 h-3 rounded-full bg-pulse-slate/50 border-4 border-pulse-bg animate-pulse" />
                     <div className="border border-pulse-slate/50 rounded-xl p-4 bg-pulse-slate/10">
                       <div className="flex flex-col gap-4">
                         <input 
                           type="text" 
                           placeholder="Session Title"
                           value={newSession.title || ''}
                           onChange={e => setNewSession({...newSession, title: e.target.value})}
                           className="bg-transparent text-lg font-bold focus:outline-none border-b border-pulse-slate/50 focus:border-pulse-cyan"
                         />
                         
                         <div className="grid grid-cols-2 gap-4">
                           <input 
                             type="time" 
                             value={newSession.startAt || ''}
                             onChange={e => setNewSession({...newSession, startAt: e.target.value})}
                             className="bg-pulse-bg border border-pulse-slate/50 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-pulse-cyan"
                           />
                           <input 
                             type="time" 
                             value={newSession.endAt || ''}
                             onChange={e => setNewSession({...newSession, endAt: e.target.value})}
                             className="bg-pulse-bg border border-pulse-slate/50 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-pulse-cyan"
                           />
                         </div>
                         
                         <input 
                           type="text" 
                           placeholder="Location (e.g. Stage B)"
                           value={newSession.location || ''}
                           onChange={e => setNewSession({...newSession, location: e.target.value})}
                           className="bg-pulse-bg border border-pulse-slate/50 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-pulse-cyan"
                         />
                         
                         <textarea 
                           placeholder="Session description..."
                           value={newSession.description || ''}
                           onChange={e => setNewSession({...newSession, description: e.target.value})}
                           className="bg-pulse-bg border border-pulse-slate/50 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-pulse-cyan h-24 resize-none"
                         />
                         
                         <div className="flex justify-end gap-2 mt-2">
                           <button onClick={() => setIsAdding(false)} className="px-4 py-2 text-sm hover:text-pulse-text/70">Cancel</button>
                           <button onClick={handleAdd} className="px-4 py-2 text-sm bg-pulse-cyan text-pulse-bg font-bold rounded-lg">Save Session</button>
                         </div>
                       </div>
                     </div>
                   </div>
                 )}
               </div>
             )}

             {!isAdding && (
               <div className="mt-6 flex justify-center">
                 <button onClick={() => setIsAdding(true)} className="px-4 py-2 rounded-lg border border-pulse-slate/50 text-pulse-text/80 hover:bg-pulse-slate/20 transition-colors flex items-center gap-2">
                   <span>+</span> Add Session
                 </button>
               </div>
             )}
          </div>
          
          <div className="flex justify-end">
            <button className="px-6 py-3 rounded-xl bg-pulse-gradient text-pulse-bg font-bold shadow-[0_0_20px_rgba(94,234,212,0.15)] hover:shadow-[0_0_30px_rgba(94,234,212,0.3)] transition-all">
              Publish Schedule
            </button>
          </div>
        </div>

        {/* Sidebar settings */}
        <div className="flex flex-col gap-4">
           <div className="p-4 border border-pulse-slate/50 bg-pulse-slate/10 rounded-xl">
            <h3 className="font-bold mb-2 text-pulse-cyan">Multi-session</h3>
            <p className="text-sm text-pulse-text/70">
              Build an agenda for conferences or multi-day events. Guests will see the full schedule on the event page.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
