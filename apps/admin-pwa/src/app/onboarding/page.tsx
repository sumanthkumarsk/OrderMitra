"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [restaurantName, setRestaurantName] = useState("");

  const nextStep = () => {
    if (step < 3) setStep(step + 1);
    else router.push("/");
  };

  return (
    <div className="flex-1 min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
      
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
        
        {/* Progress Bar */}
        <div className="flex w-full h-1.5">
          <div className={`h-full bg-[#E8A93A] transition-all duration-500`} style={{ width: `${(step / 3) * 100}%` }}></div>
          <div className="h-full bg-gray-100 flex-1"></div>
        </div>

        <div className="p-8 md:p-12">
          
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#E8A93A] to-[#C1440E] flex items-center justify-center text-white font-bold text-xl shadow-lg mb-8">
            OM
          </div>

          {step === 1 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500">
              <h1 className="text-3xl font-display font-bold text-gray-900 mb-2 tracking-tight">Welcome to OrderMitra!</h1>
              <p className="text-gray-500 mb-8">Let&apos;s set up your digital restaurant in just a few steps.</p>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Restaurant Name</label>
                  <input 
                    type="text" 
                    value={restaurantName}
                    onChange={(e) => setRestaurantName(e.target.value)}
                    placeholder="e.g. Annapurna Kitchen"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-[#E8A93A] focus:bg-white transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Currency</label>
                  <select className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-[#E8A93A] focus:bg-white transition-colors">
                    <option value="INR">₹ Indian Rupee (INR)</option>
                    <option value="USD">$ US Dollar (USD)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500">
              <h1 className="text-3xl font-display font-bold text-gray-900 mb-2 tracking-tight">Design your QR Menu</h1>
              <p className="text-gray-500 mb-8">Choose colors that match your restaurant&apos;s vibe.</p>
              
              <div className="grid grid-cols-2 gap-4">
                <button className="p-4 rounded-xl border-2 border-[#C1440E] bg-white text-left relative overflow-hidden group shadow-sm">
                  <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-[#C1440E] flex items-center justify-center text-white text-xs font-bold">✓</div>
                  <div className="w-full h-20 bg-gradient-to-br from-[#1D3557] to-[#264673] rounded-lg mb-3"></div>
                  <div className="font-bold text-gray-900 text-sm">Spicy Mitra (Default)</div>
                  <div className="text-xs text-gray-500 mt-1">Dark blue & Orange</div>
                </button>
                <button className="p-4 rounded-xl border-2 border-gray-200 hover:border-gray-300 bg-white text-left transition-colors">
                  <div className="w-full h-20 bg-gradient-to-br from-emerald-500 to-teal-700 rounded-lg mb-3"></div>
                  <div className="font-bold text-gray-900 text-sm">Fresh Green</div>
                  <div className="text-xs text-gray-500 mt-1">Light, modern, organic</div>
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500 text-center">
              <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-4xl">🚀</span>
              </div>
              <h1 className="text-3xl font-display font-bold text-gray-900 mb-2 tracking-tight">You&apos;re all set!</h1>
              <p className="text-gray-500 mb-8 max-w-md mx-auto">
                We&apos;ve generated dummy menu data so you can test out the platform. You can change it anytime in Menu Management.
              </p>
              
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 inline-block text-left mb-8">
                <div className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-2">Next Steps</div>
                <ul className="text-sm text-gray-700 space-y-2">
                  <li className="flex items-center gap-2"><span className="text-green-500 font-bold">✓</span> Add real menu items</li>
                  <li className="flex items-center gap-2"><span className="text-green-500 font-bold">✓</span> Print QR codes for tables</li>
                  <li className="flex items-center gap-2"><span className="text-green-500 font-bold">✓</span> Start taking orders</li>
                </ul>
              </div>
            </div>
          )}

          <div className="mt-10 pt-6 border-t border-gray-100 flex justify-between items-center">
            {step > 1 ? (
              <button 
                onClick={() => setStep(step - 1)}
                className="px-5 py-2.5 font-bold text-gray-500 hover:text-gray-900 transition-colors"
              >
                Back
              </button>
            ) : <div></div>}
            
            <button 
              onClick={nextStep}
              className="px-6 py-2.5 bg-[#C1440E] text-white rounded-lg font-bold shadow-md hover:bg-[#a6390a] transition-all flex items-center gap-2"
            >
              {step === 3 ? "Go to Dashboard" : "Continue"}
              {step !== 3 && <span>→</span>}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
