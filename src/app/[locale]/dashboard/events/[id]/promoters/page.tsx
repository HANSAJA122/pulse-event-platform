"use client";

import { useState } from "react";
import { Link } from "@/i18n/routing";

export default function PromotersPage() {
  const [promoters, setPromoters] = useState([
    { id: "1", name: "Tech Newsletter", code: "TECHWEEK26", commission: 15, clicks: 142, sales: 12, revenue: 600 }
  ]);
  
  const [isAdding, setIsAdding] = useState(false);
  const [newPromoter, setNewPromoter] = useState({ name: "", code: "", commission: 10 });

  const handleAdd = () => {
    if (newPromoter.name && newPromoter.code) {
      setPromoters([...promoters, { ...newPromoter, id: Math.random().toString(), clicks: 0, sales: 0, revenue: 0 }]);
      setNewPromoter({ name: "", code: "", commission: 10 });
      setIsAdding(false);
    }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <Link href={`/dashboard`} className="text-pulse-text/50 hover:text-pulse-text transition-colors">
          &larr; Back to Events
        </Link>
        <h1 className="text-3xl font-display font-bold">Promoters & Affiliates</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3 flex flex-col gap-6">
          <div className="bg-pulse-bg border border-pulse-slate/50 p-6 rounded-2xl">
             <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
               <h2 className="font-bold text-lg text-pulse-cyan">Manage Links</h2>
               
               {!isAdding && (
                 <button onClick={() => setIsAdding(true)} className="px-4 py-2 rounded-lg bg-pulse-cyan text-pulse-bg font-bold text-sm hover:bg-pulse-cyan/90 transition-colors">
                   + Create Link
                 </button>
               )}
             </div>
             
             {isAdding && (
               <div className="border border-pulse-cyan/50 rounded-xl p-5 bg-pulse-cyan/5 flex flex-col gap-5 mb-8">
                 <h3 className="font-bold text-pulse-cyan">New Tracking Link</h3>
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                   <div>
                     <label className="text-xs font-bold text-pulse-text/70 mb-2 block uppercase tracking-wider">Promoter Name</label>
                     <input 
                       type="text" 
                       placeholder="e.g. Frontend Daily"
                       value={newPromoter.name}
                       onChange={e => setNewPromoter({...newPromoter, name: e.target.value})}
                       className="w-full bg-pulse-bg border border-pulse-slate/50 rounded-lg px-3 py-2 focus:outline-none focus:border-pulse-cyan"
                     />
                   </div>
                   
                   <div>
                     <label className="text-xs font-bold text-pulse-text/70 mb-2 block uppercase tracking-wider">Unique Code</label>
                     <div className="relative">
                       <span className="absolute left-3 top-2 text-pulse-text/50 font-mono">?ref=</span>
                       <input 
                         type="text" 
                         placeholder="FD26"
                         value={newPromoter.code}
                         onChange={e => setNewPromoter({...newPromoter, code: e.target.value.toUpperCase()})}
                         className="w-full bg-pulse-bg border border-pulse-slate/50 rounded-lg pl-14 pr-3 py-2 focus:outline-none focus:border-pulse-cyan font-mono uppercase"
                       />
                     </div>
                   </div>
                   
                   <div className="sm:col-span-2">
                     <label className="text-xs font-bold text-pulse-text/70 mb-2 block uppercase tracking-wider">Commission (%)</label>
                     <input 
                       type="number" 
                       min="0" max="100"
                       value={newPromoter.commission}
                       onChange={e => setNewPromoter({...newPromoter, commission: parseInt(e.target.value) || 0})}
                       className="w-full sm:w-1/2 bg-pulse-bg border border-pulse-slate/50 rounded-lg px-3 py-2 focus:outline-none focus:border-pulse-cyan font-mono"
                     />
                   </div>
                 </div>
                 
                 <div className="flex justify-end gap-2 pt-4 border-t border-pulse-slate/30/50">
                   <button onClick={() => setIsAdding(false)} className="px-4 py-2 text-sm text-pulse-text/70 hover:text-pulse-text transition-colors">Cancel</button>
                   <button onClick={handleAdd} className="px-4 py-2 text-sm bg-pulse-cyan text-pulse-bg font-bold rounded-lg hover:bg-pulse-cyan/90 transition-colors">Generate Link</button>
                 </div>
               </div>
             )}

             <div className="overflow-x-auto">
               <table className="w-full text-left border-collapse">
                 <thead>
                   <tr className="border-b border-pulse-slate/30 text-xs uppercase tracking-widest text-pulse-text/50">
                     <th className="pb-3 font-bold">Promoter</th>
                     <th className="pb-3 font-bold">Code</th>
                     <th className="pb-3 font-bold text-right">Commission</th>
                     <th className="pb-3 font-bold text-right">Clicks</th>
                     <th className="pb-3 font-bold text-right">Sales</th>
                     <th className="pb-3 font-bold text-right">Revenue</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-pulse-slate/20">
                   {promoters.map(promoter => (
                     <tr key={promoter.id} className="hover:bg-pulse-slate/5 transition-colors group">
                       <td className="py-4 font-bold">{promoter.name}</td>
                       <td className="py-4 font-mono text-sm text-pulse-cyan bg-pulse-cyan/10 px-2 rounded inline-block mt-3">{promoter.code}</td>
                       <td className="py-4 text-right">{promoter.commission}%</td>
                       <td className="py-4 text-right font-mono">{promoter.clicks}</td>
                       <td className="py-4 text-right font-mono">{promoter.sales}</td>
                       <td className="py-4 text-right font-mono text-green-400 font-bold">${promoter.revenue}</td>
                     </tr>
                   ))}
                   {promoters.length === 0 && (
                     <tr>
                       <td colSpan={6} className="py-8 text-center text-pulse-text/50">
                         No promoters added yet. Create a tracking link to get started.
                       </td>
                     </tr>
                   )}
                 </tbody>
               </table>
             </div>
          </div>
        </div>

        <div className="flex flex-col gap-4">
           <div className="p-4 border border-pulse-slate/50 bg-pulse-slate/10 rounded-xl sticky top-8">
            <h3 className="font-bold mb-2 text-pulse-cyan">Affiliate Program</h3>
            <p className="text-sm text-pulse-text/70 mb-4">
              Incentivize partners, speakers, or influencers to drive ticket sales for your event.
            </p>
            <p className="text-sm text-pulse-text/70">
              When a guest purchases a ticket using a promoter's unique referral link, the commission is automatically calculated and tracked here.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
