import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, X, Shield, Send, CheckCircle, Flame, UserPlus, Droplets, MapPin } from 'lucide-react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';

const IncidentReporter = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState('type'); // 'type' or 'details' or 'success'
  const [selectedType, setSelectedType] = useState(null);
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { user, activeContext } = useAuth();
  const venue = activeContext?.venue || user?.preferences?.selectedVenue;
  const currentZone = activeContext?.stand || 'N1'; // Default or from context

  const incidentTypes = [
    { id: 'Medical', icon: UserPlus, label: 'Medical Help', color: 'bg-emerald-500' },
    { id: 'Security', icon: Shield, label: 'Security Concern', color: 'bg-red-500' },
    { id: 'Fire', icon: Flame, label: 'Fire / Hazard', color: 'bg-orange-500' },
    { id: 'Facility', icon: Droplets, label: 'Spill / Facility', color: 'bg-amber-500' },
    { id: 'Other', icon: AlertCircle, label: 'Other Issue', color: 'bg-slate-500' },
  ];

  const handleSubmit = async () => {
    if (!description || !selectedType) return;
    
    setIsSubmitting(true);
    try {
      await api.post('/admin/incidents/public', {
        type: selectedType,
        description,
        location: {
          zoneId: currentZone,
          venue: venue
        },
        reportedBy: {
          userId: user?._id,
          userName: user?.name
        }
      });
      setStep('success');
      setTimeout(() => {
        setIsOpen(false);
        resetForm();
      }, 3000);
    } catch (err) {
      console.error('Incident report failed:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setStep('type');
    setSelectedType(null);
    setDescription('');
  };

  return (
    <>
      {/* Floating Action Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-24 right-6 z-50 w-14 h-14 rounded-full bg-red-500 text-white shadow-2xl shadow-red-500/20 flex items-center justify-center border-2 border-white/20 group overflow-hidden"
      >
        <AlertCircle className="w-6 h-6 group-hover:rotate-12 transition-transform" />
        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform" />
      </motion.button>

      {/* Report Modal */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 sm:p-0">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-surface-container-highest border border-outline-variant/30 w-full max-w-md rounded-[2.5rem] shadow-2xl relative overflow-hidden"
            >
              <div className="p-8">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                     <div className="w-10 h-10 rounded-xl bg-red-500/10 text-red-500 flex items-center justify-center">
                        <AlertCircle className="w-6 h-6" />
                     </div>
                     <div>
                        <h3 className="font-headline font-bold text-xl leading-none">Report Issue</h3>
                        <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mt-1 italic">ArenaSync Command Link</p>
                     </div>
                  </div>
                  <button onClick={() => setIsOpen(false)} className="p-2 rounded-lg hover:bg-surface-container text-on-surface-variant">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {step === 'type' && (
                  <div className="space-y-3">
                    <p className="text-xs font-bold text-on-surface-variant mb-4 px-1">What kind of assistance is needed?</p>
                    <div className="grid grid-cols-1 gap-3">
                      {incidentTypes.map((type) => (
                        <button
                          key={type.id}
                          onClick={() => { setSelectedType(type.id); setStep('details'); }}
                          className="flex items-center gap-4 p-4 rounded-2xl bg-surface-container border border-outline-variant/30 hover:border-primary/50 hover:bg-primary/5 transition-all group"
                        >
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white ${type.color}`}>
                            <type.icon className="w-5 h-5" />
                          </div>
                          <span className="font-headline font-bold">{type.label}</span>
                          <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                             <div className="w-6 h-6 rounded-lg bg-primary/20 text-primary flex items-center justify-center">
                                <Send className="w-3 h-3" />
                             </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {step === 'details' && (
                  <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-6"
                  >
                    <div className="flex items-center gap-2 px-1 mb-2">
                       <button onClick={() => setStep('type')} className="text-[10px] font-bold text-primary uppercase tracking-widest hover:underline">Change Category</button>
                       <span className="text-[10px] text-on-surface-variant opacity-20">//</span>
                       <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">{selectedType}</span>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-on-surface-variant mb-2 ml-1">Describe the situation</label>
                      <textarea
                        autoFocus
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Please provide brief details for first responders..."
                        className="w-full bg-surface-container border border-outline-variant/30 p-4 rounded-2xl text-sm font-medium h-32 focus:outline-hidden focus:border-primary transition-all resize-none"
                      />
                    </div>

                    <div className="bg-surface-container border border-outline-variant/30 p-4 rounded-2xl flex items-center gap-4">
                       <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                          <MapPin className="w-5 h-5" />
                       </div>
                       <div>
                          <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Automatic Location</p>
                          <p className="text-sm font-bold">{venue} // {currentZone}</p>
                       </div>
                    </div>

                    <button
                      disabled={!description || isSubmitting}
                      onClick={handleSubmit}
                      className="w-full bg-primary text-surface-container-lowest py-4 rounded-2xl font-bold font-headline flex items-center justify-center gap-3 hover:scale-105 active:scale-95 transition-all shadow-xl shadow-primary/20 disabled:opacity-50"
                    >
                      {isSubmitting ? <CheckCircle className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                      Submit Urgent Report
                    </button>
                  </motion.div>
                )}

                {step === 'success' && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="py-12 text-center"
                  >
                    <div className="w-24 h-24 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto mb-6 border border-emerald-500/30">
                       <CheckCircle className="w-12 h-12" />
                    </div>
                    <h4 className="font-headline font-bold text-2xl mb-2 text-emerald-500">Report Sent</h4>
                    <p className="text-sm text-on-surface-variant font-medium leading-relaxed max-w-[240px] mx-auto">
                      Organizers have been notified. Stay calm, stay where you are if safe, or follow green paths.
                    </p>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default IncidentReporter;
