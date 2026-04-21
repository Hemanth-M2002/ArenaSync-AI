import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import HeatmapCard from '../components/HeatmapCard';
import QueueCard from '../components/QueueCard';
import ChatBox from '../components/ChatBox';
import AlertBanner from '../components/AlertBanner';
import { Search, Bell, Filter, CalendarCheck, MapPin, AlertTriangle, Info } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useVenue } from '../context/VenueContext';
import UserAvatar from '../components/UserAvatar';
import SeatNavigator from '../components/SeatNavigator';
import IncidentReporter from '../components/IncidentReporter';

/** Returns a time-of-day greeting based on the current local hour */
const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return 'Good Morning';
  if (hour >= 12 && hour < 17) return 'Good Afternoon';
  if (hour >= 17 && hour < 21) return 'Good Evening';
  return 'Good Night';
};

/** Returns a formatted date string e.g. "Apr 20, 2026" */
const getLiveDate = () =>
  new Date().toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });


const Dashboard = () => {
  const { user, activeContext } = useAuth();
  const { intel } = useVenue();
  
  const sport = activeContext?.sport || user?.preferences?.selectedSport || 'Cricket';
  const venue = activeContext?.venue || user?.preferences?.selectedVenue || 'Venue';
  const isEmergency = intel?.emergencyMode;

  const getSportContext = () => {
    switch(sport.toLowerCase()) {
      case 'soccer': return { event: 'Premier League Matchday', merch: 'Official Kit Store' };
      case 'basketball': return { event: 'NBA Championship Series', merch: 'Hoops Merch Loft' };
      case 'tennis': return { event: 'Grand Slam Quarter-Finals', merch: 'Court-Side Essentials' };
      case 'f1': return { event: 'Grand Prix Qualifying', merch: 'Racing Team Gear' };
      case 'concert': return { event: 'Neon Pulse World Tour', merch: 'Artist Merchandise' };
      default: return { event: 'Champions Trophy Final', merch: 'The Cricket Merch' };
    }
  };

  const context = getSportContext();

  const gatesData = [
    { name: 'Gate B (North)', time: '3m', status: 'optimal', trend: 'down' },
    { name: 'Gate E (East)', time: '18m', status: 'busy', trend: 'up' },
    { name: 'Gate W (VIP)', time: '2m', status: 'optimal', trend: 'down' },
  ];

  const stallsData = [
    { name: 'Burger Arena', time: '8m', status: 'steady', trend: 'down' },
    { name: 'Fan Zone Drinks', time: '5m', status: 'optimal', trend: 'down' },
    { name: context.merch, time: '12m', status: 'busy', trend: 'up' },
  ];

  return (
    <div className="min-h-screen bg-background text-on-surface flex flex-col lg:flex-row font-body transition-colors">
      <Sidebar />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-[100svh] overflow-hidden">
        {/* Top Header */}
        <header className="h-16 md:h-20 px-4 md:px-6 lg:px-10 flex items-center justify-between border-b border-outline-variant/10 bg-surface-container-lowest/30 backdrop-blur-md shrink-0">
          <div className="flex items-center gap-6 flex-1 max-w-2xl">
            <div className="relative flex-1 hidden md:block group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant group-focus-within:text-primary transition-colors" />
              <input 
                type="text" 
                placeholder="Find seats, gates, or facilities..."
                className="w-full bg-surface-container py-2.5 pl-11 pr-4 rounded-xl border border-outline-variant/30 text-sm focus:outline-hidden focus:border-primary/50 transition-all placeholder:text-slate-500 shadow-inner"
              />
            </div>
            <div className="flex items-center gap-2 text-on-surface-variant bg-surface-container px-3 py-2 rounded-xl border border-outline-variant/30 hover:border-primary/30 transition-all cursor-pointer">
              <MapPin className="w-4 h-4 text-primary" />
              <span className="text-xs font-bold font-headline uppercase tracking-widest">{venue}</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
             <motion.button 
               whileHover={{ scale: 1.05 }}
               whileTap={{ scale: 0.95 }}
               className="p-2.5 rounded-xl bg-surface-container border border-outline-variant/30 relative text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
             >
                <Bell className="w-5 h-5" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-surface-container" />
             </motion.button>
             <Link to="/profile" className="hidden sm:flex items-center gap-3 pl-4 border-l border-outline-variant/20 hover:opacity-80 transition-opacity cursor-pointer">
                <div className="text-right">
                   <p className="text-xs font-bold leading-none">{user?.name || "Marcus R."}</p>
                   <p className="text-[10px] text-primary font-bold uppercase tracking-widest mt-1">{user?.role === 'admin' ? 'Arena Manager' : 'Platinum Fan'}</p>
                </div>
                <UserAvatar 
                  src={user?.avatar} 
                  name={user?.name} 
                  className="w-10 h-10 rounded-xl border-2 border-primary/20" 
                />
             </Link>
          </div>
        </header>

        {/* Scrollable Viewport */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-10 no-scrollbar">
          <div className="max-w-7xl mx-auto space-y-8">
            
            {/* Greeting & Alert */}
            <div className="grid lg:grid-cols-3 gap-6 items-center">
              <div className="lg:col-span-2">
                <motion.h2 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-3xl lg:text-4xl font-headline font-bold tracking-tight"
                >
                  Good {getGreeting().split(' ')[1]}, <span className="text-primary italic">{user?.name?.split(' ')[0] || 'Guest'}.</span>
                </motion.h2>
                <p className="text-on-surface-variant mt-2 font-medium">Ready for the {context.event}? Here is your real-time venue intel.</p>
              </div>
              <div className="flex justify-start lg:justify-end gap-3">
                 <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-surface-container text-xs font-bold font-headline border border-outline-variant/30">
                    <CalendarCheck className="w-4 h-4 text-secondary-fixed" />
                    {getLiveDate()}
                 </div>
                 <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-on-primary text-xs font-bold font-headline shadow-lg shadow-primary/20">
                    <Filter className="w-4 h-4" />
                    Filters
                 </button>
              </div>
            </div>

            {isEmergency ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-red-500 text-white p-6 rounded-[2rem] shadow-2xl shadow-red-500/20 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32" />
                <div className="flex items-center gap-6 relative z-10">
                   <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0">
                      <AlertTriangle className="w-10 h-10 animate-bounce" />
                   </div>
                   <div>
                      <h2 className="text-2xl font-headline font-bold leading-tight">Emergency Evacuation Active</h2>
                      <p className="text-white/80 font-medium">Safe routes identified. Follow the green markers and stadium personnel instructions.</p>
                   </div>
                </div>
                <button className="bg-white text-red-500 px-8 py-3 rounded-xl font-bold font-headline hover:bg-opacity-90 transition-all relative z-10">
                   View Safety Map
                </button>
              </motion.div>
            ) : (
              <AlertBanner 
                type="warning" 
                message="CONGESTION ALERT: Main Plaza (Gate E) is experiencing heavy traffic. AI suggests using Gate B for faster entry (3 min wait)."
              />
            )}

            {/* Main Intelligence Grid - Top Row for Heatmap */}
            <div className="grid lg:grid-cols-1 gap-8">
              <div className="min-h-[500px]">
                <HeatmapCard />
              </div>
            </div>

            {/* Split Grid for Assistant & Navigation */}
            <div className="grid lg:grid-cols-2 gap-8">
              <div className="min-h-[500px]">
                <SeatNavigator />
              </div>
              <div className="h-[500px]">
                <ChatBox />
              </div>
            </div>

            {/* Bottom Grid: Intelligence Sections */}
            <div className="space-y-12">
               {/* Gate Intelligence */}
               <div>
                  <div className="flex items-center justify-between mb-6">
                     <div className="flex items-center gap-3">
                        <div className="w-1.5 h-6 bg-primary rounded-full" />
                        <h3 className="text-xl font-headline font-bold">Gate Entry Optimization</h3>
                     </div>
                     <span className="text-xs font-bold text-primary font-headline cursor-pointer hover:underline">View All Gates</span>
                  </div>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
                    {gatesData.map((gate, i) => (
                      <QueueCard key={i} type="gate" {...gate} />
                    ))}
                  </div>
               </div>

               {/* Concession Intelligence */}
               <div>
                  <div className="flex items-center justify-between mb-6">
                     <div className="flex items-center gap-3">
                        <div className="w-1.5 h-6 bg-secondary-fixed rounded-full" />
                        <h3 className="text-xl font-headline font-bold">Smart Concessions</h3>
                     </div>
                     <span className="text-xs font-bold text-secondary-fixed font-headline cursor-pointer hover:underline">See Full Menu</span>
                  </div>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
                    {stallsData.map((stall, i) => (
                      <QueueCard key={i} type="stall" {...stall} />
                    ))}
                  </div>
               </div>
            </div>

            {/* Footer space */}
            <div className="h-20" />
          </div>
        </div>
        <IncidentReporter />
      </main>
    </div>
  );
};

export default Dashboard;
