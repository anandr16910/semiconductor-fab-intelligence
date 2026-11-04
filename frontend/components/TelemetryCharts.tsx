import React from 'react';
import { 
  AreaChart, 
  Area, 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend 
} from 'recharts';
import { BarChart3, TrendingUp, Zap, Cpu } from 'lucide-react';
import { FabMetric } from '../types';

const YIELD_TRENDS: FabMetric[] = [
  { date: 'Oct 25', yieldRate: 84.2, defectDensity: 0.14, waferThroughput: 8200, powerKWPerWafer: 3.8 },
  { date: 'Nov 25', yieldRate: 86.8, defectDensity: 0.12, waferThroughput: 9100, powerKWPerWafer: 3.7 },
  { date: 'Dec 25', yieldRate: 88.5, defectDensity: 0.11, waferThroughput: 10400, powerKWPerWafer: 3.6 },
  { date: 'Jan 26', yieldRate: 90.1, defectDensity: 0.095, waferThroughput: 11800, powerKWPerWafer: 3.5 },
  { date: 'Feb 26', yieldRate: 92.4, defectDensity: 0.088, waferThroughput: 13200, powerKWPerWafer: 3.4 },
  { date: 'Mar 26 (Live)', yieldRate: 94.2, defectDensity: 0.082, waferThroughput: 14500, powerKWPerWafer: 3.3 },
];

const PACKAGING_CAPACITY = [
  { name: 'TSMC CoWoS-S', capacityK: 45, demandK: 58 },
  { name: 'TSMC CoWoS-L', capacityK: 35, demandK: 42 },
  { name: 'Intel EMIB 3.5D', capacityK: 22, demandK: 26 },
  { name: 'Samsung I-Cube', capacityK: 18, demandK: 21 },
  { name: 'Amkor 2.5D', capacityK: 15, demandK: 17 },
];

export const TelemetryCharts: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Yield & Defect Density Trend */}
        <div className="bg-[#0F172A] border border-cyan-500/20 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-cyan-400" />
                2nm GAAFET Production Yield vs. Defect Density (D0)
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">High-NA 0.55 EUV fab ramp progress</p>
            </div>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-500/30">
              94.2% Peak Yield
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={YIELD_TRENDS}>
                <defs>
                  <linearGradient id="yieldGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#06B6D4" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
                <XAxis dataKey="date" stroke="#64748B" fontSize={11} tickLine={false} />
                <YAxis domain={[80, 100]} stroke="#64748B" fontSize={11} tickLine={false} unit="%" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0B1324', borderColor: '#06B6D4', borderRadius: '0.75rem', fontSize: '12px' }}
                  labelStyle={{ color: '#E2E8F0', fontWeight: 'bold' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <Area 
                  type="monotone" 
                  dataKey="yieldRate" 
                  name="Wafer Yield (%)" 
                  stroke="#06B6D4" 
                  strokeWidth={2.5} 
                  fillOpacity={1} 
                  fill="url(#yieldGrad)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Advanced Packaging Capacity vs AI Demand */}
        <div className="bg-[#0F172A] border border-cyan-500/20 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Cpu className="w-4 h-4 text-indigo-400" />
                Advanced 2.5D/3D Packaging Bottleneck (2026 Monthly)
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">Foundry capacity vs AI ASIC / GPU demand (k wafers/mo)</p>
            </div>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-amber-950 text-amber-400 border border-amber-500/30">
              Supply Deficit -18%
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={PACKAGING_CAPACITY} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
                <XAxis dataKey="name" stroke="#64748B" fontSize={10} tickLine={false} />
                <YAxis stroke="#64748B" fontSize={11} tickLine={false} unit="k" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0B1324', borderColor: '#818CF8', borderRadius: '0.75rem', fontSize: '12px' }}
                  labelStyle={{ color: '#E2E8F0', fontWeight: 'bold' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <Bar dataKey="capacityK" name="Foundry Capacity (k)" fill="#06B6D4" radius={[4, 4, 0, 0]} />
                <Bar dataKey="demandK" name="Global AI Demand (k)" fill="#818CF8" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
};
