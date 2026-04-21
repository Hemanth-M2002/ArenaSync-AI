import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Logo from './Logo';

const SplashScreen = ({ isVisible }) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: [0.43, 0.13, 0.23, 0.96] }}
          className="fixed inset-0 z-[200] bg-slate-950 flex flex-col items-center justify-center overflow-hidden"
        >
          {/* Ambient Background Glows */}
          <motion.div 
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3]
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/20 blur-[120px] rounded-full"
          />
          
          <div className="relative z-10 flex flex-col items-center">
            {/* Pulsing Logo Container */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ 
                duration: 0.5, 
                type: "spring", 
                stiffness: 260, 
                damping: 20 
              }}
              className="w-24 h-24 rounded-3xl bg-surface-container-highest flex items-center justify-center shadow-2xl shadow-primary/20 mb-8 overflow-hidden p-3"
            >
              <Logo className="w-full h-full" />
            </motion.div>
            
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-center"
            >
              <h1 className="text-3xl font-headline font-bold text-white tracking-tight">
                ArenaSync <span className="text-primary italic">AI</span>
              </h1>
              <div className="mt-4 flex items-center gap-1.5 justify-center">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    animate={{ 
                      scale: [1, 1.5, 1],
                      opacity: [0.3, 1, 0.3]
                    }}
                    transition={{ 
                      duration: 1, 
                      repeat: Infinity, 
                      delay: i * 0.2,
                      ease: "easeInOut" 
                    }}
                    className="w-1.5 h-1.5 rounded-full bg-primary"
                  />
                ))}
              </div>
            </motion.div>
          </div>
          
          {/* Bottom Technical Lines */}
          <div className="absolute bottom-12 left-0 right-0 px-12 opacity-20 hidden md:block">
            <div className="flex items-center gap-4">
              <div className="h-[1px] flex-1 bg-linear-to-r from-transparent to-primary" />
              <span className="text-[10px] font-bold tracking-[0.4em] text-primary whitespace-nowrap">SYNCHRONIZING SECURE LAYER</span>
              <div className="h-[1px] flex-1 bg-linear-to-l from-transparent to-primary" />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SplashScreen;
