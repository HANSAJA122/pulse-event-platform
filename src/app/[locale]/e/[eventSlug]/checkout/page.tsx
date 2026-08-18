"use client";

import { use, useState } from "react";
import { Link, useRouter } from "@/i18n/routing";
import { submitRsvp } from "@/actions/rsvp";

export default function CheckoutPage({
  params,
}: {
  params: Promise<{ eventSlug: string; locale: string }>;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { eventSlug } = use(params);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    const formData = new FormData(e.currentTarget);
    const result = await submitRsvp(eventSlug, formData);
    
    if (result.success) {
      // Show success state or redirect
      router.push(`/e/${eventSlug}?rsvp=success`);
    } else {
      setError(result.error || "Failed to submit RSVP");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-pulse-bg flex flex-col md:flex-row">
      {/* Left side: Form */}
      <div className="flex-1 p-8 md:p-16 flex flex-col justify-center max-w-2xl mx-auto w-full">
        <div className="mb-8">
          <Link href={`/e/${eventSlug}`} className="text-pulse-text/50 hover:text-pulse-cyan transition-colors mb-8 inline-block">
            &larr; Back to Event
          </Link>
          <h1 className="text-4xl font-display font-bold mb-2">Complete your RSVP</h1>
          <p className="text-pulse-text/70">Register for Frontend Founders Meetup.</p>
        </div>

        {error && (
          <div className="p-4 mb-6 rounded-xl bg-red-900/20 border border-red-500/50 text-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="flex flex-col gap-4">
            <h3 className="font-bold text-pulse-cyan text-lg">Select Ticket</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="border border-pulse-cyan bg-pulse-slate/20 rounded-xl p-4 cursor-pointer relative flex flex-col justify-between h-32 hover:border-pulse-cyan/80 transition-colors">
                <input type="radio" name="ticket_tier" value="free" defaultChecked className="absolute top-4 right-4 accent-pulse-cyan w-5 h-5" />
                <div className="font-bold text-lg">General Admission</div>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-bold font-mono">Free</span>
                </div>
              </label>
              
              <label className="border border-pulse-slate/50 bg-pulse-slate/5 rounded-xl p-4 cursor-pointer relative flex flex-col justify-between h-32 hover:border-pulse-cyan/50 transition-colors opacity-80 hover:opacity-100">
                <input type="radio" name="ticket_tier" value="vip" className="absolute top-4 right-4 accent-pulse-cyan w-5 h-5" />
                <div className="font-bold text-lg">VIP Pass</div>
                <div className="flex flex-col">
                  <div className="flex items-baseline gap-1">
                    <span className="text-xl font-bold font-mono">$49</span>
                    <span className="text-pulse-text/50 text-sm">.00</span>
                  </div>
                  <span className="text-xs text-pulse-text/50 mt-1">Includes afterparty</span>
                </div>
              </label>
            </div>
          </div>
          
          <div className="w-full h-px border-t border-pulse-slate/30 my-2" />

          <div className="flex flex-col gap-2">
            <label className="font-medium text-pulse-text/80">Full Name</label>
            <input 
              type="text" 
              name="name"
              required 
              placeholder="Jane Doe"
              className="w-full py-3 px-4 rounded-xl bg-pulse-bg border border-pulse-slate focus:outline-none focus:border-pulse-cyan transition-colors"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-medium text-pulse-text/80">Email Address</label>
            <input 
              type="email" 
              name="email"
              required 
              placeholder="jane@example.com"
              className="w-full py-3 px-4 rounded-xl bg-pulse-bg border border-pulse-slate focus:outline-none focus:border-pulse-cyan transition-colors"
            />
          </div>
          
          <div className="w-full h-px border-t border-pulse-slate/30 my-4" />
          
          <div className="flex flex-col gap-2">
            <label className="font-medium text-pulse-text/80">Dietary Restrictions</label>
            <input 
              type="text" 
              name="custom_1"
              placeholder="e.g. Vegetarian, Nut Allergy"
              className="w-full py-3 px-4 rounded-xl bg-pulse-bg border border-pulse-slate focus:outline-none focus:border-pulse-cyan transition-colors"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-medium text-pulse-text/80">How did you hear about us? <span className="text-pulse-cyan">*</span></label>
            <select 
              name="custom_2"
              required
              className="w-full py-3 px-4 rounded-xl bg-pulse-bg border border-pulse-slate focus:outline-none focus:border-pulse-cyan transition-colors appearance-none"
            >
              <option value="">Select an option</option>
              <option value="Twitter">Twitter</option>
              <option value="Friend">Friend</option>
              <option value="Newsletter">Newsletter</option>
            </select>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-xl bg-pulse-gradient text-pulse-bg font-bold text-lg shadow-[0_0_20px_rgba(94,234,212,0.15)] hover:shadow-[0_0_30px_rgba(94,234,212,0.3)] hover:-translate-y-1 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none mt-4"
          >
            {loading ? "Confirming..." : "Confirm RSVP (Free)"}
          </button>
        </form>
      </div>

      {/* Right side: Event Summary Visual */}
      <div className="hidden md:flex flex-1 bg-pulse-slate/10 border-l border-pulse-slate/30 p-16 items-center justify-center">
         <div className="w-full max-w-sm border border-pulse-slate/50 bg-pulse-bg p-8 rounded-3xl shadow-2xl relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-pulse-cyan/10 blur-3xl pointer-events-none" />
            <div className="text-pulse-cyan text-xs font-bold uppercase tracking-wider mb-8">Event Ticket</div>
            <h2 className="text-2xl font-display font-bold mb-4">Frontend Founders Meetup</h2>
            <div className="space-y-4 font-mono text-sm text-pulse-text/70">
              <div className="flex justify-between border-b border-pulse-slate/30 pb-2">
                <span>Date</span>
                <span className="text-pulse-text">Oct 24, 2026</span>
              </div>
              <div className="flex justify-between border-b border-pulse-slate/30 pb-2">
                <span>Time</span>
                <span className="text-pulse-text">6:00 PM</span>
              </div>
              <div className="flex justify-between border-b border-pulse-slate/30 pb-2">
                <span>Location</span>
                <span className="text-pulse-text">SF Tech Hub</span>
              </div>
            </div>
         </div>
      </div>
    </div>
  );
}
