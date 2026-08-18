"use client";

import { useState } from "react";

export function CopyLinkButton({ slug }: { slug: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    // We assume the app is hosted on standard port or vercel url.
    // window.location.origin is the safest way to get the base URL dynamically.
    const url = `${window.location.origin}/en/event/${slug}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button 
      onClick={handleCopy}
      className="px-4 py-2 rounded-xl bg-aurora-gradient text-white font-bold transition-all transform hover:scale-105 active:scale-95 text-sm shadow-[0_0_20px_rgba(255,77,77,0.3)] w-40 flex items-center justify-center"
    >
      {copied ? "Copied!" : "Copy Share Link"}
    </button>
  );
}
