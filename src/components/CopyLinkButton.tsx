"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";

export function CopyLinkButton({ urlPath }: { urlPath: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    // Prefix the current origin (e.g. https://pulse-event.vercel.app) to the path
    const fullUrl = `${window.location.origin}${urlPath}`;
    navigator.clipboard.writeText(fullUrl);
    
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button 
      onClick={handleCopy}
      className={`px-6 py-3 rounded-xl border font-bold transition-all flex items-center gap-2 ${
        copied 
          ? "bg-green-500/20 border-green-500/50 text-green-400" 
          : "bg-white/5 border-white/10 text-white hover:bg-white/10"
      }`}
    >
      {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
      {copied ? "Copied!" : "Copy Share Link"}
    </button>
  );
}
