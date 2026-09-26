"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SessionPage() {
  const router = useRouter();
  const [phone, setPhone] = useState("");

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    router.push("/menu");
  };

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col max-w-md mx-auto shadow-xl relative items-center justify-center p-6">
      <div className="absolute top-0 left-0 w-full h-64 bg-[#1D3557] rounded-b-[40px] -z-10"></div>
      
      <div className="w-full bg-white rounded-2xl shadow-xl p-8 border border-gray-100 text-center relative mt-16">
        <div className="w-20 h-20 bg-white rounded-2xl shadow-md flex items-center justify-center text-[#C1440E] font-bold text-3xl mx-auto -mt-16 mb-4 border border-gray-50">
          OM
        </div>
        
        <h1 className="text-2xl font-display font-bold text-gray-900">OrderMitra Cafe</h1>
        <p className="text-gray-500 text-sm mt-1 mb-8">Table 12</p>

        <form onSubmit={handleJoin} className="space-y-4">
          <div>
            <input 
              type="tel" 
              placeholder="Enter mobile number" 
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-center font-bold text-gray-900 outline-none focus:border-[#C1440E] focus:bg-white transition-colors"
              required
            />
          </div>
          
          <button type="submit" className="w-full bg-[#C1440E] text-white py-3.5 rounded-xl font-bold shadow-md hover:bg-[#a6390a] transition-all">
            Open Menu
          </button>
        </form>
        
        <p className="text-xs text-gray-400 mt-6">
          By continuing, you agree to our Terms of Service.
        </p>
      </div>
    </main>
  );
}
