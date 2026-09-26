"use client";

const STAFF = [
  { id: "S01", name: "Ramesh K.", role: "Waiter", status: "Active", tables: ["T1", "T2", "T3", "T4"] },
  { id: "S02", name: "Suresh M.", role: "Waiter", status: "Active", tables: ["T5", "T6", "T7", "T8"] },
  { id: "S03", name: "Priya S.", role: "Manager", status: "Active", tables: ["All"] },
  { id: "S04", name: "Chef Anil", role: "Kitchen", status: "Active", tables: ["None"] },
  { id: "S05", name: "Rahul D.", role: "Waiter", status: "Off-Duty", tables: [] },
];

export default function StaffPage() {
  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold font-display text-gray-900 tracking-tight">Staff Management</h1>
          <p className="text-gray-500 text-sm mt-1">Manage roles, shifts, and table assignments</p>
        </div>
        <button className="bg-[#264673] text-white px-5 py-2.5 rounded-lg font-bold shadow-md hover:bg-[#1D3557] transition-colors">
          + Add Staff Member
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 text-xs uppercase tracking-wider">
              <th className="px-6 py-4 font-semibold">Name & ID</th>
              <th className="px-6 py-4 font-semibold">Role</th>
              <th className="px-6 py-4 font-semibold">Assigned Tables</th>
              <th className="px-6 py-4 font-semibold text-center">Status</th>
              <th className="px-6 py-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-sm">
            {STAFF.map(person => (
              <tr key={person.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="font-bold text-gray-900">{person.name}</div>
                  <div className="text-xs text-gray-500 font-mono mt-0.5">{person.id}</div>
                </td>
                <td className="px-6 py-4 font-semibold text-gray-700">{person.role}</td>
                <td className="px-6 py-4">
                  <div className="flex gap-1 flex-wrap">
                    {person.tables.map(t => (
                      <span key={t} className="px-2 py-1 bg-gray-100 rounded text-xs font-bold text-gray-600">{t}</span>
                    ))}
                    {person.tables.length === 0 && <span className="text-gray-400 italic">None</span>}
                  </div>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                    person.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'
                  }`}>
                    {person.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="text-[#C1440E] font-bold text-sm hover:underline">Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
