"use client";

import { useState, use } from "react";
import { Link, useRouter } from "@/i18n/routing";
import { checkinGuest } from "@/lib/actions/checkin";
import { Scanner } from "@yudiel/react-qr-scanner";

export default function CheckinPage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const router = useRouter();
  const { id: eventId } = use(params);
  
  const [isScanning, setIsScanning] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [lastGuest, setLastGuest] = useState<{name: string, email: string} | null>(null);

  const handleScan = async (result: any) => {
    if (!result || !result[0]) return;
    
    // Stop scanning while we process
    setIsScanning(false);
    setStatus("loading");
    setMessage("Verifying ticket...");

    const rsvpId = result[0].rawValue;

    try {
      const res = await checkinGuest(eventId, rsvpId);
      setStatus("success");
      setLastGuest({ name: res.guestName, email: res.guestEmail });
      setMessage(`Successfully checked in ${res.guestName}!`);
      
      // Reset success message after 3 seconds
      setTimeout(() => {
        setStatus("idle");
        setMessage("");
        setLastGuest(null);
      }, 3000);

    } catch (error: any) {
      setStatus("error");
      setMessage(error.message || "Invalid ticket.");
      
      // Reset error message after 3 seconds
      setTimeout(() => {
        setStatus("idle");
        setMessage("");
      }, 3000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col sm:justify-center sm:items-center overflow-hidden">
      
      {/* Aurora Background Effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 opacity-50">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-purple-600/30 blur-[120px] rounded-full mix-blend-screen" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[60%] bg-pink-600/20 blur-[100px] rounded-full mix-blend-screen" />
        <div className="absolute top-[20%] right-[10%] w-[30%] h-[40%] bg-orange-500/20 blur-[80px] rounded-full mix-blend-screen" />
      </div>

      <div className="w-full h-full sm:max-w-md sm:h-[800px] sm:max-h-[90vh] sm:rounded-[3rem] glass-panel sm:shadow-2xl flex flex-col relative overflow-hidden z-10">
        
        {/* Header */}
        <div className="p-6 border-b border-white/10 bg-black/40 backdrop-blur-xl sticky top-0 z-20 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <button onClick={() => router.back()} className="text-pulse-text-muted hover:text-white transition-colors font-medium">
              &larr; Back
            </button>
            <div className="font-bold text-xl tracking-tight text-white">Scanner</div>
            <div className="w-12"></div> {/* Spacer */}
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col items-center justify-center p-6 relative">
          
          {isScanning ? (
            <div className="w-full aspect-square max-w-sm rounded-3xl overflow-hidden border-2 border-white/20 shadow-2xl relative bg-black/50">
              <Scanner 
                onScan={handleScan} 
                formats={["qr_code"]}
                styles={{ container: { width: '100%', height: '100%' } }}
              />
              {/* Scan target overlay */}
              <div className="absolute inset-0 pointer-events-none border-[40px] border-black/40 flex items-center justify-center">
                <div className="w-full h-full border-2 border-dashed border-white/50 rounded-xl relative">
                  <div className="absolute top-0 left-0 w-4 h-4 border-t-4 border-l-4 border-white -mt-1 -ml-1 rounded-tl-sm"></div>
                  <div className="absolute top-0 right-0 w-4 h-4 border-t-4 border-r-4 border-white -mt-1 -mr-1 rounded-tr-sm"></div>
                  <div className="absolute bottom-0 left-0 w-4 h-4 border-b-4 border-l-4 border-white -mb-1 -ml-1 rounded-bl-sm"></div>
                  <div className="absolute bottom-0 right-0 w-4 h-4 border-b-4 border-r-4 border-white -mb-1 -mr-1 rounded-br-sm"></div>
                </div>
              </div>
              <button 
                onClick={() => setIsScanning(false)}
                className="absolute bottom-4 left-1/2 -translate-x-1/2 px-6 py-2 bg-white/10 backdrop-blur-md rounded-full text-white text-sm font-bold border border-white/20"
              >
                Cancel
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center w-full text-center space-y-8 animate-fade-in">
              
              {/* Status Display */}
              <div className="min-h-[160px] flex flex-col items-center justify-center w-full">
                {status === "idle" && (
                  <div className="w-24 h-24 bg-white/5 rounded-full border border-white/10 flex items-center justify-center text-4xl mb-4">
                    📷
                  </div>
                )}
                
                {status === "loading" && (
                  <div className="w-24 h-24 rounded-full border-4 border-white/10 border-t-white animate-spin mb-4"></div>
                )}

                {status === "success" && (
                  <div className="flex flex-col items-center animate-fade-in w-full">
                    <div className="w-24 h-24 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center text-4xl mb-4 border border-green-500/30 shadow-[0_0_30px_rgba(34,197,94,0.3)]">
                      ✓
                    </div>
                    <h3 className="text-2xl font-bold text-white tracking-tight">{lastGuest?.name}</h3>
                    <p className="text-white/60">{lastGuest?.email}</p>
                    <div className="mt-3 px-4 py-1 rounded-full bg-green-500/20 text-green-400 text-sm font-bold tracking-widest uppercase border border-green-500/30">
                      Checked In
                    </div>
                  </div>
                )}

                {status === "error" && (
                  <div className="flex flex-col items-center animate-fade-in">
                    <div className="w-24 h-24 bg-red-500/20 text-red-400 rounded-full flex items-center justify-center text-4xl mb-4 border border-red-500/30 shadow-[0_0_30px_rgba(239,68,68,0.3)]">
                      ✗
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Invalid Scan</h3>
                    <p className="text-red-300/80 text-sm max-w-[250px]">{message}</p>
                  </div>
                )}
              </div>

              {(status === "idle" || status === "success" || status === "error") && (
                <button 
                  onClick={() => setIsScanning(true)}
                  className="w-full max-w-xs py-5 rounded-2xl bg-aurora-gradient text-white font-bold text-lg shadow-[0_0_30px_rgba(255,77,77,0.3)] hover:shadow-[0_0_40px_rgba(121,40,202,0.4)] transition-all transform hover:scale-105 active:scale-95 flex justify-center items-center gap-3"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm14 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                  </svg>
                  Tap to Scan Ticket
                </button>
              )}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
