import React, { useState, useMemo } from 'react';
import { 
  BarChart3, 
  Cpu, 
  Flame, 
  Zap, 
  Sliders, 
  ShieldAlert, 
  Layers, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { PpaParams } from '../types';

interface PpaSimulatorProps {
  onAskGeminiAboutPpa: (prompt: string) => void;
}

export const PpaSimulator: React.FC<PpaSimulatorProps> = ({ onAskGeminiAboutPpa }) => {
  const [params, setParams] = useState<PpaParams>({
    processNode: '2nm-GAAFET',
    voltage: 0.72,
    frequency: 3.8,
    dieArea: 680,
    transistorCountBillion: 120,
    packagingTech: 'CoWoS-L',
    hbmStacks: 8,
  });

  // Calculate dynamic PPA metrics
  const results = useMemo(() => {
    // Dynamic Power: P ~ C * V^2 * f
    // Static Leakage Power based on node and area
    const nodeMultiplier = params.processNode === '1.4nm-CFET' ? 0.75 : params.processNode === '2nm-GAAFET' ? 0.9 : 1.2;
    const dynamicPower = 180 * Math.pow(params.voltage / 0.75, 2) * (params.frequency / 3.5) * nodeMultiplier;
    const staticLeakage = 45 * Math.pow(params.voltage / 0.75, 3) * (params.dieArea / 600) * (params.processNode === '3nm-FinFET' ? 1.6 : 0.85);
    const hbmPower = params.hbmStacks * 18.5; // ~18.5W per HBM4 stack
    const totalTdp = Math.round(dynamicPower + staticLeakage + hbmPower);

    // Compute Peak Compute (FP8 PFLOPS)
    const computeFactor = params.processNode === '1.4nm-CFET' ? 1.35 : params.processNode === '2nm-GAAFET' ? 1.15 : 1.0;
    const peakPflopsFp8 = Math.round((params.transistorCountBillion / 100) * (params.frequency / 3.0) * 18 * computeFactor);

    // Memory Bandwidth in TB/s
    const memBandwidthTBs = (params.hbmStacks * 1.5).toFixed(1);

    // Energy Efficiency (PFLOPS per kW)
    const efficiency = ((peakPflopsFp8 / totalTdp) * 1000).toFixed(1);

    // Thermal flux (W/cm^2)
    const dieAreaCm2 = params.dieArea / 100;
    const thermalFlux = (totalTdp / dieAreaCm2).toFixed(1);

    const isThermalWarning = Number(thermalFlux) > 110;

    return {
      totalTdp,
      dynamicPower: Math.round(dynamicPower),
      staticLeakage: Math.round(staticLeakage),
      hbmPower: Math.round(hbmPower),
      peakPflopsFp8,
      memBandwidthTBs,
      efficiency,
      thermalFlux,
      isThermalWarning
    };
  }, [params]);

  const triggerGeminiPpaConsult = () => {
    const prompt = `Evaluate our custom AI silicon design targeting AISemiCon 2026:
- Process Node: ${params.processNode}
- Vdd Voltage: ${params.voltage} V
- Operating Clock: ${params.frequency} GHz
- Die Area: ${params.dieArea} mm²
- Transistor Density: ${params.transistorCountBillion}B transistors
- Packaging: ${params.packagingTech} with ${params.hbmStacks} HBM4 stacks
Calculated TDP: ${results.totalTdp} W (Thermal Flux: ${results.thermalFlux} W/cm²).
Suggest architectural trade-offs: Backside Power Delivery (BS-PDN), voltage scaling, and microchannel cold-plate cooling to keep under 750W TDP.`;
    onAskGeminiAboutPpa(prompt);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-[#0F172A] border border-cyan-500/20 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-cyan-950 text-cyan-300 border border-cyan-500/30">
                PPA SIMULATOR 2026
              </span>
              <span className="text-xs text-slate-400">High-Performance AI Accelerator Design</span>
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <Sliders className="w-5 h-5 text-cyan-400" />
              Power, Performance, & Area (PPA) Silicon Synthesizer
            </h2>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl">
              Model gate capacitance, dynamic switching, subthreshold leakage, and CoWoS advanced packaging thermals in real time.
            </p>
          </div>

          <button
            onClick={triggerGeminiPpaConsult}
            className="flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 px-4 py-2 rounded-xl text-xs font-semibold shadow-lg shadow-cyan-500/20 transition border border-cyan-300/40"
          >
            <Sparkles className="w-4 h-4 text-slate-950" />
            <span>Consult Gemini on PPA</span>
          </button>
        </div>
      </div>

      {/* Simulator Inputs & Outputs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Sliders and Controls (7 cols) */}
        <div className="lg:col-span-7 bg-[#0F172A] border border-cyan-500/20 rounded-2xl p-6 shadow-xl space-y-5">
          <h3 className="text-sm font-bold text-white flex items-center gap-2 pb-3 border-b border-slate-800">
            <Cpu className="w-4 h-4 text-cyan-400" />
            Silicon Node & Architecture Parameters
          </h3>

          {/* Process Node Selector */}
          <div>
            <label className="text-xs text-slate-300 font-medium block mb-2">Process Node Architecture:</label>
            <div className="grid grid-cols-3 gap-2">
              {(['3nm-FinFET', '2nm-GAAFET', '1.4nm-CFET'] as const).map((node) => (
                <button
                  key={node}
                  onClick={() => setParams({ ...params, processNode: node })}
                  className={`py-2 px-3 rounded-xl text-xs font-mono font-medium border transition ${
                    params.processNode === node
                      ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400 shadow-sm shadow-cyan-500/30'
                      : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
                  }`}
                >
                  {node}
                </button>
              ))}
            </div>
          </div>

          {/* Voltage Vdd */}
          <div>
            <div className="flex justify-between text-xs mb-1.5">
              <span className="text-slate-300 font-medium">Supply Voltage (Vdd):</span>
              <span className="text-cyan-400 font-mono font-bold">{params.voltage.toFixed(2)} Volts</span>
            </div>
            <input
              type="range"
              min="0.55"
              max="0.95"
              step="0.01"
              value={params.voltage}
              onChange={(e) => setParams({ ...params, voltage: parseFloat(e.target.value) })}
              className="w-full accent-cyan-400 cursor-pointer bg-slate-800 h-2 rounded-lg"
            />
            <div className="flex justify-between text-[10px] text-slate-500 mt-1">
              <span>0.55V (Ultra-low Vth)</span>
              <span>0.72V (Nominal)</span>
              <span>0.95V (Overdrive)</span>
            </div>
          </div>

          {/* Frequency */}
          <div>
            <div className="flex justify-between text-xs mb-1.5">
              <span className="text-slate-300 font-medium">Core Operating Clock:</span>
              <span className="text-cyan-400 font-mono font-bold">{params.frequency.toFixed(1)} GHz</span>
            </div>
            <input
              type="range"
              min="1.8"
              max="4.8"
              step="0.1"
              value={params.frequency}
              onChange={(e) => setParams({ ...params, frequency: parseFloat(e.target.value) })}
              className="w-full accent-cyan-400 cursor-pointer bg-slate-800 h-2 rounded-lg"
            />
          </div>

          {/* Die Area & Transistors */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-slate-300 font-medium">Die Reticle Area:</span>
                <span className="text-cyan-400 font-mono font-bold">{params.dieArea} mm²</span>
              </div>
              <input
                type="range"
                min="350"
                max="858"
                step="10"
                value={params.dieArea}
                onChange={(e) => setParams({ ...params, dieArea: parseInt(e.target.value) })}
                className="w-full accent-cyan-400 cursor-pointer bg-slate-800 h-2 rounded-lg"
              />
              <span className="text-[10px] text-slate-500">Max single reticle limit: ~858 mm²</span>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-slate-300 font-medium">Transistors Count:</span>
                <span className="text-cyan-400 font-mono font-bold">{params.transistorCountBillion} Billion</span>
              </div>
              <input
                type="range"
                min="40"
                max="260"
                step="5"
                value={params.transistorCountBillion}
                onChange={(e) => setParams({ ...params, transistorCountBillion: parseInt(e.target.value) })}
                className="w-full accent-cyan-400 cursor-pointer bg-slate-800 h-2 rounded-lg"
              />
            </div>
          </div>

          {/* Packaging & HBM4 Stacks */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-800">
            <div>
              <label className="text-xs text-slate-300 font-medium block mb-1.5">Advanced Packaging:</label>
              <select
                value={params.packagingTech}
                onChange={(e) => setParams({ ...params, packagingTech: e.target.value as any })}
                className="w-full bg-slate-900 border border-slate-700 text-xs text-slate-200 rounded-xl px-3 py-2 font-mono focus:border-cyan-400 focus:outline-none"
              >
                <option value="CoWoS-S">TSMC CoWoS-S (Silicon Interposer)</option>
                <option value="CoWoS-L">TSMC CoWoS-L (RDL + LSI Bridges)</option>
                <option value="Intel-EMIB">Intel EMIB 3.5D Hybrid</option>
                <option value="Samsung-I-Cube">Samsung I-Cube 4X</option>
              </select>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-slate-300 font-medium">HBM4 Memory Stacks:</span>
                <span className="text-cyan-400 font-mono font-bold">{params.hbmStacks} Stacks (2048-bit)</span>
              </div>
              <div className="flex gap-2">
                {[4, 6, 8, 12].map((stacks) => (
                  <button
                    key={stacks}
                    onClick={() => setParams({ ...params, hbmStacks: stacks })}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-mono font-medium border transition ${
                      params.hbmStacks === stacks
                        ? 'bg-indigo-600/30 text-indigo-300 border-indigo-400'
                        : 'bg-slate-900 text-slate-400 border-slate-800'
                    }`}
                  >
                    {stacks}x
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Results & Thermals Gauge (5 cols) */}
        <div className="lg:col-span-5 bg-[#0F172A] border border-cyan-500/20 rounded-2xl p-6 shadow-xl flex flex-col justify-between space-y-6">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-400" />
                Synthesized PPA Metrics
              </span>
              <span className="text-[10px] font-mono text-cyan-400">Simulation v26.4</span>
            </h3>

            {/* Total Power / TDP */}
            <div className="mt-4 p-4 rounded-xl bg-gradient-to-r from-slate-900 to-[#121B30] border border-slate-800">
              <div className="flex justify-between items-baseline">
                <span className="text-xs text-slate-400">Total System TDP:</span>
                <span className="text-3xl font-extrabold font-mono text-cyan-300">
                  {results.totalTdp} <span className="text-base text-cyan-500">Watts</span>
                </span>
              </div>

              {/* Power breakdown bar */}
              <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden flex mt-3">
                <div 
                  style={{ width: `${(results.dynamicPower / results.totalTdp) * 100}%` }} 
                  className="bg-cyan-500" 
                  title={`Dynamic Core: ${results.dynamicPower}W`}
                />
                <div 
                  style={{ width: `${(results.staticLeakage / results.totalTdp) * 100}%` }} 
                  className="bg-rose-500" 
                  title={`Subthreshold Leakage: ${results.staticLeakage}W`}
                />
                <div 
                  style={{ width: `${(results.hbmPower / results.totalTdp) * 100}%` }} 
                  className="bg-indigo-500" 
                  title={`HBM4 Stacks: ${results.hbmPower}W`}
                />
              </div>

              <div className="flex justify-between text-[10px] text-slate-400 mt-2 font-mono">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-cyan-500"></span> Dynamic: {results.dynamicPower}W
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-rose-500"></span> Leakage: {results.staticLeakage}W
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-indigo-500"></span> HBM4: {results.hbmPower}W
                </span>
              </div>
            </div>

            {/* Key Silicon Output KPIs */}
            <div className="grid grid-cols-2 gap-3 mt-4">
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-slate-400 text-[11px] block">Peak AI Compute (FP8)</span>
                <span className="text-lg font-bold font-mono text-emerald-400">
                  {results.peakPflopsFp8} PFLOPS
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-slate-400 text-[11px] block">HBM4 Memory Bandwidth</span>
                <span className="text-lg font-bold font-mono text-cyan-300">
                  {results.memBandwidthTBs} TB/s
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-slate-400 text-[11px] block">Compute Efficiency</span>
                <span className="text-lg font-bold font-mono text-indigo-300">
                  {results.efficiency} PFLOPS/kW
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-slate-400 text-[11px] block">Thermal Flux Density</span>
                <span className={`text-lg font-bold font-mono ${results.isThermalWarning ? 'text-rose-400' : 'text-slate-200'}`}>
                  {results.thermalFlux} W/cm²
                </span>
              </div>
            </div>

            {/* Thermal Alert */}
            {results.isThermalWarning ? (
              <div className="mt-4 p-3 rounded-xl bg-rose-950/40 border border-rose-500/40 text-rose-300 text-xs flex items-start gap-2">
                <ShieldAlert className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">Thermal Flux Limit Exceeded:</span> Direct-to-chip microchannel liquid cooling (Cu/Diamond cold plate) required to prevent silicon thermal runaway.
                </div>
              </div>
            ) : (
              <div className="mt-4 p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
                <Flame className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Thermal dissipation is within standard dual-phase immersion limits.</span>
              </div>
            )}
          </div>

          <div className="text-[11px] text-slate-400 border-t border-slate-800 pt-3">
            Interconnect parasitics calculated using BS-PDN (Backside Power Delivery Network) RC extraction models.
          </div>
        </div>

      </div>
    </div>
  );
};
