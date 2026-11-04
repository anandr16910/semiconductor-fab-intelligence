import React, { useState, useMemo } from 'react';
import { 
  Layers, 
  AlertTriangle, 
  CheckCircle2, 
  ZoomIn, 
  Info, 
  RotateCw, 
  Activity, 
  Filter
} from 'lucide-react';
import { WaferDie } from '../types';

export const WaferMap: React.FC = () => {
  const [selectedDie, setSelectedDie] = useState<WaferDie | null>(null);
  const [selectedLot, setSelectedLot] = useState('LOT-2026-N2-049A');
  const [filterMode, setFilterMode] = useState<'all' | 'defects-only'>('all');

  // Generate a realistic 300mm wafer grid of dies
  const dies: WaferDie[] = useMemo(() => {
    const list: WaferDie[] = [];
    const radius = 10;
    let idCounter = 1;

    for (let y = -radius; y <= radius; y++) {
      for (let x = -radius; x <= radius; x++) {
        const dist = Math.sqrt(x * x + y * y);
        if (dist <= radius) {
          let status: WaferDie['status'] = 'good';
          let defectType: string | undefined = undefined;
          const clusterScore = Math.random();

          if (dist > radius - 0.9) {
            status = 'edge-exclusion';
            defectType = 'Edge bevel defect & slurry ring';
          } else if (
            // Simulate defect clusters near coordinate (3, 4) and (-4, -2)
            (Math.abs(x - 3) <= 1 && Math.abs(y - 4) <= 1 && Math.random() > 0.3) ||
            (Math.abs(x + 4) <= 1 && Math.abs(y + 2) <= 1 && Math.random() > 0.4) ||
            Math.random() < 0.04
          ) {
            status = 'defect';
            const defectOptions = [
              'High-NA EUV Stochastic Bridging',
              'Sub-micron Particulate Void',
              'Gate-all-around Nanosheet Collapse',
              'Via Resistance Disconnect',
              'CMP Cu Puddle Defect'
            ];
            defectType = defectOptions[Math.floor(Math.random() * defectOptions.length)];
          } else if (Math.random() < 0.08) {
            status = 'marginal';
            defectType = 'Parametric Vth shift (+12mV)';
          }

          list.push({
            id: idCounter++,
            x,
            y,
            status,
            defectType,
            clusterScore,
          });
        }
      }
    }
    return list;
  }, [selectedLot]);

  const stats = useMemo(() => {
    const total = dies.length;
    const good = dies.filter(d => d.status === 'good').length;
    const defects = dies.filter(d => d.status === 'defect').length;
    const marginal = dies.filter(d => d.status === 'marginal').length;
    const edge = dies.filter(d => d.status === 'edge-exclusion').length;
    const activeTotal = total - edge;
    const yieldRate = activeTotal > 0 ? ((good / activeTotal) * 100).toFixed(1) : '0';

    return { total, good, defects, marginal, edge, yieldRate };
  }, [dies]);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-[#0F172A] border border-cyan-500/20 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-cyan-950 text-cyan-300 border border-cyan-500/30">
                FAB 21 - PHASE 3
              </span>
              <span className="text-xs text-slate-400">300mm GAAFET Wafer Map</span>
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <Layers className="w-5 h-5 text-cyan-400" />
              Wafer Defect & Inline Inspection Telemetry
            </h2>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl">
              Real-time High-NA EUV stochastics inspection. Click on any die coordinate on the wafer substrate to view spatial defect diagnostics.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <select
              value={selectedLot}
              onChange={(e) => setSelectedLot(e.target.value)}
              className="bg-slate-900 border border-slate-700 text-xs text-slate-200 rounded-xl px-3 py-2 font-mono focus:border-cyan-400 focus:outline-none"
            >
              <option value="LOT-2026-N2-049A">Lot: LOT-2026-N2-049A (2nm GAA)</option>
              <option value="LOT-2026-N2-052C">Lot: LOT-2026-N2-052C (High-NA Pilot)</option>
              <option value="LOT-2026-A14-003">Lot: LOT-2026-A14-003 (1.4nm R&D)</option>
            </select>

            <button
              onClick={() => setSelectedLot(prev => prev.includes('049A') ? 'LOT-2026-N2-052C' : 'LOT-2026-N2-049A')}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700"
            >
              <RotateCw className="w-3.5 h-3.5 text-cyan-400" />
              <span>Rescan</span>
            </button>
          </div>
        </div>

        {/* Quick KPI stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
          <div className="bg-[#142036] p-3.5 rounded-xl border border-slate-800">
            <span className="text-slate-400 text-xs block mb-1">Effective Yield</span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold font-mono text-emerald-400">{stats.yieldRate}%</span>
              <span className="text-[10px] text-emerald-400 font-mono">+1.8% vs baseline</span>
            </div>
          </div>

          <div className="bg-[#142036] p-3.5 rounded-xl border border-slate-800">
            <span className="text-slate-400 text-xs block mb-1">Functional Dies</span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold font-mono text-cyan-300">{stats.good}</span>
              <span className="text-[10px] text-slate-400">/ {stats.total - stats.edge} active</span>
            </div>
          </div>

          <div className="bg-[#142036] p-3.5 rounded-xl border border-slate-800">
            <span className="text-slate-400 text-xs block mb-1">Fatal Defects</span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold font-mono text-rose-400">{stats.defects}</span>
              <span className="text-[10px] text-rose-400 font-mono">D0: 0.082/cm²</span>
            </div>
          </div>

          <div className="bg-[#142036] p-3.5 rounded-xl border border-slate-800">
            <span className="text-slate-400 text-xs block mb-1">Edge Exclusions</span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold font-mono text-amber-400">{stats.edge}</span>
              <span className="text-[10px] text-slate-400">3mm bevel zone</span>
            </div>
          </div>
        </div>
      </div>

      {/* Wafer Visualizer & Inspector Column */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* The 300mm Silicon Wafer Disc */}
        <div className="lg:col-span-2 bg-[#0F172A] border border-cyan-500/20 rounded-2xl p-6 shadow-xl flex flex-col items-center">
          
          <div className="w-full flex items-center justify-between mb-4">
            <div className="flex items-center gap-4 text-xs">
              <span className="flex items-center gap-1.5 text-slate-300">
                <span className="w-3 h-3 rounded bg-emerald-500"></span> Good Die
              </span>
              <span className="flex items-center gap-1.5 text-slate-300">
                <span className="w-3 h-3 rounded bg-amber-400"></span> Marginal
              </span>
              <span className="flex items-center gap-1.5 text-slate-300">
                <span className="w-3 h-3 rounded bg-rose-500"></span> Defect
              </span>
              <span className="flex items-center gap-1.5 text-slate-400">
                <span className="w-3 h-3 rounded bg-slate-700"></span> Bevel
              </span>
            </div>

            <button
              onClick={() => setFilterMode(filterMode === 'all' ? 'defects-only' : 'all')}
              className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-lg border transition ${
                filterMode === 'defects-only'
                  ? 'bg-rose-950 text-rose-300 border-rose-500/50'
                  : 'bg-slate-800 text-slate-300 border-slate-700'
              }`}
            >
              <Filter className="w-3 h-3" />
              <span>{filterMode === 'defects-only' ? 'Showing Defects Only' : 'Filter Fatal'}</span>
            </button>
          </div>

          {/* Interactive circular wafer boundary */}
          <div className="relative w-[340px] h-[340px] sm:w-[460px] sm:h-[460px] rounded-full border-4 border-cyan-500/40 bg-gradient-to-b from-[#091122] to-[#040814] shadow-[0_0_50px_rgba(6,182,212,0.15)] flex items-center justify-center p-4 overflow-hidden">
            
            {/* Wafer Notch at top */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-2.5 bg-slate-900 border-b-2 border-x-2 border-cyan-400/60 rounded-b-md z-10" />

            {/* Grid of Silicon Dies */}
            <div className="grid grid-cols-21 gap-[2px] p-2">
              {dies.map((die) => {
                const isSelected = selectedDie?.id === die.id;
                let bgClass = 'bg-emerald-500/80 hover:bg-emerald-400';

                if (die.status === 'defect') {
                  bgClass = 'bg-rose-500 shadow-sm shadow-rose-500 hover:bg-rose-400 animate-pulse';
                } else if (die.status === 'marginal') {
                  bgClass = 'bg-amber-400/90 hover:bg-amber-300';
                } else if (die.status === 'edge-exclusion') {
                  bgClass = 'bg-slate-700/60 hover:bg-slate-600';
                }

                if (filterMode === 'defects-only' && die.status !== 'defect') {
                  bgClass = 'bg-slate-900/40 opacity-30';
                }

                return (
                  <button
                    key={die.id}
                    onClick={() => setSelectedDie(die)}
                    title={`Die #${die.id} (${die.x}, ${die.y}): ${die.status}`}
                    className={`w-3 h-3 sm:w-4 sm:h-4 rounded-[2px] transition-all transform hover:scale-125 ${bgClass} ${
                      isSelected ? 'ring-2 ring-white scale-125 z-20' : ''
                    }`}
                  />
                );
              })}
            </div>

            {/* Diameter Indicator Overlay */}
            <div className="absolute bottom-3 text-[10px] font-mono text-cyan-500/70 uppercase tracking-widest pointer-events-none">
              300mm Si Wafer (100) Notch UP
            </div>
          </div>
        </div>

        {/* Die Inspector Details Card */}
        <div className="bg-[#0F172A] border border-cyan-500/20 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <ZoomIn className="w-4 h-4 text-cyan-400" />
                Die Coordinate Inspector
              </h3>
              {selectedDie && (
                <span className="font-mono text-xs text-cyan-300 px-2 py-0.5 rounded bg-cyan-950 border border-cyan-500/30">
                  Die #{selectedDie.id}
                </span>
              )}
            </div>

            {selectedDie ? (
              <div className="mt-4 space-y-4">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                  <div className={`p-2.5 rounded-lg ${
                    selectedDie.status === 'good' ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/40' :
                    selectedDie.status === 'defect' ? 'bg-rose-950 text-rose-400 border border-rose-500/40' :
                    selectedDie.status === 'marginal' ? 'bg-amber-950 text-amber-400 border border-amber-500/40' :
                    'bg-slate-800 text-slate-400'
                  }`}>
                    {selectedDie.status === 'good' && <CheckCircle2 className="w-5 h-5" />}
                    {selectedDie.status === 'defect' && <AlertTriangle className="w-5 h-5" />}
                    {selectedDie.status === 'marginal' && <Activity className="w-5 h-5" />}
                    {selectedDie.status === 'edge-exclusion' && <Layers className="w-5 h-5" />}
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 block">Die Classification</span>
                    <span className="text-sm font-bold uppercase tracking-wider text-white">
                      {selectedDie.status}
                    </span>
                  </div>
                </div>

                <div className="space-y-2 text-xs font-mono">
                  <div className="flex justify-between p-2 rounded bg-slate-900/60">
                    <span className="text-slate-400">Wafer Coordinates:</span>
                    <span className="text-cyan-300 font-bold">X: {selectedDie.x}, Y: {selectedDie.y}</span>
                  </div>

                  <div className="flex justify-between p-2 rounded bg-slate-900/60">
                    <span className="text-slate-400">Distance from Center:</span>
                    <span className="text-slate-200">
                      {(Math.sqrt(selectedDie.x * selectedDie.x + selectedDie.y * selectedDie.y) * 14.2).toFixed(1)} mm
                    </span>
                  </div>

                  <div className="flex justify-between p-2 rounded bg-slate-900/60">
                    <span className="text-slate-400">Inspection Diagnosis:</span>
                    <span className="text-amber-300 truncate max-w-[160px]">
                      {selectedDie.defectType || 'Full Spec Compliance (Pass)'}
                    </span>
                  </div>

                  <div className="flex justify-between p-2 rounded bg-slate-900/60">
                    <span className="text-slate-400">Critical Dimension (CD):</span>
                    <span className="text-emerald-400">2.04 nm (±0.06nm)</span>
                  </div>

                  <div className="flex justify-between p-2 rounded bg-slate-900/60">
                    <span className="text-slate-400">GAA Gate Oxide Integrity:</span>
                    <span className="text-cyan-300">1.28 MV/cm (Nominal)</span>
                  </div>
                </div>

                {selectedDie.status === 'defect' && (
                  <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-200 text-xs">
                    <p className="font-semibold flex items-center gap-1.5 text-rose-400 mb-1">
                      <AlertTriangle className="w-3.5 h-3.5" /> High-NA Litho Stochastic Event
                    </p>
                    SEM inspection detected nano-bridging between adjacent GAAFET nanosheets at 18nm pitch. Automated e-beam review scheduled.
                  </div>
                )}
              </div>
            ) : (
              <div className="mt-8 text-center py-10 px-4 text-slate-500">
                <Info className="w-8 h-8 mx-auto mb-2 text-slate-600" />
                <p className="text-xs text-slate-400 font-medium">No die selected</p>
                <p className="text-[11px] text-slate-500 mt-1">
                  Click on any die on the 300mm wafer map to inspect inline SEM defects, CD uniformity, and leakage telemetry.
                </p>
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-slate-800 text-[11px] text-slate-400">
            Inline SEM tool: ASML eP5 / KLA 2930 Broadband Plasma Inspection.
          </div>
        </div>

      </div>
    </div>
  );
};
