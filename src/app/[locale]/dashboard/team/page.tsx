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
      case "OWNER": return "bg-purple-900/50 text-purple-200 border-purple-500/30";
      case "ADMIN": return "bg-pulse-cyan/20 text-pulse-cyan border-pulse-cyan/30";
      case "COHOST": return "bg-blue-900/50 text-blue-200 border-blue-500/30";
      case "CHECKIN_STAFF": return "bg-pulse-slate/40 text-pulse-text border-pulse-slate/50";
      default: return "bg-pulse-slate/20 text-pulse-text";
    }
  };

  const formatRoleName = (role: string) => {
    return role.replace("_", " ").toLowerCase().replace(/\b\w/g, c => c.toUpperCase());
  };

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold">Team & Roles</h1>
          <p className="text-pulse-text/70 mt-2">Manage collaborators and permissions for your team workspace.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Members List */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <div className="bg-pulse-bg border border-pulse-slate/50 rounded-2xl overflow-hidden">
            <div className="p-4 border-b border-pulse-slate/30 bg-pulse-slate/5">
              <h2 className="font-bold">Active Members</h2>
            </div>
            
            <div className="flex flex-col divide-y divide-pulse-slate/30">
              {members.map((member) => (
                <div key={member.id} className="p-4 flex items-center justify-between hover:bg-pulse-slate/5 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-pulse-slate/30 flex items-center justify-center font-bold text-lg">
                      {member.name[0]}
                    </div>
                    <div>
                      <div className="font-bold flex items-center gap-2">
                        {member.name}
                        {member.status === 'Invited' && (
                          <span className="text-[10px] uppercase tracking-wider bg-pulse-slate/30 px-2 py-0.5 rounded text-pulse-text/60">Pending</span>
                        )}
                      </div>
                      <div className="text-sm text-pulse-text/50">{member.email}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <span className={`text-xs px-2 py-1 rounded-md border font-medium uppercase tracking-wider ${getRoleBadgeColor(member.role)}`}>
                      {formatRoleName(member.role)}
                    </span>
                    
                    {member.role !== 'OWNER' && (
                      <button className="text-pulse-text/30 hover:text-red-400 transition-colors px-2">
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
          <form onSubmit={handleInvite} className="bg-pulse-slate/10 border border-pulse-slate/50 p-6 rounded-2xl sticky top-8">
            <h2 className="font-bold text-lg text-pulse-cyan mb-4">Invite Member</h2>
            
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-pulse-text/70">Email Address</label>
                <input 
                  type="email" 
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="colleague@example.com"
                  required
                  className="w-full bg-pulse-bg border border-pulse-slate/50 rounded-lg px-3 py-2 focus:outline-none focus:border-pulse-cyan"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-pulse-text/70">Assign Role</label>
                <select 
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value)}
                  className="w-full bg-pulse-bg border border-pulse-slate/50 rounded-lg px-3 py-2 focus:outline-none focus:border-pulse-cyan appearance-none"
                >
                  <option value="ADMIN">Admin (Full Access)</option>
                  <option value="COHOST">Cohost (Manage Events)</option>
                  <option value="CHECKIN_STAFF">Check-in Staff (Scanner Only)</option>
                </select>
              </div>

              <button 
                type="submit"
                disabled={loading || !inviteEmail}
                className="w-full mt-4 py-3 rounded-lg bg-pulse-text text-pulse-bg font-bold hover:bg-pulse-cyan transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Sending..." : "Send Invite"}
              </button>
            </div>
            
            <div className="mt-8 pt-6 border-t border-pulse-slate/30">
              <h3 className="font-bold text-sm mb-2 text-pulse-text/70">Role Permissions</h3>
              <ul className="text-xs space-y-2 text-pulse-text/50">
                <li><strong className="text-pulse-text/80">Admin:</strong> Can edit team settings, billing, and all events.</li>
                <li><strong className="text-pulse-text/80">Cohost:</strong> Can edit event details and view guest lists.</li>
                <li><strong className="text-pulse-text/80">Check-in Staff:</strong> Can only access the offline check-in scanner page.</li>
              </ul>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
}
