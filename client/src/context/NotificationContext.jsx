import React, { createContext, useContext, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X, Info, AlertTriangle, Zap } from 'lucide-react';
import { useVenue } from './VenueContext';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const { intel } = useVenue();
  const [lastAlertTimestamp, setLastAlertTimestamp] = useState(null);

  // Listen for new alerts in the intel payload
  useEffect(() => {
    if (intel?.activeAlerts?.length > 0) {
      const topAlert = intel.activeAlerts[0];
      const alertTime = new Date(topAlert.timestamp).getTime();

      // Only show toast if it's a new alert (within the last 30s) and we haven't seen it
      if (!lastAlertTimestamp || alertTime > lastAlertTimestamp) {
        addNotification({
          id: alertTime,
          type: topAlert.type,
          message: topAlert.message
        });
        setLastAlertTimestamp(alertTime);
      }
    }
  }, [intel, lastAlertTimestamp]);

  const addNotification = (notif) => {
    setNotifications(prev => [...prev, { ...notif, id: Date.now() }]);
  };

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return (
    <NotificationContext.Provider value={{ addNotification }}>
      {children}
      
      {/* Toast Overlay */}
      <div className="fixed top-6 right-6 z-[100] flex flex-col gap-3 w-full max-w-sm pointer-events-none">
        <AnimatePresence>
          {notifications.map((notif) => (
            <motion.div
              key={notif.id}
              initial={{ opacity: 0, x: 50, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
              className="pointer-events-auto overflow-hidden"
            >
               <div className={`glass-card rounded-2xl border p-4 shadow-2xl flex gap-4 relative overflow-hidden ${
                 notif.type === 'emergency' 
                   ? 'border-red-500/30 bg-red-500/10' 
                   : 'border-primary/20 bg-primary/5'
               }`}>
                  {/* Decorative Gradient */}
                  <div className={`absolute top-0 left-0 w-1 h-full ${notif.type === 'emergency' ? 'bg-red-500' : 'bg-primary'}`} />
                  
                  <div className={`w-10 h-10 rounded-xl shrink-0 flex items-center justify-center ${
                    notif.type === 'emergency' ? 'bg-red-500 text-white animate-pulse' : 'bg-primary/20 text-primary'
                  }`}>
                     {notif.type === 'emergency' ? <AlertTriangle className="w-5 h-5" /> : <Bell className="w-5 h-5" />}
                  </div>

                  <div className="flex-1 pr-6">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-1">
                      {notif.type === 'emergency' ? 'Critical Alert' : 'Arena Sync Update'}
                    </p>
                    <p className="text-xs font-bold leading-relaxed">{notif.message}</p>
                  </div>

                  <button 
                    onClick={() => removeNotification(notif.id)}
                    className="absolute top-2 right-2 p-1 rounded-lg hover:bg-surface-container-highest transition-colors text-on-surface-variant"
                  >
                    <X className="w-4 h-4" />
                  </button>
               </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </NotificationContext.Provider>
  );
};

export const useNotification = () => useContext(NotificationContext);
