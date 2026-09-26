"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const LANGUAGES = [
  { code: "en", native: "English", english: "English" },
  { code: "kn", native: "ಕನ್ನಡ", english: "Kannada" },
  { code: "hi", native: "हिंदी", english: "Hindi" },
  { code: "ta", native: "தமிழ்", english: "Tamil" },
  { code: "te", native: "తెలుగు", english: "Telugu" },
];

export default function LanguageSelection() {
  const [selectedLang, setSelectedLang] = useState<string | null>(null);
  const router = useRouter();

  const handleEnter = () => {
    if (selectedLang) {
      router.push(`/menu?lang=${selectedLang}`);
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center min-h-[100dvh] p-6 bg-gradient-to-br from-[#1D3557] via-[#264673] to-[#1D3557] text-white">
      <div className="w-full max-w-sm text-center">
        
        {/* Restaurant Branding */}
        <div className="flex flex-col items-center gap-4 mb-10">
          <div className="w-20 h-20 rounded-full bg-white/10 border-[3px] border-white/20 backdrop-blur-md flex items-center justify-center text-3xl shadow-xl">
            🍽️
          </div>
          <div>
            <h1 className="font-display text-3xl font-extrabold tracking-tight">Annapurna Kitchen</h1>
            <p className="text-white/70 text-sm mt-1">Authentic South Indian Cuisine</p>
          </div>
        </div>

        <h2 className="text-lg font-semibold mb-6 text-white/90">Choose your language</h2>

        {/* Language Grid */}
        <div className="grid grid-cols-2 gap-3 mb-8">
          {LANGUAGES.map((lang) => {
            const isSelected = selectedLang === lang.code;
            return (
              <button
                key={lang.code}
                onClick={() => setSelectedLang(lang.code)}
                className={`
                  relative flex flex-col items-center gap-1.5 p-4 rounded-xl border-2 backdrop-blur-md transition-all duration-300 overflow-hidden
                  ${isSelected 
                    ? 'border-[#E8A93A] bg-[#E8A93A]/25 shadow-[0_0_20px_rgba(232,169,58,0.3)] scale-[1.03]' 
                    : 'border-white/15 bg-white/5 hover:border-[#E8A93A]/50 hover:bg-white/10'}
                `}
              >
                {isSelected && (
                  <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-[#E8A93A] flex items-center justify-center text-[10px] text-white shadow-md animate-in zoom-in">
                    ✓
                  </div>
                )}
                <span className="text-xl font-bold leading-tight">{lang.native}</span>
                <span className="text-xs font-medium text-white/60">{lang.english}</span>
              </button>
            );
          })}
        </div>

        {/* Enter Button */}
        <button
          onClick={handleEnter}
          disabled={!selectedLang}
          className={`
            w-full p-4 rounded-xl font-bold text-lg transition-all duration-300 flex justify-center items-center gap-2
            ${selectedLang 
              ? 'bg-[#E8A93A] text-white shadow-[0_8px_24px_rgba(232,169,58,0.4)] hover:-translate-y-0.5 active:translate-y-0' 
              : 'bg-white/10 text-white/40 cursor-not-allowed'}
          `}
        >
          View Menu
          {selectedLang && <span className="text-xl">→</span>}
        </button>

        {/* Powered By */}
        <div className="mt-8 text-[11px] text-white/40 tracking-wider uppercase font-medium">
          Powered by <span className="font-bold text-white/60">OrderMitra</span>
        </div>

      </div>
    </div>
  );
}
