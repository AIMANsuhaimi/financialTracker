import React, { useState } from 'react';
import { spendingService } from '../services/spendingService';
import { useNavigate } from 'react-router-dom';
import { Receipt, Calendar, AlignLeft, Tag } from 'lucide-react';

const CATEGORIES = ['Food', 'Transport', 'Shopping', 'Bills', 'Entertainment', 'Other'];

export default function AddSpending() {
  const navigate = useNavigate();
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [note, setNote] = useState('');
  const [category, setCategory] = useState('Food');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const val = parseFloat(amount);
    if (!isNaN(val) && val > 0 && date && category) {
      await spendingService.addTransaction(date, val, category, note);
      navigate('/');
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <h2 className="text-2xl font-extrabold text-slate-100 tracking-tight">New Expense</h2>
      <div className="glass-card p-8 border-t-4 border-t-pink-500">
        <form className="space-y-6" onSubmit={handleSubmit}>
          
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-300 flex items-center gap-2">
              <Receipt className="w-4 h-4 text-pink-500" /> Amount (RM)
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold">RM</span>
              <input 
                type="number" 
                step="0.01" 
                required
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full rounded-2xl bg-slate-800 border-2 border-slate-700 pl-12 p-4 text-2xl font-extrabold text-slate-100 focus:bg-slate-900 focus:border-pink-500 outline-none transition-all placeholder:text-slate-600" 
                placeholder="0.00" 
                autoFocus
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-300 flex items-center gap-2">
              <Tag className="w-4 h-4 text-pink-500" /> Category
            </label>
            <div className="grid grid-cols-3 gap-2">
              {CATEGORIES.map(c => (
                <button
                  type="button"
                  key={c}
                  onClick={() => setCategory(c)}
                  className={`p-2 rounded-xl text-xs font-bold transition-all border-2 ${category === c ? 'bg-pink-900/30 border-pink-500 text-pink-400 shadow-md shadow-pink-100/50' : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-pink-300'}`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-300 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-pink-500" /> Date
            </label>
            <input 
              type="date" 
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full rounded-2xl bg-slate-800 border-2 border-slate-700 p-4 text-slate-300 font-bold focus:bg-slate-900 focus:border-pink-500 outline-none transition-all" 
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-300 flex items-center gap-2">
              <AlignLeft className="w-4 h-4 text-pink-500" /> Note (Optional)
            </label>
            <input 
              type="text" 
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full rounded-2xl bg-slate-800 border-2 border-slate-700 p-4 text-slate-300 font-bold focus:bg-slate-900 focus:border-pink-500 outline-none transition-all placeholder:text-slate-600" 
              placeholder="What did you spend on?" 
            />
          </div>

          <button type="submit" className="w-full py-4 px-4 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white rounded-2xl font-bold text-lg shadow-[0_8px_20px_rgb(244,63,94,0.3)] hover:shadow-[0_8px_25px_rgb(244,63,94,0.5)] hover:-translate-y-1 transition-all">
            Save Record
          </button>
        </form>
      </div>
    </div>
  );
}
