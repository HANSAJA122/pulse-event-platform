"use client";

import { Link } from "@/i18n/routing";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, CreditCard, Webhook } from "lucide-react";

export function DashboardSidebar() {
  const pathname = usePathname() || "";

  return (
    <aside className="w-full md:w-64 border-r border-pulse-border bg-black p-6 flex flex-col gap-8 h-full md:h-screen sticky top-0">
      <Link href="/dashboard" className="font-display font-bold text-2xl tracking-tight text-white flex items-center gap-2">
        <div className="w-3 h-3 bg-white rounded-full"></div>
        Pulse
      </Link>
      
      <nav className="flex flex-col gap-2">
        <Link 
          href="/dashboard" 
          className={`flex items-center gap-3 px-4 py-2.5 rounded-xl font-medium transition-colors ${pathname === '/en/dashboard' || pathname === '/dashboard' ? 'bg-white/10 text-white border border-white/5 shadow-inner' : 'text-pulse-text-muted hover:bg-white/5 hover:text-white'}`}
        >
          <LayoutDashboard className="w-4 h-4" />
          Events
        </Link>
        <Link 
          href="/dashboard/team" 
          className={`flex items-center gap-3 px-4 py-2.5 rounded-xl font-medium transition-colors ${pathname.includes('/team') ? 'bg-white/10 text-white border border-white/5 shadow-inner' : 'text-pulse-text-muted hover:bg-white/5 hover:text-white'}`}
        >
          <Users className="w-4 h-4" />
          Team
        </Link>
        <Link 
          href="/dashboard/settings/billing" 
          className={`flex items-center gap-3 px-4 py-2.5 rounded-xl font-medium transition-colors ${pathname.includes('/settings/billing') ? 'bg-white/10 text-white border border-white/5 shadow-inner' : 'text-pulse-text-muted hover:bg-white/5 hover:text-white'}`}
        >
          <CreditCard className="w-4 h-4" />
          Billing & Payouts
        </Link>

        <Link 
          href="/dashboard/settings/webhooks" 
          className={`flex items-center gap-3 px-4 py-2.5 rounded-xl font-medium transition-colors ${pathname.includes('/settings/webhooks') ? 'bg-white/10 text-white border border-white/5 shadow-inner' : 'text-pulse-text-muted hover:bg-white/5 hover:text-white'}`}
        >
          <Webhook className="w-4 h-4" />
          Webhooks
        </Link>
      </nav>
    </aside>
  );
}
