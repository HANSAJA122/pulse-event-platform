"use client";

import { Link } from "@/i18n/routing";

export default function EventAnalyticsPage() {
  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <Link href={`/dashboard`} className="text-pulse-text/50 hover:text-pulse-text transition-colors">
          &larr; Back to Events
        </Link>
        <h1 className="text-3xl font-display font-bold">Analytics</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-pulse-bg border border-pulse-slate/50 rounded-2xl p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-pulse-cyan/10 blur-3xl pointer-events-none" />
          <h3 className="text-sm font-bold uppercase tracking-widest text-pulse-text/50 mb-2">Total RSVPs</h3>
          <p className="text-4xl font-mono font-bold">142</p>
          <div className="mt-4 text-xs font-bold text-pulse-cyan bg-pulse-cyan/10 inline-block px-2 py-1 rounded">
            +12 this week
          </div>
        </div>

        <div className="bg-pulse-bg border border-pulse-slate/50 rounded-2xl p-6 relative overflow-hidden">
          <h3 className="text-sm font-bold uppercase tracking-widest text-pulse-text/50 mb-2">Page Views</h3>
          <p className="text-4xl font-mono font-bold">850</p>
          <div className="mt-4 text-xs font-bold text-pulse-cyan bg-pulse-cyan/10 inline-block px-2 py-1 rounded">
            16% conversion rate
          </div>
        </div>

        <div className="bg-pulse-bg border border-pulse-slate/50 rounded-2xl p-6 relative overflow-hidden">
          <h3 className="text-sm font-bold uppercase tracking-widest text-pulse-text/50 mb-2">Revenue</h3>
          <p className="text-4xl font-mono font-bold">$2,450</p>
          <div className="mt-4 text-xs font-bold text-amber-500 bg-amber-500/10 inline-block px-2 py-1 rounded">
            Awaiting payout
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Mock Chart Area */}
        <div className="bg-pulse-bg border border-pulse-slate/50 rounded-2xl p-6">
          <h2 className="font-bold text-lg mb-6 text-pulse-cyan">Registration Activity</h2>
          <div className="h-64 flex items-end justify-between gap-2 border-b border-l border-pulse-slate/30 pb-2 pl-2">
            {/* Mock bars */}
            {[10, 25, 15, 40, 35, 60, 45].map((val, i) => (
              <div key={i} className="w-full bg-pulse-cyan/30 hover:bg-pulse-cyan/50 transition-colors rounded-t-sm relative group cursor-pointer" style={{ height: `${val}%` }}>
                 <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-pulse-slate text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                   {val}
                 </div>
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-xs text-pulse-text/50">
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
            <span>Sun</span>
          </div>
        </div>

        <div className="bg-pulse-bg border border-pulse-slate/50 rounded-2xl p-6">
          <h2 className="font-bold text-lg mb-6 text-pulse-cyan">Ticket Sales by Tier</h2>
          <div className="flex flex-col gap-4">
            <div>
              <div className="flex justify-between mb-1 text-sm font-medium">
                <span>General Admission</span>
                <span>100 / 200</span>
              </div>
              <div className="w-full h-3 bg-pulse-slate/20 rounded-full overflow-hidden">
                <div className="h-full bg-pulse-cyan" style={{ width: '50%' }} />
              </div>
            </div>
            
            <div>
              <div className="flex justify-between mb-1 text-sm font-medium">
                <span>VIP Pass</span>
                <span>42 / 50</span>
              </div>
              <div className="w-full h-3 bg-pulse-slate/20 rounded-full overflow-hidden">
                <div className="h-full bg-amber-500" style={{ width: '84%' }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
