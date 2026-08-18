"use client";

import { useState } from "react";
import { Link } from "@/i18n/routing";

type FieldType = "short_text" | "long_text" | "select" | "checkbox" | "file";

interface FormField {
  id: string;
  label: string;
  type: FieldType;
  required: boolean;
  options?: string[]; // For select fields
}

export default function EventFormBuilderPage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const [fields, setFields] = useState<FormField[]>([
    { id: "1", label: "Dietary Restrictions", type: "short_text", required: false }
  ]);

  const addField = (type: FieldType) => {
    setFields([...fields, { 
      id: Math.random().toString(36).substring(7), 
      label: "New Question", 
      type, 
      required: false,
      options: type === 'select' ? ["Option 1", "Option 2"] : undefined
    }]);
  };

  const removeField = (id: string) => {
    setFields(fields.filter(f => f.id !== id));
  };

  const updateField = (id: string, updates: Partial<FormField>) => {
    setFields(fields.map(f => f.id === id ? { ...f, ...updates } : f));
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
         {/* Since params is a Promise in Next.js 14/15, we assume the ID is handled by the parent layout, or we can just go back to the dashboard */}
        <Link href={`/dashboard`} className="text-pulse-text/50 hover:text-pulse-text transition-colors">
          &larr; Back to Events
        </Link>
        <h1 className="text-3xl font-display font-bold">Registration Form</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="bg-pulse-bg border border-pulse-slate/50 p-6 rounded-2xl">
            <h2 className="font-bold text-lg mb-4 text-pulse-cyan">Standard Fields</h2>
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between p-3 border border-pulse-slate/30 rounded-xl bg-pulse-slate/5">
                <span className="font-medium">Full Name</span>
                <span className="text-xs bg-pulse-slate/30 px-2 py-1 rounded text-pulse-text/70">Required</span>
              </div>
              <div className="flex items-center justify-between p-3 border border-pulse-slate/30 rounded-xl bg-pulse-slate/5">
                <span className="font-medium">Email Address</span>
                <span className="text-xs bg-pulse-slate/30 px-2 py-1 rounded text-pulse-text/70">Required</span>
              </div>
            </div>
          </div>

          <div className="bg-pulse-bg border border-pulse-slate/50 p-6 rounded-2xl">
             <div className="flex items-center justify-between mb-6">
               <h2 className="font-bold text-lg text-pulse-cyan">Custom Questions</h2>
             </div>
             
             {fields.length === 0 ? (
               <p className="text-pulse-text/50 text-center py-8">No custom questions added yet.</p>
             ) : (
               <div className="flex flex-col gap-4 mb-6">
                 {fields.map((field, index) => (
                   <div key={field.id} className="border border-pulse-slate/50 rounded-xl p-4 bg-pulse-slate/10 relative group">
                     <button onClick={() => removeField(field.id)} className="absolute top-4 right-4 text-pulse-text/40 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity">
                       Remove
                     </button>
                     <div className="flex flex-col gap-4">
                       <input 
                         value={field.label}
                         onChange={(e) => updateField(field.id, { label: e.target.value })}
                         className="bg-transparent text-lg font-bold focus:outline-none border-b border-transparent focus:border-pulse-cyan w-[80%]"
                       />
                       <div className="flex items-center gap-4 text-sm">
                         <span className="text-pulse-text/60 bg-pulse-bg px-2 py-1 rounded border border-pulse-slate/50">
                           {field.type.replace('_', ' ')}
                         </span>
                         <label className="flex items-center gap-2 cursor-pointer">
                           <input 
                             type="checkbox" 
                             checked={field.required} 
                             onChange={(e) => updateField(field.id, { required: e.target.checked })}
                             className="accent-pulse-cyan"
                           />
                           <span className="text-pulse-text/80">Required</span>
                         </label>
                       </div>
                       
                       {field.type === 'select' && (
                         <div className="mt-2 pl-4 border-l-2 border-pulse-slate/30">
                           <p className="text-xs uppercase text-pulse-text/50 mb-2 font-bold">Options (comma separated)</p>
                           <input 
                             value={field.options?.join(", ")}
                             onChange={(e) => updateField(field.id, { options: e.target.value.split(",").map(s => s.trim()) })}
                             className="w-full bg-pulse-bg border border-pulse-slate/50 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-pulse-cyan"
                           />
                         </div>
                       )}
                     </div>
                   </div>
                 ))}
               </div>
             )}

             <div className="flex flex-wrap gap-2">
               <button onClick={() => addField('short_text')} className="px-3 py-2 text-sm border border-pulse-slate/50 rounded-lg hover:bg-pulse-slate/20 transition-colors">+ Short Text</button>
               <button onClick={() => addField('long_text')} className="px-3 py-2 text-sm border border-pulse-slate/50 rounded-lg hover:bg-pulse-slate/20 transition-colors">+ Long Text</button>
               <button onClick={() => addField('select')} className="px-3 py-2 text-sm border border-pulse-slate/50 rounded-lg hover:bg-pulse-slate/20 transition-colors">+ Dropdown</button>
               <button onClick={() => addField('checkbox')} className="px-3 py-2 text-sm border border-pulse-slate/50 rounded-lg hover:bg-pulse-slate/20 transition-colors">+ Checkbox</button>
             </div>
          </div>
          
          <div className="flex justify-end">
            <button className="px-6 py-3 rounded-xl bg-pulse-gradient text-pulse-bg font-bold shadow-[0_0_20px_rgba(94,234,212,0.15)] hover:shadow-[0_0_30px_rgba(94,234,212,0.3)] transition-all">
              Save Form
            </button>
          </div>
        </div>

        {/* Sidebar settings */}
        <div className="flex flex-col gap-4">
           <div className="p-4 border border-pulse-slate/50 bg-pulse-slate/10 rounded-xl">
            <h3 className="font-bold mb-2 text-pulse-cyan">Registration Flow</h3>
            <p className="text-sm text-pulse-text/70">
              Customize the questions guests answer when they claim a ticket or RSVP to this event.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
