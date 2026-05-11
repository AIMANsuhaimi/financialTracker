import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, Plus, PieChart, Wallet, BrainCircuit, Settings as SettingsIcon } from 'lucide-react';
import Dashboard from './pages/Dashboard';
import AddSpending from './pages/AddSpending';
import Bills from './pages/Bills';
import Summary from './pages/Summary';
import Advisor from './pages/Advisor';
import Login from './pages/Login';
import Register from './pages/Register';
import SettingsPage from './pages/Settings';
import { authService } from './services/authService';

function Navbar() {
  const location = useLocation();
  const isActive = (path) => location.pathname === path ? "text-indigo-400 scale-110" : "text-slate-500 hover:text-indigo-500";

  return (
    <div className="fixed bottom-6 left-0 right-0 px-6 z-50 pointer-events-none flex justify-center">
      <nav className="w-full max-w-md bg-white/bg-slate-900/80 backdrop-blur-xl border border-white/border-slate-800 shadow-2xl rounded-3xl pointer-events-auto">
        <div className="flex justify-around items-center h-16 px-2 relative">
          <Link to="/" className={`flex flex-col items-center transition-all duration-300 ${isActive('/')}`}>
            <Home className="w-6 h-6" strokeWidth={2.5} />
          </Link>
          <Link to="/summary" className={`flex flex-col items-center transition-all duration-300 ${isActive('/summary')}`}>
            <PieChart className="w-6 h-6" strokeWidth={2.5} />
          </Link>
          
          <div className="relative -top-6">
            <Link to="/add" className="flex items-center justify-center w-14 h-14 bg-gradient-to-tr from-indigo-600 to-pink-500 rounded-full text-white shadow-[0_8px_30px_rgb(99,102,241,0.4)] shadow-[0_8px_30px_rgb(99,102,241,0.2)] hover:shadow-[0_8px_30px_rgb(99,102,241,0.6)] hover:scale-110 transition-all duration-300">
              <Plus className="w-7 h-7" strokeWidth={3} />
            </Link>
          </div>

          <Link to="/advisor" className={`flex flex-col items-center transition-all duration-300 ${isActive('/advisor')}`}>
            <BrainCircuit className="w-6 h-6" strokeWidth={2.5} />
          </Link>
          <Link to="/bills" className={`flex flex-col items-center transition-all duration-300 ${isActive('/bills')}`}>
            <Wallet className="w-6 h-6" strokeWidth={2.5} />
          </Link>
        </div>
      </nav>
    </div>
  );
}

function App() {
  const navigate = useNavigate();
  const [authChecked, setAuthChecked] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);

  useEffect(() => {
    // Force dark mode
    document.documentElement.classList.add('dark');
    
    setIsRegistered(authService.isRegistered());
    setIsAuthenticated(authService.isAuthenticatedSession());
    setAuthChecked(true);
  }, []);

  if (!authChecked) return null;

  if (!isRegistered) {
    return <Register onRegister={() => {
      setIsRegistered(true);
      setIsAuthenticated(true);
      navigate('/');
    }} />;
  }

  if (!isAuthenticated) {
    return <Login onLogin={() => {
      setIsAuthenticated(true);
      navigate('/');
    }} />;
  }

  const handleLogout = () => {
    authService.logout();
    setIsAuthenticated(false);
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-slate-950 font-sans selection:bg-indigo-200 transition-colors duration-500">
      {/* Background Orbs */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="blob-1 top-[-10%] left-[-10%] opacity-20 transition-opacity duration-500"></div>
        <div className="blob-2 top-[40%] right-[-10%] opacity-20 transition-opacity duration-500"></div>
        <div className="blob-3 bottom-[-10%] left-[20%] opacity-20 transition-opacity duration-500"></div>
      </div>

      <div className="max-w-md mx-auto relative z-10 pb-28 min-h-screen flex flex-col">
        <header className="px-6 py-6 pt-10 sticky top-0 z-20 backdrop-blur-md bg-white/bg-slate-900/30 border-b border-white/border-slate-800 transition-colors duration-500">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-pink-500 flex items-center justify-center shadow-lg shadow-none">
                <Wallet className="w-4 h-4 text-white" strokeWidth={3} />
              </div>
              <h1 className="text-2xl font-extrabold tracking-tight text-slate-100 transition-colors duration-500">
                Daily<span className="gradient-text">Spend</span>
              </h1>
            </Link>
            
            <div className="flex items-center gap-2">
              <Link to="/settings" className="w-10 h-10 rounded-full bg-slate-800 hover:hover:bg-slate-700 transition-colors border-2 border-slate-700 shadow-sm flex items-center justify-center text-slate-300">
                <SettingsIcon className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </header>
        
        <main className="p-6 flex-1">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/add" element={<AddSpending />} />
            <Route path="/bills" element={<Bills />} />
            <Route path="/summary" element={<Summary />} />
            <Route path="/advisor" element={<Advisor />} />
            <Route path="/settings" element={<SettingsPage onLogout={handleLogout} />} />
          </Routes>
        </main>
        
        <Navbar />
      </div>
    </div>
  );
}

export default App;
