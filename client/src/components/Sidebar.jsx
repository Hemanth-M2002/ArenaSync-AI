import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Map, 
  Clock3, 
  MessageSquareCode, 
  Settings,
  LogOut,
  Sun,
  Moon,
  ChevronLeft,
  Menu,
  X,
  Zap,
  ShieldCheck
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useVenue } from '../context/VenueContext';
import UserAvatar from './UserAvatar';
import LogoutConfirmModal from './LogoutConfirmModal';
import Logo from './Logo';

const Sidebar = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { intel } = useVenue();

  const alertCount = intel?.activeAlerts?.length || 0;
  const isEmergency = intel?.emergencyMode || false;

  const handleLogout = () => {
    setShowLogoutConfirm(false);
    logout();
    navigate('/signin');
  };

  const menuItems = [
    { icon: LayoutDashboard, label: 'Overview', path: '/dashboard' },
    { icon: Map, label: 'Live Map', path: '/map' },
    { icon: Clock3, label: 'Queue Intel', path: '/queues' },
    { icon: MessageSquareCode, label: 'AI Assistant', path: '/assistant' },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ];

  // Add Admin Command Center if user is admin
  if (user?.role === 'admin') {
    menuItems.push({ icon: ShieldCheck, label: 'Command Center', path: '/admin' });
  }

  const sidebarVariants = {
    expanded: { width: '280px' },
    collapsed: { width: '88px' }
  };

  const NavItem = ({ icon: Icon, label, path, active, badge }) => (
    <Link to={path}>
      <motion.div
        whileHover={{ x: collapsed ? 0 : 4 }}
        whileTap={{ scale: 0.98 }}
        className={`flex items-center ${collapsed ? 'justify-center' : 'gap-4 px-4'} py-3.5 rounded-xl transition-all mb-1 cursor-pointer group relative overflow-hidden ${
          active 
            ? 'bg-primary/10 text-primary border border-primary/20 shadow-lg shadow-primary/5' 
            : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-highest transition-colors'
        }`}
      >
        <div className={`p-1 flex items-center justify-center shrink-0 ${active ? 'text-primary' : 'text-on-surface-variant group-hover:text-primary'} ${collapsed ? 'w-10 h-10' : ''}`}>
          <Icon className="w-5 h-5 transition-transform group-hover:scale-110" />
        </div>
        {!collapsed && (
          <motion.span
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="font-headline font-bold text-sm whitespace-nowrap overflow-hidden"
          >
            {label}
          </motion.span>
        )}
        
        {badge > 0 && (
          <div className={`absolute ${collapsed ? 'top-2 right-2' : 'right-4'} flex items-center justify-center min-w-[18px] h-[18px] rounded-full bg-red-500 text-[10px] font-bold text-white px-1 shadow-md ${isEmergency && label === 'Overview' ? 'animate-pulse scale-110' : ''}`}>
            {badge}
          </div>
        )}

        {active && !collapsed && !badge && (
          <motion.div 
            layoutId="active-pill"
            className="ml-auto w-1.5 h-6 bg-primary rounded-full transition-colors"
          />
        )}
      </motion.div>
    </Link>
  );

  return (
    <>
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 w-full h-16 px-6 flex items-center justify-between bg-surface-container border-b border-outline-variant z-40">
        <div className="flex items-center gap-3">
          <Logo className="w-8 h-8" />
          <span className="font-headline font-bold">ArenaSync <span className="text-primary">AI</span></span>
        </div>
        <button onClick={() => setMobileOpen(!mobileOpen)} className="text-on-surface">
          {mobileOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Desktop Sidebar */}
      <motion.aside
        initial={false}
        animate={collapsed ? 'collapsed' : 'expanded'}
        variants={sidebarVariants}
        className="hidden lg:flex flex-col h-[100svh] sticky top-0 bg-surface-container border-r border-outline-variant overflow-x-hidden overflow-y-auto no-scrollbar p-3 z-50 transition-colors"
      >
        {/* Logo Section */}
        <div className={`flex items-center ${collapsed ? 'justify-center' : 'gap-3.5 px-2'} h-14 mb-8 relative`}>
          <Logo className="w-10 h-10 shrink-0 shadow-lg shadow-primary/10" />
          {!collapsed && (
            <motion.span
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-xl font-bold tracking-tighter font-headline whitespace-nowrap text-on-surface"
            >
              ArenaSync <span className="text-primary italic">AI</span>
            </motion.span>
          )}
          
          {/* Refined Toggle Button */}
          <button 
            onClick={() => setCollapsed(!collapsed)}
            className={`absolute ${collapsed ? '-right-1 top-12' : '-right-1 top-4'} w-6 h-6 rounded-full bg-surface-container-highest border border-outline-variant flex items-center justify-center hover:bg-primary hover:text-white transition-all cursor-pointer shadow-md text-on-surface-variant z-10`}
          >
            <ChevronLeft className={`w-4 h-4 transition-transform ${collapsed ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {/* Navigation */}
        <div className="flex-1 space-y-1">
          {menuItems.map((item) => (
            <NavItem 
              key={item.path} 
              badge={item.label === 'Overview' ? alertCount : 0}
              {...item} 
              active={location.pathname === item.path}
            />
          ))}
        </div>

        {/* Bottom Actions */}
        <div className="mt-auto space-y-4 pt-4 border-t border-outline-variant">
          {/* Theme Toggle */}
          <div 
            onClick={toggleTheme}
            className={`flex items-center ${collapsed ? 'justify-center' : 'gap-4 p-2.5 rounded-2xl bg-surface-container-highest/50 backdrop-blur-sm'} cursor-pointer transition-all border border-outline-variant/10 hover:border-primary/30 group relative overflow-hidden`}
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors shadow-sm shrink-0 ${
              isDarkMode ? 'bg-slate-800 text-amber-400' : 'bg-amber-100 text-amber-600'
            }`}>
              {isDarkMode ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </div>
            {!collapsed && (
              <div className="flex flex-col overflow-hidden">
                <span className="text-xs font-bold font-headline whitespace-nowrap">
                  {isDarkMode ? 'Lunar Mode' : 'Solar Mode'}
                </span>
                <span className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider">Tap to Toggle</span>
              </div>
            )}
          </div>

          {/* User Profile */}
          <div className="flex items-center gap-2">
            <Link 
              to="/profile" 
              className={`flex-1 flex items-center ${collapsed ? 'justify-center' : 'gap-4 py-2 px-2'} group overflow-hidden hover:bg-primary/5 rounded-xl transition-all`}
            >
              <UserAvatar 
                src={user?.avatar} 
                name={user?.name} 
                className="w-10 h-10 rounded-xl border-2 border-outline-variant group-hover:border-primary transition-all shrink-0" 
              />
              {!collapsed && (
                <div className="flex flex-col overflow-hidden">
                  <span className="text-sm font-bold font-headline truncate leading-none">{user?.name || "Marcus R."}</span>
                  <span className="text-[10px] text-primary font-bold uppercase tracking-wider mt-1">{user?.role === 'admin' ? 'Arena Manager' : 'Member'}</span>
                </div>
              )}
            </Link>
            {!collapsed && (
              <button 
                onClick={() => setShowLogoutConfirm(true)}
                className="p-2 text-on-surface-variant hover:text-red-400 transition-colors cursor-pointer shrink-0"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        <LogoutConfirmModal 
          isOpen={showLogoutConfirm} 
          onConfirm={handleLogout} 
          onCancel={() => setShowLogoutConfirm(false)} 
        />
      </motion.aside>

      {/* Mobile Drawer Backdrop */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileOpen(false)}
            className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          />
        )}
      </AnimatePresence>

      {/* Mobile Drawer Content */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.aside
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="lg:hidden fixed inset-y-0 left-0 w-3/4 max-w-sm bg-surface-container z-50 p-6 flex flex-col"
          >
            <div className="flex items-center gap-4 mb-10">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-headline font-bold">ArenaSync AI</span>
            </div>

            <div className="flex-1 space-y-2">
              {menuItems.map((item) => (
                <Link 
                  key={item.path} 
                  to={item.path} 
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-4 px-4 py-3.5 rounded-xl ${
                    location.pathname === item.path ? 'bg-primary/10 text-primary font-bold' : 'text-on-surface-variant'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-headline">{item.label}</span>
                </Link>
              ))}
            </div>

            <div className="mt-auto space-y-6">
              <div 
                onClick={() => { toggleTheme(); setMobileOpen(false); }}
                className="flex items-center justify-between p-4 bg-surface-container-highest rounded-2xl"
              >
                <div className="flex items-center gap-3">
                  {isDarkMode ? <Moon className="text-amber-400 w-5 h-5" /> : <Sun className="text-amber-600 w-5 h-5" />}
                  <span className="font-headline font-bold">Theme</span>
                </div>
                <div className={`w-12 h-6 rounded-full p-1 transition-colors ${isDarkMode ? 'bg-primary' : 'bg-slate-300'}`}>
                  <div className={`w-4 h-4 bg-white rounded-full transition-transform ${isDarkMode ? 'translate-x-6' : 'translate-x-0'}`} />
                </div>
              </div>
              
              <div className="flex items-center gap-4 px-2">
                <div className="w-12 h-12 rounded-xl bg-slate-400 overflow-hidden">
                   <img src="/user1.png" alt="Profile" className="w-full h-full object-cover" />
                </div>
                <div>
                  <p className="font-bold font-headline">Marcus R.</p>
                  <p className="text-xs text-primary font-bold uppercase tracking-widest">Platinum Fan</p>
                </div>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;
