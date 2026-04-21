import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LogOut, X, AlertTriangle } from 'lucide-react';

const LogoutConfirmModal = ({ isOpen, onConfirm, onCancel }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onCancel}
            className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
          />
          
          {/* Modal */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-sm glass-card border-outline-variant/20 rounded-3xl p-8 shadow-2xl overflow-hidden"
          >
            {/* Decorative background circle */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/10 blur-[60px] rounded-full" />
            
            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center mb-6">
                <LogOut className="w-8 h-8 text-red-400" />
              </div>
              
              <h3 className="text-2xl font-headline font-bold mb-2">Logout Confirmation</h3>
              <p className="text-on-surface-variant text-sm mb-8 leading-relaxed">
                Are you sure you want to end your session? You'll need to sign back in to access your venue intelligence.
              </p>
              
              <div className="grid grid-cols-2 gap-4 w-full">
                <button
                  onClick={onCancel}
                  className="px-6 py-3.5 rounded-xl border border-outline-variant/30 font-headline font-bold text-sm hover:bg-surface-container-highest transition-colors"
                >
                  Stay Here
                </button>
                <button
                  onClick={onConfirm}
                  className="px-6 py-3.5 rounded-xl bg-red-500 text-white font-headline font-bold text-sm shadow-lg shadow-red-500/20 hover:bg-red-600 transition-all"
                >
                  Yes, Logout
                </button>
              </div>
            </div>
            
            <button 
              onClick={onCancel}
              className="absolute top-4 right-4 text-on-surface-variant hover:text-on-surface transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default LogoutConfirmModal;
