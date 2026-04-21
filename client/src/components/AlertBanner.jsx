import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Info, X, Zap } from 'lucide-react';

const AlertBanner = ({ type = 'info', message, onClose }) => {
  const styles = {
    info: 'bg-primary/10 border-primary/20 text-primary',
    warning: 'bg-amber-500/10 border-amber-500/20 text-amber-500',
    danger: 'bg-red-500/10 border-red-500/20 text-red-500',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`p-4 rounded-2xl border flex items-center gap-4 ${styles[type]} shadow-sm`}
    >
      <div className="shrink-0">
        {type === 'warning' || type === 'danger' ? <AlertTriangle className="w-5 h-5" /> : <Zap className="w-5 h-5" />}
      </div>
      <p className="flex-1 text-sm font-bold font-headline leading-tight tracking-tight">
        {message}
      </p>
      {onClose && (
        <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-lg transition-colors">
          <X className="w-4 h-4" />
        </button>
      )}
    </motion.div>
  );
};

export default AlertBanner;
