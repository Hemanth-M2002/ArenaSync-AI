import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { Settings, Construction, ChevronLeft, Rocket, Sparkles, Timer } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import Logo from '../components/Logo';

const ComingSoon = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const getFeatureName = () => {
    switch(location.pathname) {
      case '/map': return 'Live Map';
      case '/queues': return 'Queue Intel';
      case '/assistant': return 'AI Assistant';
      case '/settings': return 'Settings';
      default: return 'Feature';
    }
  };

  const featureName = getFeatureName();

  return (
    <div className="min-h-screen bg-background text-on-surface flex flex-col lg:flex-row font-body transition-colors overflow-hidden">
      <Sidebar />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-[100svh] relative">
        {/* Background Effects */}
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-secondary/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
        
        <header className="h-16 md:h-20 px-4 md:px-6 lg:px-10 flex items-center border-b border-outline-variant/10 bg-surface-container-lowest/30 backdrop-blur-md shrink-0 z-10">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors font-bold bg-surface-container-highest/50 px-4 py-2 rounded-xl"
          >
            <ChevronLeft className="w-4 h-4" /> Back
          </button>
        </header>

        <div className="flex-1 flex items-center justify-center p-6 z-10">
          <div className="max-w-2xl w-full text-center space-y-8">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="relative inline-block"
            >
              <div className="w-24 h-24 rounded-3xl bg-primary/10 flex items-center justify-center mx-auto relative overflow-hidden group">
                <Rocket className="w-12 h-12 text-primary animate-bounce" />
                <div className="absolute inset-0 bg-primary/20 blur-xl group-hover:scale-150 transition-transform duration-500" />
              </div>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute -top-4 -right-4"
              >
                <Sparkles className="w-8 h-8 text-secondary" />
              </motion.div>
            </motion.div>

            <div className="space-y-4">
              <motion.h1 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                key={featureName} // Force re-animation on path change
                className="text-4xl md:text-6xl font-bold font-headline tracking-tighter"
              >
                {featureName} <span className="gradient-text">In Development</span>
              </motion.h1>
              <motion.p 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-on-surface-variant text-lg max-w-lg mx-auto"
              >
                Our engineers are hard at work synchronizing this module. We're building something premium to enhance your arena experience.
              </motion.p>
            </div>

            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-4"
            >
              {[
                { icon: Timer, title: "Efficiency", desc: "Optimizing code for speed" },
                { icon: Construction, title: "Design", desc: "Crafting pixel-perfect UI" },
                { icon: Settings, title: "System", desc: "Core module integration" }
              ].map((item, i) => (
                <div key={i} className="p-6 rounded-[2rem] bg-surface-container/50 border border-outline-variant/20 backdrop-blur-sm hover:border-primary/30 transition-colors group">
                  <item.icon className="w-6 h-6 text-primary mb-3 mx-auto group-hover:scale-110 transition-transform" />
                  <h3 className="font-bold font-headline text-sm mb-1">{item.title}</h3>
                  <p className="text-[10px] text-on-surface-variant uppercase tracking-widest font-bold">{item.desc}</p>
                </div>
              ))}
            </motion.div>

            <motion.button
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              onClick={() => navigate('/dashboard')}
              className="bg-primary text-on-primary px-8 py-4 rounded-2xl font-bold hover:scale-105 active:scale-95 transition-all shadow-lg shadow-primary/20 flex items-center gap-2 mx-auto"
            >
              Back to Intel Dashboard
            </motion.button>
          </div>
        </div>

        {/* Footer info */}
        <div className="absolute bottom-10 left-0 right-0 text-center pointer-events-none">
           <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest opacity-50">
             ArenaSync Alpha v1.0.4 · Production Module Pending
           </p>
        </div>
      </main>
    </div>
  );
};

export default ComingSoon;
