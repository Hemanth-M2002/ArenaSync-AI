import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { ShieldCheck, Lock, Mail, ArrowRight, Zap, Sparkles } from 'lucide-react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import Logo from '../components/Logo';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const navigate = useNavigate();
  const location = useLocation();
  const { setUser } = useAuth();

  const from = location.state?.from?.pathname || "/admin";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const res = await api.post('/auth/admin/login', { email, password });
      
      if (res.data.success) {
        localStorage.setItem('token', res.data.token);
        setUser(res.data.user);
        navigate(from, { replace: true });
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Access Denied: Invalid Staff Credentials');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6 relative overflow-hidden font-body">
      {/* High-tech Background Grid */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent" />
        <div className="w-full h-full" style={{ 
          backgroundImage: 'radial-gradient(circle, #3cd7ff 1px, transparent 1px)', 
          backgroundSize: '40px 40px' 
        }} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md z-10"
      >
        <div className="text-center mb-10">
          <div className="flex justify-center mb-6">
             <div className="w-20 h-20 rounded-3xl bg-primary/10 border border-primary/20 flex items-center justify-center relative group">
                <ShieldCheck className="w-10 h-10 text-primary group-hover:scale-110 transition-transform" />
                <div className="absolute inset-0 bg-primary/20 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
             </div>
          </div>
          <h1 className="text-4xl font-headline font-bold tracking-tighter mb-2">Command <span className="text-primary italic">Portal</span></h1>
          <p className="text-slate-400 text-sm font-bold uppercase tracking-widest">Authorized Organizer Access Only</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <AnimatePresence mode='wait'>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-red-500/10 border border-red-500/30 p-4 rounded-2xl text-red-400 text-xs font-bold text-center"
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="space-y-4">
            <div className="relative group">
              <div className="absolute inset-y-0 left-4 flex items-center text-slate-500 group-focus-within:text-primary transition-colors">
                <Mail className="w-5 h-5" />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ORGANIZER EMAIL"
                className="w-full bg-slate-900/50 border border-slate-800 py-4 pl-12 pr-4 rounded-2xl focus:outline-hidden focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all font-headline font-bold text-sm tracking-widest"
                required
              />
            </div>

            <div className="relative group">
              <div className="absolute inset-y-0 left-4 flex items-center text-slate-500 group-focus-within:text-primary transition-colors">
                <Lock className="w-5 h-5" />
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="ACCESS KEY"
                className="w-full bg-slate-900/50 border border-slate-800 py-4 pl-12 pr-4 rounded-2xl focus:outline-hidden focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all font-headline font-bold text-sm"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary text-slate-950 py-4 rounded-2xl font-bold font-headline hover:scale-[1.02] active:scale-98 transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-3 relative overflow-hidden group"
          >
            {isLoading ? (
              <Sparkles className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <Zap className="w-5 h-5" />
                Initialize Command Center
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </>
            )}
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
          </button>
        </form>

        <div className="mt-12 text-center">
           <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-4">Secured by ArenaSync Integrity Engine</p>
           <button 
             onClick={() => navigate('/')}
             className="text-primary/60 hover:text-primary text-xs font-bold transition-colors"
           >
             Return to Fan Portal
           </button>
        </div>
      </motion.div>

      {/* Decorative Bottom Bar */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-8 opacity-20">
         <div className="w-32 h-1 bg-slate-800 rounded-full" />
         <div className="flex gap-2">
            <div className="w-2 h-2 rounded-full bg-primary" />
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <div className="w-2 h-2 rounded-full bg-primary" />
         </div>
         <div className="w-32 h-1 bg-slate-800 rounded-full" />
      </div>
    </div>
  );
};

export default AdminLogin;
