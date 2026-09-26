import Link from "next/link";
import { LayoutGrid, ClipboardList, UtensilsCrossed, BarChart3, Settings, Rocket, LogOut, Users } from "lucide-react";

export function Sidebar() {
  return (
    <aside className="w-[260px] bg-[#0F1B2D] flex flex-col flex-shrink-0 text-gray-300 h-screen fixed left-0 top-0">
      <div className="h-[72px] flex items-center px-6 border-b border-white/5">
        <div className="w-8 h-8 rounded bg-gradient-to-br from-[#E8A93A] to-[#C1440E] flex items-center justify-center font-bold text-white text-sm mr-3">
          OM
        </div>
        <div>
          <div className="font-semibold text-white tracking-tight leading-tight">OrderMitra</div>
          <span className="text-white/50 text-[11px] font-medium uppercase tracking-wider">Restaurant Admin</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto py-6 px-4 flex flex-col gap-8 no-scrollbar">
        {/* Main Section */}
        <div>
          <div className="px-3 text-xs font-bold uppercase tracking-widest text-white/40 mb-3">
            Main
          </div>
          <nav className="flex flex-col gap-1">
            <Link href="/" className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/5 transition-colors font-medium text-sm">
              <LayoutGrid size={18} />
              Dashboard
            </Link>
            <Link href="/orders" className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/5 transition-colors font-medium text-sm">
              <ClipboardList size={18} />
              Live Orders
              <span className="ml-auto bg-[#E8A93A]/20 text-[#E8A93A] text-[10px] font-bold px-2 py-0.5 rounded-full">3</span>
            </Link>
          </nav>
        </div>

        {/* Management Section */}
        <div>
          <div className="px-3 text-xs font-bold uppercase tracking-widest text-white/40 mb-3">
            Management
          </div>
          <nav className="flex flex-col gap-1">
            <Link href="/table-map" className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/5 transition-colors font-medium text-sm">
              <LayoutGrid size={18} />
              Table Map
            </Link>
            <Link href="/menu-management" className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/5 transition-colors font-medium text-sm">
              <UtensilsCrossed size={18} />
              Menu Management
            </Link>
            <Link href="/billing" className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/5 transition-colors font-medium text-sm">
              <ClipboardList size={18} />
              Billing
            </Link>
            <Link href="/staff" className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/5 transition-colors font-medium text-sm">
              <Users size={18} />
              Staff
            </Link>
            <Link href="/analytics" className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/5 transition-colors font-medium text-sm">
              <BarChart3 size={18} />
              Analytics & Reports
            </Link>
          </nav>
        </div>

        {/* Setup Section */}
        <div>
          <div className="px-3 text-xs font-bold uppercase tracking-widest text-white/40 mb-3">
            Setup & AI
          </div>
          <nav className="flex flex-col gap-1">
            <Link href="/ai-controls" className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/5 transition-colors font-medium text-sm">
              <Rocket size={18} />
              AI Controls
            </Link>
            <Link href="/onboarding" className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/5 transition-colors font-medium text-sm">
              <Rocket size={18} />
              Onboarding
            </Link>
            <Link href="/settings" className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/5 transition-colors font-medium text-sm opacity-50 cursor-not-allowed">
              <Settings size={18} />
              Settings
            </Link>
          </nav>
        </div>
      </div>

      <div className="p-4 border-t border-white/5">
        <button className="w-full flex items-center justify-center gap-2 py-2 text-sm font-medium text-white/60 hover:text-white transition-colors">
          <LogOut size={16} />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
