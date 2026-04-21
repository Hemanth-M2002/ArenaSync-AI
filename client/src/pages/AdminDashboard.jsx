import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, 
  Users, 
  Map as MapIcon, 
  AlertTriangle, 
  Settings, 
  Zap, 
  RefreshCw, 
  CheckCircle,
  Clock,
  Send,
  MessageSquare,
  TrendingUp,
  User,
  LogOut,
  ChevronRight,
  Maximize2,
  Info
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from 'recharts';
import { useAuth } from '../context/AuthContext';
import { useVenue } from '../context/VenueContext';
import api from '../utils/api';
import Logo from '../components/Logo';
import UserAvatar from '../components/UserAvatar';

const AdminDashboard = () => {
  const { user, activeContext, logout, setActiveContext } = useAuth();
  const { intel, refresh } = useVenue();
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState(null);
  const [incidents, setIncidents] = useState([]);
  const [broadcastMsg, setBroadcastMsg] = useState('');
  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const [simOffset, setSimOffset] = useState(0);
  const [isUpdatingSim, setIsUpdatingSim] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const venue = activeContext?.venue || user?.preferences?.selectedVenue || 'Narendra Modi Stadium';

  // State polling for admin stats and incidents
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, incidentsRes] = await Promise.all([
          api.get(`/admin/stats?venue=${encodeURIComponent(venue)}`),
          api.get(`/admin/incidents?venue=${encodeURIComponent(venue)}`)
        ]);
        setStats(statsRes.data.stats);
        setIncidents(incidentsRes.data.incidents);
      } catch (err) {
        console.error('Failed to fetch admin data:', err);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 10000); // 10s refresh for admins
    return () => clearInterval(interval);
  }, [venue]);

  const handleBroadcast = async () => {
    if (!broadcastMsg) return;
    setIsBroadcasting(true);
    try {
      await api.post('/admin/broadcast', { 
        venue, 
        message: broadcastMsg,
        type: 'info'
      });
      setBroadcastMsg('');
      refresh(); // Refresh venue context to show new alert locally
    } catch (err) {
      console.error('Broadcast failed:', err);
    } finally {
      setIsBroadcasting(false);
    }
  };

  const handleSimPulse = async (value) => {
    setSimOffset(value);
    setIsUpdatingSim(true);
    try {
      await api.patch('/admin/simulate', { venue, simulationOffset: value });
      refresh();
    } catch (err) {
      console.error('Simulation update failed:', err);
    } finally {
      setIsUpdatingSim(false);
    }
  };

  const resolveIncident = async (id) => {
    try {
      await api.patch(`/admin/incidents/${id}`, { 
        status: 'Resolved',
        resolutionNotes: 'Standard staff resolution applied.'
      });
      setIncidents(prev => prev.map(inc => inc._id === id ? { ...inc, status: 'Resolved' } : inc));
    } catch (err) {
      console.error('Resolution failed:', err);
    }
  };

  const toggleEmergency = async (enabled) => {
    try {
      await api.patch('/analytics/emergency', { venue, enabled });
      refresh();
    } catch (err) {
      console.error('Emergency toggle failed:', err);
    }
  };

  // Mocked Chart Data
  const trendData = [
    { time: '18:00', density: 15 },
    { time: '18:30', density: 25 },
    { time: '19:00', density: 45 },
    { time: '19:30', density: 75 },
    { time: '20:00', density: 65 },
    { time: '20:30', density: 55 },
    { time: '21:00', density: 40 },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col lg:flex-row font-body">
      {/* Admin Sidebar */}
      <aside className="w-full lg:w-72 bg-slate-900 border-r border-slate-800 flex flex-col h-screen sticky top-0 z-30 shrink-0">
        <div className="p-8 pb-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
             <ShieldCheck className="w-6 h-6 text-slate-950" />
          </div>
          <div>
            <h1 className="font-headline font-bold text-lg leading-none">COMMAND</h1>
            <p className="text-[10px] font-bold text-primary uppercase tracking-[0.2em] mt-1 italic">ArenaSync Staff</p>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto no-scrollbar">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-4 mb-4 mt-6">Monitoring</p>
          {[
            { id: 'overview', icon: TrendingUp, label: 'Live Overview' },
            { id: 'crowd', icon: MapIcon, label: 'Crowd Control' },
            { id: 'incidents', icon: AlertTriangle, label: 'Incident Feed', badge: incidents.filter(i => i.status === 'Open').length },
            { id: 'staff', icon: Users, label: 'Staff Roster' },
          ].map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all relative group ${
                activeTab === item.id ? 'bg-primary/10 text-primary border border-primary/20 shadow-md shadow-primary/5' : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-headline font-bold text-sm">{item.label}</span>
              {item.badge > 0 && (
                <div className="ml-auto w-5 h-5 rounded-full bg-red-500 text-[10px] font-bold text-white flex items-center justify-center">
                  {item.badge}
                </div>
              )}
            </button>
          ))}
        </nav>

        <div className="p-6 border-t border-slate-800 space-y-6">
          <div className="flex items-center gap-4 px-2">
            <UserAvatar name={user?.name} className="w-10 h-10 rounded-xl border border-slate-700" />
            <div className="flex-1 min-w-0">
               <p className="text-sm font-bold truncate leading-none">{user?.name || 'Admin'}</p>
               <p className="text-[10px] text-primary font-bold uppercase tracking-wider mt-1">{user?.accessLevel || 'Overseer'}</p>
            </div>
            <button onClick={logout} className="text-slate-500 hover:text-red-400 transition-colors">
               <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto overflow-x-hidden no-scrollbar">
        {/* Top Header */}
        <header className="h-20 bg-slate-900/50 backdrop-blur-md border-b border-slate-800 px-6 lg:px-10 flex items-center justify-between sticky top-0 z-20">
           <div className="flex items-center gap-4">
              <h2 className="text-xl font-headline font-bold uppercase tracking-tight">
                {venue} <span className="text-slate-500 mx-2">/</span> <span className="text-primary">{activeTab.toUpperCase()}</span>
              </h2>
           </div>
           
           <div className="flex items-center gap-4">
              <div className="hidden md:flex flex-col items-end mr-4">
                 <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Global Status</p>
                 <div className="flex items-center gap-2 mt-1">
                    <div className={`w-2 h-2 rounded-full ${intel?.emergencyMode ? 'bg-red-500 animate-pulse' : 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]'}`} />
                    <span className={`text-xs font-bold ${intel?.emergencyMode ? 'text-red-500' : 'text-emerald-500'}`}>
                      {intel?.emergencyMode ? 'EMERGENCY ACTIVE' : 'SYSTEMS BALANCED'}
                    </span>
                 </div>
              </div>
              <button 
                onClick={async () => { setIsRefreshing(true); await refresh(); setIsRefreshing(false); }}
                className="p-2.5 rounded-xl bg-slate-800 border border-slate-700 hover:border-primary transition-all text-slate-400 hover:text-primary"
              >
                <RefreshCw className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} />
              </button>
           </div>
        </header>

        <div className="p-6 lg:p-10 max-w-7xl mx-auto space-y-8">
           {/* Quick Stats Grid */}
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { label: 'Live Attendees', value: stats?.totalAttendees || '0', icon: Users, color: 'text-primary' },
                { label: 'Queue Load', value: 'Moderate', icon: Clock, color: 'text-amber-400' },
                { label: 'Active Alerts', value: stats?.activeAlerts || '0', icon: Zap, color: 'text-primary' },
                { label: 'Open Incidents', value: incidents.filter(i => i.status === 'Open').length, icon: AlertTriangle, color: 'text-red-400' },
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-2xl bg-slate-800 ${stat.color}`}>
                       <stat.icon className="w-5 h-5" />
                    </div>
                  </div>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">{stat.label}</p>
                  <h3 className="text-3xl font-headline font-black mt-1">{stat.value}</h3>
                </motion.div>
              ))}
           </div>

           <div className="grid lg:grid-cols-3 gap-8">
              {/* Main Panel */}
              <div className="lg:col-span-2 space-y-8">
                 {/* Density Chart */}
                 <section className="bg-slate-900 border border-slate-800 rounded-[3rem] p-8 shadow-xl">
                    <div className="flex items-center justify-between mb-8">
                       <div>
                          <h4 className="font-headline font-bold text-xl">Occupancy Trends</h4>
                          <p className="text-xs text-slate-500 uppercase font-bold tracking-widest">Hourly Crowd Density %</p>
                       </div>
                       <div className="flex gap-2">
                          <button className="px-4 py-2 rounded-xl bg-slate-800 text-[10px] font-bold uppercase tracking-widest border border-slate-700 hover:border-primary transition-all">24 Hours</button>
                          <button className="px-4 py-2 rounded-xl bg-primary text-slate-950 text-[10px] font-bold uppercase tracking-widest shadow-lg shadow-primary/20">Live Pulse</button>
                       </div>
                    </div>
                    
                    <div className="h-72 w-full">
                       <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={trendData}>
                             <defs>
                                <linearGradient id="colorDensity" x1="0" y1="0" x2="0" y2="1">
                                   <stop offset="5%" stopColor="#3cd7ff" stopOpacity={0.3}/>
                                   <stop offset="95%" stopColor="#3cd7ff" stopOpacity={0}/>
                                </linearGradient>
                             </defs>
                             <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                             <XAxis dataKey="time" stroke="#64748b" fontSize={10} axisLine={false} tickLine={false} />
                             <YAxis stroke="#64748b" fontSize={10} axisLine={false} tickLine={false} />
                             <Tooltip 
                                contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '12px' }}
                                itemStyle={{ color: '#3cd7ff', fontSize: '12px', fontWeight: 'bold' }}
                             />
                             <Area 
                                type="monotone" 
                                dataKey="density" 
                                stroke="#3cd7ff" 
                                strokeWidth={3}
                                fillOpacity={1} 
                                fill="url(#colorDensity)" 
                             />
                          </AreaChart>
                       </ResponsiveContainer>
                    </div>
                 </section>

                 {/* Simulation Control (Innovative Feature) */}
                 <section className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-8 shadow-xl overflow-hidden relative group">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[100px] pointer-events-none group-hover:bg-primary/10 transition-colors" />
                    <div className="flex items-center justify-between mb-8">
                       <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                             <Zap className="w-6 h-6" />
                          </div>
                          <div>
                             <h4 className="font-headline font-bold text-xl tracking-tight leading-none">Simulation Engine</h4>
                             <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">Stress Test Venue Logic</p>
                          </div>
                       </div>
                       <div className="flex items-center gap-4">
                          <span className={`text-[10px] font-black uppercase tracking-tighter px-3 py-1 rounded-lg border ${simOffset > 0 ? 'bg-orange-500/10 text-orange-500 border-orange-500/30 animate-pulse' : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30'}`}>
                             {simOffset > 0 ? `+${simOffset}% Load` : 'Normal Load'}
                          </span>
                       </div>
                    </div>

                    <div className="space-y-8">
                       <div className="relative pt-6">
                          <div className="flex justify-between text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4">
                            <span>Nominal</span>
                            <span>Peak Capacity Stress</span>
                          </div>
                          <input 
                            type="range" 
                            min="0" 
                            max="60" 
                            value={simOffset}
                            onChange={(e) => setSimOffset(parseInt(e.target.value))}
                            onMouseUp={() => handleSimPulse(simOffset)}
                            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-primary"
                          />
                       </div>
                       <div className="bg-slate-950/50 border border-slate-800/50 rounded-2xl p-4 flex items-center gap-4">
                          <Info className="w-5 h-5 text-primary" />
                          <p className="text-xs text-slate-400 leading-relaxed font-medium">
                            <span className="text-primary font-bold">Heads up:</span> This control artificially inflates zone occupancy percentages across the venue. Fans will instantly see updated heatmaps and receive congestion re-routing advice.
                          </p>
                       </div>
                    </div>
                 </section>
              </div>

              {/* Side Panels */}
              <div className="space-y-8">
                 {/* Broadcast Studio */}
                 <section className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-6 shadow-xl relative overflow-hidden">
                    <div className="relative z-10">
                       <div className="flex items-center gap-3 mb-6">
                          <MessageSquare className="w-5 h-5 text-primary" />
                          <h4 className="font-headline font-bold text-lg">Broadcast Studio</h4>
                       </div>
                       <textarea 
                          value={broadcastMsg}
                          onChange={(e) => setBroadcastMsg(e.target.value)}
                          placeholder="Type global alert message..."
                          className="w-full bg-slate-950 border border-slate-800 p-4 rounded-2xl text-xs font-bold focus:outline-hidden focus:border-primary transition-all resize-none mb-4 h-24"
                       />
                       <button 
                          onClick={handleBroadcast}
                          disabled={isBroadcasting || !broadcastMsg}
                          className="w-full bg-primary text-slate-950 py-3.5 rounded-xl font-bold font-headline flex items-center justify-center gap-2 hover:scale-105 active:scale-95 transition-all shadow-lg shadow-primary/20 disabled:opacity-50 disabled:hover:scale-100"
                       >
                          {isBroadcasting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                          Issue Global Alert
                       </button>
                    </div>
                 </section>

                 {/* Emergency Command */}
                 <section className={`rounded-[2.5rem] p-6 border transition-all shadow-xl ${intel?.emergencyMode ? 'bg-red-500 border-white/20' : 'bg-slate-900 border-slate-800'}`}>
                    <div className="flex items-center gap-3 mb-6">
                       <AlertTriangle className={`w-5 h-5 ${intel?.emergencyMode ? 'text-white' : 'text-red-500'}`} />
                       <h4 className={`font-headline font-bold text-lg ${intel?.emergencyMode ? 'text-white' : ''}`}>Critical Evacuation</h4>
                    </div>
                    <p className={`text-xs mb-6 font-medium leading-relaxed ${intel?.emergencyMode ? 'text-white/80' : 'text-slate-400'}`}>
                       Triggering evacuation will instantly activate emergency routing on all fan devices and notify first responders.
                    </p>
                    <button 
                       onClick={() => toggleEmergency(!intel?.emergencyMode)}
                       className={`w-full py-4 rounded-2xl font-bold font-headline transition-all shadow-xl ${
                         intel?.emergencyMode 
                           ? 'bg-white text-red-500 hover:scale-105' 
                           : 'bg-red-500 text-white shadow-red-500/20 hover:scale-105 active:scale-95'
                       }`}
                    >
                       {intel?.emergencyMode ? 'ABORT EVACUATION' : 'INITIATE EVACUATION'}
                    </button>
                 </section>

                 {/* Incident Feed Preview */}
                 <section className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-6 shadow-xl">
                    <div className="flex items-center justify-between mb-6">
                       <div className="flex items-center gap-3">
                          <AlertTriangle className="w-5 h-5 text-amber-500" />
                          <h4 className="font-headline font-bold text-lg">Live Incidents</h4>
                       </div>
                       <span className="text-[10px] font-bold bg-slate-800 text-slate-400 px-2 py-1 rounded-md">
                          {incidents.length} FEED
                       </span>
                    </div>

                    <div className="space-y-4 max-h-[400px] overflow-y-auto no-scrollbar pr-1">
                       {incidents.length === 0 ? (
                         <div className="text-center py-10 opacity-30">
                            <CheckCircle className="w-10 h-10 mx-auto mb-2" />
                            <p className="text-xs font-bold uppercase tracking-widest">No Active Reports</p>
                         </div>
                       ) : (
                         incidents.map((incident) => (
                           <motion.div 
                              key={incident._id}
                              initial={{ opacity: 0, x: 10 }}
                              animate={{ opacity: 1, x: 0 }}
                              className={`p-4 rounded-2xl border transition-all ${
                                incident.status === 'Open' ? 'bg-red-500/5 border-red-500/20' : 'bg-slate-800/50 border-slate-800'
                              }`}
                           >
                              <div className="flex justify-between items-start mb-2">
                                 <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded ${
                                   incident.status === 'Open' ? 'bg-red-500 text-white' : 'bg-emerald-500 text-white'
                                 }`}>
                                    {incident.status}
                                 </span>
                                 <span className="text-[8px] font-bold text-slate-500 mb-2 uppercase">{new Date(incident.createdAt).toLocaleTimeString()}</span>
                              </div>
                              <p className="text-xs font-bold mb-1">{incident.type}</p>
                              <p className="text-[10px] text-slate-400 leading-tight mb-3">{incident.description}</p>
                              
                              {incident.status === 'Open' && (
                                <button 
                                  onClick={() => resolveIncident(incident._id)}
                                  className="w-full py-2 rounded-xl bg-slate-800 border border-slate-700 text-[10px] font-bold uppercase tracking-widest text-primary hover:bg-primary hover:text-slate-950 transition-all"
                                >
                                   Mark Resolved
                                </button>
                              )}
                           </motion.div>
                         ))
                       )}
                    </div>
                 </section>
              </div>
           </div>
        </div>

        {/* Footer / Status bar */}
        <footer className="h-10 border-t border-slate-800 px-6 flex items-center justify-between text-[8px] font-bold text-slate-500 uppercase tracking-[0.3em] bg-slate-950/80 backdrop-blur-md">
           <div className="flex items-center gap-6">
              <span className="flex items-center gap-2 italic"><div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" /> Uplink Stable</span>
              <span>Encrypted Session</span>
           </div>
           <p>ArenaSync Admin Suite v0.9.4 // Build 2026.04.C2</p>
        </footer>
      </main>
    </div>
  );
};

export default AdminDashboard;
