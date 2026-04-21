import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Mail, 
  Lock, 
  ArrowRight, 
  ChevronLeft,
  KeyRound,
  AlertCircle,
  ShieldCheck,
  Fingerprint,
  Zap
} from 'lucide-react';

import { GoogleLogin } from '@react-oauth/google';
import Logo from '../components/Logo';

const SignIn = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, googleLogin, logout, error: authError } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [localError, setLocalError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleStaffTransition = () => {
    // Clear any existing fan session for a clean staff login
    localStorage.removeItem('token');
    setIsTransitioning(true);
    setTimeout(() => {
      navigate('/admin-login');
    }, 1200);
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setIsSubmitting(true);
    const result = await googleLogin(credentialResponse.credential);
    if (result.success) {
      const from = location.state?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    } else {
      setLocalError(result.message);
    }
    setIsSubmitting(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setLocalError('');

    const result = await login(formData.email, formData.password);
    
    if (result.success) {
      const from = location.state?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    } else {
      setLocalError(result.message);
    }
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col font-body text-on-surface overflow-hidden relative">
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-primary/5 blur-[120px] rounded-full pointer-events-none -z-10" />
      
      <header className="px-6 h-20 flex items-center justify-between max-w-7xl mx-auto w-full z-10">
        <Link to="/" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors group">
          <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Back</span>
        </Link>
        <Link to="/" className="flex items-center gap-3 active:scale-95 transition-all">
          <Logo className="w-10 h-10" />
          <div className="text-xl font-bold tracking-tighter text-slate-50 font-headline">
            ArenaSync <span className="text-primary">AI</span>
          </div>
        </Link>
      </header>

      <main className="flex-1 flex items-center justify-center p-4 md:p-8 lg:p-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full my-auto"
        >
          <div className="glass-card p-6 md:p-10 rounded-2xl md:rounded-3xl border-outline-variant/20 shadow-2xl overflow-y-auto max-h-[calc(100vh-200px)] md:max-h-none no-scrollbar">
            <div className="text-center mb-10">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <KeyRound className="w-8 h-8 text-primary" />
              </div>
              <h1 className="text-3xl font-headline font-bold mb-2">Welcome Back</h1>
              <p className="text-on-surface-variant mb-8">Enter your credentials to access your arena intelligence.</p>
              
              <AnimatePresence>
                {(localError || authError) && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mb-6 bg-red-500/10 border border-red-500/20 rounded-xl p-3 flex items-start gap-3 text-red-400 text-xs"
                  >
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{localError || authError}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Google Sign In */}
              <div className="flex justify-center mb-8">
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={() => setLocalError('Google Sign-In failed')}
                  theme="filled_blue"
                  shape="pill"
                  text="continue_with"
                />
              </div>

              <div className="relative mb-8">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-outline-variant/10"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase tracking-[0.2em] font-bold">
                  <span className="bg-background px-4 text-slate-500">Or use your email</span>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-bold font-headline uppercase tracking-widest text-slate-400 ml-1">Email</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="w-5 h-5 text-slate-500 group-focus-within:text-primary transition-colors" />
                  </div>
                  <input
                    type="email"
                    required
                    className="w-full bg-surface-container-lowest border border-outline-variant/30 text-white rounded-xl py-3.5 pl-12 pr-4 focus:outline-hidden focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all placeholder:text-slate-600"
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center ml-1">
                  <label className="text-sm font-bold font-headline uppercase tracking-widest text-slate-400">Password</label>
                  <a href="#" className="text-xs text-primary font-bold hover:underline">Forgot?</a>
                </div>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="w-5 h-5 text-slate-500 group-focus-within:text-primary transition-colors" />
                  </div>
                  <input
                    type="password"
                    required
                    className="w-full bg-surface-container-lowest border border-outline-variant/30 text-white rounded-xl py-4 pl-12 pr-4 focus:outline-hidden focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all placeholder:text-slate-600"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                  />
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.01, boxShadow: '0 0 20px rgba(60,215,255,0.2)' }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full bg-primary text-on-primary font-headline font-bold py-4.5 rounded-xl flex items-center justify-center gap-2 shadow-xl shadow-primary/10 hover:bg-primary/90 transition-all mt-4"
              >
                Sign In
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            </form>

            <div className="mt-8 text-center space-y-6">
              <p className="text-on-surface-variant">
                Don't have an account?{' '}
                <Link to="/signup" className="text-primary hover:underline font-bold">Register Now</Link>
              </p>

              {/* Innovative Staff Portal Toggle */}
              <div className="pt-6 border-t border-outline-variant/10">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleStaffTransition}
                  className="w-full relative group overflow-hidden rounded-2xl p-1 bg-slate-900 border border-slate-800"
                >
                   <div className="absolute inset-0 bg-primary/5 group-hover:bg-primary/10 transition-colors" />
                   <div className="relative flex items-center justify-between px-4 py-3">
                      <div className="flex items-center gap-3">
                         <div className="w-8 h-8 rounded-lg bg-primary/20 text-primary flex items-center justify-center border border-primary/20">
                            <Fingerprint className="w-5 h-5 group-hover:animate-pulse" />
                         </div>
                         <div className="text-left">
                            <p className="text-[10px] font-bold text-primary uppercase tracking-widest leading-none mb-1">Staff Access</p>
                            <p className="text-xs font-bold text-slate-300">Secure Organizer Uplink</p>
                         </div>
                      </div>
                      <ShieldCheck className="w-4 h-4 text-slate-500 group-hover:text-primary transition-colors" />
                   </div>

                   {/* Scanning Effect */}
                   <motion.div 
                     animate={{ 
                       y: [0, 50, 0],
                       opacity: [0, 0.5, 0] 
                     }}
                     transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                     className="absolute inset-x-0 top-0 h-0.5 bg-primary/50 blur-[2px] shadow-[0_0_10px_#3cd7ff] pointer-events-none"
                   />
                </motion.button>
              </div>
            </div>
          </div>
          
          {/* Global Transition Scanner */}
          <AnimatePresence>
            {isTransitioning && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-slate-950/80 backdrop-blur-3xl overflow-hidden"
              >
                 <motion.div 
                    initial={{ height: 0 }}
                    animate={{ height: "100%" }}
                    className="absolute w-full top-0 bg-linear-to-b from-transparent via-primary/20 to-transparent flex items-center justify-center"
                 >
                    <div className="h-0.5 w-full bg-primary shadow-[0_0_20px_#3cd7ff]" />
                 </motion.div>
                 
                 <div className="relative z-10 flex flex-col items-center">
                    <div className="w-24 h-24 rounded-3xl border-2 border-primary/50 flex items-center justify-center animate-pulse mb-8 overflow-hidden">
                       <ShieldCheck className="w-12 h-12 text-primary" />
                    </div>
                    <h3 className="text-2xl font-headline font-bold tracking-widest text-primary italic">AUTHORIZING...</h3>
                    <p className="text-slate-500 text-xs mt-2 font-bold uppercase tracking-[0.4em]">Establishing Secure Frequency</p>
                 </div>

                 {/* Digital Artifacts */}
                 <div className="absolute inset-0 pointer-events-none">
                    {[...Array(20)].map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: Math.random() * 200 - 100, y: Math.random() * 200 - 100 }}
                        animate={{ opacity: [0, 1, 0] }}
                        transition={{ duration: 1, repeat: Infinity, delay: Math.random() }}
                        className="absolute w-px h-10 bg-primary/20"
                        style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }}
                      />
                    ))}
                 </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </main>

      <footer className="py-8 text-center text-sm text-slate-500">
        <p>© 2026 ArenaSync AI. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default SignIn;
