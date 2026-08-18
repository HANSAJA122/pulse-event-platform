"use client";

import { removeMember, removeInvitation } from "@/lib/actions/team";
import { useState } from "react";

export function RemoveMemberButton({ 
  teamId, 
  id, 
  isInvite 
}: { 
  teamId: string; 
  id: string; 
  isInvite: boolean;
}) {
  const [loading, setLoading] = useState(false);

  const handleRemove = async () => {
    if (!confirm(isInvite ? "Revoke this invitation?" : "Remove this member from the team?")) return;
    
    setLoading(true);
    try {
      if (isInvite) {
        await removeInvitation(id);
      } else {
        await removeMember(teamId, id);
      }
    } catch (err: any) {
      alert(err.message || "Failed to remove");
      setLoading(false);
    }
  };

  return (
    <button 
      onClick={handleRemove}
      disabled={loading}
      className="text-white/50 hover:text-red-400 transition-colors px-2 text-sm font-medium disabled:opacity-50"
    >
      {isInvite ? "Revoke" : "Remove"}
    </button>
  );
}
