"use client";

import { useState } from "react";
import { Link } from "@/i18n/routing";

export default function TeamPage() {
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("COHOST");
  const [loading, setLoading] = useState(false);
  
  // Mock team members
  const [members, setMembers] = useState([
    { id: "1", name: "Demo Host", email: "demo@pulse.dev", role: "OWNER", status: "Active" },
    { id: "2", name: "Sarah Chen", email: "sarah@pulse.dev", role: "ADMIN", status: "Active" },
    { id: "3", name: "Marcus Johnson", email: "marcus@pulse.dev", role: "CHECKIN_STAFF", status: "Invited" },
  ]);

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail) return;
    
    setLoading(true);
    setTimeout(() => {
      setMembers([...members, {
        id: Math.random().toString(36).substring(7),
        name: "Pending User",
        email: inviteEmail,
        role: inviteRole,
        status: "Invited"
      }]);
      setInviteEmail("");
      setLoading(false);
    }, 800);
  };

  const getRoleBadgeColor = (role: string) => {
    switch(role) {
      case "OWNER": return "bg-aurora-gradient-subtle text-white border-white/20 shadow-[0_0_10px_rgba(255,77,77,0.2)]";
      case "ADMIN": return "bg-white/10 text-white border-white/20";
      case "COHOST": return "bg-white/5 text-white/80 border-white/10";
      case "CHECKIN_STAFF": return "bg-transparent text-white/50 border-white/5";
      default: return "bg-white/5 text-white";
    }
  };

  const formatRoleName = (role: string) => {
    return role.replace("_", " ").toLowerCase().replace(/\b\w/g, c => c.toUpperCase());
  };

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-4xl font-display font-bold tracking-tight">Team & Roles</h1>
        <p className="text-pulse-text-muted mt-2">Manage collaborators and permissions for your team workspace.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Members List */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <div className="glass-panel rounded-3xl overflow-hidden">
            <div className="p-6 border-b border-white/10 bg-white/5">
              <h2 className="font-bold text-lg">Active Members</h2>
            </div>
            
            <div className="flex flex-col divide-y divide-white/5">
              {members.map((member) => (
                <div key={member.id} className="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between hover:bg-white/[0.02] transition-colors gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-white/10 border border-white/20 flex items-center justify-center font-bold text-lg">
                      {member.name[0]}
                    </div>
                    <div>
                      <div className="font-bold flex items-center gap-2">
                        {member.name}
                        {member.status === 'Invited' && (
                          <span className="text-[10px] uppercase tracking-widest bg-white/10 px-2 py-0.5 rounded-full text-white/60">Pending</span>
                        )}
                      </div>
                      <div className="text-sm text-pulse-text-muted">{member.email}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                    <span className={`text-xs px-3 py-1 rounded-full border font-medium uppercase tracking-wider ${getRoleBadgeColor(member.role)}`}>
                      {formatRoleName(member.role)}
                    </span>
                    
                    {member.role !== 'OWNER' && (
                      <button className="text-pulse-text-muted hover:text-red-400 transition-colors px-2 text-sm font-medium">
                        Remove
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Invite Sidebar */}
        <div>
          <form onSubmit={handleInvite} className="glass-panel p-6 rounded-3xl sticky top-8">
            <h2 className="font-bold text-lg mb-6">Invite Member</h2>
            
            <div className="flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-pulse-text-muted">Email Address</label>
                <input 
                  type="email" 
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="colleague@example.com"
                  required
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-white/30 transition-colors text-sm placeholder:text-white/30"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-pulse-text-muted">Assign Role</label>
                <select 
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value)}
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-white/30 transition-colors text-sm appearance-none"
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
              <h3 className="font-bold text-sm mb-3">Role Permissions</h3>
              <ul className="text-xs space-y-3 text-pulse-text-muted leading-relaxed">
                <li><strong className="text-white">Admin:</strong> Can edit team settings, billing, and all events.</li>
                <li><strong className="text-white">Cohost:</strong> Can edit event details and view guest lists.</li>
                <li><strong className="text-white">Check-in Staff:</strong> Can only access the offline check-in scanner page.</li>
              </ul>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
}
