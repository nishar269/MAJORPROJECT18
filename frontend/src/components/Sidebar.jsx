import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, MapPin, Bell, Shield, Users, 
  LogOut, Menu, X, Activity, Fingerprint, Settings, AlertCircle
} from 'lucide-react';
import { useState } from 'react';
import useStore from '../store/useStore';

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/map', icon: MapPin, label: 'Map View' },
  { to: '/alerts', icon: Bell, label: 'Alerts' },
  { to: '/panic', icon: Shield, label: 'Panic Button' },
  { icon: Users, to: '/admin', label: 'Police Dashboard' },
  { to: '/anomaly', icon: Activity, label: 'AI Anomaly' },
  { to: '/blockchain', icon: Fingerprint, label: 'Blockchain ID' },
  { to: '/settings', icon: Settings, label: 'Settings' },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const { user, logout, unreadCount, panicActive } = useStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const filteredNav = navItems.filter(item => {
    if (user?.role === 'police') {
      return item.to !== '/panic';
    } else {
      return item.to !== '/admin' && item.to !== '/anomaly';
    }
  });

  return (
    <>
      <button 
        className="fixed top-4 left-4 z-50 md:hidden p-2 rounded-xl glass-card text-dark-300 hover:text-white transition shadow-glow-blue"
        onClick={() => setCollapsed(!collapsed)}
      >
        {collapsed ? <X size={24}/> : <Menu size={24}/>}
      </button>

      <aside className={`
        fixed top-0 left-0 h-full z-40 
        glass-card border-r border-white/5
        transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]
        ${collapsed ? 'w-72 translate-x-0 shadow-2xl' : '-translate-x-full w-72'}
        md:translate-x-0 md:w-72
        flex flex-col
        ${panicActive ? 'border-r-danger-500/50 shadow-glow-red' : ''}
      `}>
        {/* Brand */}
        <div className={`p-8 border-b border-white/5 transition-all duration-500 ${panicActive ? 'bg-danger-500/5' : ''}`}>
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 ${
              panicActive ? 'bg-danger-500 animate-pulse shadow-glow-red' : 'bg-gradient-to-br from-primary-500 to-primary-600 shadow-glow-blue'
            }`}>
              <Shield size={24} className="text-white" />
            </div>
            <div>
              <h1 className={`text-xl font-display font-black tracking-tight transition-colors ${panicActive ? 'text-danger-400' : 'text-white'}`}>
                TourSafe
              </h1>
              <p className="text-[10px] text-dark-400 font-bold tracking-[0.2em] uppercase opacity-60">
                {user?.role || 'Guest'} Protocol
              </p>
            </div>
          </div>
        </div>

        {/* Emergency Alert */}
        <AnimatePresence>
          {panicActive && (
            <motion.div 
              initial={{ opacity: 0, height: 0, marginTop: 0 }} 
              animate={{ opacity: 1, height: 'auto', marginTop: 16 }} 
              exit={{ opacity: 0, height: 0, marginTop: 0 }}
              className="px-4 overflow-hidden"
            >
              <div className="bg-danger-500/10 border border-danger-500/20 rounded-2xl p-4 flex items-center gap-4 animate-pulse shadow-glow-red">
                <div className="w-10 h-10 rounded-xl bg-danger-500/20 flex items-center justify-center">
                   <AlertCircle size={20} className="text-danger-400" />
                </div>
                <div>
                   <p className="text-xs font-black text-danger-400 uppercase tracking-wider">Emergency Mode</p>
                   <p className="text-[10px] text-danger-400/70 font-bold">ALL SYSTEMS ARMED</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation */}
        <nav className="flex-1 py-8 px-4 space-y-2 overflow-y-auto custom-scrollbar">
          {filteredNav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setCollapsed(false)}
              className={({ isActive }) =>
                `group flex items-center justify-between px-5 py-4 rounded-2xl text-sm font-semibold transition-all duration-300
                ${isActive 
                  ? 'bg-primary-500/10 text-primary-400 shadow-[inset_0_0_20px_rgba(59,130,246,0.05)] border border-primary-500/10' 
                  : 'text-dark-400 hover:bg-white/5 hover:text-white hover:translate-x-1'
                }`
              }
            >
              <div className="flex items-center gap-4">
                <item.icon size={20} className="group-hover:scale-110 transition-transform duration-300" />
                <span>{item.label}</span>
              </div>
              {item.label === 'Alerts' && unreadCount > 0 && (
                <span className="flex items-center justify-center min-w-[22px] h-[22px] px-1.5 rounded-full bg-primary-500 text-white text-[10px] font-black shadow-glow-blue">
                  {unreadCount}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Footer / User */}
        <div className="p-6 border-t border-white/5 bg-white/[0.02]">
          <div className="flex items-center gap-3 mb-6 px-2">
            <div className="w-10 h-10 rounded-full bg-dark-700 flex items-center justify-center text-sm font-bold text-white border border-white/10">
              {user?.name?.charAt(0) || 'U'}
            </div>
            <div className="flex-1 min-w-0">
               <p className="text-sm font-bold text-white truncate">{user?.name || 'User'}</p>
               <p className="text-[10px] text-dark-500 font-medium truncate uppercase">{user?.role}</p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-4 px-5 py-4 rounded-2xl text-sm font-bold text-dark-400 hover:text-danger-400 hover:bg-danger-500/10 transition-all w-full border border-transparent hover:border-danger-500/20"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}
