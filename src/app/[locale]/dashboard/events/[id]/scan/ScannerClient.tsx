"use client";

import { useState } from "react";
import { Scanner } from "@yudiel/react-qr-scanner";
import { checkInGuest } from "@/lib/actions/checkin";
import { Link } from "@/i18n/routing";
import { ArrowLeft, CheckCircle2, XCircle } from "lucide-react";

export default function ScannerClient({ eventId, eventTitle }: { eventId: string, eventTitle: string }) {
  const [lastScanned, setLastScanned] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleScan = async (result: string) => {
    if (result && result !== lastScanned && status !== "loading") {
      setLastScanned(result);
      setStatus("loading");
      setMessage("Verifying ticket...");

      const res = await checkInGuest(result, eventId);

      if (res.error) {
        setStatus("error");
        setMessage(res.error);
      } else {
        setStatus("success");
        setMessage(`Checked in ${res.guestName}!`);
      }

      // Reset after 3 seconds so they can scan another
      setTimeout(() => {
        setLastScanned(null);
        setStatus("idle");
        setMessage("");
      }, 3000);
    }
  };

  return (
    <div className="max-w-md mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link href={`/dashboard/events/${eventId}`} className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-display font-bold tracking-tight">Scanner</h1>
          <p className="text-pulse-text-muted text-sm">{eventTitle}</p>
        </div>
      </div>

      {/* Scanner View */}
      <div className="glass-panel rounded-3xl overflow-hidden p-2 relative">
        <div className="rounded-2xl overflow-hidden bg-black aspect-square relative">
          <Scanner 
            onScan={(result) => {
              if (result && result.length > 0) {
                handleScan(result[0].rawValue);
              }
            }}
            formats={["qr_code"]}
          />

          {/* Status Overlay */}
          {status !== "idle" && (
            <div className={`absolute inset-0 z-10 flex flex-col items-center justify-center p-6 text-center backdrop-blur-md transition-all ${
              status === "success" ? "bg-green-500/20 text-green-400" :
              status === "error" ? "bg-red-500/20 text-red-400" :
              "bg-black/50 text-white"
            }`}>
              {status === "success" && <CheckCircle2 className="w-16 h-16 mb-4" />}
              {status === "error" && <XCircle className="w-16 h-16 mb-4" />}
              {status === "loading" && <div className="w-16 h-16 mb-4 border-4 border-white/20 border-t-white rounded-full animate-spin" />}
              
              <h2 className="text-xl font-bold font-display">{message}</h2>
            </div>
          )}
        </div>
      </div>

      <div className="text-center text-pulse-text-muted text-sm">
        Point your camera at the attendee's QR code ticket to check them in.
      </div>
    </div>
  );
}
