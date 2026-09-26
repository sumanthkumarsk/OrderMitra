"use client";

const BILLS = [
  { id: "INV-047", table: "T10", amount: 1250.00, status: "Paid", method: "UPI", time: "10 mins ago" },
  { id: "INV-046", table: "T22", amount: 480.00, status: "Paid", method: "Cash", time: "38 mins ago" },
  { id: "INV-045", table: "T17", amount: 390.00, status: "Paid", method: "Card", time: "1 hr ago" },
  { id: "INV-044", table: "T2", amount: 450.00, status: "Pending", method: "-", time: "Just now" },
];

export default function BillingPage() {
  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold font-display text-gray-900 tracking-tight">Billing & Invoices</h1>
          <p className="text-gray-500 text-sm mt-1">Manage completed bills and payments</p>
        </div>
        <div className="flex gap-3">
          <button className="bg-gray-100 text-gray-700 px-4 py-2.5 rounded-lg font-bold shadow-sm hover:bg-gray-200 transition-colors">
            Export CSV
          </button>
          <button className="bg-[#264673] text-white px-5 py-2.5 rounded-lg font-bold shadow-md hover:bg-[#1D3557] transition-colors">
            Create Custom Bill
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 text-xs uppercase tracking-wider">
              <th className="px-6 py-4 font-semibold">Invoice ID</th>
              <th className="px-6 py-4 font-semibold">Table / Source</th>
              <th className="px-6 py-4 font-semibold">Amount</th>
              <th className="px-6 py-4 font-semibold">Status & Method</th>
              <th className="px-6 py-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-sm">
            {BILLS.map(bill => (
              <tr key={bill.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="font-bold text-gray-900 font-mono">{bill.id}</div>
                  <div className="text-xs text-gray-500">{bill.time}</div>
                </td>
                <td className="px-6 py-4 font-bold text-gray-700">{bill.table}</td>
                <td className="px-6 py-4 font-bold font-mono text-gray-900">₹{bill.amount.toFixed(2)}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      bill.status === 'Paid' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {bill.status}
                    </span>
                    {bill.method !== '-' && (
                      <span className="text-xs text-gray-500 font-semibold border border-gray-200 px-1.5 rounded bg-white">
                        {bill.method}
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button className="text-[#C1440E] font-bold text-sm hover:underline">Print</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
