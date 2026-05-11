import React, { useState, useEffect } from 'react';
import { aiService } from '../services/aiService';
import { BrainCircuit, AlertTriangle, CheckCircle, Info, Sparkles, Activity, Target } from 'lucide-react';

export default function Advisor() {
  const [insight, setInsight] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInsights = async () => {
      setTimeout(async () => {
        const result = await aiService.generateInsight();
        setInsight(result);
        setLoading(false);
      }, 1500);
    };
    fetchInsights();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4 animate-pulse">
        <div className="w-20 h-20 bg-gradient-to-tr from-purple-500 to-indigo-500 rounded-3xl flex items-center justify-center animate-bounce shadow-xl shadow-indigo-500/20">
          <BrainCircuit className="w-10 h-10 text-white" />
        </div>
        <p className="text-slate-400 font-extrabold tracking-wide uppercase text-sm">Synthesizing Data...</p>
      </div>
    );
  }

  const isHighRisk = insight.riskLevel === 'HIGH';
  const isMedRisk = insight.riskLevel === 'MEDIUM';

  const riskGradient = isHighRisk ? 'from-rose-500 to-red-600 shadow-rose-500/30' : isMedRisk ? 'from-amber-500 to-orange-500 shadow-amber-500/30' : 'from-emerald-400 to-teal-500 shadow-emerald-500/30';
  const riskBg = isHighRisk ? 'bg-rose-950/40 border-rose-900/50' : isMedRisk ? 'bg-amber-950/40 border-amber-900/50' : 'bg-emerald-950/40 border-emerald-900/50';

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      
      {/* Header */}
      <div className="flex items-center gap-3 mb-2">
        <div className="p-3 bg-purple-900/30 rounded-2xl text-purple-400">
          <BrainCircuit className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-2xl font-extrabold text-slate-100 tracking-tight">AI Advisor</h2>
          <p className="text-sm font-medium text-slate-400">Smart financial forecasting</p>
        </div>
      </div>

      {/* Risk Profile Card */}
      <div className={`rounded-3xl p-6 border relative overflow-hidden ${riskBg}`}>
        <div className={`absolute -right-4 -top-4 w-32 h-32 rounded-full bg-gradient-to-br ${riskGradient} opacity-20 blur-2xl`}></div>
        <div className="flex items-center justify-between relative z-10">
          <div>
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Status Level</h3>
            <div className="flex items-center gap-2">
              <div className={`px-4 py-1.5 rounded-full text-xs font-black tracking-wider text-white bg-gradient-to-r ${riskGradient} shadow-lg`}>
                {insight.riskLevel}
              </div>
            </div>
          </div>
          <div className="opacity-80">
            {isHighRisk ? <AlertTriangle className="w-12 h-12 text-rose-400" /> : <CheckCircle className="w-12 h-12 text-emerald-400" />}
          </div>
        </div>
      </div>

      {/* Analytical Data Card */}
      <div className="glass-card p-6 border-t-4 border-t-indigo-500">
        <div className="flex items-center gap-2 mb-6">
          <Activity className="w-5 h-5 text-indigo-400" />
          <h3 className="font-extrabold text-slate-100">Financial Analytics</h3>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-slate-900/50 rounded-2xl p-4 border border-slate-700/50">
            <p className="text-[10px] uppercase font-bold text-slate-400 mb-1 flex items-center gap-1"><Target className="w-3 h-3 text-pink-400"/> Forecast</p>
            <p className="text-xl font-black text-slate-100">RM {insight.forecastTotal.toFixed(2)}</p>
          </div>
          <div className="bg-slate-900/50 rounded-2xl p-4 border border-slate-700/50">
            <p className="text-[10px] uppercase font-bold text-slate-400 mb-1 flex items-center gap-1"><Sparkles className="w-3 h-3 text-emerald-400"/> Safe Daily</p>
            <p className="text-xl font-black text-slate-100">RM {insight.safeDailySpend.toFixed(2)}</p>
          </div>
          
          {insight.analytics && insight.analytics.map((metric, idx) => (
            <div key={idx} className="bg-slate-900/50 rounded-2xl p-4 border border-slate-700/50">
              <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">{metric.label}</p>
              <p className="text-lg font-bold text-slate-200">{metric.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Insights & Recommendations Card */}
      <div className="glass-card p-6 border-t-4 border-t-purple-500">
        <div className="space-y-6">
          <div>
            <h4 className="text-sm font-extrabold text-slate-100 flex items-center gap-2 mb-3">
              <Info className="w-5 h-5 text-purple-400" /> AI Observations
            </h4>
            <ul className="space-y-3">
              {insight.insights.map((item, idx) => (
                <li key={idx} className="text-sm font-medium text-slate-300 bg-slate-800/50 p-3 rounded-xl border border-slate-700/50 shadow-inner flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-1.5 flex-shrink-0"></span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-extrabold text-slate-100 flex items-center gap-2 mb-3">
              <Sparkles className="w-5 h-5 text-amber-400" /> Action Plan
            </h4>
            <ul className="space-y-3">
              {insight.recommendations.map((item, idx) => (
                <li key={idx} className="text-sm font-bold text-amber-100 bg-amber-900/20 p-4 rounded-xl border border-amber-900/40 shadow-sm flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 flex-shrink-0"></span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

    </div>
  );
}
