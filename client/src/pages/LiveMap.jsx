import React from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, Info, Map as MapIcon, Maximize2, Zap, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useVenue } from '../context/VenueContext';
import Sidebar from '../components/Sidebar';
import HeatmapCard from '../components/HeatmapCard';
import SeatNavigator from '../components/SeatNavigator';

const LiveMap = () => {
  const navigate = useNavigate();
  const { intel } = useVenue();
  const isEmergency = intel?.emergencyMode;

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
                <h2 className="text-xl font-headline font-bold">Live Venue Map</h2>
                <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest">Interactive Seat & Crowd Intel</p>
             </div>
          </div>
          
          {isEmergency && (
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500 text-white font-bold animate-pulse text-sm">
               <AlertTriangle className="w-4 h-4" />
               Emergency Active
            </div>
          )}
        </header>

        {/* Major Viewport */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-10 no-scrollbar">
          <div className="max-w-7xl mx-auto grid lg:grid-cols-5 gap-8 pb-10 h-full">
            
            {/* Left: Enhanced Heatmap (Large View) */}
            <div className="lg:col-span-3 flex flex-col gap-6">
               <div className="flex-1 min-h-[600px]">
                  <HeatmapCard />
               </div>
               <div className="bg-surface-container p-6 rounded-3xl border border-outline-variant/20">
                  <div className="flex items-center gap-3 mb-4">
                     <Info className="w-5 h-5 text-primary" />
                     <h4 className="font-bold font-headline">Map Operations</h4>
                  </div>
                  <p className="text-sm text-on-surface-variant leading-relaxed">
                     The heatmap is synchronized with stadium density sensors located in every section. 
                     Optimal zones (Green) have &lt;30% occupancy, while Congested zones (Red) exceed 70%. 
                     In case of an alert, follow Safety markers on the Seat Navigator.
                  </p>
               </div>
            </div>

            {/* Right: Seat Navigator & Stats */}
            <div className="lg:col-span-2 flex flex-col gap-6">
               <div className="flex-1">
                  <SeatNavigator />
               </div>
               
               <div className="grid grid-cols-2 gap-4">
                  <div className="bg-surface-container p-5 rounded-3xl border border-outline-variant/20">
                     <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-1">Total Exits</p>
                     <p className="text-2xl font-black font-headline">12 Clear</p>
                  </div>
                  <div className="bg-surface-container p-5 rounded-3xl border border-outline-variant/20">
                     <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-1">Evac Time</p>
                     <p className="text-2xl font-black font-headline">~4.2m</p>
                  </div>
               </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
};

export default LiveMap;
