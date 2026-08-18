"use client";

import { useState } from "react";
import { useRouter } from "@/i18n/routing";

export default function NewEventPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    
    // In a real app, this would be a Server Action or API call
    // For now, simulate creation and redirect
    setTimeout(() => {
      setLoading(false);
      router.push("/dashboard");
    }, 1000);
  };

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h1 className="text-3xl font-display font-bold mb-8">Create New Event</h1>
      
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <label className="font-medium text-pulse-text/80">Event Title</label>
          <input 
            type="text" 
            required 
            placeholder="e.g. Design Systems Conf 2026"
            className="w-full py-3 px-4 rounded-xl bg-pulse-bg border border-pulse-slate focus:outline-none focus:border-pulse-cyan transition-colors"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <label className="font-medium text-pulse-text/80">Start Date & Time</label>
            <input 
              type="datetime-local" 
              required 
              className="w-full py-3 px-4 rounded-xl bg-pulse-bg border border-pulse-slate focus:outline-none focus:border-pulse-cyan transition-colors"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="font-medium text-pulse-text/80">End Date & Time</label>
            <input 
              type="datetime-local" 
              required 
              className="w-full py-3 px-4 rounded-xl bg-pulse-bg border border-pulse-slate focus:outline-none focus:border-pulse-cyan transition-colors"
            />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-medium text-pulse-text/80">Location Type</label>
          <select className="w-full py-3 px-4 rounded-xl bg-pulse-bg border border-pulse-slate focus:outline-none focus:border-pulse-cyan transition-colors appearance-none">
            <option value="PHYSICAL">Physical Location</option>
            <option value="VIRTUAL">Virtual (Zoom, Google Meet)</option>
            <option value="HYBRID">Hybrid</option>
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-medium text-pulse-text/80">Description</label>
          <textarea 
            rows={5}
            placeholder="Tell your guests what this event is all about..."
            className="w-full py-3 px-4 rounded-xl bg-pulse-bg border border-pulse-slate focus:outline-none focus:border-pulse-cyan transition-colors resize-none"
          />
        </div>

        <div className="pt-4 border-t border-pulse-slate/30 flex justify-end gap-4">
          <button 
            type="button"
            onClick={() => router.back()}
            className="px-6 py-3 rounded-xl border border-pulse-slate hover:bg-pulse-slate/30 transition-colors font-medium"
          >
            Cancel
          </button>
          <button 
            type="submit"
            disabled={loading}
            className="px-6 py-3 rounded-xl bg-pulse-gradient text-pulse-bg font-bold shadow-[0_0_20px_rgba(94,234,212,0.15)] hover:shadow-[0_0_30px_rgba(94,234,212,0.3)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Creating..." : "Create Event"}
          </button>
        </div>
      </form>
    </div>
  );
}
