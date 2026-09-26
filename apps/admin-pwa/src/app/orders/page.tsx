"use client";

import { useState } from "react";

// Mock Data
const MOCK_ORDERS = [
  {
    id: 'ORD-0038', table: 'T5', status: 'new', time: '4m ago',
    items: [
      { name: 'Masala Dosa', qty: 2, price: 140 },
      { name: 'Idli Sambar', qty: 1, price: 90 },
      { name: 'Filter Coffee', qty: 2, price: 50 }
    ],
    notes: 'Extra crispy dosa please'
  },
  {
    id: 'ORD-0039', table: 'T12', status: 'new', time: '7m ago',
    items: [
      { name: 'Chicken Biryani', qty: 1, price: 280 },
      { name: 'Raita', qty: 1, price: 40 },
    ]
  },
  {
    id: 'ORD-0041', table: 'T8', status: 'preparing', time: '18m ago',
    items: [
      { name: 'Mutton Rogan Josh', qty: 1, price: 340 },
      { name: 'Butter Naan', qty: 2, price: 65 },
    ]
  },
  {
    id: 'ORD-0045', table: 'T17', status: 'ready', time: '32m ago',
    items: [
      { name: 'Pav Bhaji', qty: 2, price: 150 },
      { name: 'Masala Chai', qty: 2, price: 40 }
    ]
  },
  {
    id: 'ORD-0036', table: 'T7', status: 'billed', time: '1h 12m ago',
    items: [
      { name: 'Butter Chicken', qty: 1, price: 300 },
      { name: 'Naan', qty: 2, price: 60 },
    ]
  }
];

export default function OrdersPage() {
  const [orders, setOrders] = useState(MOCK_ORDERS);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const updateStatus = (id: string, newStatus: string) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status: newStatus } : o));
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-display text-gray-900 tracking-tight">Orders Queue</h1>
          <p className="text-gray-500 text-sm mt-1">Manage kitchen tickets and table service</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <svg className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            <input 
              type="text" 
              placeholder="Search Order ID..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:border-[#E8A93A] outline-none shadow-sm w-full md:w-64"
            />
          </div>
          <select 
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-[#E8A93A] outline-none shadow-sm bg-white"
          >
            <option value="all">All Status</option>
            <option value="new">New (2)</option>
            <option value="preparing">Preparing (1)</option>
            <option value="ready">Ready (1)</option>
            <option value="billed">Billed (1)</option>
          </select>
        </div>
      </div>

      {/* Kanban Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 items-start">
        
        {/* NEW COLUMN */}
        {(filter === 'all' || filter === 'new') && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b-2 border-blue-500 pb-2">
              <div className="w-6 h-6 rounded-md bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
                {orders.filter(o => o.status === 'new').length}
              </div>
              <h2 className="font-bold text-gray-900">New Orders</h2>
            </div>
            
            {orders.filter(o => o.status === 'new').map(order => (
              <OrderCard key={order.id} order={order} color="blue" onAction={(action) => updateStatus(order.id, action)} />
            ))}
          </div>
        )}

        {/* PREPARING COLUMN */}
        {(filter === 'all' || filter === 'preparing') && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b-2 border-amber-500 pb-2">
              <div className="w-6 h-6 rounded-md bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-xs">
                {orders.filter(o => o.status === 'preparing').length}
              </div>
              <h2 className="font-bold text-gray-900">Preparing</h2>
            </div>
            
            {orders.filter(o => o.status === 'preparing').map(order => (
              <OrderCard key={order.id} order={order} color="amber" onAction={(action) => updateStatus(order.id, action)} />
            ))}
          </div>
        )}

        {/* READY COLUMN */}
        {(filter === 'all' || filter === 'ready') && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b-2 border-green-500 pb-2">
              <div className="w-6 h-6 rounded-md bg-green-100 text-green-700 flex items-center justify-center font-bold text-xs">
                {orders.filter(o => o.status === 'ready').length}
              </div>
              <h2 className="font-bold text-gray-900">Ready to Serve</h2>
            </div>
            
            {orders.filter(o => o.status === 'ready').map(order => (
              <OrderCard key={order.id} order={order} color="green" onAction={(action) => updateStatus(order.id, action)} />
            ))}
          </div>
        )}

        {/* BILLED COLUMN */}
        {(filter === 'all' || filter === 'billed') && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b-2 border-gray-500 pb-2">
              <div className="w-6 h-6 rounded-md bg-gray-100 text-gray-700 flex items-center justify-center font-bold text-xs">
                {orders.filter(o => o.status === 'billed').length}
              </div>
              <h2 className="font-bold text-gray-900">Awaiting Payment</h2>
            </div>
            
            {orders.filter(o => o.status === 'billed').map(order => (
              <OrderCard key={order.id} order={order} color="gray" onAction={(action) => updateStatus(order.id, action)} />
            ))}
          </div>
        )}

      </div>
    </div>
  );
}

interface OrderItem {
  name: string;
  qty: number;
  price: number;
}
interface Order {
  id: string;
  table: string;
  status: string;
  time: string;
  items: OrderItem[];
  notes?: string;
}

// Order Card Component
function OrderCard({ order, color, onAction }: { order: Order, color: string, onAction: (status: string) => void }) {
  const total = order.items.reduce((s: number, i: OrderItem) => s + (i.price * i.qty), 0);
  
  return (
    <div className={`bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden border-l-4 ${
      color === 'blue' ? 'border-l-blue-500' :
      color === 'amber' ? 'border-l-amber-500' :
      color === 'green' ? 'border-l-green-500' : 'border-l-gray-500'
    } transition-shadow hover:shadow-md`}>
      <div className="p-4 border-b border-gray-50 bg-gray-50/50 flex justify-between items-start">
        <div>
          <div className="font-mono text-xs font-bold text-gray-900">{order.id}</div>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-sm font-bold">Table {order.table}</span>
            <span className="text-[10px] text-gray-500 bg-gray-200 px-1.5 py-0.5 rounded-sm">{order.time}</span>
          </div>
        </div>
        <div className={`text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider ${
          color === 'blue' ? 'bg-blue-100 text-blue-700' :
          color === 'amber' ? 'bg-amber-100 text-amber-700' :
          color === 'green' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
        }`}>
          {order.status}
        </div>
      </div>
      
      <div className="p-4 space-y-3">
        {order.items.map((item: OrderItem, i: number) => (
          <div key={i} className="flex justify-between items-start text-sm">
            <div className="flex gap-2">
              <span className="font-bold text-gray-900">{item.qty}×</span>
              <span className="text-gray-600">{item.name}</span>
            </div>
            <span className="text-gray-400 font-mono text-xs">₹{item.price * item.qty}</span>
          </div>
        ))}
        
        {order.notes && (
          <div className="text-xs bg-amber-50 text-amber-800 p-2 rounded border border-amber-100 italic">
            📝 {order.notes}
          </div>
        )}
      </div>

      <div className="p-3 border-t border-gray-100 bg-gray-50 flex justify-between items-center">
        <span className="font-bold text-sm">Total: ₹{total}</span>
        
        <div className="flex gap-2">
          {order.status === 'new' && (
            <>
              <button onClick={() => onAction('paid')} className="px-3 py-1.5 rounded bg-gray-200 text-gray-700 text-xs font-bold hover:bg-red-100 hover:text-red-700 transition-colors">Reject</button>
              <button onClick={() => onAction('preparing')} className="px-3 py-1.5 rounded bg-blue-500 text-white text-xs font-bold shadow-sm hover:bg-blue-600 transition-colors">Accept Order</button>
            </>
          )}
          {order.status === 'preparing' && (
            <button onClick={() => onAction('ready')} className="px-3 py-1.5 rounded bg-amber-500 text-white text-xs font-bold shadow-sm hover:bg-amber-600 transition-colors">Mark Ready</button>
          )}
          {order.status === 'ready' && (
            <button onClick={() => onAction('billed')} className="px-3 py-1.5 rounded bg-green-500 text-white text-xs font-bold shadow-sm hover:bg-green-600 transition-colors">Serve & Bill</button>
          )}
          {order.status === 'billed' && (
            <button onClick={() => onAction('paid')} className="px-3 py-1.5 rounded bg-gray-800 text-white text-xs font-bold shadow-sm hover:bg-black transition-colors">Mark Paid</button>
          )}
        </div>
      </div>
    </div>
  );
}
