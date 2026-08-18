"use client";

import { useState } from "react";
import { Link } from "@/i18n/routing";

export default function EventSponsorsPage() {
  const [sponsors, setSponsors] = useState([
    { id: "1", name: "Vercel", tier: "Platinum", link: "https://vercel.com" },
    { id: "2", name: "Stripe", tier: "Gold", link: "https://stripe.com" }
  ]);
  
  const [isAdding, setIsAdding] = useState(false);
  const [newSponsor, setNewSponsor] = useState({ name: "", tier: "Gold", link: "" });

  const handleAdd = () => {
    if (newSponsor.name) {
      setSponsors([...sponsors, { ...newSponsor, id: Math.random().toString() }]);
      setNewSponsor({ name: "", tier: "Gold", link: "" });
      setIsAdding(false);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <Link href={`/dashboard`} className="text-pulse-text/50 hover:text-pulse-text transition-colors">
          &larr; Back to Events
        </Link>
        <h1 className="text-3xl font-display font-bold">Event Sponsors</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="bg-pulse-bg border border-pulse-slate/50 p-6 rounded-2xl">
             <div className="flex items-center justify-between mb-6">
               <h2 className="font-bold text-lg text-pulse-cyan">Manage Sponsors</h2>
             </div>
             
             <div className="flex flex-col gap-4">
               {sponsors.map(sponsor => (
                 <div key={sponsor.id} className="border border-pulse-slate/50 rounded-xl p-4 bg-pulse-slate/5 flex items-center justify-between">
                   <div>
                     <h3 className="font-bold text-lg">{sponsor.name}</h3>
                     <a href={sponsor.link} target="_blank" rel="noreferrer" className="text-sm text-pulse-text/50 hover:text-pulse-cyan transition-colors">{sponsor.link}</a>
                   </div>
                   <div className="flex items-center gap-4">
                     <span className="text-xs uppercase tracking-widest font-bold border border-pulse-cyan/30 text-pulse-cyan px-2 py-1 rounded bg-pulse-cyan/10">
                       {sponsor.tier}
                     </span>
                     <button onClick={() => setSponsors(sponsors.filter(s => s.id !== sponsor.id))} className="text-pulse-text/30 hover:text-red-400">Remove</button>
                   </div>
                 </div>
               ))}

               {isAdding && (
                 <div className="border border-pulse-slate/50 rounded-xl p-4 bg-pulse-slate/10 flex flex-col gap-4 mt-4">
                   <input 
                     type="text" 
                     placeholder="Sponsor Name"
                     value={newSponsor.name}
                     onChange={e => setNewSponsor({...newSponsor, name: e.target.value})}
                     className="bg-pulse-bg border border-pulse-slate/50 rounded-lg px-3 py-2 focus:outline-none focus:border-pulse-cyan"
                   />
                   <div className="grid grid-cols-2 gap-4">
                     <input 
                       type="url" 
                       placeholder="Website URL"
                       value={newSponsor.link}
                       onChange={e => setNewSponsor({...newSponsor, link: e.target.value})}
                       className="bg-pulse-bg border border-pulse-slate/50 rounded-lg px-3 py-2 focus:outline-none focus:border-pulse-cyan"
                     />
                     <select 
                       value={newSponsor.tier}
                       onChange={e => setNewSponsor({...newSponsor, tier: e.target.value})}
                       className="bg-pulse-bg border border-pulse-slate/50 rounded-lg px-3 py-2 focus:outline-none focus:border-pulse-cyan appearance-none"
                     >
                       <option value="Platinum">Platinum</option>
                       <option value="Gold">Gold</option>
                       <option value="Silver">Silver</option>
                       <option value="Partner">Partner</option>
                     </select>
                   </div>
                   <div className="flex justify-end gap-2">
                     <button onClick={() => setIsAdding(false)} className="px-4 py-2 text-sm text-pulse-text/70">Cancel</button>
                     <button onClick={handleAdd} className="px-4 py-2 text-sm bg-pulse-cyan text-pulse-bg font-bold rounded-lg">Save</button>
                   </div>
                 </div>
               )}

               {!isAdding && (
                 <button onClick={() => setIsAdding(true)} className="mt-4 py-3 border border-dashed border-pulse-slate/50 rounded-xl text-pulse-text/50 hover:bg-pulse-slate/20 transition-colors">
                   + Add Sponsor
                 </button>
               )}
             </div>
          </div>
        </div>

        <div className="flex flex-col gap-4">
           <div className="p-4 border border-pulse-slate/50 bg-pulse-slate/10 rounded-xl">
            <h3 className="font-bold mb-2 text-pulse-cyan">Sponsorships</h3>
            <p className="text-sm text-pulse-text/70">
              Highlight your event partners. Sponsors will appear at the bottom of the public event page.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
