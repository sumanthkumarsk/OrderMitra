"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";

export default function ServiceRequestsPage() {
  const [requested, setRequested] = useState<string[]>([]);

  const toggleRequest = (type: string, label: string) => {
    if (requested.includes(type)) return;
    setRequested([...requested, type]);
    toast.success(`${label} request sent! Waiter is on the way.`);
  };

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col max-w-md mx-auto shadow-xl overflow-hidden relative">
      <div className="bg-[#1D3557] text-white p-5 pt-8 rounded-b-3xl shadow-md relative z-10">
        <div className="flex justify-between items-center mb-4">
          <Link href="/menu" className="text-white/80 hover:text-white">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
          </Link>
          <div className="font-bold tracking-widest text-sm uppercase">Table 12</div>
          <div className="w-6"></div>
        </div>
        <h1 className="text-2xl font-display font-bold">Service Requests</h1>
        <p className="text-sm text-white/70 mt-1">Tap a button to call a waiter.</p>
      </div>

      <div className="p-6 flex-1 flex flex-col gap-4">
        {[
          { id: 'water', label: 'Need Water', icon: '💧' },
          { id: 'waiter', label: 'Call Waiter', icon: '👋' },
          { id: 'clean', label: 'Clean Table', icon: '🧹' },
          { id: 'cutlery', label: 'Extra Cutlery', icon: '🍴' },
        ].map(req => (
          <button 
            key={req.id}
            onClick={() => toggleRequest(req.id, req.label)}
            disabled={requested.includes(req.id)}
            className={`w-full p-4 rounded-xl flex items-center justify-between font-bold text-lg border-2 transition-all shadow-sm ${
              requested.includes(req.id) 
                ? 'bg-green-50 border-green-200 text-green-700 opacity-80 cursor-default' 
                : 'bg-white border-gray-200 text-gray-800 hover:border-[#C1440E]'
            }`}
          >
            <div className="flex items-center gap-4">
              <span className="text-2xl">{req.icon}</span>
              <span>{requested.includes(req.id) ? 'Request Sent!' : req.label}</span>
            </div>
            {requested.includes(req.id) ? (
              <span className="text-green-500">✓</span>
            ) : (
              <span className="text-[#C1440E]">+</span>
            )}
          </button>
        ))}
      </div>
    </main>
  );
}
