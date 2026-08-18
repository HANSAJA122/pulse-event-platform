"use client";

import { useState } from "react";
import { submitRsvp } from "@/lib/actions/rsvp";
import { createCheckoutSession } from "@/lib/actions/checkout";

export function RsvpForm({ eventId, ticketTiers }: { eventId: string, ticketTiers?: any[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  
  // Default to first tier if available
  const [selectedTierId, setSelectedTierId] = useState(ticketTiers && ticketTiers.length > 0 ? ticketTiers[0].id : "");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");
    
    try {
      const formData = new FormData(e.currentTarget);
      if (selectedTierId) {
        formData.set("ticketTierId", selectedTierId);
      }
      
      const res = await submitRsvp(eventId, formData);
      setStatus("success");
    } catch (err: any) {
      console.error(err);
      setStatus("error");
      setErrorMsg(err.message || "Failed to RSVP. Please try again.");
    }
  };

  if (status === "success") {
    return (
      <div className="w-full md:w-auto p-6 rounded-2xl bg-white/10 border border-green-400/30 text-center animate-fade-in">
        <div className="w-12 h-12 rounded-full bg-green-400/20 text-green-400 flex items-center justify-center mx-auto mb-4 text-xl">✓</div>
        <h3 className="text-xl font-bold text-white mb-2">You're in!</h3>
        <p className="text-white/70 text-sm">Check your email for your ticket and QR code.</p>
      </div>
    );
  }



  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="w-full md:w-auto px-8 py-4 rounded-2xl bg-aurora-gradient text-white font-bold text-lg shadow-[0_0_30px_rgba(255,77,77,0.3)] hover:shadow-[0_0_40px_rgba(121,40,202,0.4)] transition-all transform hover:scale-105 active:scale-95 text-center"
      >
        RSVP Now
      </button>
    );
  }

  return (
    <div className="w-full md:w-auto p-6 rounded-3xl bg-white/5 border border-white/10 shadow-2xl animate-fade-in backdrop-blur-md min-w-[300px]">
      <h3 className="text-xl font-bold text-white mb-4">Complete Registration</h3>
      
      {status === "error" && (
        <div className="p-3 mb-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-200 text-sm">
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-bold text-white/70">Full Name</label>
          <input 
            type="text" 
            name="guestName"
            required
            placeholder="Jane Doe"
            className="w-full py-2.5 px-4 rounded-xl bg-black/50 border border-white/10 focus:outline-none focus:border-white/30 text-white placeholder:text-white/20"
          />
        </div>
        
        <div className="flex flex-col gap-2">
          <label className="text-sm font-bold text-white/70">Email Address</label>
          <input 
            type="email" 
            name="guestEmail"
            required
            placeholder="jane@example.com"
            className="w-full py-2.5 px-4 rounded-xl bg-black/50 border border-white/10 focus:outline-none focus:border-white/30 text-white placeholder:text-white/20"
          />
        </div>
        
        <div className="flex gap-3 mt-4">
          <button 
            type="button"
            onClick={() => setIsOpen(false)}
            disabled={status === "loading"}
            className="flex-1 py-3 rounded-xl border border-white/10 text-white/70 hover:bg-white/5 transition-colors text-sm font-bold disabled:opacity-50"
          >
            Cancel
          </button>
          <button 
            type="submit"
            disabled={status === "loading"}
            className="flex-1 py-3 rounded-xl bg-white text-black hover:bg-gray-200 transition-colors text-sm font-bold disabled:opacity-50"
          >
            {status === "loading" ? "..." : "Confirm"}
          </button>
        </div>
      </form>
    </div>
  );
}
