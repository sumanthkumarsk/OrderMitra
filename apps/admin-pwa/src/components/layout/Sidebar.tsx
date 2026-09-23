import Link from "next/link";
import { LayoutGrid, Users, CreditCard, Cpu, Network, Activity, HelpCircle, Settings, LogOut } from "lucide-react";

export function Sidebar() {
  return (
    <aside className="w-[260px] bg-[#0F1B2D] flex flex-col flex-shrink-0 text-gray-300 h-screen fixed left-0 top-0">
      <div className="h-[72px] flex items-center px-6 border-b border-white/5">
        <div className="w-8 h-8 rounded bg-gradient-to-br from-red-500 to-[#FF6B6B] flex items-center justify-center font-bold text-white text-sm mr-3">
          SS
        </div>
        <div>
          <div className="font-semibold text-white tracking-tight leading-tight">ScanServe</div>
          <span className="text-white/50 text-[11px] font-medium uppercase tracking-wider">Platform Admin</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto py-6 px-4 flex flex-col gap-8 no-scrollbar">
        {/* Platform Section */}
        <div>
          <div className="px-3 text-xs font-bold uppercase tracking-widest text-white/40 mb-3">
            Platform
          </div>
          <nav className="flex flex-col gap-1">
            <Link href="/" className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-red-500/10 text-white border-r-2 border-red-500 font-medium">
              <Users size={18} />
              Tenants
              <span className="ml-auto bg-red-500/20 text-red-500 text-[10px] font-bold px-2 py-0.5 rounded-full">48</span>
            </Link>
            <Link href="/subscriptions" className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/5 transition-colors font-medium text-sm">
              <CreditCard size={18} />
              Subscriptions
            </Link>
            <Link href="/ai-quotas" className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/5 transition-colors font-medium text-sm">
              <Cpu size={18} />
              AI Quotas
            </Link>
            <Link href="/integrations" className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/5 transition-colors font-medium text-sm">
              <Network size={18} />
              POS Integrations
            </Link>
          </nav>
        </div>

        {/* Support Section */}
        <div>
          <div className="px-3 text-xs font-bold uppercase tracking-widest text-white/40 mb-3">
            Support
          </div>
          <nav className="flex flex-col gap-1">
            <Link href="/health" className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/5 transition-colors font-medium text-sm">
              <Activity size={18} />
              Health Dashboard
            </Link>
            <Link href="/tickets" className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/5 transition-colors font-medium text-sm">
              <HelpCircle size={18} />
              Support Tickets
              <span className="ml-auto bg-white/10 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">3</span>
            </Link>
          </nav>
        </div>

        {/* Admin Section */}
        <div>
          <div className="px-3 text-xs font-bold uppercase tracking-widest text-white/40 mb-3">
            Platform Admin
          </div>
          <nav className="flex flex-col gap-1">
            <Link href="/settings" className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/5 transition-colors font-medium text-sm">
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
