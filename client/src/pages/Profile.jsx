import React from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Mail, 
  MapPin, 
  Calendar, 
  Shield, 
  Trophy, 
  Zap, 
  Clock, 
  QrCode, 
  ChevronRight, 
  Edit3,
  Award,
  Star,
  Activity,
  MessageSquareCode
} from 'lucide-react';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';
import UserAvatar from '../components/UserAvatar';
import { Link } from 'react-router-dom';

const Profile = () => {
  const { user } = useAuth();

  const stats = [
    { label: 'Venue IQ', value: '94/100', icon: Zap, color: 'text-primary bg-primary/10' },
    { label: 'Stands Visited', value: '12', icon: MapPin, color: 'text-secondary-fixed bg-secondary-fixed/10' },
    { label: 'Avg Arrival', value: '15m Pre-Match', icon: Clock, color: 'text-emerald-500 bg-emerald-500/10' },
    { label: 'Fan Loyalty', value: 'Level 42', icon: Trophy, color: 'text-amber-500 bg-amber-500/10' },
  ];

  const badges = [
    { title: 'Early Bird', description: 'Arrived 1hr early for 5 matches', icon: Award, locked: false },
    { title: 'AI Power User', description: 'Engaged with AI Assistant 50+ times', icon: Star, locked: false },
    { title: 'Safe Path Master', description: 'Used Emergency Mode simulation', icon: Shield, locked: false },
    { title: 'Elite Fan', description: 'Attended 10+ ArenaSync events', icon: Trophy, locked: true },
  ];

  const formatDate = (dateString) => {
    if (!dateString) return 'Joined Apr 2026';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-background text-on-surface flex flex-col lg:flex-row font-body">
      <Sidebar />

      <main className="flex-1 flex flex-col h-svh overflow-hidden">
        {/* Header */}
        <header className="h-16 md:h-20 px-6 lg:px-10 flex items-center justify-between border-b border-outline-variant/10 bg-surface-container-lowest/30 backdrop-blur-md shrink-0">
          <div className="flex items-center gap-4">
             <h2 className="text-xl font-headline font-bold uppercase tracking-tight">Arena Passport</h2>
          </div>
          <Link to="/settings#identity">
            <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-surface-container border border-outline-variant/30 text-xs font-bold font-headline hover:border-primary transition-all">
               <Edit3 className="w-4 h-4" />
               Edit Profile
            </button>
          </Link>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-10 no-scrollbar">
          <div className="max-w-5xl mx-auto space-y-8 pb-10">
            
            {/* Identity Hero */}
            <motion.div 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               className="relative overflow-hidden rounded-[2.5rem] bg-surface-container-high border border-outline-variant/20 p-8 md:p-12 shadow-2xl"
            >
               <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full -mr-48 -mt-48 blur-3xl" />
               <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary-fixed/5 rounded-full -ml-32 -mb-32 blur-3xl" />

               <div className="flex flex-col md:flex-row items-center gap-10 relative z-10">
                  <div className="relative group">
                     <div className="absolute -inset-1.5 bg-linear-to-tr from-primary to-cyan-400 rounded-[2.2rem] blur opacity-30 group-hover:opacity-50 transition-all duration-500" />
                     <UserAvatar 
                        src={user?.avatar} 
                        name={user?.name} 
                        className="w-32 h-32 md:w-40 md:h-40 rounded-4xl border-4 border-surface-container shadow-2xl relative z-10" 
                     />
                     <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white shadow-lg border-4 border-surface-container-high">
                        <Trophy className="w-5 h-5" />
                     </div>
                  </div>

                  <div className="flex-1 text-center md:text-left">
                     <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
                        <h1 className="text-3xl md:text-5xl font-bold font-headline tracking-tighter">{user?.name || "Marcus R."}</h1>
                        <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest border border-primary/20">
                           {user?.role === 'admin' ? 'Arena Manager' : 'Platinum Fan'}
                        </span>
                     </div>
                     <div className="flex flex-col md:flex-row items-center gap-4 text-on-surface-variant font-medium">
                        <div className="flex items-center gap-2">
                           <Mail className="w-4 h-4 text-primary" />
                           {user?.email}
                        </div>
                        <div className="flex items-center gap-2">
                           <Calendar className="w-4 h-4 text-primary" />
                           {formatDate(user?.createdAt)}
                        </div>
                     </div>
                     
                     <div className="mt-8 flex flex-wrap justify-center md:justify-start gap-4">
                        <div className="px-5 py-2.5 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 flex items-center gap-3 shadow-sm transition-all hover:shadow-md hover:border-primary/30">
                           <User className="w-5 h-5 text-secondary-fixed" />
                           <div>
                              <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest leading-none">Security UID</p>
                              <p className="text-xs font-bold font-headline mt-1">AS-{user?.id?.slice(-8).toUpperCase() || "88219433"}</p>
                           </div>
                        </div>
                        <div className="px-5 py-2.5 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 flex items-center gap-3 shadow-sm transition-all hover:shadow-md hover:border-primary/30">
                           <Shield className="w-5 h-5 text-emerald-500" />
                           <div>
                              <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest leading-none">Global Status</p>
                              <p className="text-xs font-bold font-headline mt-1">TRUSTED VISITOR</p>
                           </div>
                        </div>
                     </div>
                  </div>

                  <div className="bg-surface-container-highest/50 backdrop-blur-xl p-6 rounded-4xl border border-outline-variant/30 flex flex-col items-center justify-center shrink-0 shadow-inner group cursor-pointer hover:border-primary/50 transition-all">
                     <div className="w-32 h-32 bg-white rounded-2xl p-3 shadow-xl flex items-center justify-center group-hover:scale-105 transition-transform duration-500">
                        <QrCode className="w-full h-full text-slate-900" />
                     </div>
                     <span className="text-[10px] font-bold text-on-surface-variant tracking-widest uppercase mt-4 group-hover:text-primary transition-colors">Digital Entry Pass</span>
                  </div>
               </div>
            </motion.div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
               {stats.map((stat, i) => (
                  <motion.div
                     key={i}
                     initial={{ opacity: 0, y: 10 }}
                     animate={{ opacity: 1, y: 0 }}
                     transition={{ delay: i * 0.1 }}
                     className="glass-card p-6 rounded-3xl border border-outline-variant/20 shadow-sm hover:shadow-md transition-all group"
                  >
                     <div className={`w-12 h-12 rounded-2xl ${stat.color} flex items-center justify-center mb-4 transition-transform group-hover:scale-110`}>
                        <stat.icon className="w-6 h-6" />
                     </div>
                     <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">{stat.label}</p>
                     <p className="text-2xl font-black font-headline mt-1 tracking-tight">{stat.value}</p>
                  </motion.div>
               ))}
            </div>

            {/* Achievement Gallery & Activity */}
            <div className="grid lg:grid-cols-12 gap-8">
               <div className="lg:col-span-8">
                  <div className="flex items-center justify-between mb-6">
                     <div className="flex items-center gap-3">
                        <div className="w-1.5 h-6 bg-primary rounded-full" />
                        <h3 className="text-xl font-headline font-bold uppercase tracking-tight">Arena Milestones</h3>
                     </div>
                     <div className="text-[10px] font-bold text-primary font-headline cursor-pointer hover:underline uppercase tracking-widest">
                        View Hall of Fame
                     </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                     {badges.map((badge, i) => (
                        <div 
                           key={i}
                           className={`p-5 rounded-3xl border transition-all flex items-start gap-4 ${
                              badge.locked 
                              ? 'bg-surface-container opacity-50 grayscale border-outline-variant/30' 
                              : 'bg-surface-container-high border-outline-variant/40 hover:border-primary/30 hover:shadow-lg'
                           }`}
                        >
                           <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${
                              badge.locked ? 'bg-outline-variant text-on-surface-variant' : 'bg-primary/20 text-primary shadow-inner shadow-primary/20'
                           }`}>
                              <badge.icon className="w-7 h-7" />
                           </div>
                           <div className="flex-1">
                              <div className="flex items-center justify-between">
                                 <h4 className="font-bold font-headline">{badge.title}</h4>
                                 {badge.locked && <Clock className="w-3 h-3" />}
                              </div>
                              <p className="text-xs text-on-surface-variant mt-1 font-medium">{badge.description}</p>
                              {!badge.locked && (
                                 <div className="mt-3 w-full h-1 bg-surface-container-lowest rounded-full overflow-hidden">
                                    <div className="w-full h-full bg-primary" />
                                 </div>
                              )}
                           </div>
                        </div>
                     ))}
                  </div>
               </div>

               <div className="lg:col-span-4">
                  <div className="flex items-center gap-3 mb-6">
                     <div className="w-1.5 h-6 bg-secondary-fixed rounded-full" />
                     <h3 className="text-xl font-headline font-bold uppercase tracking-tight">Activity Stream</h3>
                  </div>

                  <div className="glass-card rounded-4xl border border-outline-variant/20 p-6 space-y-6">
                     {[
                        { title: 'Entered via Gate B', time: '2h ago', icon: Activity },
                        { title: 'Queried AI Assistant', time: '4h ago', icon: MessageSquareCode },
                        { title: 'Ticket Verified', time: '6h ago', icon: Shield },
                     ].map((item, i) => (
                        <div key={i} className="flex gap-4 relative">
                           {i !== 2 && <div className="absolute left-[13px] top-8 w-px h-10 bg-outline-variant/30" />}
                           <div className="w-7 h-7 rounded-full bg-surface-container-highest border border-outline-variant/30 flex items-center justify-center shrink-0 relative z-10">
                              <item.icon className="w-3.5 h-3.5 text-primary" />
                           </div>
                           <div>
                              <p className="text-sm font-bold leading-none">{item.title}</p>
                              <p className="text-[10px] text-on-surface-variant mt-1 uppercase font-bold tracking-widest">{item.time}</p>
                           </div>
                        </div>
                     ))}
                     <button className="w-full py-3 rounded-2xl bg-surface-container text-[10px] font-bold uppercase tracking-widest hover:bg-surface-container-highest transition-colors flex items-center justify-center gap-2">
                        View Full History
                        <ChevronRight className="w-3 h-3" />
                     </button>
                  </div>
               </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;
