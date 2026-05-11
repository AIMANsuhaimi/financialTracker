import React, { useState, useEffect } from 'react';
import { Settings as SettingsIcon, Moon, Sun, Download, Upload, LogOut, DollarSign } from 'lucide-react';
import { authService } from '../services/authService';
import { budgetService } from '../services/budgetService';
import dbExportImport from 'dexie-export-import';
import { db } from '../db/indexedDb';

export default function Settings({ onLogout }) {
  const [darkMode, setDarkMode] = useState(localStorage.getItem('theme') === 'dark');
  const [monthlyIncome, setMonthlyIncome] = useState('');
  const [saveMessage, setSaveMessage] = useState('');

  useEffect(() => {
    budgetService.getDailyBudget().then(b => {
      if (b && b.monthlyIncome) setMonthlyIncome(b.monthlyIncome.toString());
    });
  }, []);

  const handleThemeToggle = () => {
    const newTheme = !darkMode ? 'dark' : 'light';
    setDarkMode(!darkMode);
    localStorage.setItem('theme', newTheme);
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const handleSaveIncome = async () => {
    const val = parseFloat(monthlyIncome);
    if (!isNaN(val)) {
      const b = await budgetService.getDailyBudget();
      await budgetService.setDailyBudget(b?.dailyLimit || 0, false, val);
      setSaveMessage('Saved successfully!');
      setTimeout(() => setSaveMessage(''), 2000);
    }
  };

  const handleExport = async () => {
    try {
      const blob = await db.export();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `dailyspend_backup_${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      alert("Export failed: " + err.message);
    }
  };

  const handleImport = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (confirm("Importing will overwrite your current data. Are you sure?")) {
      try {
        await db.delete();
        await db.open();
        await db.import(file);
        alert("Import successful! Reloading app...");
        window.location.reload();
      } catch (err) {
        alert("Import failed: " + err.message);
      }
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-slate-800 rounded-2xl text-slate-300">
          <SettingsIcon className="w-6 h-6" />
        </div>
        <h2 className="text-2xl font-extrabold text-slate-100 tracking-tight">Settings</h2>
      </div>

      <div className="glass-card p-6 space-y-6">
        
        {/* Financial Settings */}
        <div>
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">Financial Profile</h3>
          <div className="bg-slate-800 p-4 rounded-2xl border border-slate-700 space-y-3">
            <label className="text-sm font-bold text-slate-300 flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-emerald-500" /> Monthly Income (RM)
            </label>
            <div className="flex gap-2">
              <input 
                type="number"
                value={monthlyIncome}
                onChange={e => setMonthlyIncome(e.target.value)}
                className="flex-1 bg-slate-900 border border-slate-600 rounded-xl px-4 py-2 text-slate-200 outline-none focus:border-indigo-500 font-bold"
                placeholder="e.g. 3000"
              />
              <button onClick={handleSaveIncome} className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl font-bold transition-colors">
                Save
              </button>
            </div>
            {saveMessage && <p className="text-xs font-bold text-emerald-500">{saveMessage}</p>}
          </div>
        </div>

        {/* Data Backup */}
        <div>
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">Data Backup</h3>
          <div className="grid grid-cols-2 gap-3">
            <button onClick={handleExport} className="flex flex-col items-center justify-center p-4 bg-slate-800 border border-slate-700 rounded-2xl hover:hover:border-indigo-500 transition-colors group">
              <Download className="w-6 h-6 text-slate-400 group-hover:text-indigo-500 mb-2" />
              <span className="text-sm font-bold text-slate-300">Export JSON</span>
            </button>
            
            <label className="flex flex-col items-center justify-center p-4 bg-slate-800 border border-slate-700 rounded-2xl hover:hover:border-indigo-500 transition-colors cursor-pointer group">
              <Upload className="w-6 h-6 text-slate-400 group-hover:text-indigo-500 mb-2" />
              <span className="text-sm font-bold text-slate-300">Import JSON</span>
              <input type="file" accept=".json" className="hidden" onChange={handleImport} />
            </label>
          </div>
        </div>

        {/* Account */}
        <div>
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">Account</h3>
          <button onClick={onLogout} className="w-full flex items-center justify-center gap-2 p-4 bg-rose-900/20 text-rose-400 border border-rose-900 rounded-2xl hover:hover:bg-rose-900/40 transition-colors font-bold">
            <LogOut className="w-5 h-5" /> Lock App
          </button>
        </div>

      </div>
    </div>
  );
}
