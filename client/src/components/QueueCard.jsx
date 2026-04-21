import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Navigation, MapPin, TrendingDown, TrendingUp, Compass, ArrowUpRight, CheckCircle2, X, CornerUpLeft, CornerUpRight, ArrowUp, Milestone } from 'lucide-react';

const QueueCard = ({ type, name, time, status, trend }) => {
  const [isNavigating, setIsNavigating] = useState(false);
  const cardRef = useRef(null);
  const bottomRef = useRef(null);

  useEffect(() => {
    if (isNavigating && bottomRef.current) {
      // Wait for Framer Motion spring animation to finish expanding before scrolling
      setTimeout(() => {
        bottomRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 400);
    }
  }, [isNavigating]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'optimal': return 'text-emerald-500 bg-emerald-500/10';
      case 'steady': return 'text-amber-500 bg-amber-500/10';
      case 'busy': return 'text-red-500 bg-red-500/10';
      default: return 'text-slate-400 bg-slate-400/10';
    }
  };

  const getDirectionDetails = (name) => {
    const sum = (name || '').split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const types = [
      { text: "Turn Left Ahead", type: "left" },
      { text: "Keep Straight", type: "straight" },
      { text: "Turn Right Next", type: "right" },
      { text: "Take Stairs Up", type: "up" },
      { text: "Follow Blue Line", type: "straight" },
      { text: "Cross Plaza", type: "milestone" }
    ];
    return types[sum % types.length];
  };

  const DirectionIcon = ({ type }) => {
     if (type === 'left') return <CornerUpLeft className="w-3 h-3 text-on-surface-variant" />;
     if (type === 'right') return <CornerUpRight className="w-3 h-3 text-on-surface-variant" />;
     if (type === 'straight') return <ArrowUp className="w-3 h-3 text-on-surface-variant" />;
     if (type === 'up') return <ArrowUpRight className="w-3 h-3 text-on-surface-variant" />;
     return <Milestone className="w-3 h-3 text-on-surface-variant" />;
  };

  const dirDetail = getDirectionDetails(name);

  return (
    <motion.div
      ref={cardRef}
      layout
      whileHover={!isNavigating ? { y: -4 } : {}}
      className="glass-card rounded-2xl p-5 border-outline-variant/10 flex flex-col justify-between"
    >
      <motion.div layout="position" className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-surface-container-highest flex items-center justify-center border border-outline-variant/20">
            {type === 'gate' ? <Navigation className="w-5 h-5 text-primary" /> : <MapPin className="w-5 h-5 text-primary" />}
          </div>
          <div>
            <h4 className="font-headline font-bold text-sm block">{name}</h4>
            <div className={`inline-flex items-center text-[10px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded-md mt-1 ${getStatusColor(status)}`}>
              {status}
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="flex items-center gap-1.5 justify-end">
            <Clock className="w-4 h-4 text-on-surface-variant" />
            <span className="text-xl font-headline font-bold">{time}</span>
          </div>
          <div className="flex items-center gap-1 justify-end mt-0.5">
            {trend === 'down' ? (
              <TrendingDown className="w-3 h-3 text-emerald-500" />
            ) : (
              <TrendingUp className="w-3 h-3 text-red-400" />
            )}
            <span className="text-[10px] text-on-surface-variant font-bold uppercase tracking-tight">
              {trend === 'down' ? 'Clearing' : 'Increasing'}
            </span>
          </div>
        </div>
      </motion.div>

      <motion.div layout="position">
        <AnimatePresence mode="wait">
          {!isNavigating ? (
            <motion.button
              key="btn-nav"
              className="w-full py-2.5 rounded-xl bg-surface-container-highest/50 border border-outline-variant/20 text-xs font-bold font-headline uppercase tracking-widest hover:bg-primary hover:text-white transition-all"
              onClick={() => setIsNavigating(true)}
              exit={{ opacity: 0, scale: 0.95 }}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              Navigate Now
            </motion.button>
          ) : (
            <motion.div
               key="nav-active"
               initial={{ opacity: 0, height: 0 }}
               animate={{ opacity: 1, height: 'auto' }}
               exit={{ opacity: 0, height: 0 }}
               className="bg-primary/10 border border-primary/30 rounded-2xl overflow-hidden shadow-inner mt-2"
            >
               {/* Header */}
               <div className="p-3 border-b border-primary/10 bg-primary/5 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-widest">
                     <Compass className="w-4 h-4 animate-spin-slow" />
                     Live Routing
                  </div>
                  <button onClick={() => setIsNavigating(false)} className="text-on-surface-variant hover:text-red-400 transition-colors">
                     <X className="w-4 h-4" />
                  </button>
               </div>

               <div className="p-4 space-y-4">
                  {/* Radar Visualization */}
                  <div className="relative w-full h-16 bg-surface-container-lowest rounded-xl overflow-hidden border border-outline-variant/10 flex items-center justify-center shadow-inner">
                     <motion.div
                        className="absolute inset-0 bg-[conic-gradient(from_0deg,transparent_0deg,rgba(60,215,255,0.4)_90deg,transparent_90deg)] origin-center"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                     />
                     <div className="absolute w-6 h-6 border border-primary/40 rounded-full" />
                     <div className="absolute w-12 h-12 border border-primary/20 rounded-full" />
                     <MapPin className="relative z-10 w-4 h-4 text-primary drop-shadow-[0_0_8px_rgba(60,215,255,1)] animate-pulse" />
                     <div className="absolute bottom-1 w-full text-center">
                        <span className="text-[7px] uppercase tracking-widest font-bold text-primary opacity-60">Scanning Sub-Millimeter Path...</span>
                     </div>
                  </div>

                  {/* Turn-by-Turn Steps */}
                  <div className="flex items-center justify-between relative px-2">
                     <div className="absolute left-[19px] top-6 bottom-6 w-[1px] bg-primary/20" />
                     <div className="flex flex-col gap-4 w-full">
                        <div className="flex items-center gap-3 relative z-10">
                           <div className="w-6 h-6 rounded-full bg-surface-container flex items-center justify-center border-2 border-primary shrink-0">
                              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                           </div>
                           <div>
                             <p className="text-xs font-bold leading-none">Your Location</p>
                             <p className="text-[9px] text-on-surface-variant uppercase tracking-widest mt-0.5">Section E2</p>
                           </div>
                        </div>
                        <div className="flex items-center gap-3 relative z-10 opacity-70 ml-0.5">
                           <div className="w-5 h-5 rounded-full bg-surface-container flex items-center justify-center border border-outline-variant/30 shrink-0">
                              <DirectionIcon type={dirDetail.type} />
                           </div>
                           <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">{dirDetail.text} (+{Math.ceil(parseInt(time) * 0.4)} mins)</span>
                        </div>
                        <div className="flex items-center gap-3 relative z-10">
                           <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center shrink-0 shadow-lg shadow-primary/30">
                              {type === 'gate' ? <Navigation className="w-3 h-3 text-white" /> : <MapPin className="w-3 h-3 text-white" />}
                           </div>
                           <div>
                             <p className="text-xs font-bold text-primary leading-none">{name}</p>
                             <p className="text-[9px] text-primary/70 font-bold uppercase tracking-widest mt-0.5">Est. Arrival in {time}</p>
                           </div>
                        </div>
                     </div>
                  </div>

                  {/* Action */}
                  <button onClick={() => setIsNavigating(false)} className="w-full py-2.5 rounded-xl bg-primary text-white text-xs font-bold font-headline uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-transform flex items-center justify-center gap-2 shadow-lg shadow-primary/20">
                     <CheckCircle2 className="w-4 h-4" /> Reached Target
                  </button>

                  {/* Scroll sentinel — scrollIntoView targets this after card expands */}
                  <div ref={bottomRef} />
               </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};

export default QueueCard;
