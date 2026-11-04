import React from 'react';
import { 
  Cpu, 
  Layers, 
  BarChart3, 
  Globe2, 
  CalendarDays, 
  Sparkles, 
  Activity, 
  Calculator
} from 'lucide-react';
import { ActiveTab } from '../types';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  openChat: () => void;
  unreadChatCount?: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  openChat,
  unreadChatCount = 0,
}) => {
  const tabs = [
    { id: 'overview', label: 'Summit Overview', icon: Cpu },
    { id: 'wafer', label: 'Wafer Yield & Defects', icon: Layers },
    { id: 'ppa', label: 'PPA Silicon Architect', icon: BarChart3 },
    { id: 'supply-chain', label: 'Supply Chain & Fabs', icon: Globe2 },
    { id: 'summit', label: 'AISemiCon Agenda', icon: CalendarDays },
    { id: 'cloud-cost', label: 'Cloud Cost (₹)', icon: Calculator },
  ] as const;

  return (
    <header className="sticky top-0 z-40 bg-[#0A0F1D]/90 backdrop-blur-md border-b border-cyan-500/20 px-4 lg:px-8 py-3 transition-all">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Brand identity */}
        <div className="flex items-center justify-between w-full md:w-auto">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 border border-cyan-400/40">
                <Cpu className="w-5 h-5 text-white animate-pulse" />
              </div>
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-sky-200 to-indigo-300">
                  AISEMICON<span className="text-cyan-400 font-mono">2026</span>
                </span>
                <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-500/30">
                  2nm GAA / High-NA
                </span>
              </div>
              <p className="text-xs text-slate-400">Next-Gen Semiconductor Summit & Fab Telemetry</p>
            </div>
          </div>

          {/* Mobile Gemini Trigger */}
          <button
            onClick={openChat}
            className="md:hidden flex items-center gap-1.5 bg-gradient-to-r from-cyan-600 to-indigo-600 text-white text-xs px-3 py-1.5 rounded-lg border border-cyan-400/30 font-medium"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-200" />
            <span>Copilot</span>
          </button>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto p-1 bg-slate-900/80 rounded-xl border border-slate-800 scrollbar-none">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-500/20 to-blue-600/30 text-cyan-300 border border-cyan-500/50 shadow-sm shadow-cyan-500/20'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Header Right Actions */}
        <div className="hidden md:flex items-center gap-3">
          <div className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-emerald-950/40 border border-emerald-500/30 text-emerald-400 text-xs font-mono">
            <Activity className="w-3.5 h-3.5 animate-pulse text-emerald-400" />
            <span>Fab Status: Nominal (94.2% Yield)</span>
          </div>

          <button
            onClick={openChat}
            className="group relative flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 hover:text-slate-900 px-4 py-2 rounded-xl text-xs font-semibold shadow-lg shadow-cyan-500/25 transition-all duration-200 border border-cyan-300/40"
          >
            <Sparkles className="w-4 h-4 text-slate-950 group-hover:rotate-12 transition-transform" />
            <span>Ask SemiBot 2026</span>
            <span className="ml-1 text-[10px] font-mono bg-cyan-900/30 px-1.5 py-0.5 rounded text-cyan-950 border border-cyan-900/30">
              Gemini 2.5
            </span>
          </button>
        </div>

      </div>
    </header>
  );
};
