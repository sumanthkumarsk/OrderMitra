import { Search, Bell } from "lucide-react";

export function Topbar() {
  return (
    <header className="h-[72px] bg-white border-b border-gray-200 flex items-center justify-between px-8 sticky top-0 z-10">
      <div className="flex items-center gap-6 flex-1">
        <h1 className="font-display font-bold text-gray-900">Platform Admin</h1>
        <div className="relative w-full max-w-[320px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input 
            type="text" 
            placeholder="Search tenants, owners, outlets..." 
            className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-full text-sm outline-none focus:bg-white focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-5">
        <button className="relative text-gray-400 hover:text-gray-600 transition-colors">
          <Bell size={20} />
          <span className="absolute 1 top-0 right-0 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>
        
        <div className="flex items-center gap-3 border-l border-gray-200 pl-5">
          <div className="w-9 h-9 rounded bg-gray-900 text-white flex items-center justify-center text-xs font-bold">
            AK
          </div>
          <div className="hidden md:block">
            <div className="text-sm font-bold text-gray-900 leading-none mb-1">Arun Kumar</div>
            <div className="text-[11px] text-gray-500 font-medium">Super Admin</div>
          </div>
        </div>
      </div>
    </header>
  );
}
