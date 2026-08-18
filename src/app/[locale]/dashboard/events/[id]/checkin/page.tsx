"use client";

import { useState, useEffect } from "react";
import { Link, useRouter } from "@/i18n/routing";

interface Guest {
  id: string;
  name: string;
  email: string;
  ticketTier: string;
  checkedIn: boolean;
}

export default function CheckinPage() {
  const router = useRouter();
  const [isOnline, setIsOnline] = useState(true);
  const [syncQueue, setSyncQueue] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  
  // Mock guest list that would normally be fetched and cached in IndexedDB
  const [guests, setGuests] = useState<Guest[]>([
    { id: "1", name: "Jane Doe", email: "jane@example.com", ticketTier: "VIP", checkedIn: false },
    { id: "2", name: "John Smith", email: "john@example.com", ticketTier: "General", checkedIn: true },
    { id: "3", name: "Alice Johnson", email: "alice@example.com", ticketTier: "General", checkedIn: false },
  ]);

  useEffect(() => {
    // Track network status for offline-first capability
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    setIsOnline(navigator.onLine);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const handleCheckIn = (guestId: string) => {
    setGuests(guests.map(g => g.id === guestId ? { ...g, checkedIn: !g.checkedIn } : g));
    
    if (!isOnline) {
      // Queue for sync when offline
      setSyncQueue([...syncQueue, guestId]);
    } else {
      // In a real app, fire the API request here
      console.log(`Live API sync: Checked in ${guestId}`);
    }
  };

  const handleSync = () => {
    if (!isOnline) return;
    
    // Process queue
    console.log(`Syncing ${syncQueue.length} records to server...`);
    setSyncQueue([]);
  };

  const filteredGuests = guests.filter(g => 
    g.name.toLowerCase().includes(search.toLowerCase()) || 
    g.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 bg-pulse-bg flex flex-col sm:justify-center sm:items-center overflow-hidden">
      
      {/* Mobile container to constrain width on desktop */}
      <div className="w-full h-full sm:max-w-md sm:h-[800px] sm:max-h-[90vh] sm:border sm:border-pulse-slate/50 sm:rounded-3xl sm:shadow-2xl bg-pulse-bg flex flex-col relative overflow-hidden">
        
        {/* Header */}
        <div className="p-4 border-b border-pulse-slate/30 bg-pulse-bg/80 backdrop-blur-md sticky top-0 z-10 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <button onClick={() => router.back()} className="text-pulse-text/70 hover:text-pulse-cyan">
              &larr; Back
            </button>
            <div className="font-bold text-lg">Check-in</div>
            <div className="w-10"></div> {/* Spacer for alignment */}
          </div>
          
          <div className="flex items-center justify-between">
            <div className={`text-xs font-bold uppercase tracking-widest px-2 py-1 rounded-md border flex items-center gap-2 ${isOnline ? 'bg-pulse-cyan/20 text-pulse-cyan border-pulse-cyan/30' : 'bg-amber-500/20 text-amber-500 border-amber-500/30'}`}>
              <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-pulse-cyan animate-pulse-wave' : 'bg-amber-500'}`} />
              {isOnline ? 'Live' : 'Offline'}
            </div>
            
            {syncQueue.length > 0 && (
              <button 
                onClick={handleSync}
                disabled={!isOnline}
                className="text-xs font-bold uppercase tracking-widest px-2 py-1 rounded-md bg-pulse-gradient text-pulse-bg disabled:opacity-50"
              >
                Sync ({syncQueue.length})
              </button>
            )}
          </div>
          
          <input 
            type="text" 
            placeholder="Search name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-pulse-slate/10 border border-pulse-slate/50 rounded-xl px-4 py-3 focus:outline-none focus:border-pulse-cyan"
          />
        </div>

        {/* Guest List */}
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
          {filteredGuests.map(guest => (
            <div 
              key={guest.id} 
              className={`p-4 border rounded-xl flex items-center justify-between transition-colors ${guest.checkedIn ? 'bg-pulse-cyan/10 border-pulse-cyan/30' : 'bg-pulse-slate/5 border-pulse-slate/30'}`}
              onClick={() => handleCheckIn(guest.id)}
            >
              <div>
                <div className="font-bold flex items-center gap-2">
                  {guest.name}
                  <span className="text-[10px] bg-pulse-slate/20 px-2 py-0.5 rounded text-pulse-text/70">{guest.ticketTier}</span>
                </div>
                <div className="text-sm text-pulse-text/50">{guest.email}</div>
              </div>
              
              <div>
                <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-colors ${guest.checkedIn ? 'border-pulse-cyan bg-pulse-cyan text-pulse-bg' : 'border-pulse-slate/50'}`}>
                  {guest.checkedIn && (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
              </div>
            </div>
          ))}
          
          {filteredGuests.length === 0 && (
            <div className="text-center text-pulse-text/50 mt-10">
              No guests found.
            </div>
          )}
        </div>
        
        {/* Scanner Action Button (Mock) */}
        <div className="p-4 border-t border-pulse-slate/30 bg-pulse-bg sticky bottom-0">
          <button className="w-full py-4 rounded-xl border-2 border-pulse-cyan text-pulse-cyan font-bold hover:bg-pulse-cyan/10 transition-colors flex justify-center items-center gap-2">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm14 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
            </svg>
            Scan QR Code
          </button>
        </div>

      </div>
    </div>
  );
}
