"use client";

import { useState } from "react";

export default function AIControlsPage() {
  const [upsellEnabled, setUpsellEnabled] = useState(true);
  const [autoDesc, setAutoDesc] = useState(true);

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="bg-gradient-to-r from-[#1D3557] to-[#264673] p-8 rounded-2xl shadow-lg text-white">
        <h1 className="text-3xl font-display font-bold mb-2">AI Controls</h1>
        <p className="text-white/80 max-w-xl">Configure how the OrderMitra AI assistant interacts with your diners and manages your menu.</p>
      </div>

      <div className="space-y-4">
        {/* Setting 1 */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex items-start justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <span>Smart Upselling</span>
              <span className="bg-[#E8A93A]/20 text-[#E8A93A] text-[10px] uppercase font-bold px-2 py-0.5 rounded">Active</span>
            </h3>
            <p className="text-gray-500 text-sm mt-1">The AI will analyze cart contents and suggest complementary items (e.g. suggesting Coke with a Burger).</p>
          </div>
          <button 
            onClick={() => setUpsellEnabled(!upsellEnabled)}
            className={`w-12 h-6 rounded-full transition-colors relative flex-shrink-0 ${upsellEnabled ? 'bg-green-500' : 'bg-gray-300'}`}
          >
            <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all ${upsellEnabled ? 'left-7' : 'left-1'}`}></div>
          </button>
        </div>

        {/* Setting 2 */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex items-start justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <span>Auto Menu Descriptions</span>
            </h3>
            <p className="text-gray-500 text-sm mt-1">Automatically generate mouth-watering descriptions for new menu items based on their name and category.</p>
          </div>
          <button 
            onClick={() => setAutoDesc(!autoDesc)}
            className={`w-12 h-6 rounded-full transition-colors relative flex-shrink-0 ${autoDesc ? 'bg-green-500' : 'bg-gray-300'}`}
          >
            <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all ${autoDesc ? 'left-7' : 'left-1'}`}></div>
          </button>
        </div>

      </div>
    </div>
  );
}
