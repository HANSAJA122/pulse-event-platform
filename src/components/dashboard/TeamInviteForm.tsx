"use client";

import { useState } from "react";
import { inviteMember } from "@/lib/actions/team";

export function TeamInviteForm({ teamId }: { teamId: string }) {
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<"ADMIN" | "COHOST" | "CHECKIN_STAFF">("COHOST");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail) return;
    
    setLoading(true);
    setErrorMsg("");
    
    try {
      await inviteMember(teamId, inviteEmail, inviteRole);
      setInviteEmail("");
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to invite member");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleInvite} className="glass-panel p-6 rounded-3xl sticky top-8">
      <h2 className="font-bold text-lg mb-6 text-white">Invite Member</h2>
      
      {errorMsg && (
        <div className="p-3 mb-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-200 text-sm">
          {errorMsg}
        </div>
      )}

      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-white/70">Email Address</label>
          <input 
            type="email" 
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
            placeholder="colleague@example.com"
            required
            className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-white/30 transition-colors text-sm text-white placeholder:text-white/30"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-white/70">Assign Role</label>
          <select 
            value={inviteRole}
            onChange={(e) => setInviteRole(e.target.value as any)}
            className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-white/30 transition-colors text-sm text-white appearance-none"
          >
            <option value="ADMIN">Admin (Full Access)</option>
            <option value="COHOST">Cohost (Manage Events)</option>
            <option value="CHECKIN_STAFF">Check-in Staff (Scanner Only)</option>
          </select>
        </div>

        <button 
          type="submit"
          disabled={loading || !inviteEmail}
          className="w-full mt-2 py-3 rounded-xl bg-aurora-gradient text-white font-bold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(121,40,202,0.3)]"
        >
          {loading ? "Sending..." : "Send Invite"}
        </button>
      </div>
      
      <div className="mt-8 pt-6 border-t border-white/10">
        <h3 className="font-bold text-sm mb-3 text-white">Role Permissions</h3>
        <ul className="text-xs space-y-3 text-white/50 leading-relaxed">
          <li><strong className="text-white/80">Admin:</strong> Can edit team settings, billing, and all events.</li>
          <li><strong className="text-white/80">Cohost:</strong> Can edit event details and view guest lists.</li>
          <li><strong className="text-white/80">Check-in Staff:</strong> Can only access the offline check-in scanner page.</li>
        </ul>
      </div>
    </form>
  );
}
