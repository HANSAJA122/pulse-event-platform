"use client";

import { useState } from "react";
import { Link } from "@/i18n/routing";

export default function BillingSettingsPage() {
  // In a real app, we'd check the Team or User model for a stripeConnectAccountId
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleConnect = () => {
    setLoading(true);
    // Simulate Stripe Connect OAuth redirect
    setTimeout(() => {
      setIsConnected(true);
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold">Billing & Payouts</h1>
        <p className="text-pulse-text/70 mt-2">Manage how you get paid for ticket sales.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 flex flex-col gap-8">
          
          <section className="bg-pulse-bg border border-pulse-slate/50 p-8 rounded-3xl relative overflow-hidden">
            {!isConnected && <div className="absolute top-0 right-0 w-64 h-64 bg-pulse-cyan/10 blur-3xl pointer-events-none" />}
            
            <h2 className="text-2xl font-bold font-display mb-2">Stripe Connect</h2>
            <p className="text-pulse-text/70 mb-6">
              Connect your Stripe account to receive payouts directly from ticket sales. Pulse takes a 2% platform fee, significantly lower than competitors.
            </p>

            {isConnected ? (
              <div className="flex flex-col gap-6 border-t border-pulse-slate/30 pt-6">
                <div className="flex items-center gap-4 text-pulse-cyan font-bold">
                  <span className="w-3 h-3 rounded-full bg-pulse-cyan animate-pulse-wave" />
                  Connected to Stripe
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-pulse-slate/10 border border-pulse-slate/30 rounded-xl p-4">
                    <p className="text-sm text-pulse-text/50 uppercase font-bold tracking-widest mb-1">Available Balance</p>
                    <p className="text-2xl font-mono">$1,240.00</p>
                  </div>
                  <div className="bg-pulse-slate/10 border border-pulse-slate/30 rounded-xl p-4">
                    <p className="text-sm text-pulse-text/50 uppercase font-bold tracking-widest mb-1">Next Payout</p>
                    <p className="text-2xl font-mono">Tomorrow</p>
                  </div>
                </div>
                
                <button 
                  onClick={() => setIsConnected(false)}
                  className="w-full md:w-auto px-6 py-3 rounded-xl border border-pulse-slate hover:bg-pulse-slate/30 transition-colors font-medium mt-2"
                >
                  Disconnect Account
                </button>
              </div>
            ) : (
              <button 
                onClick={handleConnect}
                disabled={loading}
                className="w-full md:w-auto px-8 py-4 rounded-xl bg-pulse-gradient text-pulse-bg font-bold shadow-[0_0_20px_rgba(94,234,212,0.15)] hover:shadow-[0_0_30px_rgba(94,234,212,0.3)] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? "Redirecting to Stripe..." : "Set up Payouts"}
                {!loading && <span className="font-serif italic font-normal text-pulse-bg/80">via Stripe</span>}
              </button>
            )}
          </section>

        </div>

        <div className="flex flex-col gap-4">
           <div className="p-6 border border-pulse-slate/50 bg-pulse-slate/10 rounded-2xl">
            <h3 className="font-bold mb-4 font-display text-lg">Fee Breakdown</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex justify-between border-b border-pulse-slate/30 pb-2">
                <span className="text-pulse-text/70">Pulse Platform Fee</span>
                <span className="font-bold text-pulse-cyan">2.0%</span>
              </li>
              <li className="flex justify-between border-b border-pulse-slate/30 pb-2">
                <span className="text-pulse-text/70">Stripe Processing</span>
                <span className="font-mono">2.9% + 30¢</span>
              </li>
              <li className="flex justify-between pt-2">
                <span className="text-pulse-text/70">Free Tickets</span>
                <span className="font-bold text-pulse-cyan">Always Free</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
