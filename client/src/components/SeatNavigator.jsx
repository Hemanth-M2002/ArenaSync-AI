import React, { useMemo, useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Navigation, AlertTriangle, ShieldCheck, ArrowRight, Scan, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useVenue } from '../context/VenueContext';

const SeatNavigator = () => {
  const { activeContext } = useAuth();
  const { intel, getEvacuationGuide } = useVenue();
  
  const userGate = activeContext?.gate || 'Gate B';
  const userStand = activeContext?.stand || 'N1';
  const isEmergency = intel?.emergencyMode;
  const evacGuide = getEvacuationGuide();
  const [is3DMode, setIs3DMode] = useState(false);
  const [zoom, setZoom] = useState(1.5);
  const mapContainerRef = useRef(null);

  // Must attach with { passive: false } so we can call preventDefault and block page scroll
  useEffect(() => {
    const el = mapContainerRef.current;
    if (!el) return;
    const onWheel = (e) => {
      if (!is3DMode) return;
      e.preventDefault(); // blocks the outer scroll container from scrolling
      setZoom((z) => Math.min(Math.max(0.6, z - e.deltaY * 0.005), 3.5));
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, [is3DMode]);

  // Mocked coordinates for the 2D SVG map (0-100 scale)
  const waypoints = useMemo(() => {
    const points = {
      'Gate A': { x: 10, y: 50 },
      'Gate B': { x: 50, y: 10 },
      'Gate C': { x: 90, y: 50 },
      'Gate D': { x: 50, y: 90 },
      'N1': { x: 30, y: 30 },
      'N2': { x: 50, y: 30 },
      'E1': { x: 70, y: 40 },
      'E2': { x: 70, y: 60 },
      'S1': { x: 50, y: 70 },
      'S2': { x: 30, y: 70 },
      'W1': { x: 30, y: 60 },
      'W2': { x: 30, y: 40 },
    };

    const start = points[userGate] || points['Gate B'];
    const end = points[userStand] || points['N1'];
    
    // In emergency, path goes to nearest "Safe" gate (mocking Gate A as safe)
    const evacEndPoint = points['Gate A']; 

    return {
      start,
      end: isEmergency ? evacEndPoint : end,
      path: `M ${start.x} ${start.y} L ${start.x} ${end.y} L ${end.x} ${end.y}`
    };
  }, [userGate, userStand, isEmergency]);

  return (
    <div className="glass-card rounded-3xl p-6 border-outline-variant/10 shadow-xl overflow-hidden flex flex-col h-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-headline font-bold mb-1">Smart Seat Navigation</h3>
          <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest">2D Venue Wayfinding</p>
        </div>
        <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5 ${isEmergency ? 'bg-red-500 text-white animate-pulse' : 'bg-primary/10 text-primary'}`}>
          {isEmergency ? <AlertTriangle className="w-3 h-3" /> : <Navigation className="w-3 h-3" />}
          {isEmergency ? 'Emergency Mode' : 'Live Path'}
        </div>
      </div>

      {/* SVG Map Rendering with 3D Transform Capability */}
      <div 
         ref={mapContainerRef}
         className={`relative flex-1 bg-surface-container-lowest rounded-2xl border border-outline-variant/20 overflow-hidden mb-6 ${is3DMode ? 'cursor-grab active:cursor-grabbing' : ''}`} 
         style={{ perspective: '1200px' }}
      >
        <motion.div
           animate={{
              rotateX: is3DMode ? 60 : 0,
              rotateZ: is3DMode ? -45 : 0,
              scale: is3DMode ? zoom : 1,
              y: is3DMode ? -10 : 0
           }}
           transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
           className="w-full h-full flex items-center justify-center transform-style-3d origin-center"
        >
          <motion.div
             drag={is3DMode}
             dragConstraints={{ left: -150, right: 150, top: -150, bottom: 150 }}
             animate={!is3DMode ? { x: 0, y: 0 } : {}}
             className="w-full h-full flex items-center justify-center transform-style-3d origin-center"
          >
            <svg viewBox="0 0 100 100" className="w-full h-full p-4 overflow-visible pointer-events-none">
            
            {/* 3D Holographic Base Grid (Only visible in 3D Mode) */}
            <motion.g 
               initial={{ opacity: 0 }}
               animate={{ opacity: is3DMode ? 1 : 0 }}
            >
               <defs>
                 <pattern id="gridPattern" width="4" height="4" patternUnits="userSpaceOnUse">
                   <path d="M 4 0 L 0 0 0 4" fill="none" stroke="currentColor" className="text-primary opacity-20" strokeWidth="0.2"/>
                 </pattern>
               </defs>
               <rect x="-50" y="-50" width="200" height="200" fill="url(#gridPattern)" />
               <rect x="5" y="5" width="90" height="90" rx="30" fill="currentColor" className="text-primary opacity-5" />
            </motion.g>

            {/* Stadium Outer Boundary */}
            <rect x="5" y="5" width="90" height="90" rx="30" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-outline-variant opacity-20" />
            
            {/* Pitch Area */}
            <rect x="35" y="35" width="30" height="30" rx="15" fill="currentColor" className="text-outline-variant opacity-5" />

            {/* Path Drawing */}
            <motion.path
              d={waypoints.path}
              fill="none"
              stroke={isEmergency ? '#ef4444' : '#3cd7ff'}
              strokeWidth="2"
              strokeDasharray="4 4"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              style={{ filter: is3DMode ? 'drop-shadow(0px 10px 5px rgba(60, 215, 255, 0.5))' : 'none' }}
            />

          {/* Start Point (Gate) */}
          <circle cx={waypoints.start.x} cy={waypoints.start.y} r="3" className={isEmergency ? 'fill-emerald-500 shadow-lg shadow-emerald-500/50' : 'fill-primary'} />
          
          {/* Target Point (Stand/Seat) */}
          <motion.circle 
            cx={waypoints.end.x} 
            cy={waypoints.end.y} 
            r="4" 
            className={isEmergency ? 'fill-emerald-500' : 'fill-secondary-fixed'}
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />

          {/* Text Labels for Context */}
          <motion.text animate={{ y: is3DMode ? -15 : -5 }} x={waypoints.start.x} y={waypoints.start.y} fontSize="3" className="fill-on-surface-variant font-bold text-center" textAnchor="middle">{userGate}</motion.text>
          <motion.text animate={{ y: is3DMode ? -15 : 8 }} x={waypoints.end.x} y={waypoints.end.y} fontSize="3" className="fill-on-surface font-bold text-center" textAnchor="middle">{isEmergency ? 'Safety Exit (Gate A)' : `Stand ${userStand}`}</motion.text>
        </svg>
          </motion.div>
        </motion.div>

        {/* Floating Instruction Info */}
        <div className="absolute bottom-4 left-4 right-4 bg-surface-container/80 backdrop-blur-md p-3 rounded-xl border border-outline-variant/30">
          {isEmergency ? (
             <div className="flex items-center gap-3">
               <div className="w-8 h-8 rounded-lg bg-red-500 flex items-center justify-center shrink-0">
                 <AlertTriangle className="w-5 h-5 text-white" />
               </div>
               <div>
                  <p className="text-[10px] uppercase font-bold text-red-500 tracking-widest">{evacGuide?.status}: IMMEDIATE DEPARTURE</p>
                  <p className="text-xs font-bold leading-tight">{evacGuide?.message}</p>
               </div>
             </div>
          ) : (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors ${is3DMode ? 'bg-primary text-on-primary shadow-lg shadow-primary/20' : 'bg-primary/10 text-primary'}`}>
                  {is3DMode ? <Scan className="w-5 h-5 animate-pulse" /> : <MapPin className="w-5 h-5" />}
                </div>
                <div>
                   <p className={`text-[10px] uppercase font-bold tracking-widest transition-colors ${is3DMode ? 'text-primary' : 'text-on-surface-variant'}`}>
                     {is3DMode ? 'Spatial AR Mode' : 'Target Location'}
                   </p>
                   <p className="text-xs font-bold">{userStand} · Row G · Seat 12</p>
                </div>
              </div>
              <motion.button 
                 whileHover={{ scale: 1.1, x: is3DMode ? 0 : 5 }}
                 whileTap={{ scale: 0.9 }}
                 onClick={() => {
                   setIs3DMode(!is3DMode);
                   if (!is3DMode) setZoom(1.5);
                 }}
                 className={`w-10 h-10 rounded-xl flex items-center justify-center cursor-pointer transition-colors shadow-lg border ${
                    is3DMode 
                       ? 'bg-red-500/10 text-red-500 border-red-500/30 hover:bg-red-500/20 shadow-red-500/10' 
                       : 'bg-surface-container-highest text-primary border-outline-variant/30 hover:border-primary/50'
                 }`}
              >
                 {is3DMode ? <X className="w-5 h-5" /> : <ArrowRight className="w-5 h-5" />}
              </motion.button>
            </div>
          )}
        </div>
      </div>

      {/* Waypoint Checklist */}
      <div className="space-y-3">
         <div className="flex items-center gap-3 opacity-100">
            <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center">
              <ShieldCheck className="w-3 h-3 text-white" />
            </div>
            <span className="text-xs font-bold">{isEmergency ? 'Safe Exit Route Identified' : `Entered through ${userGate}`}</span>
         </div>
         <div className="flex items-center gap-3 opacity-60">
            <div className="w-5 h-5 rounded-full bg-surface-container-highest border border-outline-variant/30" />
            <span className="text-xs font-medium">{isEmergency ? 'Move towards Concourse A' : 'Pass through North Concourse'}</span>
         </div>
      </div>
    </div>
  );
};

export default SeatNavigator;
