import { getDefaultTeam } from "@/lib/actions/team";
import { TeamInviteForm } from "@/components/dashboard/TeamInviteForm";
import { RemoveMemberButton } from "@/components/dashboard/RemoveMemberButton";

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

export default async function TeamPage() {
  const team = await getDefaultTeam();

  // Sort members so OWNER is first
  const sortedMembers = [...team.members].sort((a, b) => {
    if (a.role === "OWNER") return -1;
    if (b.role === "OWNER") return 1;
    return 0;
  });

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-4xl font-display font-bold tracking-tight">Team & Roles</h1>
        <p className="text-white/60 mt-2">Manage collaborators and permissions for {team.name}.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Members List */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <div className="glass-panel rounded-3xl overflow-hidden">
            <div className="p-6 border-b border-white/10 bg-white/5">
              <h2 className="font-bold text-lg text-white">Active Members</h2>
            </div>
            
            <div className="flex flex-col divide-y divide-white/5">
              {sortedMembers.map((member) => (
                <div key={member.id} className="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between hover:bg-white/[0.02] transition-colors gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-white/10 border border-white/20 flex items-center justify-center font-bold text-lg text-white">
                      {(member.user.name || "U")[0].toUpperCase()}
                    </div>
                    <div>
                      <div className="font-bold flex items-center gap-2 text-white">
                        {member.user.name || "Unknown User"}
                      </div>
                      <div className="text-sm text-white/60">{member.user.email}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                    <span className={`text-xs px-3 py-1 rounded-full border font-medium uppercase tracking-wider ${getRoleBadgeColor(member.role)}`}>
                      {formatRoleName(member.role)}
                    </span>
                    
                    {member.role !== 'OWNER' && (
                      <RemoveMemberButton teamId={team.id} id={member.id} isInvite={false} />
                    )}
                  </div>
                </div>
              ))}

              {team.invitations.map((invite) => (
                <div key={invite.id} className="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between hover:bg-white/[0.02] transition-colors gap-4 opacity-70">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 border-dashed flex items-center justify-center font-bold text-lg text-white/50">
                      {invite.email[0].toUpperCase()}
                    </div>
                    <div>
                      <div className="font-bold flex items-center gap-2 text-white">
                        {invite.email.split("@")[0]}
                        <span className="text-[10px] uppercase tracking-widest bg-white/10 px-2 py-0.5 rounded-full text-white/60">Pending</span>
                      </div>
                      <div className="text-sm text-white/50">{invite.email}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                    <span className={`text-xs px-3 py-1 rounded-full border font-medium uppercase tracking-wider ${getRoleBadgeColor(invite.role)}`}>
                      {formatRoleName(invite.role)}
                    </span>
                    <RemoveMemberButton teamId={team.id} id={invite.id} isInvite={true} />
                  </div>
                </div>
              ))}

              {sortedMembers.length === 0 && team.invitations.length === 0 && (
                <div className="p-8 text-center text-white/50">No members yet.</div>
              )}
            </div>
          </div>
        </div>

        {/* Invite Sidebar */}
        <div>
          <TeamInviteForm teamId={team.id} />
        </div>

      </div>
    </div>
  );
}
