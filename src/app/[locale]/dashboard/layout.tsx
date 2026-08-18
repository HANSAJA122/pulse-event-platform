"use client";

import { Link } from "@/i18n/routing";
import { usePathname } from "next/navigation";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname() || "";

  return (
    <div className="min-h-screen bg-pulse-bg text-pulse-text flex flex-col md:flex-row">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 border-r border-pulse-slate/30 bg-pulse-bg/50 p-6 flex flex-col gap-8">
        <div className="font-display font-bold text-2xl text-pulse-cyan">Pulse</div>
        
        <nav className="flex flex-col gap-2">
          <Link href="/dashboard" className={`px-4 py-2 rounded-lg font-medium ${pathname === '/dashboard' ? 'bg-pulse-slate/20 text-pulse-text border border-pulse-slate/50' : 'text-pulse-text/70 hover:bg-pulse-slate/10 hover:text-pulse-text'}`}>
            Events
          </Link>
          <Link href="/dashboard/team" className={`px-4 py-2 rounded-lg ${pathname === '/dashboard/team' ? 'bg-pulse-slate/20 text-pulse-text font-bold' : 'text-pulse-text/70 hover:bg-pulse-slate/10 hover:text-pulse-text'}`}>
            Team
          </Link>
          <Link href={`/dashboard/settings/billing`} className={`flex items-center gap-3 px-4 py-2 rounded-lg text-pulse-text/70 hover:text-pulse-text hover:bg-pulse-slate/10 transition-colors ${pathname.includes('/settings/billing') ? 'bg-pulse-slate/20 text-pulse-text font-bold' : ''}`}>
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
            Billing & Payouts
          </Link>

          <Link href={`/dashboard/settings/webhooks`} className={`flex items-center gap-3 px-4 py-2 rounded-lg text-pulse-text/70 hover:text-pulse-text hover:bg-pulse-slate/10 transition-colors ${pathname.includes('/settings/webhooks') ? 'bg-pulse-slate/20 text-pulse-text font-bold' : ''}`}>
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Webhooks
          </Link>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
