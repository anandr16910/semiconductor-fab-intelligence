import React, { useState, useMemo } from 'react';
import { 
  Calculator, 
  Sparkles, 
  Server, 
  Globe, 
  Database, 
  HelpCircle, 
  CheckCircle2, 
  Zap, 
  DollarSign, 
  ShieldCheck,
  TrendingDown,
  ArrowRight
} from 'lucide-react';
import { CloudCostConfig } from '../types';

interface CloudCostEstimatorProps {
  onAskGemini: (prompt: string) => void;
}

const USD_TO_INR = 86.5; // Benchmark exchange rate

export const CloudCostEstimator: React.FC<CloudCostEstimatorProps> = ({ onAskGemini }) => {
  const [config, setConfig] = useState<CloudCostConfig>({
    monthlyUsers: 3500,
    queriesPerUser: 6,
    avgInputTokens: 350,
    avgOutputTokens: 450,
    percentSearchGrounded: 25,
    hostingTier: 'free'
  });

  const [useFreeTierDiscount, setUseFreeTierDiscount] = useState(true);

  // Cost calculation engine
  const calculation = useMemo(() => {
    const totalQueries = config.monthlyUsers * config.queriesPerUser;
    const totalInputTokens = totalQueries * config.avgInputTokens;
    const totalOutputTokens = totalQueries * config.avgOutputTokens;
    const groundedQueries = Math.round(totalQueries * (config.percentSearchGrounded / 100));

    // Gemini 2.5 Flash Pricing (Standard Tier):
    // Input: $0.075 per 1,000,000 tokens
    // Output: $0.30 per 1,000,000 tokens
    // Grounding: ~$0.035 per search query (above daily free quotas)
    const rawInputCostUSD = (totalInputTokens / 1_000_000) * 0.075;
    const rawOutputCostUSD = (totalOutputTokens / 1_000_000) * 0.30;
    
    // Free tier offsets
    let inputCostUSD = rawInputCostUSD;
    let outputCostUSD = rawOutputCostUSD;
    let groundingCostUSD = (groundedQueries / 1000) * 35;

    if (useFreeTierDiscount) {
      // First 1,500 daily requests free on Google AI Studio
      const monthlyFreeAllowance = 1500 * 30;
      if (totalQueries <= monthlyFreeAllowance) {
        inputCostUSD = Math.max(0, rawInputCostUSD * 0.15); // Negligible or free
        outputCostUSD = Math.max(0, rawOutputCostUSD * 0.15);
        groundingCostUSD = Math.max(0, groundingCostUSD * 0.2);
      }
    }

    const hostingCostUSD = config.hostingTier === 'free' ? 0 : 25; // $25 for GCP Cloud Run / Load Balancer
    const storageCostUSD = config.hostingTier === 'free' ? 0 : 5;

    const totalUSD = inputCostUSD + outputCostUSD + groundingCostUSD + hostingCostUSD + storageCostUSD;
    const totalINR = totalUSD * USD_TO_INR;

    const inputINR = inputCostUSD * USD_TO_INR;
    const outputINR = outputCostUSD * USD_TO_INR;
    const groundingINR = groundingCostUSD * USD_TO_INR;
    const hostingINR = (hostingCostUSD + storageCostUSD) * USD_TO_INR;

    const costPerUserINR = config.monthlyUsers > 0 ? (totalINR / config.monthlyUsers).toFixed(2) : '0';

    return {
      totalQueries,
      totalInputTokens,
      totalOutputTokens,
      groundedQueries,
      inputINR: Math.round(inputINR),
      outputINR: Math.round(outputINR),
      groundingINR: Math.round(groundingINR),
      hostingINR: Math.round(hostingINR),
      totalINR: Math.round(totalINR),
      totalUSD: totalUSD.toFixed(2),
      costPerUserINR
    };
  }, [config, useFreeTierDiscount]);

  const consultGeminiForOptimization = () => {
    const prompt = `I am running the AISemiCon 2026 dashboard in India with ${config.monthlyUsers} monthly users generating ~${calculation.totalQueries} semiconductor queries per month. Current projected cloud spend is ₹${calculation.totalINR} INR ($${calculation.totalUSD} USD). Suggest 3 concrete engineering tactics to minimize Gemini 2.5 Flash token costs, manage search grounding thresholds, and optimize client-side caching.`;
    onAskGemini(prompt);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-[#0F172A] border border-cyan-500/20 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-emerald-950 text-emerald-300 border border-emerald-500/30">
                INR (₹) COST AUDITOR
              </span>
              <span className="text-xs text-slate-400">Vertex AI & Gemini 2.5 Flash Infrastructure</span>
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <Calculator className="w-5 h-5 text-cyan-400" />
              AISemiCon 2026 Cloud Spend & Cost Simulator (in Rupees)
            </h2>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl">
              Transparent cost breakdown for serving the semiconductor dashboard, running Gemini 2.5 Flash Copilot, performing live wafer analytics, and Google Search grounding.
            </p>
          </div>

          <button
            onClick={consultGeminiForOptimization}
            className="flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 px-4 py-2 rounded-xl text-xs font-semibold shadow-lg shadow-cyan-500/20 transition border border-cyan-300/40"
          >
            <Sparkles className="w-4 h-4 text-slate-950" />
            <span>Ask Gemini Cost Optimization Tips</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Parameters + Real-time INR Output */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Sliders and Configurations (7 cols) */}
        <div className="lg:col-span-7 bg-[#0F172A] border border-cyan-500/20 rounded-2xl p-6 shadow-xl space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Server className="w-4 h-4 text-cyan-400" />
              Traffic & Usage Parameters
            </h3>
            <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
              <input 
                type="checkbox" 
                checked={useFreeTierDiscount} 
                onChange={(e) => setUseFreeTierDiscount(e.target.checked)}
                className="accent-cyan-400 rounded"
              />
              <span>Apply Google AI Free Tier</span>
            </label>
          </div>

          {/* Monthly Active Attendees / Users */}
          <div>
            <div className="flex justify-between text-xs mb-1.5">
              <span className="text-slate-300 font-medium">Monthly Active Users (Summit delegates):</span>
              <span className="text-cyan-400 font-mono font-bold">{config.monthlyUsers.toLocaleString()} Users</span>
            </div>
            <input
              type="range"
              min="100"
              max="25000"
              step="200"
              value={config.monthlyUsers}
              onChange={(e) => setConfig({ ...config, monthlyUsers: parseInt(e.target.value) })}
              className="w-full accent-cyan-400 cursor-pointer bg-slate-800 h-2 rounded-lg"
            />
            <div className="flex justify-between text-[10px] text-slate-500 mt-1">
              <span>100 (Internal Test)</span>
              <span>5,000 (Summit Event)</span>
              <span>25,000 (Global Platform)</span>
            </div>
          </div>

          {/* Questions per User */}
          <div>
            <div className="flex justify-between text-xs mb-1.5">
              <span className="text-slate-300 font-medium">Copilot Queries per User:</span>
              <span className="text-cyan-400 font-mono font-bold">{config.queriesPerUser} Prompts / month</span>
            </div>
            <input
              type="range"
              min="1"
              max="25"
              step="1"
              value={config.queriesPerUser}
              onChange={(e) => setConfig({ ...config, queriesPerUser: parseInt(e.target.value) })}
              className="w-full accent-cyan-400 cursor-pointer bg-slate-800 h-2 rounded-lg"
            />
          </div>

          {/* Search Grounding % */}
          <div>
            <div className="flex justify-between text-xs mb-1.5">
              <span className="text-slate-300 font-medium">Questions requiring Live Web Grounding:</span>
              <span className="text-cyan-400 font-mono font-bold">{config.percentSearchGrounded}% of questions</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={config.percentSearchGrounded}
              onChange={(e) => setConfig({ ...config, percentSearchGrounded: parseInt(e.target.value) })}
              className="w-full accent-cyan-400 cursor-pointer bg-slate-800 h-2 rounded-lg"
            />
            <p className="text-[10px] text-slate-400 mt-1">
              *Silicon node questions (e.g., GAAFET formulas, local wafer defect scans) do NOT need Google Search, saving substantial API cost.
            </p>
          </div>

          {/* Hosting infrastructure tier */}
          <div className="pt-2 border-t border-slate-800">
            <label className="text-xs text-slate-300 font-medium block mb-2">Hosting & Distribution Tier:</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setConfig({ ...config, hostingTier: 'free' })}
                className={`p-3 rounded-xl border text-left transition ${
                  config.hostingTier === 'free'
                    ? 'bg-cyan-500/20 text-cyan-200 border-cyan-400'
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
                }`}
              >
                <div className="font-bold text-xs flex items-center justify-between">
                  <span>Serverless / Free Edge</span>
                  <span className="text-[10px] font-mono text-emerald-400">₹0 / mo</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">Firebase Hosting / Vercel / Cloudflare CDN. Zero server maintenance.</p>
              </button>

              <button
                onClick={() => setConfig({ ...config, hostingTier: 'managed-gcp' })}
                className={`p-3 rounded-xl border text-left transition ${
                  config.hostingTier === 'managed-gcp'
                    ? 'bg-cyan-500/20 text-cyan-200 border-cyan-400'
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
                }`}
              >
                <div className="font-bold text-xs flex items-center justify-between">
                  <span>Enterprise GCP Cluster</span>
                  <span className="text-[10px] font-mono text-amber-400">~₹2,590 / mo</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">Dedicated Cloud Load Balancer, VPC egress, and guaranteed 99.99% SLA.</p>
              </button>
            </div>
          </div>
        </div>

        {/* INR Calculation Output Summary (5 cols) */}
        <div className="lg:col-span-5 bg-[#0F172A] border border-cyan-500/20 rounded-2xl p-6 shadow-xl flex flex-col justify-between space-y-6">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span className="text-base text-emerald-400 font-bold">₹</span>
                Projected Monthly Expenditure
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800">
                1 USD ≈ ₹{USD_TO_INR}
              </span>
            </div>

            {/* Total Rupees Highlight Box */}
            <div className="mt-4 p-5 rounded-xl bg-gradient-to-r from-emerald-950/40 via-cyan-950/30 to-slate-900 border border-emerald-500/40 text-center">
              <span className="text-xs uppercase font-mono tracking-wider text-emerald-300 block mb-1">
                Estimated Monthly Cloud Bill
              </span>
              <div className="flex items-center justify-center gap-1">
                <span className="text-4xl font-extrabold font-mono text-emerald-400">
                  ₹{calculation.totalINR.toLocaleString()}
                </span>
                <span className="text-xs text-slate-400 font-mono mt-2">INR / mo</span>
              </div>
              <p className="text-xs text-slate-400 mt-1 font-mono">
                Equivalent to approx <strong className="text-slate-200">${calculation.totalUSD} USD</strong> (₹{calculation.costPerUserINR} per user)
              </p>
            </div>

            {/* Detailed Itemized Line Items in INR */}
            <div className="space-y-2 mt-4 text-xs font-mono">
              <div className="flex justify-between p-2.5 rounded bg-slate-900/70 border border-slate-800/80">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-cyan-400" />
                  Gemini 2.5 Flash Input Tokens:
                </span>
                <span className="text-cyan-300 font-bold">₹{calculation.inputINR}</span>
              </div>

              <div className="flex justify-between p-2.5 rounded bg-slate-900/70 border border-slate-800/80">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                  Gemini 2.5 Flash Output Tokens:
                </span>
                <span className="text-indigo-300 font-bold">₹{calculation.outputINR}</span>
              </div>

              <div className="flex justify-between p-2.5 rounded bg-slate-900/70 border border-slate-800/80">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-amber-400" />
                  Google Search Grounding ({calculation.groundedQueries} calls):
                </span>
                <span className="text-amber-300 font-bold">₹{calculation.groundingINR}</span>
              </div>

              <div className="flex justify-between p-2.5 rounded bg-slate-900/70 border border-slate-800/80">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <Server className="w-3.5 h-3.5 text-emerald-400" />
                  Web Hosting & Edge CDN:
                </span>
                <span className="text-emerald-400 font-bold">
                  {calculation.hostingINR === 0 ? '₹0 (Free Tier)' : `₹${calculation.hostingINR}`}
                </span>
              </div>
            </div>

            {/* Free Tier Highlight Note */}
            {calculation.totalINR < 1000 ? (
              <div className="mt-4 p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>
                  <strong>Ultra-Low Budget:</strong> At this usage level, expenses are minimal or practically <strong>₹0</strong> when using developer keys on Vertex AI / Google AI Studio.
                </span>
              </div>
            ) : (
              <div className="mt-4 p-3 rounded-xl bg-cyan-950/40 border border-cyan-500/30 text-cyan-300 text-xs flex items-center gap-2">
                <TrendingDown className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                <span>
                  Production Scale: Gemini 2.5 Flash costs only ~₹6.50 per 1M prompt tokens, making it ~10x cheaper than legacy LLMs.
                </span>
              </div>
            )}
          </div>

          <div className="text-[11px] text-slate-500 border-t border-slate-800 pt-3 flex items-center justify-between">
            <span>Prices based on official Google Cloud & Vertex AI rates.</span>
            <span className="text-cyan-400 font-mono">GST ~18% applicable for Indian billing</span>
          </div>
        </div>

      </div>

      {/* Cloud Cost Strategy Guide */}
      <div className="bg-[#0F172A] border border-cyan-500/20 rounded-2xl p-6 shadow-xl">
        <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-3">
          <ShieldCheck className="w-4 h-4 text-cyan-400" />
          How to Keep aisemicon2026 Cloud Spend Under ₹1,500 / Month
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-300">
          <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
            <span className="font-bold text-cyan-300 block mb-1">1. Selective Web Grounding</span>
            Keep search grounding disabled for deterministic semiconductor math (die yield formulas, PPA voltage math). Only trigger search when users ask for live breaking news.
          </div>
          <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
            <span className="font-bold text-indigo-300 block mb-1">2. Client-Side Telemetry</span>
            The 300mm wafer defect map and PPA calculators execute entirely on the client browser in JavaScript with zero server compute, saving database read/write costs.
          </div>
          <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
            <span className="font-bold text-emerald-300 block mb-1">3. Gemini 2.5 Flash Economics</span>
            `gemini-2.5-flash` gives near-Pro reasoning speed at a fraction of the token cost, ideal for high-volume technical event dashboards.
          </div>
        </div>
      </div>
    </div>
  );
};
