"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const router = useRouter();
  const [isPlacing, setIsPlacing] = useState(false);

  const handlePlaceOrder = () => {
    setIsPlacing(true);
    setTimeout(() => {
      router.push("/status");
    }, 1500);
  };

  return (
    <div className="flex-1 flex flex-col relative pb-40 bg-gray-50">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white border-b border-gray-100 px-4 py-4 shadow-sm flex items-center gap-3">
        <button 
          onClick={() => router.back()} 
          className="w-9 h-9 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-600 active:bg-gray-200 transition-colors"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
        </button>
        <h1 className="font-display font-bold text-lg text-gray-900">Your Order</h1>
      </div>

      <div className="p-4 flex flex-col gap-5">
        
        <div>
          <h2 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Your Items</h2>
          
          <div className="flex flex-col gap-2.5">
            {/* Item 1 */}
            <div className="p-3.5 bg-white border border-gray-200 rounded-xl flex items-center gap-3.5 shadow-sm">
              <div className="w-12 h-12 rounded-lg bg-gray-50 flex items-center justify-center text-2xl border border-gray-100 flex-shrink-0">🍗</div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-[15px] text-gray-900 leading-tight">Chicken 65</h3>
                <p className="text-gray-500 text-[13px] mt-0.5">₹260 each</p>
                <div className="mt-1 text-[#C1440E] text-[11px] font-semibold bg-[#E8A93A]/10 inline-block px-1.5 py-0.5 rounded italic">
                  + Add special instructions
                </div>
              </div>
              <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                <div className="flex items-center border-2 border-gray-100 rounded-lg overflow-hidden h-8">
                  <button className="w-8 h-full flex items-center justify-center text-gray-600 font-bold bg-gray-50 active:bg-gray-200">−</button>
                  <span className="min-w-[24px] text-center font-bold text-sm text-gray-900">2</span>
                  <button className="w-8 h-full flex items-center justify-center text-gray-600 font-bold bg-gray-50 active:bg-gray-200">+</button>
                </div>
                <div className="font-bold text-[15px] text-gray-900">₹520</div>
              </div>
            </div>

            {/* Item 2 */}
            <div className="p-3.5 bg-white border border-gray-200 rounded-xl flex items-center gap-3.5 shadow-sm">
              <div className="w-12 h-12 rounded-lg bg-gray-50 flex items-center justify-center text-2xl border border-gray-100 flex-shrink-0">🫓</div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-[15px] text-gray-900 leading-tight">Butter Naan</h3>
                <p className="text-gray-500 text-[13px] mt-0.5">₹50 each</p>
              </div>
              <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                <div className="flex items-center border-2 border-gray-100 rounded-lg overflow-hidden h-8">
                  <button className="w-8 h-full flex items-center justify-center text-gray-600 font-bold bg-gray-50 active:bg-gray-200">−</button>
                  <span className="min-w-[24px] text-center font-bold text-sm text-gray-900">4</span>
                  <button className="w-8 h-full flex items-center justify-center text-gray-600 font-bold bg-gray-50 active:bg-gray-200">+</button>
                </div>
                <div className="font-bold text-[15px] text-gray-900">₹200</div>
              </div>
            </div>

            {/* Item 3 */}
            <div className="p-3.5 bg-white border border-gray-200 rounded-xl flex items-center gap-3.5 shadow-sm">
              <div className="w-12 h-12 rounded-lg bg-gray-50 flex items-center justify-center text-2xl border border-gray-100 flex-shrink-0">🍛</div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-[15px] text-gray-900 leading-tight">Chicken Biryani</h3>
                <p className="text-gray-500 text-[13px] mt-0.5">₹280 each</p>
                <div className="mt-1 text-gray-600 text-[11px] font-semibold bg-gray-100 inline-block px-1.5 py-0.5 rounded italic">
                  Note: No onions, extra raita
                </div>
              </div>
              <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                <div className="flex items-center border-2 border-gray-100 rounded-lg overflow-hidden h-8">
                  <button className="w-8 h-full flex items-center justify-center text-gray-600 font-bold bg-gray-50 active:bg-gray-200">−</button>
                  <span className="min-w-[24px] text-center font-bold text-sm text-gray-900">1</span>
                  <button className="w-8 h-full flex items-center justify-center text-gray-600 font-bold bg-gray-50 active:bg-gray-200">+</button>
                </div>
                <div className="font-bold text-[15px] text-gray-900">₹280</div>
              </div>
            </div>

          </div>
        </div>

        {/* Note Section */}
        <div className="p-4 bg-white border border-gray-200 rounded-xl shadow-sm">
          <label className="block text-[13px] font-bold text-gray-700 mb-2">Cooking Instructions (Optional)</label>
          <input 
            type="text" 
            placeholder="e.g., Make it spicy, allergies..."
            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:bg-white focus:border-[#E8A93A] transition-colors shadow-inner"
          />
        </div>

      </div>

      {/* Checkout Footer */}
      <div className="fixed bottom-0 left-0 right-0 md:left-auto md:right-auto md:w-full md:max-w-md bg-white border-t-2 border-gray-100 px-5 py-4 shadow-[0_-8px_20px_rgba(0,0,0,0.06)] z-50 rounded-t-2xl">
        <div className="flex flex-col gap-1.5 mb-4 text-sm">
          <div className="flex justify-between text-gray-600">
            <span>Subtotal (7 items)</span>
            <span className="font-semibold text-gray-900">₹1,000</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>Taxes (5% GST)</span>
            <span className="font-semibold text-gray-900">₹50</span>
          </div>
          <div className="flex justify-between text-lg font-bold text-gray-900 mt-1 pt-2 border-t border-gray-100">
            <span>Total</span>
            <span className="text-[#C1440E]">₹1,050</span>
          </div>
        </div>
        
        <button 
          onClick={handlePlaceOrder}
          disabled={isPlacing}
          className="w-full p-4 rounded-xl bg-[#C1440E] text-white font-bold text-lg shadow-[0_4px_14px_rgba(193,68,14,0.4)] active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed flex flex-col items-center justify-center leading-tight relative overflow-hidden"
        >
          {isPlacing ? (
            <span className="animate-pulse">Placing Order...</span>
          ) : (
            <>
              <span>Place Order · ₹1,050</span>
              <span className="text-[11px] font-normal text-white/80 mt-0.5">Order ID will be generated</span>
            </>
          )}
        </button>
      </div>

    </div>
  );
}
