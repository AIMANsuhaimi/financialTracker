import React from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { spendingService } from '../services/spendingService';
import { Activity, LayoutGrid, CalendarDays, PieChart } from 'lucide-react';

export default function Summary() {
  const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM
  const monthName = new Date().toLocaleString('default', { month: 'long', year: 'numeric' });
  const transactions = useLiveQuery(() => spendingService.getMonthlyTransactions(currentMonth)) || [];
  
  const totalSpent = transactions.reduce((acc, curr) => acc + curr.amount, 0);
  const dailyAvg = totalSpent / (new Date().getDate() || 1); 
  
  // Group by date for chart
  const dailyTotals = transactions.reduce((acc, tx) => {
    acc[tx.date] = (acc[tx.date] || 0) + tx.amount;
    return acc;
  }, {});
  
  const sortedData = Object.entries(dailyTotals)
    .sort(([dateA], [dateB]) => dateA.localeCompare(dateB))
    .map(([date, amount]) => ({ date, amount }));
    
  const maxDay = Math.max(...sortedData.map(d => d.amount), 1);

  // Group by category
  const categoryTotals = transactions.reduce((acc, tx) => {
    acc[tx.category] = (acc[tx.category] || 0) + tx.amount;
    return acc;
  }, {});
  
  const sortedCategories = Object.entries(categoryTotals)
    .sort((a, b) => b[1] - a[1]) // highest first
    .map(([cat, amt]) => ({ name: cat, amount: amt, percent: (amt / totalSpent) * 100 }));

  const COLORS = ['bg-pink-500', 'bg-indigo-500', 'bg-purple-500', 'bg-emerald-500', 'bg-amber-500', 'bg-rose-500'];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-24">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-indigo-900/30 rounded-2xl text-indigo-400">
          <Activity className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-2xl font-extrabold text-slate-100 tracking-tight">Overview</h2>
          <p className="text-sm font-medium text-slate-500 flex items-center gap-1"><CalendarDays className="w-3 h-3"/> {monthName}</p>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="glass-card p-5 relative overflow-hidden group hover:scale-[1.02] transition-transform duration-300">
          <div className="absolute top-0 right-0 w-16 h-16 bg-pink-900/20 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
          <h3 className="text-[11px] text-slate-500 font-bold uppercase tracking-wider mb-1">Total Spent</h3>
          <p className="text-2xl font-extrabold text-slate-100">RM {totalSpent.toFixed(2)}</p>
        </div>
        <div className="glass-card p-5 relative overflow-hidden group hover:scale-[1.02] transition-transform duration-300">
          <div className="absolute top-0 right-0 w-16 h-16 bg-indigo-900/20 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
          <h3 className="text-[11px] text-slate-500 font-bold uppercase tracking-wider mb-1">Daily Avg</h3>
          <p className="text-2xl font-extrabold text-slate-100">RM {dailyAvg.toFixed(2)}</p>
        </div>
      </div>

      <div className="glass-card p-6 border-t-4 border-t-pink-500">
        <div className="flex items-center gap-2 mb-6">
          <PieChart className="w-5 h-5 text-pink-500" />
          <h3 className="font-bold text-slate-100">Category Breakdown</h3>
        </div>
        
        {sortedCategories.length > 0 ? (
          <div className="space-y-4">
            {sortedCategories.map((cat, idx) => (
              <div key={cat.name} className="space-y-1">
                <div className="flex justify-between text-sm font-bold">
                  <span className="text-slate-300">{cat.name} <span className="text-[10px] text-slate-400 font-medium ml-1">({cat.percent.toFixed(0)}%)</span></span>
                  <span className="text-slate-100">RM {cat.amount.toFixed(2)}</span>
                </div>
                <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div className={`h-full ${COLORS[idx % COLORS.length]}`} style={{ width: `${cat.percent}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6">
            <p className="text-slate-500 font-medium text-sm">No data for categories.</p>
          </div>
        )}
      </div>
      
      <div className="glass-card p-6 border-t-4 border-t-purple-500">
        <div className="flex items-center gap-2 mb-6">
          <LayoutGrid className="w-5 h-5 text-purple-500" />
          <h3 className="font-bold text-slate-100">Spending Trend</h3>
        </div>
        
        {sortedData.length > 0 ? (
          <div className="h-44 flex items-end justify-start gap-3 overflow-x-auto pb-4 scrollbar-hide">
            {sortedData.map(day => (
              <div key={day.date} className="flex flex-col items-center flex-shrink-0 w-10 group">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-bold text-indigo-300 mb-1 bg-indigo-900/50 px-1.5 py-0.5 rounded">
                  {Math.round(day.amount)}
                </div>
                <div 
                  className="w-full bg-gradient-to-t from-indigo-500 to-purple-400 rounded-t-xl transition-all duration-1000 ease-out group-hover:from-pink-500 group-hover:to-rose-400 group-hover:shadow-[0_0_15px_rgba(236,72,153,0.5)]" 
                  style={{ height: `${(day.amount / maxDay) * 100}%`, minHeight: '6px' }}
                ></div>
                <span className="text-[11px] font-bold text-slate-500 mt-2">{day.date.split('-')[2]}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-slate-800/30 rounded-2xl border border-dashed border-slate-700">
            <p className="text-slate-500 font-medium text-sm">No spending recorded this month.</p>
          </div>
        )}
      </div>
    </div>
  );
}
