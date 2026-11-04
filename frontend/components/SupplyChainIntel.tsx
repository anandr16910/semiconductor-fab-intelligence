import React from 'react';
import { 
  Globe2, 
  Layers, 
  Cpu, 
  CheckCircle2, 
  AlertCircle, 
  ArrowUpRight, 
  ShieldCheck, 
  Zap 
} from 'lucide-react';

interface FoundryNode {
  name: string;
  location: string;
  leadNode: string;
  highNaEuvTools: number;
  monthlyCapacityK: number;
  status: 'Production Nominal' | 'Ramping Volume' | 'Pilot Fab';
  riskScore: 'Low' | 'Medium' | 'High';
}

const FOUNDRIES: FoundryNode[] = [
  {
    name: 'TSMC Fab 20 / Fab 21',
    location: 'Hsinchu / Phoenix Phase 2',
    leadNode: 'A16 (1.6nm) & N2 GAA',
    highNaEuvTools: 8,
    monthlyCapacityK: 65,
    status: 'Ramping Volume',
    riskScore: 'Low'
  },
  {
    name: 'Intel Foundry Fab 52/62',
    location: 'Chandler, Arizona & Magdeburg',
    leadNode: 'Intel 14A (High-NA 0.55)',
    highNaEuvTools: 6,
    monthlyCapacityK: 40,
    status: 'Ramping Volume',
    riskScore: 'Medium'
  },
  {
    name: 'Samsung Electronics S3/S5',
    location: 'Pyeongtaek & Taylor, Texas',
    leadNode: 'SF2P (2nm 2nd Gen GAA)',
    highNaEuvTools: 4,
    monthlyCapacityK: 35,
    status: 'Production Nominal',
    riskScore: 'Low'
  },
  {
    name: 'Rapidus IIM-1',
    location: 'Chitose, Hokkaido, Japan',
    leadNode: '2nm GAA Pilot',
    highNaEuvTools: 2,
    monthlyCapacityK: 8,
    status: 'Pilot Fab',
    riskScore: 'Medium'
  }
];

export const SupplyChainIntel: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-[#0F172A] border border-cyan-500/20 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-cyan-950 text-cyan-300 border border-cyan-500/30">
                GLOBAL SILICON RADAR
              </span>
              <span className="text-xs text-slate-400">2026 Supply Chain Status</span>
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <Globe2 className="w-5 h-5 text-cyan-400" />
              Sub-2nm Leading Edge Foundry & High-NA Tool Intelligence
            </h2>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl">
              Tracking ASML Twinscan EXE:5000/5200 tool deliveries, High-NA optical pellicle supplies, and photomask reticle limits across top foundries.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl text-center">
              <span className="text-xs text-slate-400 block">Total High-NA Deployed</span>
              <span className="text-xl font-mono font-bold text-cyan-300">20 Scanners</span>
            </div>
          </div>
        </div>
      </div>

      {/* Foundry Table / Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {FOUNDRIES.map((fab, idx) => (
          <div key={idx} className="bg-[#0F172A] border border-slate-800 hover:border-cyan-500/40 rounded-2xl p-5 shadow-lg transition">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  {fab.name}
                </h3>
                <span className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                  <Globe2 className="w-3 h-3 text-cyan-400" />
                  {fab.location}
                </span>
              </div>

              <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded border ${
                fab.status === 'Production Nominal'
                  ? 'bg-emerald-950 text-emerald-300 border-emerald-500/40'
                  : 'bg-cyan-950 text-cyan-300 border-cyan-500/40'
              }`}>
                {fab.status}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 mt-4 text-xs font-mono">
              <div className="p-2.5 rounded-lg bg-slate-900/80">
                <span className="text-slate-500 text-[10px] block">Lead Process</span>
                <span className="text-cyan-300 font-bold">{fab.leadNode}</span>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-900/80">
                <span className="text-slate-500 text-[10px] block">High-NA Tools</span>
                <span className="text-indigo-300 font-bold">{fab.highNaEuvTools} Units</span>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-900/80">
                <span className="text-slate-500 text-[10px] block">Target Output</span>
                <span className="text-emerald-400 font-bold">{fab.monthlyCapacityK}k wpm</span>
              </div>
            </div>

            <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-800/80 text-xs text-slate-400">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                Geopolitical Supply Risk: <strong className="text-slate-200">{fab.riskScore}</strong>
              </span>

              <span className="text-cyan-400 hover:text-cyan-300 cursor-pointer flex items-center gap-1">
                Telemetry <ArrowUpRight className="w-3 h-3" />
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
