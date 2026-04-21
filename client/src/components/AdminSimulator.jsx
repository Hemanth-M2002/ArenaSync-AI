import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, Zap, AlertTriangle, RefreshCw, X, Play, Square } from 'lucide-react';
import { useVenue } from '../context/VenueContext';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';

const AdminSimulator = () => {
  const [isOpen, setIsOpen] = useState(false);
  const simulatorRef = useRef(null);
  const { intel, refresh } = useVenue();
  const { activeContext } = useAuth();
  const [isUpdating, setIsUpdating] = useState(false);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (simulatorRef.current && !simulatorRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const venue = activeContext?.venue;

  const toggleEmergency = async (enabled) => {
    if (!venue) return;
    setIsUpdating(true);
    try {
      await api.patch('/analytics/emergency', { venue, enabled });
      await refresh();
    } catch (err) {
      console.error('Failed to toggle emergency:', err);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div ref={simulatorRef} className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="bg-surface-container-highest border border-outline-variant/30 rounded-3xl p-6 shadow-2xl mb-4 w-72 backdrop-blur-xl"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-primary" />
                <h4 className="font-headline font-bold">Hackathon Simulator</h4>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-on-surface-variant hover:text-on-surface">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="bg-surface-container p-4 rounded-2xl border border-outline-variant/20">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Emergency Mode</span>
                  <div className={`w-2 h-2 rounded-full ${intel?.emergencyMode ? 'bg-red-500 animate-pulse' : 'bg-emerald-500'}`} />
                </div>
                
                <button
                  onClick={() => toggleEmergency(!intel?.emergencyMode)}
                  disabled={isUpdating}
                  className={`w-full py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
                    intel?.emergencyMode 
                      ? 'bg-emerald-500/20 text-emerald-500 hover:bg-emerald-500/30' 
                      : 'bg-red-500 text-white hover:bg-red-600 shadow-lg shadow-red-500/20'
                  }`}
                >
                  {intel?.emergencyMode ? (
                    <><RefreshCw className={`w-4 h-4 ${isUpdating ? 'animate-spin' : ''}`} /> Clear Emergency</>
                  ) : (
                    <><AlertTriangle className="w-4 h-4" /> Trigger Evacuation</>
                  )}
                </button>
              </div>

              <div className="bg-surface-container p-4 rounded-2xl border border-outline-variant/20">
                <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-2 block">Live Pulse Status</span>
                <div className="flex items-center justify-between">
                   <div className="flex items-center gap-2">
                     <Play className="w-3 h-3 text-emerald-500" />
                     <span className="text-xs font-bold">Auto-Sim Active</span>
                   </div>
                   <span className="text-[10px] font-medium text-on-surface-variant italic">Every 30s</span>
                </div>
              </div>
            </div>
            
            <p className="mt-4 text-[10px] text-on-surface-variant text-center italic font-medium">
              Demo Tool: Use to trigger real-time AI logic
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all ${
          intel?.emergencyMode ? 'bg-red-500 text-white' : 'bg-surface-container-highest text-primary border border-primary/20'
        }`}
      >
        {isOpen ? <X className="w-6 h-6" /> : <Zap className="w-6 h-6" />}
      </motion.button>
    </div>
  );
};

export default AdminSimulator;
