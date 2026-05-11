import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { Lock } from 'lucide-react';

export default function Login({ onLogin }) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const name = authService.getUserName();

  const handleLogin = (e) => {
    e.preventDefault();
    if (authService.verifyPin(pin)) {
      authService.loginSession();
      onLogin();
    } else {
      setError('Incorrect PIN. Please try again.');
      setPin('');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden bg-slate-950 transition-colors duration-500">
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="blob-1 top-[-10%] left-[-10%] opacity-20 transition-opacity duration-500"></div>
        <div className="blob-3 bottom-[-10%] right-[-10%] opacity-20 transition-opacity duration-500"></div>
      </div>
      
      <div className="glass-card p-8 w-full max-w-sm z-10 border-t-4 border-t-indigo-500 animate-in zoom-in-95 duration-500">
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-full flex items-center justify-center shadow-lg shadow-none mb-4">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-100 tracking-tight">Welcome back,</h2>
          <p className="text-xl font-bold text-indigo-400 mt-1">{name}</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <input 
              type="password" 
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={4}
              required
              value={pin}
              onChange={(e) => {
                setError('');
                setPin(e.target.value);
              }}
              className="w-full text-center tracking-[1em] rounded-2xl bg-slate-800 border-2 border-slate-700 p-4 text-3xl font-extrabold text-slate-100 focus:focus:bg-slate-900 focus:border-indigo-500 focus:ring-4 focus:focus:ring-indigo-900/30 outline-none transition-all placeholder:placeholder:text-slate-600" 
              placeholder="••••" 
              autoFocus
            />
            {error && <p className="text-rose-500 text-sm font-bold text-center mt-2">{error}</p>}
          </div>

          <button type="submit" className="w-full py-4 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-2xl font-bold text-lg shadow-[0_8px_20px_rgb(79,70,229,0.3)] hover:shadow-[0_8px_25px_rgb(79,70,229,0.5)] hover:-translate-y-1 transition-all">
            Unlock App
          </button>
        </form>
      </div>
    </div>
  );
}
