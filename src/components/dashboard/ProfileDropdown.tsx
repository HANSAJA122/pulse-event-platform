"use client";

import { useState } from "react";
import { signOut, signIn } from "next-auth/react";
import { LogOut, UserPlus, Home, ChevronDown, User } from "lucide-react";
import { Link } from "@/i18n/routing";

interface ProfileDropdownProps {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

export function ProfileDropdown({ user }: ProfileDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 px-3 py-2 rounded-full glass-panel-interactive transition-all"
      >
        {user.image ? (
          <img src={user.image} alt="Profile" className="w-8 h-8 rounded-full" />
        ) : (
          <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
            <User className="w-4 h-4 text-white" />
          </div>
        )}
        <div className="hidden md:flex flex-col items-start text-left">
          <span className="text-sm font-semibold leading-tight">{user.name || "User"}</span>
          <span className="text-xs text-pulse-text-muted leading-tight max-w-[120px] truncate">{user.email}</span>
        </div>
        <ChevronDown className={`w-4 h-4 text-pulse-text-muted transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)}></div>
          <div className="absolute right-0 mt-2 w-56 glass-panel rounded-2xl shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2">
            
            <Link 
              href="/" 
              onClick={() => setIsOpen(false)}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium hover:bg-white/10 transition-colors"
            >
              <Home className="w-4 h-4 text-white/70" />
              Return Home
            </Link>

            <button 
              onClick={() => signIn("google", { prompt: "select_account", redirectTo: "/dashboard" })}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium hover:bg-white/10 transition-colors"
            >
              <UserPlus className="w-4 h-4 text-white/70" />
              Switch Account
            </button>
            
            <div className="h-px bg-white/10 my-1 mx-2" />
            
            <button 
              onClick={() => signOut({ callbackUrl: "/" })}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium hover:bg-red-500/20 text-red-400 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Log Out
            </button>

          </div>
        </>
      )}
    </div>
  );
}
