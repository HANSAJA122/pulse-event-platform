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
    <div className="p-8 max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <Link href={`/dashboard/settings`} className="text-pulse-text/50 hover:text-pulse-text transition-colors">
          &larr; Back to Settings
        </Link>
        <h1 className="text-3xl font-display font-bold">Webhooks</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="bg-pulse-bg border border-pulse-slate/50 p-6 rounded-2xl">
             <div className="flex items-center justify-between mb-6">
               <h2 className="font-bold text-lg text-pulse-cyan">Endpoints</h2>
             </div>
             
             <div className="flex flex-col gap-4">
               {webhooks.map(hook => (
                 <div key={hook.id} className="border border-pulse-slate/50 rounded-xl p-5 bg-pulse-slate/5 flex flex-col gap-3">
                   <div className="flex items-center justify-between">
                     <div className="flex items-center gap-2">
                       <span className="w-2 h-2 rounded-full bg-pulse-cyan animate-pulse-wave" />
                       <span className="font-mono text-sm">{hook.url}</span>
                     </div>
                     <button onClick={() => setWebhooks(webhooks.filter(w => w.id !== hook.id))} className="text-pulse-text/30 hover:text-red-400 text-sm">Delete</button>
                   </div>
                   <div className="flex flex-wrap gap-2 mt-2">
                     {hook.events.map(ev => (
                       <span key={ev} className="text-xs uppercase tracking-widest font-bold bg-pulse-slate/20 text-pulse-text/70 px-2 py-1 rounded">
                         {ev}
                       </span>
                     ))}
                   </div>
                 </div>
               ))}

               {isAdding && (
                 <div className="border border-pulse-slate/50 rounded-xl p-5 bg-pulse-slate/10 flex flex-col gap-5 mt-4">
                   <div>
                     <label className="text-sm font-bold text-pulse-text/70 mb-2 block">Payload URL</label>
                     <input 
                       type="url" 
                       placeholder="https://..."
                       value={newWebhook.url}
                       onChange={e => setNewWebhook({...newWebhook, url: e.target.value})}
                       className="w-full bg-pulse-bg border border-pulse-slate/50 rounded-lg px-3 py-2 focus:outline-none focus:border-pulse-cyan font-mono text-sm"
                     />
                   </div>
                   
                   <div>
                     <label className="text-sm font-bold text-pulse-text/70 mb-2 block">Events to send</label>
                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                       {availableEvents.map(ev => (
                         <label key={ev.id} className="flex items-center gap-3 cursor-pointer p-2 rounded hover:bg-pulse-slate/5 transition-colors border border-transparent hover:border-pulse-slate/30">
                           <input 
                             type="checkbox" 
                             checked={newWebhook.events.includes(ev.id)}
                             onChange={() => toggleEvent(ev.id)}
                             className="w-4 h-4 rounded border-pulse-slate/50 bg-pulse-bg text-pulse-cyan focus:ring-pulse-cyan focus:ring-offset-pulse-bg"
                           />
                           <span className="text-sm">{ev.label}</span>
                         </label>
                       ))}
                     </div>
                   </div>

                   <div className="flex justify-end gap-2 pt-4 border-t border-pulse-slate/30">
                     <button onClick={() => setIsAdding(false)} className="px-4 py-2 text-sm text-pulse-text/70">Cancel</button>
                     <button onClick={handleAdd} className="px-4 py-2 text-sm bg-pulse-cyan text-pulse-bg font-bold rounded-lg hover:bg-pulse-cyan/90">Add Webhook</button>
                   </div>
                 </div>
               )}

               {!isAdding && (
                 <button onClick={() => setIsAdding(true)} className="mt-4 py-4 border border-dashed border-pulse-slate/50 rounded-xl text-pulse-text/50 hover:bg-pulse-slate/20 transition-colors font-bold tracking-wide">
                   + Add Endpoint
                 </button>
               )}
             </div>
          </div>
        </div>

        <div className="flex flex-col gap-4">
           <div className="p-4 border border-pulse-slate/50 bg-pulse-slate/10 rounded-xl">
            <h3 className="font-bold mb-2 text-pulse-cyan">Developer API</h3>
            <p className="text-sm text-pulse-text/70">
              Listen to real-time events on your team's workspace to automate workflows, sync with external CRMs, or trigger custom notifications.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
