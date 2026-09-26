"use client";

import { useState } from "react";

// Mock Table Data
const TABLES = [
  { id: "T1", seats: 2, status: "available" },
  { id: "T2", seats: 2, status: "occupied", orderId: "ORD-044" },
  { id: "T3", seats: 4, status: "occupied", orderId: "ORD-040" },
  { id: "T4", seats: 4, status: "available" },
  { id: "T5", seats: 4, status: "occupied", orderId: "ORD-038" },
  { id: "T6", seats: 6, status: "reserved", time: "8:00 PM" },
  { id: "T7", seats: 2, status: "needs-cleaning" },
  { id: "T8", seats: 4, status: "occupied", orderId: "ORD-041" },
  { id: "T9", seats: 4, status: "available" },
  { id: "T10", seats: 8, status: "occupied", orderId: "ORD-047" },
  { id: "T11", seats: 2, status: "available" },
  { id: "T12", seats: 4, status: "occupied", orderId: "ORD-039" },
];

export default function TableMapPage() {
  const [filter, setFilter] = useState("all");

  const filteredTables = TABLES.filter(t => filter === "all" || t.status === filter);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-white border-gray-300 text-gray-700';
      case 'occupied': return 'bg-[#C1440E] border-[#C1440E] text-white shadow-md';
      case 'reserved': return 'bg-blue-100 border-blue-400 text-blue-800';
      case 'needs-cleaning': return 'bg-amber-100 border-amber-400 text-amber-800';
      default: return 'bg-gray-100 border-gray-300';
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold font-display text-gray-900 tracking-tight">Table Management</h1>
          <p className="text-gray-500 text-sm mt-1">Live overview of your restaurant floor</p>
        </div>
        
        <div className="flex gap-2 bg-gray-50 p-1.5 rounded-lg border border-gray-200 overflow-x-auto">
          {[
            { id: "all", label: "All" },
            { id: "available", label: "Available" },
            { id: "occupied", label: "Occupied" },
            { id: "reserved", label: "Reserved" },
            { id: "needs-cleaning", label: "Cleaning" },
          ].map(f => (
            <button 
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`px-3 py-1.5 rounded-md text-sm font-semibold transition-all whitespace-nowrap ${
                filter === f.id ? 'bg-white shadow-sm text-gray-900 border border-gray-200' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-gray-100 p-8 rounded-3xl border-2 border-dashed border-gray-300 relative min-h-[600px]">
        {/* Entrance Marker */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-white border border-gray-300 rounded-full text-xs font-bold text-gray-500 uppercase tracking-widest">
          Entrance
        </div>
        
        {/* Kitchen Marker */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-white border border-gray-300 rounded-full text-xs font-bold text-gray-500 uppercase tracking-widest">
          Kitchen
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 pt-12">
          {filteredTables.map(table => (
            <div 
              key={table.id}
              className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 cursor-pointer transition-transform hover:scale-105 active:scale-95 h-32 ${getStatusColor(table.status)}`}
            >
              <div className="text-2xl font-display font-black mb-1">{table.id}</div>
              <div className="text-xs font-semibold opacity-80 mb-2">{table.seats} Seats</div>
              
              {table.status === 'occupied' && (
                <div className="text-[10px] font-mono bg-black/20 px-2 py-0.5 rounded text-white font-bold">
                  {table.orderId}
                </div>
              )}
              {table.status === 'reserved' && (
                <div className="text-[10px] bg-blue-500/20 px-2 py-0.5 rounded text-blue-900 font-bold">
                  {table.time}
                </div>
              )}
              {table.status === 'needs-cleaning' && (
                <div className="text-[10px] font-bold uppercase tracking-wider">
                  Clean Table
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
