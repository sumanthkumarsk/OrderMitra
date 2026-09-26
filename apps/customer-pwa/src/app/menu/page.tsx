"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

// --- Mock Data ---
const CATEGORIES = [
  { id: "all", label: "All" },
  { id: "starters", label: "🔥 Starters" },
  { id: "biryani", label: "🍚 Biryani" },
  { id: "curry", label: "🍛 Curries" },
  { id: "bread", label: "🫓 Breads" },
  { id: "beverages", label: "🥤 Beverages" },
];

const MENU_ITEMS = [
  {
    id: "m1",
    categoryId: "starters",
    name: "Gobi Manchurian",
    desc: "Crispy cauliflower florets tossed in tangy Manchurian sauce with bell peppers",
    price: 180,
    type: "veg",
    emoji: "🍗",
    badges: [{ label: "Chef's Special", color: "text-amber-700 bg-amber-100" }, { label: "🌶️ Medium", color: "text-red-700 bg-red-100" }],
    soldOut: false,
  },
  {
    id: "m2",
    categoryId: "starters",
    name: "Chicken 65",
    desc: "Deep-fried chicken marinated in spicy red masala, garnished with curry leaves",
    price: 260,
    type: "nonveg",
    emoji: "🍖",
    badges: [{ label: "⭐ Bestseller", color: "text-green-700 bg-green-100" }, { label: "🌶️ Hot", color: "text-red-700 bg-red-100" }],
    soldOut: false,
  },
  {
    id: "m3",
    categoryId: "starters",
    name: "Paneer Tikka",
    desc: "Marinated cottage cheese grilled in tandoor with onions and capsicum",
    price: 240,
    type: "veg",
    emoji: "🥘",
    badges: [{ label: "Chef's Special", color: "text-amber-700 bg-amber-100" }],
    soldOut: true,
  },
  {
    id: "m4",
    categoryId: "biryani",
    name: "Chicken Biryani",
    desc: "Aromatic basmati rice layered with tender chicken, saffron, and fried onions. Dum-cooked to perfection.",
    price: 280,
    type: "nonveg",
    emoji: "🍛",
    badges: [{ label: "⭐ Bestseller", color: "text-green-700 bg-green-100" }, { label: "Chef's Special", color: "text-amber-700 bg-amber-100" }],
    soldOut: false,
  },
  {
    id: "m5",
    categoryId: "curry",
    name: "Butter Chicken",
    desc: "Tender chicken in rich, creamy tomato-butter gravy with aromatic spices",
    price: 300,
    type: "nonveg",
    emoji: "🫕",
    badges: [{ label: "⭐ Bestseller", color: "text-green-700 bg-green-100" }],
    soldOut: false,
  },
  {
    id: "m6",
    categoryId: "bread",
    name: "Butter Naan",
    desc: "Soft leavened bread from tandoor, brushed with butter",
    price: 50,
    type: "veg",
    emoji: "🫓",
    badges: [{ label: "⭐ Bestseller", color: "text-green-700 bg-green-100" }],
    soldOut: false,
  },
];

export default function MenuPage() {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [cart, setCart] = useState<Record<string, number>>({});
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { role: "ai", text: "Hi! I'm your menu assistant. Ask me anything about our dishes — I can help you find what you're looking for! 🍽️" },
    { role: "ai", text: "Try: \"Chicken items below ₹300\" or \"What's the best biryani?\"", small: true }
  ]);
  const [chatInput, setChatInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  // Filter items based on category and search
  const filteredItems = MENU_ITEMS.filter(item => {
    const matchesCat = activeCategory === "all" || item.categoryId === activeCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.desc.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  // Cart calculations
  const totalItems = Object.values(cart).reduce((sum, qty) => sum + qty, 0);
  const totalPrice = Object.entries(cart).reduce((sum, [id, qty]) => {
    const item = MENU_ITEMS.find(i => i.id === id);
    return sum + (item?.price || 0) * qty;
  }, 0);

  const updateCart = (id: string, delta: number) => {
    setCart(prev => {
      const current = prev[id] || 0;
      const next = current + delta;
      
      if (delta > 0 && current === 0) {
        const item = MENU_ITEMS.find(i => i.id === id);
        toast.success(`Added ${item?.name} to cart!`);
      }

      if (next <= 0) {
        const newCart = { ...prev };
        delete newCart[id];
        return newCart;
      }
      return { ...prev, [id]: next };
    });
  };

  const handleSendChat = () => {
    if (!chatInput.trim()) return;
    const userMsg = chatInput.trim();
    setChatMessages(prev => [...prev, { role: "user", text: userMsg }]);
    setChatInput("");
    setIsTyping(true);
    
    // Simulate AI response
    setTimeout(() => {
      setIsTyping(false);
      setChatMessages(prev => [...prev, { 
        role: "ai", 
        text: `I recommend our Butter Chicken and Butter Naan combo! It perfectly matches what you're looking for.` 
      }]);
    }, 1500);
  };

  return (
    <div className="flex-1 flex flex-col relative pb-28">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 px-4 py-3 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-[#E8A93A]/10 text-[#C1440E] flex items-center justify-center text-xl shadow-sm border border-[#E8A93A]/20">
              🍽️
            </div>
            <div>
              <div className="font-display font-bold text-[15px] leading-tight text-gray-900">Annapurna Kitchen</div>
              <div className="text-[11px] text-gray-500 font-medium">Open now · 11 AM – 10 PM</div>
            </div>
          </div>
          <button 
            onClick={() => router.push("/")}
            className="px-3 py-1.5 rounded-full border border-gray-200 bg-white text-[13px] font-semibold text-gray-600 flex items-center gap-1 shadow-sm active:bg-gray-50 transition-colors"
          >
            🌐 English <span className="text-[10px]">▼</span>
          </button>
        </div>
        
        {/* Search */}
        <div className="relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input 
            type="text" 
            placeholder="Search dishes, cuisines..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-full text-sm outline-none focus:bg-white focus:border-[#E8A93A] transition-all shadow-inner"
          />
        </div>
      </div>

      {/* Category Nav */}
      <div className="flex gap-2 px-4 py-3 overflow-x-auto no-scrollbar bg-white border-b border-gray-100">
        {CATEGORIES.map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`
              px-4 py-2 rounded-full text-[13px] font-semibold whitespace-nowrap transition-all flex-shrink-0 border
              ${activeCategory === cat.id 
                ? 'bg-[#C1440E] border-[#C1440E] text-white shadow-md' 
                : 'bg-white border-gray-200 text-gray-600 hover:border-[#E8A93A] hover:text-[#C1440E]'}
            `}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Session Banner */}
      <div className="mx-4 my-3 bg-emerald-50 border border-emerald-200 rounded-lg p-2.5 px-3 flex items-center justify-between text-[13px] shadow-sm">
        <div className="flex items-center gap-2 font-semibold text-emerald-800">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          Table 12 · Active Session
        </div>
        <div className="font-bold text-emerald-700">₹920</div>
      </div>

      {/* Menu Body */}
      <div className="px-4 py-2 flex flex-col gap-6">
        {CATEGORIES.filter(c => c.id !== "all").map(category => {
          const catItems = filteredItems.filter(i => i.categoryId === category.id);
          if (catItems.length === 0) return null;
          
          return (
            <div key={category.id}>
              <h3 className="text-base font-bold text-gray-900 mb-3 border-b-2 border-[#E8A93A] inline-block pb-1">{category.label}</h3>
              <div className="flex flex-col gap-3">
                {catItems.map(item => (
                  <div key={item.id} className={`flex gap-3.5 p-3.5 bg-white border border-gray-200 rounded-xl relative transition-shadow shadow-sm hover:shadow-md ${item.soldOut ? 'opacity-60 grayscale-[30%]' : ''}`}>
                    
                    {item.soldOut && (
                      <div className="absolute top-2 left-2 bg-gray-800 text-white text-[10px] font-bold px-1.5 py-0.5 rounded uppercase z-10 shadow-sm">
                        Sold Out
                      </div>
                    )}
                    
                    <div className="w-20 h-20 rounded-lg bg-gray-50 flex items-center justify-center text-3xl flex-shrink-0 border border-gray-100 shadow-inner">
                      {item.emoji}
                    </div>
                    
                    <div className="flex-1 min-w-0 flex flex-col">
                      <div className="flex items-start gap-1.5 mb-1">
                        {/* Veg/Nonveg indicator */}
                        <div className={`w-3.5 h-3.5 mt-0.5 border flex items-center justify-center rounded-[2px] flex-shrink-0 ${item.type === 'veg' ? 'border-green-600' : 'border-red-600'}`}>
                          <div className={`w-1.5 h-1.5 rounded-full ${item.type === 'veg' ? 'bg-green-600' : 'bg-red-600'}`}></div>
                        </div>
                        <h4 className="font-semibold text-[15px] leading-snug text-gray-900">{item.name}</h4>
                      </div>
                      
                      <p className="text-[13px] text-gray-500 line-clamp-2 leading-relaxed mb-2">
                        {item.desc}
                      </p>
                      
                      <div className="mt-auto flex items-center justify-between">
                        <div className="flex flex-col gap-1">
                          <span className="font-bold text-[15px] text-gray-900">₹{item.price}</span>
                          {item.badges.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {item.badges.map((b, i) => (
                                <span key={i} className={`text-[10px] font-bold px-1.5 py-0.5 rounded-sm ${b.color}`}>
                                  {b.label}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Add to Cart / Qty Controls */}
                    <div className="absolute bottom-3 right-3">
                      {!item.soldOut && (
                        cart[item.id] ? (
                          <div className="flex items-center bg-[#C1440E] rounded-full overflow-hidden shadow-md h-8">
                            <button onClick={() => updateCart(item.id, -1)} className="w-8 h-full flex items-center justify-center text-white font-bold active:bg-[#a6390a]">
                              −
                            </button>
                            <span className="min-w-[20px] text-center text-white font-bold text-sm">
                              {cart[item.id]}
                            </span>
                            <button onClick={() => updateCart(item.id, 1)} className="w-8 h-full flex items-center justify-center text-white font-bold active:bg-[#a6390a]">
                              +
                            </button>
                          </div>
                        ) : (
                          <button 
                            onClick={() => updateCart(item.id, 1)}
                            className="w-8 h-8 rounded-full bg-[#E8A93A] text-white flex items-center justify-center text-lg shadow-[0_2px_8px_rgba(232,169,58,0.4)] active:scale-95 transition-transform font-bold"
                          >
                            +
                          </button>
                        )
                      )}
                    </div>

                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Floating Cart Bar */}
      <div className={`fixed bottom-0 left-0 right-0 md:left-auto md:right-auto md:w-full md:max-w-md bg-[#1D3557] text-white px-5 py-3.5 flex items-center justify-between shadow-[0_-8px_20px_rgba(0,0,0,0.15)] transition-transform duration-300 z-[100] ${totalItems > 0 ? 'translate-y-0' : 'translate-y-[150%]'}`}>
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-full bg-[#E8A93A] flex items-center justify-center font-bold text-sm text-white shadow-sm">
            {totalItems}
          </div>
          <div className="font-bold text-lg">₹{totalPrice}</div>
        </div>
        <button 
          onClick={() => router.push('/cart')}
          className="px-5 py-2.5 bg-[#E8A93A] text-white rounded-lg font-bold text-sm shadow-md active:scale-95 transition-transform flex items-center gap-1.5"
        >
          View Cart <span>→</span>
        </button>
      </div>

      {/* AI Chat FAB */}
      <button 
        onClick={() => setIsChatOpen(true)}
        className={`fixed bottom-[85px] right-4 w-[56px] h-[56px] rounded-full bg-gradient-to-br from-[#E8A93A] to-[#C1440E] text-white text-2xl flex items-center justify-center shadow-[0_4px_16px_rgba(193,68,14,0.4)] transition-all z-[90] active:scale-95 md:right-auto md:ml-[340px] ${isChatOpen ? 'scale-0 opacity-0' : 'scale-100 opacity-100'}`}
      >
        <div className="absolute inset-0 rounded-full bg-[#E8A93A] animate-ping opacity-20"></div>
        💬
      </button>

      {/* AI Chat Panel */}
      <div className={`fixed inset-x-0 bottom-0 md:inset-x-auto md:w-full md:max-w-md bg-white rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.2)] z-[200] flex flex-col transition-transform duration-300 ease-out h-[80vh] md:h-[600px] ${isChatOpen ? 'translate-y-0' : 'translate-y-full'}`}>
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50 rounded-t-3xl">
          <div className="flex items-center gap-2">
            <span className="font-bold text-gray-900">Menu Assistant</span>
            <span className="bg-[#E8A93A]/10 text-[#C1440E] text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wide">AI</span>
          </div>
          <button onClick={() => setIsChatOpen(false)} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 font-bold active:bg-gray-200">
            ✕
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 bg-gray-50/30">
          {chatMessages.map((msg, i) => (
            <div key={i} className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-[14px] leading-relaxed shadow-sm ${
              msg.role === 'ai' 
                ? 'bg-gray-100 text-gray-800 self-start rounded-tl-sm' 
                : 'bg-[#C1440E] text-white self-end rounded-tr-sm'
            } ${msg.small ? 'text-[12px] text-gray-500 bg-transparent shadow-none px-2 py-0 italic' : ''}`}>
              {msg.text}
            </div>
          ))}
          
          {isTyping && (
            <div className="max-w-[85%] px-4 py-3.5 rounded-2xl bg-gray-100 text-gray-800 self-start rounded-tl-sm flex gap-1.5 shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0.15s' }}></span>
              <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0.3s' }}></span>
            </div>
          )}
        </div>
        
        <div className="p-3 border-t border-gray-100 bg-white">
          <div className="flex items-center gap-2">
            <input 
              type="text" 
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendChat()}
              placeholder="Ask about our menu..."
              className="flex-1 px-4 py-2.5 bg-gray-100 border-transparent rounded-full text-[14px] outline-none focus:bg-white focus:border-[#E8A93A] focus:ring-1 focus:ring-[#E8A93A] transition-all"
            />
            <button 
              onClick={handleSendChat}
              disabled={!chatInput.trim()}
              className="w-10 h-10 rounded-full bg-[#E8A93A] text-white flex items-center justify-center flex-shrink-0 disabled:opacity-50 disabled:bg-gray-300 transition-colors shadow-md active:scale-95"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
            </button>
          </div>
        </div>
      </div>
      
    </div>
  );
}
