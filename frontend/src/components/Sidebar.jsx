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
        bg-black/95 backdrop-blur-2xl
        border-r border-white/5
        transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]
        ${collapsed ? 'w-80 translate-x-0 shadow-[20px_0_50px_rgba(0,0,0,0.8)]' : '-translate-x-full w-80'}
        md:translate-x-0 md:w-80
        flex flex-col
        ${panicActive ? 'border-r-danger-500/30' : ''}
      `}>
        {/* Decorative Top Accent */}
        <div className={`h-1 w-full ${panicActive ? 'bg-danger-500 shadow-glow-red' : 'bg-primary-500 shadow-glow-blue'} opacity-20`} />

        {/* Brand */}
        <div className={`p-10 transition-all duration-500 ${panicActive ? 'bg-danger-500/5' : ''}`}>
          <div className="flex items-center gap-5">
            <div className={`w-14 h-14 rounded-[2rem] flex items-center justify-center transition-all duration-700 ${
              panicActive ? 'bg-danger-500 animate-pulse scale-110 shadow-glow-red' : 'bg-gradient-to-br from-primary-400 to-primary-600 shadow-glow-blue rotate-3 hover:rotate-0'
            }`}>
              <Shield size={28} className="text-white" />
            </div>
            <div>
              <h1 className={`text-2xl font-display font-black tracking-tighter transition-colors ${panicActive ? 'text-danger-400' : 'text-white'}`}>
                TourSafe<span className="text-primary-500">.</span>
              </h1>
              <p className="text-[9px] text-dark-400 font-extrabold tracking-[0.3em] uppercase opacity-40 mt-1">
                Security Core
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto custom-scrollbar pt-2">
          {filteredNav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setCollapsed(false)}
              className={({ isActive }) =>
                `group flex items-center justify-between px-6 py-4.5 rounded-[1.5rem] text-sm font-bold transition-all duration-500 relative overflow-hidden
                ${isActive 
                  ? 'bg-white/5 text-white shadow-xl border border-white/10' 
                  : 'text-dark-500 hover:bg-white/[0.03] hover:text-white'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div className="flex items-center gap-4 relative z-10">
                    <item.icon size={22} className={`transition-all duration-500 ${
                        isActive ? 'text-primary-400 scale-110' : 'group-hover:text-primary-400 group-hover:scale-110'
                    }`} />
                    <span className={`tracking-tight ${isActive ? 'translate-x-1' : 'group-hover:translate-x-1'} transition-transform duration-500`}>
                      {item.label}
                    </span>
                  </div>
                  
                  {isActive && (
                    <motion.div layoutId="activeNav" className={`absolute inset-0 bg-gradient-to-r ${panicActive ? 'from-danger-500/10' : 'from-primary-500/10'} to-transparent opacity-100`} />
                  )}

                  {item.label === 'Alerts' && unreadCount > 0 && (
                    <span className="relative z-10 flex items-center justify-center min-w-[24px] h-[24px] px-2 rounded-lg bg-primary-500 text-white text-[10px] font-black shadow-glow-blue">
                      {unreadCount}
                    </span>
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Footer / User Profile */}
        <div className="p-8 border-t border-white/5 bg-black/20">
          <div className="flex items-center gap-4 mb-8 group cursor-pointer">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-dark-700 to-dark-800 flex items-center justify-center text-lg font-black text-white border border-white/10 shadow-xl group-hover:border-primary-500/50 transition-all duration-500">
              {user?.name?.charAt(0) || 'U'}
            </div>
            <div className="flex-1 min-w-0">
               <p className="text-sm font-black text-white tracking-tight truncate group-hover:text-primary-400 transition-colors">{user?.name || 'User'}</p>
               <p className="text-[10px] text-dark-500 font-extrabold truncate uppercase tracking-widest mt-0.5">{user?.role} Node</p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-4 px-6 py-5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-dark-500 hover:text-danger-400 hover:bg-danger-500/5 transition-all w-full border border-white/5 hover:border-danger-500/20 active:scale-95"
          >
            <LogOut size={18} />
            Logout Session
          </button>
        </div>
      </aside>
    </>
  );
}
