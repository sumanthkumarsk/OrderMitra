"use client";

import Link from "next/link";

export default function CustomerBillPage() {
  return (
    <main className="min-h-screen bg-gray-50 flex flex-col max-w-md mx-auto shadow-xl overflow-hidden">
      <div className="p-6 pb-24">
        <Link href="/menu" className="inline-flex items-center gap-2 text-gray-500 font-semibold mb-6">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
          Back to Menu
        </Link>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 relative overflow-hidden">
          {/* Receipt Zig Zag effect at top and bottom */}
          <div className="absolute top-0 left-0 right-0 h-2 w-full bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCI+PHBvbHlnb24gcG9pbnRzPSIwLDAgNSwxMCAxMCwwIiBmaWxsPSIjZjdmN2Y5Ii8+PC9zdmc+')] rotate-180"></div>
          
          <div className="text-center mb-6">
            <h1 className="text-2xl font-display font-black text-gray-900 tracking-tight">OrderMitra Cafe</h1>
            <p className="text-sm text-gray-500">Table 12 • ORD-0039</p>
          </div>

          <div className="border-t border-b border-dashed border-gray-300 py-4 mb-4 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="font-semibold text-gray-900">1× Chicken Biryani</span>
              <span className="font-mono text-gray-600">₹280.00</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="font-semibold text-gray-900">1× Raita</span>
              <span className="font-mono text-gray-600">₹40.00</span>
            </div>
          </div>

          <div className="space-y-2 mb-6">
            <div className="flex justify-between text-sm text-gray-500">
              <span>Subtotal</span>
              <span className="font-mono">₹320.00</span>
            </div>
            <div className="flex justify-between text-sm text-gray-500">
              <span>CGST (2.5%)</span>
              <span className="font-mono">₹8.00</span>
            </div>
            <div className="flex justify-between text-sm text-gray-500">
              <span>SGST (2.5%)</span>
              <span className="font-mono">₹8.00</span>
            </div>
          </div>

          <div className="flex justify-between items-center pt-4 border-t-2 border-gray-900">
            <span className="font-bold text-lg text-gray-900">Grand Total</span>
            <span className="font-bold font-mono text-2xl text-gray-900">₹336.00</span>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100 max-w-md mx-auto shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
        <button className="w-full bg-[#1D3557] text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:bg-[#264673] transition-colors flex items-center justify-center gap-2">
          Pay Now
        </button>
      </div>
    </main>
  );
}
