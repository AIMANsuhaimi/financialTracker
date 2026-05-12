import React, { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { budgetService } from '../services/budgetService';
import { spendingService } from '../services/spendingService';
import { Edit2, TrendingDown, Tag, Trash2 } from 'lucide-react';

export default function Dashboard() {
  const [isEditingBudget, setIsEditingBudget] = useState(false);
  const [budgetInput, setBudgetInput] = useState('');

  const budget = useLiveQuery(() => budgetService.getDailyBudget());
  
  const today = new Date().toISOString().split('T')[0];
  const transactions = useLiveQuery(() => spendingService.getDailyTransactions(today)) || [];

  const dailyLimit = budget?.dailyLimit || 0;
  const spentToday = transactions.reduce((acc, curr) => acc + curr.amount, 0);
  const remaining = dailyLimit - spentToday;
  
  const formatValue = (val) => Number(val || 0).toFixed(2);

  const handleSaveBudget = async () => {
    const val = parseFloat(budgetInput);
    if (!isNaN(val) && val > 0) {
      await budgetService.setDailyBudget(val, budget?.rollover, budget?.monthlyIncome);
      setIsEditingBudget(false);
    }
  };

  const handleDelete = async (id) => {
    await spendingService.deleteTransaction(id);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className={`glass-card p-8 text-white relative overflow-hidden ${remaining < 0 ? 'bg-gradient-to-br from-rose-500 to-red-600 shadow-[0_8px_30px_rgb(225,29,72,0.3)]' : 'bg-gradient-to-br from-indigo-500 to-purple-600 shadow-[0_8px_30px_rgb(99,102,241,0.3)]'}`}>
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-bl-full -mr-4 -mt-4"></div>
        <div className="relative z-10">
          <div className="flex justify-between items-start">
            <h2 className="text-white/80 font-bold tracking-wide text-xs uppercase">Remaining Budget</h2>
            <button onClick={() => setIsEditingBudget(!isEditingBudget)} className="text-white/80 hover:text-white transition-colors bg-white/10 hover:bg-white/20 p-2 rounded-xl">
              <Edit2 className="w-4 h-4" />
            </button>
          </div>
          
          {isEditingBudget ? (
            <div className="mt-6 flex gap-2">
              <input 
                type="number" 
                className="w-full rounded-xl px-4 py-2 text-slate-800 outline-none font-bold text-lg bg-white/90 focus:ring-4 focus:ring-white/20" 
                placeholder="Limit"
                value={budgetInput}
                onChange={(e) => setBudgetInput(e.target.value)}
                autoFocus
              />
              <button onClick={handleSaveBudget} className="bg-white text-indigo-600 px-6 py-2 rounded-xl font-bold shadow-lg hover:scale-105 transition-transform">Save</button>
            </div>
          ) : (
            <div className="mt-4">
              <p className="text-5xl font-extrabold tracking-tight drop-shadow-sm">RM {formatValue(remaining)}</p>
              <div className="flex items-center gap-2 mt-3">
                <div className="h-1.5 flex-1 bg-white/20 rounded-full overflow-hidden">
                  <div className="h-full bg-white rounded-full transition-all duration-1000" style={{ width: `${Math.min((spentToday / (dailyLimit || 1)) * 100, 100)}%` }}></div>
                </div>
                <p className="text-xs font-bold text-white/90 whitespace-nowrap">of RM {formatValue(dailyLimit)}</p>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className="glass-card p-6 border-t-4 border-t-indigo-500">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-900/30 rounded-lg text-indigo-400">
              <TrendingDown className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-lg text-slate-100">Today's Transactions</h3>
          </div>
          <p className="font-extrabold text-lg text-slate-100">RM {formatValue(spentToday)}</p>
        </div>
        
        <div className="space-y-3">
          {transactions.length > 0 ? (
            transactions.map(tx => (
              <div key={tx.id} className="flex justify-between items-center bg-slate-800/50 p-4 rounded-2xl border border-slate-700/50 group hover:scale-[1.02] transition-transform duration-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-pink-900/20 text-pink-500 flex items-center justify-center">
                    <Tag className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-200 text-sm">{tx.category}</p>
                    {tx.note && <p className="text-xs font-medium text-slate-400 mt-0.5">{tx.note}</p>}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <p className="font-extrabold text-slate-100">RM {formatValue(tx.amount)}</p>
                  <button onClick={() => handleDelete(tx.id)} className="text-rose-400 hover:text-rose-600 transition-opacity p-1 bg-slate-800 rounded-lg shadow-sm border border-slate-700 hover:bg-slate-700">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-10 bg-slate-800/30 rounded-2xl border border-dashed border-slate-700">
              <p className="text-slate-500 font-bold text-sm">No spending recorded today.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
