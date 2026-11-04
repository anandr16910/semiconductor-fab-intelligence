import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { GeminiChatModal } from './components/GeminiChatModal';
import { WaferMap } from './components/WaferMap';
import { PpaSimulator } from './components/PpaSimulator';
import { TelemetryCharts } from './components/TelemetryCharts';
import { SummitAgenda } from './components/SummitAgenda';
import { SupplyChainIntel } from './components/SupplyChainIntel';
import { CloudCostEstimator } from './components/CloudCostEstimator';
import { ActiveTab } from './types';
import { 
  Cpu, 
  Sparkles, 
  Layers, 
  Activity, 
  Zap, 
  Globe2, 
  Calendar, 
  ShieldCheck, 
  ChevronRight,
  TrendingUp,
  Sliders,
  Flame,
  ArrowRight,
  Calculator
} from 'lucide-react';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');
  const [isChatOpen, setIsChatOpen] = useState(false);

  // Helper to open chat modal and immediately trigger a query
  const handleAskGemini = (customPrompt?: string) => {
    setIsChatOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#070B14] text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-black">
      
      {/* Top Navigation */}
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        openChat={() => setIsChatOpen(true)} 
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 lg:px-8 py-6 space-y-6">
        
        {/* VIEW 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            
            {/* Hero Banner with Summit Call to Action */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#0C1527] via-[#101D36] to-[#0A1020] border border-cyan-500/30 p-6 sm:p-8 shadow-2xl">
              <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
              <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

              <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                <div className="max-w-2xl space-y-2">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 text-xs font-mono">
                    <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Live Intelligence: AISemiCon 2026 World Summit</span>
                  </div>
                  <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                    Next-Gen AI Silicon, High-NA Litho & Advanced 3D Packaging
                  </h1>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    Explore real-time 300mm wafer defect analytics, simulate 2nm GAAFET / 1.4nm CFET Power-Performance-Area trade-offs, and interact with <span className="text-cyan-300 font-semibold">SemiBot (Gemini 2.5 Flash)</span> for cutting-edge semiconductor architecture.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                  <button
                    onClick={() => setIsChatOpen(true)}
                    className="flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-400 to-indigo-500 hover:from-cyan-300 hover:to-indigo-400 text-slate-950 px-5 py-3 rounded-xl font-bold text-xs shadow-xl shadow-cyan-500/20 transition transform active:scale-95"
                  >
                    <Sparkles className="w-4 h-4 text-slate-950" />
                    <span>Launch SemiBot Copilot</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('cloud-cost')}
                    className="flex items-center justify-center gap-2 bg-emerald-950/60 hover:bg-emerald-900/60 text-emerald-300 border border-emerald-500/40 px-5 py-3 rounded-xl font-medium text-xs transition"
                  >
                    <Calculator className="w-4 h-4 text-emerald-400" />
                    <span>Cloud Cost in Rupees (₹)</span>
                  </button>
                </div>
              </div>

              {/* Real-time Summit quick metrics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-6 border-t border-slate-800/80">
                <div>
                  <span className="text-xs text-slate-400 block mb-1">Global 2nm Fab Yield</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold font-mono text-emerald-400">94.2%</span>
                    <span className="text-[10px] text-emerald-400 font-mono">+1.8% M/M</span>
                  </div>
                </div>

                <div>
                  <span className="text-xs text-slate-400 block mb-1">High-NA 0.55 Tools Online</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold font-mono text-cyan-300">20 Units</span>
                    <span className="text-[10px] text-slate-400">ASML EXE:5000</span>
                  </div>
                </div>

                <div>
                  <span className="text-xs text-slate-400 block mb-1">HBM4 Memory Peak BW</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold font-mono text-indigo-300">2.0 TB/s</span>
                    <span className="text-[10px] text-indigo-300">2048-bit base</span>
                  </div>
                </div>

                <div>
                  <span className="text-xs text-slate-400 block mb-1">Cloud Run Cost Target</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold font-mono text-amber-300">₹0 - ₹1.8k</span>
                    <span className="text-[10px] text-slate-400">Per Month</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Access Feature Tiles */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Card 1: Wafer Inspection */}
              <div 
                onClick={() => setActiveTab('wafer')}
                className="group cursor-pointer bg-[#0F172A] hover:bg-[#131D33] border border-cyan-500/20 hover:border-cyan-400/50 rounded-2xl p-6 transition-all duration-200 shadow-lg flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-cyan-950 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-4 group-hover:scale-110 transition-transform">
                    <Layers className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition flex items-center justify-between">
                    <span>300mm Wafer Yield Map</span>
                    <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400" />
                  </h3>
                  <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                    Interactive die-level spatial defect clustering, High-NA stochastic bridge detection, and critical dimension leakage measurements.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] font-mono text-cyan-400 flex items-center gap-1">
                  <span>Explore 300+ Die Coordinates</span>
                  <ArrowRight className="w-3 h-3" />
                </div>
              </div>

              {/* Card 2: PPA Simulator */}
              <div 
                onClick={() => setActiveTab('ppa')}
                className="group cursor-pointer bg-[#0F172A] hover:bg-[#131D33] border border-cyan-500/20 hover:border-cyan-400/50 rounded-2xl p-6 transition-all duration-200 shadow-lg flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-indigo-950 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mb-4 group-hover:scale-110 transition-transform">
                    <Sliders className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-white group-hover:text-indigo-300 transition flex items-center justify-between">
                    <span>PPA Silicon Synthesizer</span>
                    <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-indigo-400" />
                  </h3>
                  <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                    Dynamic voltage scaling (0.55V–0.95V), CoWoS-L thermals, FP8 compute throughput, and Backside Power Delivery (BS-PDN) modeling.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] font-mono text-indigo-400 flex items-center gap-1">
                  <span>Simulate 2nm vs 1.4nm TDP</span>
                  <ArrowRight className="w-3 h-3" />
                </div>
              </div>

              {/* Card 3: Cloud Cost in Rupees */}
              <div 
                onClick={() => setActiveTab('cloud-cost')}
                className="group cursor-pointer bg-[#0F172A] hover:bg-[#131D33] border border-cyan-500/20 hover:border-cyan-400/50 rounded-2xl p-6 transition-all duration-200 shadow-lg flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-emerald-950 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-4 group-hover:scale-110 transition-transform">
                    <Calculator className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-white group-hover:text-emerald-300 transition flex items-center justify-between">
                    <span>Cloud Cost Auditor (₹)</span>
                    <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400" />
                  </h3>
                  <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                    Complete breakdown of Gemini 2.5 Flash token costs, Google Search Grounding calls, and static hosting expenses in Indian Rupees.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] font-mono text-emerald-400 flex items-center gap-1">
                  <span>Calculate Monthly Bill</span>
                  <ArrowRight className="w-3 h-3" />
                </div>
              </div>

            </div>

            {/* Live Telemetry & Yield Trends Chart Section */}
            <TelemetryCharts />

          </div>
        )}

        {/* VIEW 2: WAFER MAP & DEFECT INSPECTION */}
        {activeTab === 'wafer' && <WaferMap />}

        {/* VIEW 3: PPA SILICON ARCHITECT */}
        {activeTab === 'ppa' && (
          <PpaSimulator onAskGeminiAboutPpa={handleAskGemini} />
        )}

        {/* VIEW 4: SUPPLY CHAIN & FOUNDRY RADAR */}
        {activeTab === 'supply-chain' && <SupplyChainIntel />}

        {/* VIEW 5: SUMMIT AGENDA */}
        {activeTab === 'summit' && (
          <SummitAgenda onAskGemini={handleAskGemini} />
        )}

        {/* VIEW 6: CLOUD COST & ROI IN RUPEES */}
        {activeTab === 'cloud-cost' && (
          <CloudCostEstimator onAskGemini={handleAskGemini} />
        )}

      </main>

      {/* Floating Gemini AI Copilot Trigger button */}
      <button
        onClick={() => setIsChatOpen(true)}
        className="fixed bottom-6 right-6 z-30 flex items-center gap-2.5 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 px-4 py-3 rounded-full font-bold text-xs shadow-2xl shadow-cyan-500/40 border-2 border-cyan-300 transition transform hover:scale-105 active:scale-95"
      >
        <Sparkles className="w-4 h-4 text-slate-950 animate-bounce" />
        <span className="hidden sm:inline">Ask SemiBot 2026</span>
        <span className="sm:hidden">Copilot</span>
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
      </button>

      {/* Gemini Chat Copilot Modal */}
      <GeminiChatModal 
        isOpen={isChatOpen} 
        onClose={() => setIsChatOpen(false)} 
      />

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-[#070B14] py-6 px-4 lg:px-8 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-slate-300">AISemiCon 2026</span>
            <span>• Global AI Semiconductor Summit Platform</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Powered by Gemini 2.5 Flash</span>
            <span>•</span>
            <span>Cloud Spend: ~₹0 (Dev) to ~₹1,800/mo</span>
          </div>
        </div>
      </footer>

    </div>
  );
};
