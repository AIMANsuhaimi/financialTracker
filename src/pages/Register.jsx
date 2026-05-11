import React, { useState } from 'react';
import { authService } from '../services/authService';
import { UserPlus } from 'lucide-react';

export default function Register({ onRegister }) {
  const [name, setName] = useState('');
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [error, setError] = useState('');

  const handleRegister = (e) => {
    e.preventDefault();
    if (pin.length < 4) {
      setError('PIN must be at least 4 digits.');
      return;
    }
    if (pin !== confirmPin) {
      setError('PINs do not match.');
      return;
    }
    
    authService.register(name, pin);
    authService.loginSession();
    onRegister();
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden bg-slate-950 transition-colors duration-500">
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="blob-1 top-[-10%] left-[-10%] opacity-20 transition-opacity duration-500"></div>
        <div className="blob-2 top-[40%] right-[-10%] opacity-20 transition-opacity duration-500"></div>
      </div>
      
      <div className="glass-card p-8 w-full max-w-sm z-10 border-t-4 border-t-pink-500 animate-in zoom-in-95 duration-500">
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-tr from-pink-500 to-rose-500 rounded-full flex items-center justify-center shadow-lg shadow-none mb-4">
            <UserPlus className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-100 tracking-tight">Create Profile</h2>
          <p className="text-sm font-medium text-slate-400 mt-2">Set up your local offline vault.</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-5">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Your Name</label>
            <input 
              type="text" 
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-2xl bg-slate-800 border-2 border-slate-700 p-3 px-4 font-bold text-slate-100 focus:focus:bg-slate-900 focus:border-pink-500 outline-none transition-all placeholder:placeholder:text-slate-600" 
              placeholder="e.g. Alex" 
              autoFocus
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Create 4-Digit PIN</label>
            <input 
              type="password" 
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={4}
              required
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              className="w-full text-center tracking-[1em] rounded-2xl bg-slate-800 border-2 border-slate-700 p-4 text-3xl font-extrabold text-slate-100 focus:focus:bg-slate-900 focus:border-pink-500 outline-none transition-all placeholder:placeholder:text-slate-600" 
              placeholder="••••" 
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Confirm PIN</label>
            <input 
              type="password" 
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={4}
              required
              value={confirmPin}
              onChange={(e) => {
                setError('');
                setConfirmPin(e.target.value);
              }}
              className="w-full text-center tracking-[1em] rounded-2xl bg-slate-50 border-2 border-slate-100 p-4 text-2xl font-extrabold text-slate-800 focus:bg-white focus:border-pink-500 focus:ring-4 focus:ring-pink-100 outline-none transition-all" 
              placeholder="••••" 
            />
          </div>

          {error && <p className="text-rose-500 text-sm font-bold text-center pt-2">{error}</p>}

          <button type="submit" className="w-full mt-2 py-4 px-4 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white rounded-2xl font-bold text-lg shadow-[0_8px_20px_rgb(244,63,94,0.3)] hover:shadow-[0_8px_25px_rgb(244,63,94,0.5)] hover:-translate-y-1 transition-all">
            Get Started
          </button>
        </form>
      </div>
    </div>
  );
}
