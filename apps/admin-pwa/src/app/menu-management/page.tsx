"use client";

import { useState } from "react";

const INITIAL_MENU = [
  { id: "m1", name: "Gobi Manchurian", category: "Starters", price: 180, type: "veg", active: true },
  { id: "m2", name: "Chicken 65", category: "Starters", price: 260, type: "nonveg", active: true },
  { id: "m3", name: "Paneer Tikka", category: "Starters", price: 240, type: "veg", active: false },
  { id: "m4", name: "Chicken Biryani", category: "Biryani", price: 280, type: "nonveg", active: true },
  { id: "m5", name: "Veg Biryani", category: "Biryani", price: 220, type: "veg", active: true },
  { id: "m6", name: "Butter Chicken", category: "Curries", price: 300, type: "nonveg", active: true },
  { id: "m7", name: "Butter Naan", category: "Breads", price: 50, type: "veg", active: true },
];

export default function MenuManagementPage() {
  const [items, setItems] = useState(INITIAL_MENU);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");

  const toggleStatus = (id: string) => {
    setItems(items.map(i => i.id === id ? { ...i, active: !i.active } : i));
  };

  const deleteItem = (id: string) => {
    setItems(items.filter(i => i.id !== id));
  };

  const filteredItems = items.filter(item => {
    if (categoryFilter !== "All" && item.category !== categoryFilter) return false;
    if (search && !item.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const categories = ["All", ...Array.from(new Set(items.map(i => i.category)))];

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold font-display text-gray-900 tracking-tight">Menu Management</h1>
          <p className="text-gray-500 text-sm mt-1">Add, edit, and manage your restaurant offerings</p>
        </div>
        
        <button className="bg-[#C1440E] text-white px-5 py-2.5 rounded-lg font-bold shadow-md hover:bg-[#a6390a] transition-colors flex items-center gap-2">
          <span>+</span> Add New Item
        </button>
      </div>

      {/* Filters and List */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        
        {/* Controls */}
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row gap-4 justify-between bg-gray-50/50">
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
            {categories.map(cat => (
              <button 
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-4 py-1.5 rounded-full text-sm font-semibold whitespace-nowrap transition-colors ${
                  categoryFilter === cat 
                    ? 'bg-[#1D3557] text-white' 
                    : 'bg-white border border-gray-200 text-gray-600 hover:border-gray-300'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          
          <div className="relative w-full sm:w-64">
            <svg className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            <input 
              type="text" 
              placeholder="Search items..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:border-[#E8A93A] outline-none shadow-sm transition-colors"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 text-xs uppercase tracking-wider">
                <th className="px-6 py-3 font-semibold">Item Name</th>
                <th className="px-6 py-3 font-semibold">Category</th>
                <th className="px-6 py-3 font-semibold">Price</th>
                <th className="px-6 py-3 font-semibold text-center">Status</th>
                <th className="px-6 py-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {filteredItems.map(item => (
                <tr key={item.id} className={`hover:bg-gray-50 transition-colors ${!item.active ? 'opacity-60 bg-gray-50/50' : ''}`}>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 border flex items-center justify-center rounded-sm ${item.type === 'veg' ? 'border-green-600' : 'border-red-600'}`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${item.type === 'veg' ? 'bg-green-600' : 'bg-red-600'}`}></div>
                      </div>
                      <div>
                        <div className="font-bold text-gray-900">{item.name}</div>
                        <div className="text-xs text-gray-500 font-mono mt-0.5">{item.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="bg-gray-100 text-gray-600 px-2.5 py-1 rounded-md text-xs font-semibold">
                      {item.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-bold text-gray-900">
                    ₹{item.price}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button 
                      onClick={() => toggleStatus(item.id)}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold transition-colors ${
                        item.active 
                          ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                          : 'bg-red-100 text-red-700 hover:bg-red-200'
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${item.active ? 'bg-green-500' : 'bg-red-500'}`}></span>
                      {item.active ? 'Available' : 'Sold Out'}
                    </button>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button className="p-1.5 text-gray-400 hover:text-[#264673] bg-gray-50 hover:bg-gray-100 rounded transition-colors" title="Edit">
                        ✏️
                      </button>
                      <button onClick={() => deleteItem(item.id)} className="p-1.5 text-gray-400 hover:text-red-600 bg-gray-50 hover:bg-red-50 rounded transition-colors" title="Delete">
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              
              {filteredItems.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    <div className="text-4xl mb-2">🍽️</div>
                    <p>No menu items found.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}
