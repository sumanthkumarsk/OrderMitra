"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function OrderStatusPage() {
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);

  // Simulate order status progression
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex-1 flex flex-col relative pb-10 bg-gray-50 min-h-[100dvh]">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white border-b border-gray-100 px-4 py-4 shadow-sm flex items-center gap-3">
        <button 
          onClick={() => router.push("/menu")} 
          className="w-9 h-9 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-600 active:bg-gray-200 transition-colors"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
        </button>
        <h1 className="font-display font-bold text-lg text-gray-900">Order Status</h1>
      </div>

      <div className="p-4 flex flex-col gap-5">
        
        {/* Order Hero */}
        <div className="bg-gradient-to-br from-[#264673] to-[#1D3557] rounded-2xl p-6 text-center text-white shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
          <div className="text-xs text-white/70 font-semibold tracking-widest uppercase mb-1 relative z-10">Your Order ID</div>
          <div className="font-display text-[26px] font-extrabold tracking-tight relative z-10">ORD-2026-0042</div>
          <div className="text-sm text-white/80 font-medium mt-3 relative z-10">Table 12 · Annapurna Kitchen</div>
          <div className="text-[11px] text-white/50 mt-1 relative z-10">Placed at 7:45 PM</div>
        </div>

        {/* Step Indicator */}
        <div className="flex justify-between items-center px-2 py-4 relative">
          <div className="absolute top-[32px] left-8 right-8 h-[2px] bg-gray-200 -z-10"></div>
          <div className="absolute top-[32px] left-8 right-8 h-[2px] bg-green-500 -z-10 transition-all duration-1000 ease-in-out" style={{ width: isReady ? '100%' : '50%' }}></div>
          
          <div className="flex flex-col items-center gap-2 relative">
            <div className="w-8 h-8 rounded-full bg-green-500 border-2 border-white flex items-center justify-center text-white text-[10px] shadow-sm font-bold">✓</div>
            <div className="text-[10px] font-bold text-gray-900">Placed</div>
          </div>
          
          <div className="flex flex-col items-center gap-2 relative">
            <div className="w-8 h-8 rounded-full bg-green-500 border-2 border-white flex items-center justify-center text-white text-[10px] shadow-sm font-bold">✓</div>
            <div className="text-[10px] font-bold text-gray-900">Accepted</div>
          </div>
          
          <div className="flex flex-col items-center gap-2 relative">
            <div className={`w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-sm shadow-sm transition-colors duration-500 ${isReady ? 'bg-green-500 text-white font-bold text-[10px]' : 'bg-[#E8A93A] shadow-[0_0_0_4px_rgba(232,169,58,0.2)] animate-pulse'}`}>
              {isReady ? '✓' : '👨‍🍳'}
            </div>
            <div className="text-[10px] font-bold text-gray-900">Preparing</div>
          </div>
          
          <div className="flex flex-col items-center gap-2 relative">
            <div className={`w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-sm shadow-sm transition-colors duration-500 ${isReady ? 'bg-green-500 text-white font-bold text-[10px]' : 'bg-gray-100 text-gray-400'}`}>
              {isReady ? '✓' : ''}
            </div>
            <div className={`text-[10px] font-bold ${isReady ? 'text-gray-900' : 'text-gray-400'}`}>Ready</div>
          </div>
        </div>

        {/* ETA Banner */}
        <div className={`border rounded-xl p-4 flex items-center gap-4 transition-colors duration-500 shadow-sm ${isReady ? 'bg-green-50 border-green-200' : 'bg-orange-50 border-orange-200'}`}>
          <div className="text-2xl">{isReady ? '🎉' : '⏱️'}</div>
          <div>
            <div className={`font-bold text-[15px] ${isReady ? 'text-green-800' : 'text-orange-800'}`}>
              {isReady ? 'Your food is ready!' : 'Estimated ~12 minutes'}
            </div>
            <div className={`text-xs mt-0.5 ${isReady ? 'text-green-600' : 'text-orange-600'}`}>
              {isReady ? 'Please collect it from the counter' : 'Your order is being prepared by the kitchen'}
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm mt-2">
          <div className="bg-gray-50 px-4 py-3 border-b border-gray-100 flex justify-between font-bold text-[13px] text-gray-700">
            <span>Items (4)</span>
            <span>₹1,050</span>
          </div>
          <div className="divide-y divide-gray-100">
            {/* Item */}
            <div className="px-4 py-3.5 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${isReady ? 'bg-green-500' : 'bg-amber-500'}`}></div>
                <div>
                  <div className="font-semibold text-[14px] text-gray-900">Chicken 65</div>
                  <div className="text-xs text-gray-500 mt-0.5">× 2</div>
                </div>
              </div>
              <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${isReady ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                {isReady ? 'Ready' : 'Preparing'}
              </span>
            </div>
            
            {/* Item */}
            <div className="px-4 py-3.5 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                <div>
                  <div className="font-semibold text-[14px] text-gray-900">Chicken Biryani</div>
                  <div className="text-xs text-gray-500 mt-0.5">× 1 · No onions, extra raita</div>
                </div>
              </div>
              <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-blue-100 text-blue-700">
                Placed
              </span>
            </div>
            
            {/* Item */}
            <div className="px-4 py-3.5 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <div>
                  <div className="font-semibold text-[14px] text-gray-900">Lime Soda</div>
                  <div className="text-xs text-gray-500 mt-0.5">× 2</div>
                </div>
              </div>
              <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-green-100 text-green-700">
                Ready
              </span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex gap-3 mt-2">
          <button onClick={() => router.push("/service")} className="flex-1 bg-white border border-gray-200 rounded-xl p-3 flex flex-col items-center gap-1.5 shadow-sm active:bg-gray-50">
            <div className="text-xl">💧</div>
            <div className="font-bold text-[11px] text-gray-900">Need Service?</div>
            <div className="text-[9px] text-gray-500">Water, tissue...</div>
          </button>
          <button onClick={() => router.push("/menu")} className="flex-1 bg-white border border-gray-200 rounded-xl p-3 flex flex-col items-center gap-1.5 shadow-sm active:bg-gray-50">
            <div className="text-xl">➕</div>
            <div className="font-bold text-[11px] text-gray-900">Add Items</div>
            <div className="text-[9px] text-gray-500">Order more</div>
          </button>
          <button onClick={() => router.push("/bill")} className="flex-1 bg-white border border-gray-200 rounded-xl p-3 flex flex-col items-center gap-1.5 shadow-sm active:bg-gray-50">
            <div className="text-xl">📄</div>
            <div className="font-bold text-[11px] text-gray-900">Pay Bill</div>
            <div className="text-[9px] text-gray-500">View & pay</div>
          </button>
        </div>

      </div>
    </div>
  );
}
