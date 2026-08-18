"use client";

import { useState } from "react";
import { Link } from "@/i18n/routing";
import { createEvent } from "@/lib/actions/event";

export default function NewEventPage() {
  const [loading, setLoading] = useState(false);

  return (
    <div className="p-4 md:p-8 max-w-3xl mx-auto space-y-8">
      <div>
        <Link href="/dashboard" className="text-pulse-text-muted hover:text-white transition-colors text-sm font-medium mb-4 inline-block">
          &larr; Back to Events
        </Link>
        <h1 className="text-4xl font-display font-bold tracking-tight">Create New Event</h1>
      </div>
      
      <form 
        action={async (formData) => {
          setLoading(true);
          try {
            await createEvent(formData);
          } catch (e) {
            console.error(e);
            setLoading(false);
          }
        }} 
        className="glass-panel p-6 md:p-8 rounded-3xl flex flex-col gap-6"
      >
        <div className="flex flex-col gap-3">
          <label className="font-bold text-white text-lg tracking-tight">Event Title</label>
          <input 
            type="text" 
            name="title"
            required 
            placeholder="e.g. Design Systems Conf 2026"
            className="w-full py-4 px-5 rounded-2xl bg-black/50 border border-white/10 focus:outline-none focus:border-white/30 transition-colors text-lg placeholder:text-white/20"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-3">
            <label className="font-bold text-white tracking-tight">Start Date & Time</label>
            <input 
              type="datetime-local" 
              name="startAt"
              required 
              className="w-full py-3 px-4 rounded-xl bg-black/50 border border-white/10 focus:outline-none focus:border-white/30 transition-colors text-white/90"
            />
          </div>
          <div className="flex flex-col gap-3">
            <label className="font-bold text-white tracking-tight">End Date & Time</label>
            <input 
              type="datetime-local" 
              name="endAt"
              required 
              className="w-full py-3 px-4 rounded-xl bg-black/50 border border-white/10 focus:outline-none focus:border-white/30 transition-colors text-white/90"
            />
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <label className="font-bold text-white tracking-tight">Location Type</label>
          <div className="relative">
            <select name="locationType" className="w-full py-3 px-4 rounded-xl bg-black/50 border border-white/10 focus:outline-none focus:border-white/30 transition-colors appearance-none text-white/90">
              <option value="PHYSICAL">Physical Location</option>
              <option value="VIRTUAL">Virtual (Zoom, Google Meet)</option>
              <option value="HYBRID">Hybrid</option>
            </select>
            <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-white/50">
              ▼
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <label className="font-bold text-white tracking-tight">Description</label>
          <textarea 
            name="description"
            rows={5}
            placeholder="Tell your guests what this event is all about..."
            className="w-full py-3 px-4 rounded-xl bg-black/50 border border-white/10 focus:outline-none focus:border-white/30 transition-colors resize-none placeholder:text-white/20"
          />
        </div>

        <div className="pt-6 mt-2 border-t border-white/10 flex flex-col sm:flex-row justify-end gap-4">
          <Link 
            href="/dashboard"
            className="px-8 py-3 rounded-xl border-2 border-white/10 hover:bg-white/5 transition-colors font-medium text-center"
          >
            Cancel
          </Link>
          <button 
            type="submit"
            disabled={loading}
            className="px-8 py-3 rounded-xl bg-aurora-gradient text-white font-bold shadow-[0_0_20px_rgba(121,40,202,0.3)] hover:shadow-[0_0_30px_rgba(255,77,77,0.4)] transition-all disabled:opacity-50 disabled:cursor-not-allowed text-center"
          >
            {loading ? "Creating..." : "Create Event"}
          </button>
        </div>
      </form>
    </div>
  );
}
