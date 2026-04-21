import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Settings as SettingsIcon, 
  User, 
  MapPin, 
  Bell, 
  Shield, 
  Monitor, 
  Globe, 
  LogOut, 
  ChevronRight, 
  Check, 
  Save, 
  ArrowRight,
  Sparkles,
  Info
} from 'lucide-react';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

const Settings = () => {
  const { user, updateProfile, activeContext, setActiveContext, logout } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    notifications: user?.preferences?.notifications ?? true,
    language: user?.preferences?.language || 'en',
    selectedSport: user?.preferences?.selectedSport || 'Cricket',
    selectedVenue: user?.preferences?.selectedVenue || 'Narendra Modi Stadium'
  });

  const handleToggle = (key) => {
    setFormData(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    const { name, email, ...preferences } = formData;
    const result = await updateProfile({ name, email, preferences });
    
    if (result.success) {
      // Synchronize changes with active session context if venue/sport changed
      if (activeContext) {
        setActiveContext({
          ...activeContext,
          venue: formData.selectedVenue,
          sport: formData.selectedSport
        });
      }
      
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }
    setIsSaving(false);
  };

  const SettingSection = ({ title, icon: Icon, children, id }) => (
    <section id={id} className="bg-surface-container-high rounded-[2rem] border border-outline-variant/20 overflow-hidden shadow-xl scroll-mt-24">
      <div className="p-6 border-b border-outline-variant/10 flex items-center gap-3">
         <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
            <Icon className="w-4 h-4" />
         </div>
         <h3 className="font-headline font-bold uppercase tracking-tight">{title}</h3>
      </div>
      <div className="p-6 space-y-6">
        {children}
      </div>
    </section>
  );

  const SettingRow = ({ label, description, action }) => (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <p className="text-sm font-bold">{label}</p>
        <p className="text-xs text-on-surface-variant font-medium mt-1">{description}</p>
      </div>
      <div className="shrink-0">
        {action}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background text-on-surface flex flex-col lg:flex-row font-body">
      <Sidebar />

      <main className="flex-1 flex flex-col h-[100svh] overflow-hidden">
        {/* Header */}
        <header className="h-16 md:h-20 px-6 lg:px-10 flex items-center justify-between border-b border-outline-variant/10 bg-surface-container-lowest/30 backdrop-blur-md shrink-0">
          <div className="flex items-center gap-4">
             <SettingsIcon className="w-5 h-5 text-primary" />
             <h2 className="text-xl font-headline font-bold uppercase tracking-tight">System Settings</h2>
          </div>
          <button 
             onClick={handleSave}
             disabled={isSaving}
             className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold font-headline transition-all ${
               saveSuccess 
                 ? 'bg-emerald-500 text-white' 
                 : 'bg-primary text-on-primary shadow-lg shadow-primary/20 hover:scale-105 active:scale-95'
             }`}
          >
             {isSaving ? <Sparkles className="w-4 h-4 animate-spin" /> : saveSuccess ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
             {isSaving ? 'Synchronizing...' : saveSuccess ? 'Preferences Saved' : 'Save Changes'}
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-10 no-scrollbar">
          <div className="max-w-4xl mx-auto space-y-8 pb-20">
            
            {/* Quick Profile Link */}
            <Link to="/profile" className="block group">
               <motion.div 
                 whileHover={{ y: -4 }}
                 className="p-6 rounded-3xl bg-primary/10 border border-primary/20 flex items-center justify-between hover:bg-primary tracking-tight transition-all duration-300"
               >
                  <div className="flex items-center gap-4">
                     <div className="w-14 h-14 rounded-2xl bg-surface-container flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                        <User className="w-6 h-6" />
                     </div>
                     <div>
                        <h4 className="text-lg font-bold font-headline group-hover:text-on-primary transition-colors">Personalize Your Profile</h4>
                        <p className="text-xs text-on-surface-variant group-hover:text-on-primary/70 transition-colors">Edit your avatar, Arena ID, and view your personal achievements.</p>
                     </div>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                     <ArrowRight className="w-5 h-5 text-on-primary" />
                  </div>
               </motion.div>
            </Link>

            <div className="grid gap-8 lg:grid-cols-2">
               {/* Account Identity */}
               <SettingSection id="identity" title="Account Identity" icon={User}>
                  <div className="space-y-4">
                     <div>
                        <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest ml-1">Full Name</label>
                        <input 
                           type="text" 
                           value={formData.name}
                           onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                           className="w-full mt-1.5 bg-surface-container py-3 px-4 rounded-xl border border-outline-variant/30 text-sm font-headline focus:outline-hidden focus:border-primary transition-all"
                           placeholder="Enter your name"
                        />
                     </div>
                     <div>
                        <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest ml-1">Email Address</label>
                        <input 
                           type="email" 
                           value={formData.email}
                           onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                           className="w-full mt-1.5 bg-surface-container py-3 px-4 rounded-xl border border-outline-variant/30 text-sm font-headline focus:outline-hidden focus:border-primary transition-all"
                           placeholder="Enter your email"
                        />
                     </div>
                  </div>
               </SettingSection>

               {/* Arena Context */}
               <SettingSection id="arena" title="Arena Orientation" icon={MapPin}>
                  <SettingRow 
                     label="Preferred Sport" 
                     description="Updates the dashboard theme and stadium intel."
                     action={
                        <select 
                           value={formData.selectedSport}
                           onChange={(e) => setFormData(prev => ({ ...prev, selectedSport: e.target.value }))}
                           className="bg-surface-container py-2 px-4 rounded-xl border border-outline-variant/30 text-xs font-bold focus:outline-hidden focus:border-primary"
                        >
                           <option>Cricket</option>
                           <option>Soccer</option>
                           <option>Basketball</option>
                           <option>Concert</option>
                        </select>
                     }
                  />
                  <div className="h-px bg-outline-variant/10" />
                  <SettingRow 
                     label="Home Venue" 
                     description="Your default stadium for real-time map data."
                     action={
                        <select 
                           value={formData.selectedVenue}
                           onChange={(e) => setFormData(prev => ({ ...prev, selectedVenue: e.target.value }))}
                           className="bg-surface-container py-2 px-4 rounded-xl border border-outline-variant/30 text-xs font-bold focus:outline-hidden focus:border-primary"
                        >
                           <option>Narendra Modi Stadium</option>
                           <option>Eden Gardens</option>
                           <option>Wankhede Stadium</option>
                           <option>M. Chinnaswamy Stadium</option>
                        </select>
                     }
                  />
               </SettingSection>

               {/* App Preferences */}
               <SettingSection title="App Experience" icon={Monitor}>
                  <SettingRow 
                     label="Display Mode" 
                     description="Choose between Solar and Lunar themes."
                     action={
                        <button 
                           onClick={toggleTheme}
                           className="flex items-center gap-2 p-1 rounded-xl bg-surface-container border border-outline-variant/20"
                        >
                           <span className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${!isDarkMode ? 'bg-primary text-on-primary' : 'text-on-surface-variant'}`}>Solar</span>
                           <span className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${isDarkMode ? 'bg-primary text-on-primary' : 'text-on-surface-variant'}`}>Lunar</span>
                        </button>
                     }
                  />
                  <div className="h-px bg-outline-variant/10" />
                  <SettingRow 
                     label="Language" 
                     description="Choose your preferred interface language."
                     action={
                        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-surface-container text-xs font-bold border border-outline-variant/30">
                           <Globe className="w-4 h-4 text-primary" />
                           English (IN)
                        </div>
                     }
                  />
               </SettingSection>

               {/* Notifications */}
               <SettingSection title="Notification Intelligence" icon={Bell}>
                  <SettingRow 
                     label="Real-time Alerts" 
                     description="Get entry congestion and emergency broadcast updates."
                     action={
                        <button 
                           onClick={() => handleToggle('notifications')}
                           className={`w-12 h-6 rounded-full p-1 transition-all flex items-center ${formData.notifications ? 'bg-primary justify-end' : 'bg-surface-container justify-start'}`}
                        >
                           <div className="w-4 h-4 bg-white rounded-full shadow-md" />
                        </button>
                     }
                  />
               </SettingSection>

               {/* Security */}
               <SettingSection title="Security & Integrity" icon={Shield}>
                  <button className="w-full p-4 rounded-2xl bg-surface-container hover:bg-surface-container-highest flex items-center justify-between group transition-all">
                     <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                           <Sparkles className="w-4 h-4" />
                        </div>
                        <span className="text-sm font-bold">Privacy Center</span>
                     </div>
                     <ChevronRight className="w-4 h-4 text-on-surface-variant group-hover:translate-x-1 transition-transform" />
                  </button>
                  <button className="w-full p-4 rounded-2xl bg-red-500/5 hover:bg-red-500/10 flex items-center justify-between group transition-all text-red-500 border border-red-500/10">
                     <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-red-500/10 text-red-500 flex items-center justify-center">
                           <LogOut className="w-4 h-4" />
                        </div>
                        <span className="text-sm font-bold">Terminate Session</span>
                     </div>
                     <ChevronRight className="w-4 h-4 text-red-500/50 group-hover:translate-x-1 transition-transform" />
                  </button>
               </SettingSection>
            </div>

            {/* Support Info */}
            <div className="flex flex-col items-center gap-4 py-10 opacity-40">
               <div className="flex items-center gap-2">
                  <Info className="w-4 h-4" />
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Build v0.8.2-Hackathon</span>
               </div>
               <p className="text-[10px] text-center max-w-sm tracking-wide">
                  ArenaSync uses Google Gemini to provide intelligent venue insights. 
                  All location data is encrypted and used solely for navigation assistance.
               </p>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
};

export default Settings;
