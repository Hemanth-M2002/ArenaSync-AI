import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, AlertCircle, Maximize2, Zap, X, Shrink, MapPin } from 'lucide-react';
import { useVenue } from '../context/VenueContext';
import { useAuth } from '../context/AuthContext';

const HeatmapCard = () => {
  const { intel, loading } = useVenue();
  const { activeContext } = useAuth();
  const [isExpanded, setIsExpanded] = useState(false);

  const userStand = activeContext?.stand;
  const userGate = activeContext?.gate;

  const zones = intel?.zoneDensity || [
    { zoneId: 'N1', name: 'North Stand', status: 'Optimal', occupancyPercentage: 12 },
    { zoneId: 'N2', name: 'North Terrace', status: 'Steady', occupancyPercentage: 45 },
    { zoneId: 'E1', name: 'East Premium', status: 'Congested', occupancyPercentage: 88 },
    { zoneId: 'E2', name: 'East Wing', status: 'Steady', occupancyPercentage: 52 },
    { zoneId: 'S1', name: 'South Bowl', status: 'Steady', occupancyPercentage: 38 },
    { zoneId: 'S2', name: 'South Gate', status: 'Optimal', occupancyPercentage: 15 },
    { zoneId: 'W1', name: 'West Deck', status: 'Congested', occupancyPercentage: 92 },
    { zoneId: 'W2', name: 'West Club', status: 'Steady', occupancyPercentage: 41 },
  ];

  const getColor = (status) => {
    if (status === 'Optimal') return 'bg-emerald-500';
    if (status === 'Steady') return 'bg-amber-500';
    return 'bg-red-500';
  };

  const CardContent = ({ expanded = false }) => (
    <div className={`${expanded ? 'p-8 md:p-12' : 'p-6'} flex flex-col h-full`}>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className={`${expanded ? 'text-4xl' : 'text-xl'} font-headline font-bold mb-1 transition-all`}>Live Crowd Heatmap</h3>
          <p className={`${expanded ? 'text-sm' : 'text-xs'} text-on-surface-variant font-bold uppercase tracking-widest`}>Venue Intelligence Layer</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 rounded-xl bg-surface-container-highest border border-outline-variant/30 text-on-surface-variant hover:text-primary transition-colors"
          >
            {expanded ? <Shrink className="w-6 h-6" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Stadium Visualization Grid */}
      <div className={`relative ${expanded ? 'flex-1' : 'aspect-video mb-8'} flex items-center justify-center p-4`}>
        <div className={`w-full ${expanded ? 'h-full max-w-6xl' : 'h-full'} border-4 border-outline-variant/20 rounded-[100px] relative flex items-center justify-center bg-surface-container-lowest overflow-hidden transition-all shadow-inner`}>
           {/* Inner Pitch */}
           <div className="w-1/2 h-1/2 border-2 border-outline-variant/10 rounded-full flex items-center justify-center opacity-30">
              <div className="w-px h-full bg-outline-variant/20" />
              <div className="w-full h-px bg-outline-variant/20 absolute" />
           </div>

           {/* Zones */}
           <div className={`absolute inset-0 grid grid-cols-4 grid-rows-2 ${expanded ? 'gap-4 p-8' : 'gap-2 p-4'}`}>
              {zones.map((zone) => {
                const isBeacon = zone.zoneId === userStand || zone.zoneId === userGate;
                
                return (
                  <motion.div
                    key={zone.zoneId}
                    whileHover={{ scale: 1.02 }}
                    className={`relative rounded-2xl flex flex-col items-center justify-center border transition-all group overflow-hidden ${
                      isBeacon ? 'border-primary/50 shadow-[0_0_15px_rgba(60,215,255,0.3)] z-10' : 'border-white/5'
                    } ${loading ? 'animate-pulse opacity-50' : ''}`}
                  >
                     {/* Background Heat */}
                     <div className={`absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity ${isBeacon ? 'bg-primary' : getColor(zone.status)}`} />
                     
                     {/* Pulsing indicator */}
                     <div className={`w-2 h-2 rounded-full absolute top-2 right-2 ${isBeacon ? 'bg-primary shadow-[0_0_8px_rgba(60,215,255,0.8)]' : getColor(zone.status)} ${zone.status === 'Congested' || zone.status === 'Danger' || isBeacon ? 'animate-pulse' : ''}`} />
                     
                     {isBeacon && (
                        <motion.div 
                          initial={{ y: 5, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          className="absolute top-2 left-2"
                        >
                          <MapPin className="w-3 h-3 text-primary" />
                        </motion.div>
                     )}

                     <span className={`${expanded ? 'text-3xl' : 'text-lg'} font-bold font-headline mb-0.5 ${isBeacon ? 'text-primary' : ''}`}>{zone.zoneId}</span>
                     <span className={`${expanded ? 'text-sm' : 'text-[10px]'} font-bold opacity-60 uppercase tracking-tighter`}>{zone.occupancyPercentage}%</span>

                     {/* Hover Tooltip */}
                     <div className="absolute inset-0 bg-surface-container-highest backdrop-blur-md flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all scale-95 group-hover:scale-100 px-2 text-center overflow-hidden">
                        <span className={`${expanded ? 'text-sm' : 'text-[10px]'} font-bold text-primary uppercase tracking-widest leading-tight`}>{zone.name || `Section ${zone.zoneId}`}</span>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <div className={`w-1.5 h-1.5 rounded-full ${getColor(zone.status)}`} />
                          <span className={`${expanded ? 'text-lg' : 'text-sm'} font-bold`}>{zone.status}</span>
                        </div>
                        {zone.status === 'Danger' && (
                          <div className="text-[8px] text-red-500 font-bold uppercase tracking-tighter mt-1 flex items-center gap-1">
                            <Zap className="w-2 h-2" /> Avoid Zone
                          </div>
                        )}
                     </div>
                  </motion.div>
                );
              })}
           </div>
        </div>
      </div>

      {/* Legend & Stats */}
      <div className={`grid grid-cols-3 gap-4 pt-4 border-t border-outline-variant/20 ${expanded ? 'mt-8' : ''}`}>
        <div className="flex items-center gap-3">
          <div className={`${expanded ? 'w-14 h-14' : 'w-10 h-10'} rounded-xl bg-primary/10 flex items-center justify-center shrink-0`}>
            <Users className={`${expanded ? 'w-8 h-8' : 'w-5 h-5'} text-primary`} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest leading-none">Total Crowd</p>
            <p className={`${expanded ? 'text-2xl' : 'text-lg'} font-bold`}>42,850</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className={`${expanded ? 'w-14 h-14' : 'w-10 h-10'} rounded-xl bg-orange-500/10 flex items-center justify-center shrink-0`}>
            <AlertCircle className={`${expanded ? 'w-8 h-8' : 'w-5 h-5'} text-orange-500`} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest leading-none">Congestion</p>
            <p className={`${expanded ? 'text-2xl' : 'text-lg'} font-bold`}>Low</p>
          </div>
        </div>

        <div className="flex flex-col justify-center items-end">
           <div className="flex gap-1.5 items-center">
              <div className="w-2 h-2 rounded-full bg-emerald-500" />
              <div className="w-2 h-2 rounded-full bg-amber-500" />
              <div className="w-2 h-2 rounded-full bg-red-500" />
           </div>
           <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mt-1">
             {intel?.emergencyMode ? 'Emergency Status' : 'Live Levels'}
           </span>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <div className="glass-card rounded-3xl border-outline-variant/10 shadow-xl overflow-hidden relative h-full">
        <CardContent />
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-background/60 backdrop-blur-3xl flex items-center justify-center p-4 md:p-10"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-surface-container-lowest border border-outline-variant/30 w-full h-full rounded-[3rem] shadow-2xl relative overflow-hidden"
            >
               <CardContent expanded={true} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default HeatmapCard;
