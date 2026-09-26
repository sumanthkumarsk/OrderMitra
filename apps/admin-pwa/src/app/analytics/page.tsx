"use client";

import { useState } from "react";

export default function AnalyticsPage() {
  const [timeframe, setTimeframe] = useState("today");

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-display text-gray-900 tracking-tight">Analytics & Reports</h1>
          <p className="text-gray-500 text-sm mt-1">Track your restaurant's performance and sales</p>
        </div>
        
        <div className="flex gap-2 bg-gray-100 p-1 rounded-lg border border-gray-200">
          {["today", "week", "month", "year"].map(tf => (
            <button 
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`px-4 py-1.5 rounded-md text-sm font-semibold capitalize transition-all ${
                timeframe === tf 
                  ? 'bg-white text-[#264673] shadow-sm' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-green-50 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:bg-green-100 transition-colors"></div>
          <div className="text-gray-500 text-sm font-semibold mb-1">Total Revenue</div>
          <div className="text-3xl font-display font-extrabold text-gray-900">₹42,500</div>
          <div className="mt-2 text-xs font-bold text-green-600 flex items-center gap-1">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
            +14.5% from last period
          </div>
        </div>
        
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:bg-blue-100 transition-colors"></div>
          <div className="text-gray-500 text-sm font-semibold mb-1">Total Orders</div>
          <div className="text-3xl font-display font-extrabold text-gray-900">128</div>
          <div className="mt-2 text-xs font-bold text-green-600 flex items-center gap-1">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
            +8.2% from last period
          </div>
        </div>
        
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-50 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:bg-amber-100 transition-colors"></div>
          <div className="text-gray-500 text-sm font-semibold mb-1">Avg. Order Value</div>
          <div className="text-3xl font-display font-extrabold text-gray-900">₹332</div>
          <div className="mt-2 text-xs font-bold text-red-600 flex items-center gap-1">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 18 13.5 8.5 8.5 13.5 1 6"/><polyline points="17 18 23 18 23 12"/></svg>
            -2.1% from last period
          </div>
        </div>
        
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-purple-50 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:bg-purple-100 transition-colors"></div>
          <div className="text-gray-500 text-sm font-semibold mb-1">Most Popular Table</div>
          <div className="text-3xl font-display font-extrabold text-gray-900">T12</div>
          <div className="mt-2 text-xs font-bold text-gray-500 flex items-center gap-1">
            14 orders today
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Chart Mockup */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 shadow-sm p-5 flex flex-col h-[400px]">
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-bold text-lg text-gray-900">Revenue Trend</h2>
            <button className="text-sm text-[#264673] font-semibold hover:underline">Export CSV</button>
          </div>
          <div className="flex-1 flex items-end gap-2 relative">
            <div className="absolute inset-0 flex flex-col justify-between text-xs text-gray-400 font-mono pb-8 pointer-events-none">
              <div>₹50k</div>
              <div>₹40k</div>
              <div>₹30k</div>
              <div>₹20k</div>
              <div>₹10k</div>
              <div>0</div>
            </div>
            
            {/* Bars */}
            <div className="flex-1 flex items-end justify-around h-full pt-4 pb-8 pl-12">
              {[40, 60, 45, 80, 55, 90, 75].map((height, i) => (
                <div key={i} className="w-[10%] flex flex-col justify-end items-center h-full group relative">
                  <div 
                    className="w-full bg-gradient-to-t from-[#264673] to-[#457b9d] rounded-t-sm transition-all duration-500 group-hover:opacity-80 cursor-pointer"
                    style={{ height: `${height}%` }}
                  ></div>
                  
                  {/* Tooltip */}
                  <div className="absolute -top-10 bg-gray-900 text-white text-xs font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                    ₹{Math.floor((height / 100) * 50000)}
                  </div>
                  
                  <div className="absolute -bottom-6 text-xs font-semibold text-gray-500">
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i]}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Items */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 flex flex-col">
          <h2 className="font-bold text-lg text-gray-900 mb-6">Top Selling Items</h2>
          
          <div className="space-y-5">
            {[
              { name: 'Chicken Biryani', qty: 42, rev: '₹11,760', perc: 100 },
              { name: 'Butter Chicken', qty: 38, rev: '₹11,400', perc: 85 },
              { name: 'Masala Dosa', qty: 35, rev: '₹4,900', perc: 75 },
              { name: 'Butter Naan', qty: 80, rev: '₹4,000', perc: 60 },
              { name: 'Paneer Tikka', qty: 24, rev: '₹5,760', perc: 45 },
            ].map((item, i) => (
              <div key={i}>
                <div className="flex justify-between items-center mb-1.5 text-sm">
                  <span className="font-semibold text-gray-900">{item.name}</span>
                  <span className="font-bold font-mono text-gray-600">{item.qty} <span className="text-[10px] text-gray-400">units</span></span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-[#E8A93A] rounded-full" style={{ width: `${item.perc}%` }}></div>
                  </div>
                  <span className="text-xs font-bold text-gray-500 w-16 text-right">{item.rev}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
