"use client";

import { useState } from "react";
import { Link } from "@/i18n/routing";

export default function WebhooksPage() {
  const [webhooks, setWebhooks] = useState([
    { id: "1", url: "https://api.example.com/pulse-webhook", events: ["rsvp.created", "ticket.purchased"], status: "active" }
  ]);
  
  const [isAdding, setIsAdding] = useState(false);
  const [newWebhook, setNewWebhook] = useState({ url: "", events: ["rsvp.created"] });

  const availableEvents = [
    { id: "rsvp.created", label: "RSVP Created" },
    { id: "ticket.purchased", label: "Ticket Purchased" },
    { id: "checkin.completed", label: "Guest Checked In" },
    { id: "event.published", label: "Event Published" }
  ];

  const handleAdd = () => {
    if (newWebhook.url) {
      setWebhooks([...webhooks, { ...newWebhook, id: Math.random().toString(), status: "active" }]);
      setNewWebhook({ url: "", events: ["rsvp.created"] });
      setIsAdding(false);
    }
  };

  const toggleEvent = (eventId: string) => {
    const events = newWebhook.events.includes(eventId)
      ? newWebhook.events.filter(e => e !== eventId)
      : [...newWebhook.events, eventId];
    setNewWebhook({ ...newWebhook, events });
  };

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-4xl font-display font-bold tracking-tight">Webhooks</h1>
        <p className="text-pulse-text-muted mt-2">Listen to real-time events on your team's workspace to automate workflows.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="glass-panel p-6 rounded-3xl">
             <div className="flex items-center justify-between mb-6">
               <h2 className="font-bold text-lg">Endpoints</h2>
             </div>
             
             <div className="flex flex-col gap-4">
               {webhooks.map(hook => (
                 <div key={hook.id} className="border border-white/10 rounded-2xl p-5 bg-white/5 flex flex-col gap-4">
                   <div className="flex items-center justify-between">
                     <div className="flex items-center gap-3">
                       <span className="w-2 h-2 rounded-full bg-green-400 shadow-[0_0_8px_rgba(74,222,128,0.6)]" />
                       <span className="font-mono text-sm tracking-tight text-white/90">{hook.url}</span>
                     </div>
                     <button onClick={() => setWebhooks(webhooks.filter(w => w.id !== hook.id))} className="text-pulse-text-muted hover:text-red-400 text-sm font-medium transition-colors">Delete</button>
                   </div>
                   <div className="flex flex-wrap gap-2 mt-1">
                     {hook.events.map(ev => (
                       <span key={ev} className="text-[10px] uppercase tracking-widest font-bold bg-white/10 text-white/80 px-2 py-1 rounded-full">
                         {ev}
                       </span>
                     ))}
                   </div>
                 </div>
               ))}

               {isAdding && (
                 <div className="border border-white/20 rounded-2xl p-6 bg-white/10 flex flex-col gap-6 mt-4 shadow-2xl">
                   <div>
                     <label className="text-sm font-bold text-pulse-text-muted mb-2 block">Payload URL</label>
                     <input 
                       type="url" 
                       placeholder="https://..."
                       value={newWebhook.url}
                       onChange={e => setNewWebhook({...newWebhook, url: e.target.value})}
                       className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-white/30 transition-colors font-mono text-sm placeholder:text-white/30"
                     />
                   </div>
                   
                   <div>
                     <label className="text-sm font-bold text-pulse-text-muted mb-3 block">Events to send</label>
                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                       {availableEvents.map(ev => (
                         <label key={ev.id} className="flex items-center gap-3 cursor-pointer p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-transparent hover:border-white/20">
                           <input 
                             type="checkbox" 
                             checked={newWebhook.events.includes(ev.id)}
                             onChange={() => toggleEvent(ev.id)}
                             className="w-4 h-4 rounded border-white/20 bg-black/50 accent-white"
                           />
                           <span className="text-sm font-medium">{ev.label}</span>
                         </label>
                       ))}
                     </div>
                   </div>

                   <div className="flex justify-end gap-3 pt-6 border-t border-white/10">
                     <button onClick={() => setIsAdding(false)} className="px-5 py-2.5 text-sm font-medium text-pulse-text-muted hover:text-white transition-colors">Cancel</button>
                     <button onClick={handleAdd} className="px-5 py-2.5 text-sm bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition-colors shadow-lg">Add Webhook</button>
                   </div>
                 </div>
               )}

               {!isAdding && (
                 <button onClick={() => setIsAdding(true)} className="mt-4 py-4 border-2 border-dashed border-white/10 rounded-2xl text-pulse-text-muted hover:bg-white/5 hover:text-white hover:border-white/30 transition-all font-bold tracking-wide">
                   + Add Endpoint
                 </button>
               )}
             </div>
          </div>
        </div>

        <div className="flex flex-col gap-4">
           <div className="p-6 border border-white/10 bg-white/5 rounded-3xl">
            <h3 className="font-bold mb-3 text-lg">Developer API</h3>
            <p className="text-sm text-pulse-text-muted leading-relaxed">
              Listen to real-time events on your team's workspace to automate workflows, sync with external CRMs, or trigger custom notifications.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
