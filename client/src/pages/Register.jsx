import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  User, 
  Mail, 
  Lock, 
  ArrowRight, 
  ChevronLeft,
  ShieldCheck,
  Zap,
  Globe,
  AlertCircle
} from 'lucide-react';

import { useGoogleLogin } from '@react-oauth/google';

import { GoogleLogin } from '@react-oauth/google';

const Register = () => {
  const navigate = useNavigate();
  const { register, googleLogin, error: authError } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [localError, setLocalError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleGoogleSuccess = async (credentialResponse) => {
    setIsSubmitting(true);
    const result = await googleLogin(credentialResponse.credential);
    if (result.success) {
      navigate('/dashboard');
    } else {
      setLocalError(result.message);
    }
    setIsSubmitting(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setLocalError('');

    const result = await register(formData.name, formData.email, formData.password);
    
    if (result.success) {
      navigate('/dashboard');
    } else {
      setLocalError(result.message);
    }
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col font-body text-on-surface overflow-hidden relative">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 blur-[120px] rounded-full pointer-events-none -z-10" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-secondary-fixed/5 blur-[100px] rounded-full pointer-events-none -z-10" />

      {/* Header / Back Navigation */}
      <header className="px-6 h-20 flex items-center justify-between max-w-7xl mx-auto w-full z-10">
        <Link to="/" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors group">
          <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Back to Home</span>
        </Link>
        <div className="text-xl font-bold tracking-tighter text-slate-50 font-headline">
          ArenaSync <span className="text-primary">AI</span>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-4 md:p-8 lg:p-12">
        <div className="max-w-5xl w-full grid lg:grid-cols-2 gap-8 lg:gap-12 items-center my-auto">
          
          {/* Left Column: Form Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <div className="glass-card p-6 md:p-10 rounded-2xl md:rounded-3xl border-outline-variant/20 shadow-2xl relative overflow-hidden overflow-y-auto max-h-[calc(100vh-160px)] md:max-h-none no-scrollbar">
              {/* Subtle gradient overlay */}
              <div className="absolute inset-0 bg-linear-to-br from-primary/5 via-transparent to-transparent pointer-events-none" />
              
              <div className="relative z-10">
                <h1 className="text-3xl md:text-4xl font-headline font-bold mb-3 tracking-tight">Create your account</h1>
                <p className="text-on-surface-variant mb-8">Join thousands of fans enjoying a frictionless stadium experience.</p>
                
                <AnimatePresence>
                  {(localError || authError) && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mb-8 bg-red-500/10 border border-red-500/20 rounded-xl p-3 flex items-start gap-3 text-red-400 text-xs"
                    >
                      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                      <span>{localError || authError}</span>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Google Sign Up */}
                <div className="flex justify-center mb-8">
                  <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={() => setLocalError('Google Sign-Up failed')}
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
                    <span className="bg-background px-4 text-slate-500">Or continue with email</span>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name Field */}
                  <div className="space-y-2">
                    <label className="text-sm font-bold font-headline uppercase tracking-widest text-slate-400 ml-1">Full Name</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <User className="w-5 h-5 text-slate-500 group-focus-within:text-primary transition-colors" />
                      </div>
                      <input
                        type="text"
                        required
                        className="w-full bg-surface-container-lowest border border-outline-variant/30 text-white rounded-xl py-3.5 pl-12 pr-4 focus:outline-hidden focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all placeholder:text-slate-600"
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                      />
                    </div>
                  </div>

                  {/* Email Field */}
                  <div className="space-y-2">
                    <label className="text-sm font-bold font-headline uppercase tracking-widest text-slate-400 ml-1">Email Address</label>
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

                  {/* Password Field */}
                  <div className="space-y-2">
                    <label className="text-sm font-bold font-headline uppercase tracking-widest text-slate-400 ml-1">Password</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Lock className="w-5 h-5 text-slate-500 group-focus-within:text-primary transition-colors" />
                      </div>
                      <input
                        type="password"
                        required
                        className="w-full bg-surface-container-lowest border border-outline-variant/30 text-white rounded-xl py-3.5 pl-12 pr-4 focus:outline-hidden focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all placeholder:text-slate-600"
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
                    className="w-full bg-primary text-on-primary font-headline font-bold py-4.5 rounded-xl flex items-center justify-center gap-2 shadow-xl shadow-primary/10 hover:bg-primary/90 transition-all mt-8"
                  >
                    Start Your Experience
                    <ArrowRight className="w-5 h-5" />
                  </motion.button>
                </form>

                <div className="mt-8 text-center">
                  <p className="text-on-surface-variant">
                    Already have an account?{' '}
                    <Link to="/signin" className="text-primary hover:underline font-bold">Sign In</Link>
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Visual / Benefits */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, rotate: 2 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="hidden lg:block relative"
          >
            <div className="absolute -inset-10 bg-primary/10 blur-[100px] rounded-full" />
            
            <div className="relative rounded-3xl overflow-hidden border border-outline-variant/20 shadow-2xl">
              <img 
                src="/signup-hero.png" 
                alt="ArenaSync AI Visualization" 
                className="w-full h-auto"
              />
              {/* Overlay with features */}
              <div className="absolute bottom-0 inset-x-0 p-8 bg-linear-to-t from-slate-950 via-slate-950/80 to-transparent">
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <ShieldCheck className="w-6 h-6 text-primary mx-auto mb-2" />
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Secure Access</p>
                  </div>
                  <div className="text-center border-x border-white/10">
                    <Zap className="w-6 h-6 text-secondary-fixed mx-auto mb-2" />
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Instant Sync</p>
                  </div>
                  <div className="text-center">
                    <Globe className="w-6 h-6 text-primary mx-auto mb-2" />
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Global Venues</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Status Badge */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="absolute -top-6 -right-6 glass-card px-6 py-4 rounded-2xl border-primary/30"
            >
              <div className="flex items-center gap-2">
                <span className="w-2h-2 rounded-full bg-secondary-fixed animate-pulse w-2 h-2" />
                <span className="text-xs font-bold text-slate-400">ENROLLING NOW</span>
              </div>
              <div className="text-xl font-bold font-headline mt-1">Free for Fans</div>
            </motion.div>
          </motion.div>

        </div>
      </main>

      <footer className="py-8 text-center text-sm text-slate-500">
        <p>© 2026 ArenaSync AI. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Register;
