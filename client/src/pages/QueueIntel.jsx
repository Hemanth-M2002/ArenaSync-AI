import React from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, Info, Trophy, MapPin, Clock3, AlertCircle, ArrowRight, Zap, Coffee } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useVenue } from '../context/VenueContext';
import Sidebar from '../components/Sidebar';
import QueueCard from '../components/QueueCard';

const QueueIntel = () => {
  const navigate = useNavigate();
  const { intel, getRecommendedGate, loading } = useVenue();

  const recommendedGate = getRecommendedGate();
  
  // Dummy data for concessions if not in intel
  const stallsData = [
    { name: 'Burger Arena', time: '8m', status: 'steady', trend: 'down' },
    { name: 'Fan Zone Drinks', time: '5m', status: 'optimal', trend: 'down' },
    { name: 'The Cricket Merch', time: '12m', status: 'busy', trend: 'up' },
  ];

  return (
    <div className="min-h-screen bg-background text-on-surface flex flex-col lg:flex-row font-body transition-colors">
      <Sidebar />

      <main className="flex-1 flex flex-col h-[100svh] overflow-hidden">
        {/* Header */}
        <header className="h-16 md:h-20 px-4 md:px-6 lg:px-10 flex items-center justify-between border-b border-outline-variant/10 bg-surface-container-lowest/30 backdrop-blur-md shrink-0">
          <div className="flex items-center gap-4">
             <button onClick={() => navigate(-1)} className="p-2 mr-2 rounded-xl bg-surface-container-highest/50 text-on-surface-variant hover:text-primary transition-colors">
                <ChevronLeft className="w-5 h-5" />
             </button>
             <div>
                <h2 className="text-xl font-headline font-bold">Queue Intelligence</h2>
                <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest">Real-time Wait Time Optimization</p>
             </div>
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-10 no-scrollbar">
          <div className="max-w-5xl mx-auto space-y-10 pb-20">
            
            {/* Smart Recommendation Hero */}
            <div className="relative overflow-hidden rounded-[2.5rem] bg-surface-container-high border border-primary/20 p-8 md:p-12 shadow-2xl">
               {/* Background Decorative Rings */}
               <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full -mr-32 -mt-32 blur-3xl animate-pulse" />
               
               <div className="flex flex-col md:flex-row items-center gap-10 relative z-10">
                  <div className="w-24 h-24 md:w-32 md:h-32 rounded-[2rem] bg-gradient-to-br from-primary to-cyan-400 flex items-center justify-center shadow-2xl shadow-primary/30 shrink-0">
                     <Zap className="w-12 h-12 md:w-16 md:h-16 text-white" />
                  </div>
                  
                  <div className="flex-1 text-center md:text-left">
                     <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest mb-4">
                        AI Recommended Entry
                     </span>
                     <h1 className="text-3xl md:text-5xl font-bold font-headline tracking-tighter mb-3">
                        Enter via <span className="text-primary">{recommendedGate?.gateId || 'Gate B'}</span>
                     </h1>
                     <p className="text-on-surface-variant font-medium text-lg max-w-lg">
                        This gate has the shortest combined wait and walking time 
                        (<span className="text-on-surface font-bold">~{recommendedGate ? recommendedGate.waitTime + (recommendedGate.walkingOffset || 0) : 5} mins</span> total).
                     </p>
                  </div>

                  <div className="flex flex-col items-center justify-center bg-surface-container-highest/50 backdrop-blur-xl p-6 rounded-3xl border border-outline-variant/30 min-w-[160px]">
                     <Clock3 className="w-8 h-8 text-primary mb-2" />
                     <span className="text-3xl font-black font-headline">{recommendedGate?.waitTime || 3}m</span>
                     <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mt-1">Wait Time</span>
                  </div>
               </div>
            </div>

            {/* All Stadium Gates Section */}
            <section>
               <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                     <div className="w-1.5 h-6 bg-primary rounded-full" />
                     <h3 className="text-2xl font-headline font-bold uppercase tracking-tight">Gate Entry Logistics</h3>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-bold text-on-surface-variant bg-surface-container px-3 py-1.5 rounded-lg border border-outline-variant/20">
                     <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                     Live Status
                  </div>
               </div>
               
               <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
                 {intel?.gateStatus?.map((gate, i) => (
                   <QueueCard 
                     key={i} 
                     type="gate" 
                     name={gate.gateId} 
                     time={`${gate.waitTime}m`} 
                     status={gate.isClosed ? 'busy' : gate.waitTime < 10 ? 'optimal' : 'steady'}
                     trend={gate.waitTime < 10 ? 'down' : 'up'}
                   />
                 )) || (
                    <div className="col-span-3 h-32 flex items-center justify-center bg-surface-container rounded-2xl border-2 border-dashed border-outline-variant/20 italic text-on-surface-variant font-medium">
                       Loading gate sensor data...
                    </div>
                 )}
               </div>
            </section>

            {/* Smart Concessions Section */}
            <section>
               <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                     <div className="w-1.5 h-6 bg-secondary-fixed rounded-full" />
                     <h3 className="text-2xl font-headline font-bold uppercase tracking-tight">Smart Concessions</h3>
                  </div>
                  <Coffee className="w-6 h-6 text-on-surface-variant opacity-20" />
               </div>
               
               <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
                 {stallsData.map((stall, i) => (
                   <QueueCard 
                     key={i} 
                     type="stall" 
                     name={stall.name} 
                     time={stall.time} 
                     status={stall.status} 
                     trend={stall.trend} 
                   />
                 ))}
               </div>
            </section>

          </div>
        </div>
      </main>
    </div>
  );
};

export default QueueIntel;
