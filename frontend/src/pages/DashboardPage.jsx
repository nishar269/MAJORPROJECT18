import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, MapPin, Bell, Activity, Users, 
  Fingerprint, ChevronRight, Settings, Zap, Target
} from 'lucide-react';
import { Link } from 'react-router-dom';
import useStore from '../store/useStore';
import { touristAPI, alertsAPI, statusAPI } from '../services/api';

const severityStyles = {
  critical: 'border-danger-500/30 bg-danger-500/5 text-danger-400',
  warning: 'border-warning-500/30 bg-warning-500/5 text-warning-400',
  info: 'border-primary-500/30 bg-primary-500/5 text-primary-400',
  success: 'border-success-500/30 bg-success-500/5 text-success-400',
};

const fadeUp = { 
  initial: { opacity: 0, y: 30 }, 
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
};

export default function DashboardPage() {
  const user = useStore((s) => s.user);
  const [stats, setStats] = useState([
    { label: 'Active Personnel', value: '0', icon: Users, color: 'from-primary-500 to-primary-600', shadow: 'shadow-glow-blue' },
    { label: 'Live Alerts', value: '0', icon: Bell, color: 'from-warning-400 to-warning-500', shadow: 'shadow-glow-yellow' },
    { label: 'Safe Sectors', value: '0', icon: MapPin, color: 'from-success-400 to-success-500', shadow: 'shadow-glow-green' },
    { label: 'AI Detections', value: '0', icon: Activity, color: 'from-accent-500 to-accent-600', shadow: 'shadow-glow-red' },
  ]);
  const [recentAlerts, setRecentAlerts] = useState([]);
  const [systemStatus, setSystemStatus] = useState([
    { label: 'Neural Mesh', status: 'Offline', ok: false },
    { label: 'Sentinel AI', status: 'Offline', ok: false },
    { label: 'Data Relay', status: 'Offline', ok: false },
    { label: 'Chain Identity', status: 'Offline', ok: false },
  ]);
  const { setAlerts } = useStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [tourists, alerts, status] = await Promise.all([
          touristAPI.getAll().catch(() => []),
          alertsAPI.getAll().catch(() => []),
          statusAPI.getStatus().catch(() => null),
        ]);

        setAlerts(alerts);
        setStats([
          { label: 'Active Personnel', value: tourists.length.toString(), icon: Users, color: 'from-primary-500 to-primary-600', shadow: 'shadow-glow-blue' },
          { label: 'Live Alerts', value: alerts.filter(a => a.severity === 'critical').length.toString(), icon: Bell, color: 'from-warning-400 to-warning-500', shadow: 'shadow-glow-yellow' },
          { label: 'Safe Sectors', value: '12', icon: MapPin, color: 'from-success-400 to-success-500', shadow: 'shadow-glow-green' },
          { label: 'AI Detections', value: alerts.filter(a => a.message.includes('AI')).length.toString(), icon: Activity, color: 'from-accent-500 to-accent-600', shadow: 'shadow-glow-red' },
        ]);

        setRecentAlerts(alerts.slice(0, 5));

        if (status) {
          setSystemStatus([
            { label: 'Neural Mesh', status: 'Operational', ok: true },
            { label: 'Sentinel AI', status: 'Tracking', ok: true },
            { label: 'Data Relay', status: 'Encrypted', ok: true },
            { label: 'Chain Identity', status: 'Validated', ok: true },
          ]);
        }
      } catch (err) {
        console.error('Fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();

    // Real-time Update Signal
    import('../services/socket').then(({ onNewAlert, onLocationUpdated }) => {
       const u1 = onNewAlert(() => fetchDashboardData());
       const u2 = onLocationUpdated(() => fetchDashboardData());
       return () => { u1(); u2(); };
    });

    const interval = setInterval(fetchDashboardData, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-10 pb-12">
      {/* Dynamic Header */}
      <motion.div {...fadeUp} className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-3">
             <span className="px-3 py-1 rounded-full bg-primary-500/10 border border-primary-500/20 text-[10px] font-black text-primary-400 uppercase tracking-widest">
               System Online
             </span>
             <span className="w-1.5 h-1.5 rounded-full bg-success-500 animate-pulse shadow-glow-green" />
          </div>
          <h1 className="text-5xl font-display font-black text-white tracking-tighter leading-none">
            Secure <span className="text-gradient">Horizon.</span>
          </h1>
          <p className="text-dark-400 mt-4 font-medium text-lg max-w-md opacity-70">
            Real-time behavioral telemetry and structural safety analysis.
          </p>
        </div>
        
        <div className="flex items-center gap-4 bg-white/[0.03] p-2 rounded-2xl border border-white/5">
           <div className="px-4 py-2 text-right">
              <p className="text-[10px] font-black text-dark-500 uppercase tracking-widest">Local Node</p>
              <p className="text-sm font-bold text-white">New Delhi, IN</p>
           </div>
           <div className="w-12 h-12 rounded-xl bg-dark-800 flex items-center justify-center border border-white/10 group hover:border-primary-500/50 transition-colors">
              <Target size={20} className="text-primary-400 group-hover:scale-110 transition-transform" />
           </div>
        </div>
      </motion.div>

      {/* Hero Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div 
            key={stat.label} 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 + 0.5 }}
            className="glass-card p-6 relative overflow-hidden group hover:-translate-y-1"
          >
            <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${stat.color} opacity-[0.03] rounded-bl-full group-hover:opacity-[0.08] transition-opacity`} />
            <div className="flex items-start justify-between mb-6">
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center ${stat.shadow} border border-white/10`}>
                <stat.icon size={28} className="text-white" />
              </div>
              <Zap size={16} className="text-dark-600 opacity-20 group-hover:opacity-100 transition-opacity" />
            </div>
            <p className="text-4xl font-display font-black text-white tracking-tighter mb-1">{stat.value}</p>
            <p className="text-xs font-bold text-dark-500 uppercase tracking-widest leading-none">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Analytics Section */}
        <motion.div {...fadeUp} transition={{ delay: 0.8 }} className="lg:col-span-2 space-y-8">
          <div className="glass-card p-8 relative overflow-hidden min-h-[400px]">
            <div className="flex items-center justify-between mb-10">
              <div>
                <h2 className="text-xl font-display font-black text-white tracking-tight">Behavioral Mesh</h2>
                <p className="text-[10px] font-bold text-dark-500 uppercase tracking-[0.2em] mt-1">Anomaly & Alert Vectors</p>
              </div>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-primary-500 shadow-glow-blue" />
                  <span className="text-[10px] font-black text-dark-400 uppercase tracking-widest">Volume</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-accent-500 shadow-glow-red blur-[1px]" />
                  <span className="text-[10px] font-black text-dark-400 uppercase tracking-widest">Risk</span>
                </div>
              </div>
            </div>

            <div className="h-64 w-full relative">
               <svg className="w-full h-full overflow-visible" viewBox="0 0 1000 200" preserveAspectRatio="none">
                 <defs>
                   <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                     <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.2" />
                     <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                   </linearGradient>
                 </defs>
                 <motion.path 
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 2.5, ease: "circOut" }}
                    d="M 0 160 Q 150 140 300 170 T 600 100 T 1000 80" 
                    fill="none" stroke="#3b82f6" strokeWidth="4" strokeLinecap="round" 
                  />
                  <path d="M 0 160 Q 150 140 300 170 T 600 100 T 1000 80 L 1000 200 L 0 200 Z" fill="url(#g1)" />
                  <motion.path 
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 3, delay: 0.5 }}
                    d="M 0 190 Q 250 185 500 175 T 750 140 T 1000 160" 
                    fill="none" stroke="#f43f5e" strokeWidth="2" strokeDasharray="8 8" 
                  />
               </svg>
            </div>

            <div className="flex justify-between mt-8 text-[9px] font-black text-dark-600 uppercase tracking-[0.3em] px-2">
               <span>00:00</span><span>04:00</span><span>08:00</span><span>12:00</span><span>16:00</span><span>20:00</span>
            </div>
          </div>

          {/* Quick Actions Grid (Integrated) */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
             {[
               { icon: Shield, label: 'Panic', link: '/panic', color: 'text-danger-400', bg: 'bg-danger-500/10' },
               { icon: MapPin, label: 'Map', link: '/map', color: 'text-primary-400', bg: 'bg-primary-500/10' },
               { icon: Fingerprint, label: 'ID', link: '/blockchain', color: 'text-success-400', bg: 'bg-success-500/10' },
               { icon: Settings, label: 'Prefs', link: '/settings', color: 'text-dark-300', bg: 'bg-white/5' },
             ].map((action) => (
               <Link key={action.label} to={action.link} className="glass-card p-4 flex flex-col items-center justify-center gap-3 hover:bg-white/5 border-white/5 hover:border-white/10 group transition-all">
                  <div className={`w-12 h-12 rounded-2xl ${action.bg} flex items-center justify-center transition-transform group-hover:scale-110`}>
                     <action.icon size={22} className={action.color} />
                  </div>
                  <span className="text-[10px] font-black text-white uppercase tracking-widest">{action.label}</span>
               </Link>
             ))}
          </div>
        </motion.div>

        {/* Sidebar Data: Alerts & Health */}
        <div className="space-y-8">
          {/* Alerts Panel */}
          <motion.div {...fadeUp} transition={{ delay: 1 }} className="glass-card p-8 border-white/10">
            <div className="flex items-center justify-between mb-8">
               <h3 className="text-xl font-display font-black text-white tracking-tight">Signal Stream</h3>
               <Link to="/alerts" className="text-[9px] font-black text-primary-400 hover:text-white uppercase tracking-widest border-b border-primary-500/20 pb-0.5 transition-all">
                 Archive
               </Link>
            </div>
            
            <div className="space-y-4">
               <AnimatePresence>
                {recentAlerts.map((alert, i) => (
                  <motion.div 
                    key={alert.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className={`p-4 rounded-2xl border ${severityStyles[alert.severity]} transition-all hover:bg-white/[0.02] cursor-pointer`}
                  >
                    <p className="text-xs font-bold leading-relaxed">{alert.message}</p>
                    <div className="flex items-center justify-between mt-3">
                       <span className="text-[9px] font-black uppercase tracking-widest opacity-40">{new Date(alert.time).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</span>
                       <span className="text-[8px] font-black uppercase tracking-[0.2em]">{alert.severity}</span>
                    </div>
                  </motion.div>
                ))}
               </AnimatePresence>
            </div>
          </motion.div>

          {/* System Health Panel */}
          <motion.div {...fadeUp} transition={{ delay: 1.2 }} className="glass-card p-8 border-white/10">
             <h3 className="text-xl font-display font-black text-white tracking-tight mb-8">Nervous System</h3>
             <div className="space-y-6">
                {systemStatus.map((sys) => (
                  <div key={sys.label} className="flex items-center justify-between group">
                    <div className="space-y-1">
                       <p className="text-[10px] font-black text-dark-500 uppercase tracking-widest group-hover:text-dark-300 transition-colors">{sys.label}</p>
                       <p className={`text-xs font-bold ${sys.ok ? 'text-white' : 'text-danger-400'}`}>{sys.status}</p>
                    </div>
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${sys.ok ? 'border-success-500/20 bg-success-500/5 shadow-glow-green' : 'border-danger-500/20 bg-danger-500/5 shadow-glow-red'} transition-all`}>
                       <Shield size={16} className={sys.ok ? 'text-success-400' : 'text-danger-400'} />
                    </div>
                  </div>
                ))}
             </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
