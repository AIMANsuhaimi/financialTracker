import React, { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { billService } from '../services/billService';
import { CheckCircle2, Clock, AlertCircle, Plus } from 'lucide-react';

export default function Bills() {
  const bills = useLiveQuery(() => billService.getBills());
  const [showForm, setShowForm] = useState(false);
  
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [dueDate, setDueDate] = useState('');

  const handleAddBill = async (e) => {
    e.preventDefault();
    if (title && amount && dueDate) {
      await billService.addBill(title, parseFloat(amount), dueDate);
      setTitle('');
      setAmount('');
      setDueDate('');
      setShowForm(false);
    }
  };

  const handleMarkPaid = async (id) => {
    await billService.markBillPaid(id);
  };

  const isDueSoon = (dateStr) => {
    const today = new Date();
    const due = new Date(dateStr);
    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays >= 0 && diffDays <= 3;
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight">Upcoming Bills</h2>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-1 text-sm bg-indigo-100 text-indigo-700 px-4 py-2 rounded-xl font-bold hover:bg-indigo-200 transition-colors shadow-sm"
        >
          {showForm ? 'Cancel' : <><Plus className="w-4 h-4"/> Add</>}
        </button>
      </div>

      {showForm && (
        <div className="glass-card p-6 border-t-4 border-t-indigo-500 animate-in slide-in-from-top-4">
          <form className="space-y-4" onSubmit={handleAddBill}>
            <input required type="text" placeholder="Bill Title" value={title} onChange={e => setTitle(e.target.value)} className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl p-3 text-sm font-bold outline-none focus:bg-white focus:border-indigo-500 transition-colors" />
            <div className="flex gap-4">
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">RM</span>
                <input required type="number" step="0.01" placeholder="0.00" value={amount} onChange={e => setAmount(e.target.value)} className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl pl-9 p-3 text-sm font-bold outline-none focus:bg-white focus:border-indigo-500 transition-colors" />
              </div>
              <input required type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} className="flex-1 bg-slate-50 border-2 border-slate-100 rounded-xl p-3 text-sm font-bold outline-none focus:bg-white focus:border-indigo-500 transition-colors text-slate-600" />
            </div>
            <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white p-3 rounded-xl text-sm font-bold shadow-[0_4px_14px_0_rgb(79,70,229,0.39)] transition-colors">Save Bill</button>
          </form>
        </div>
      )}
      
      <div className="space-y-4 pb-4">
        {bills && bills.length > 0 ? (
          bills.sort((a, b) => a.dueDate.localeCompare(b.dueDate)).map(bill => {
            const paid = bill.status === 'paid';
            const dueSoon = !paid && isDueSoon(bill.dueDate);
            
            return (
              <div key={bill.id} className={`glass-card p-5 flex justify-between items-center relative overflow-hidden group ${paid ? 'opacity-60 grayscale-[30%]' : ''}`}>
                <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${paid ? 'bg-emerald-500' : dueSoon ? 'bg-rose-500' : 'bg-indigo-500'}`}></div>
                
                <div className="pl-3 flex items-center gap-4">
                  <div className={`p-2.5 rounded-xl ${paid ? 'bg-emerald-100 text-emerald-600' : dueSoon ? 'bg-rose-100 text-rose-600' : 'bg-indigo-100 text-indigo-600'}`}>
                    {paid ? <CheckCircle2 className="w-5 h-5" /> : dueSoon ? <AlertCircle className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 text-lg">{bill.title}</h3>
                    <p className={`text-xs font-bold mt-0.5 ${paid ? 'text-emerald-600' : dueSoon ? 'text-rose-500' : 'text-slate-500'}`}>
                      {paid ? 'Paid' : `Due: ${bill.dueDate}`}
                    </p>
                  </div>
                </div>
                
                <div className="text-right">
                  <p className="font-extrabold text-xl text-slate-800">RM {bill.amount.toFixed(2)}</p>
                  {!paid && (
                    <button onClick={() => handleMarkPaid(bill.id)} className="text-[10px] uppercase tracking-wider text-indigo-600 font-extrabold mt-1 hover:text-indigo-800 transition-colors bg-indigo-50 px-2 py-1 rounded-md opacity-0 group-hover:opacity-100">
                      Mark Paid
                    </button>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-12 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
            <p className="text-slate-400 font-medium text-sm">No upcoming bills.</p>
          </div>
        )}
      </div>
    </div>
  );
}
