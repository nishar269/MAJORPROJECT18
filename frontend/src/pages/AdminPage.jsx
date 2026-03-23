import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, Users, Search, AlertCircle, MapPin, Eye, 
  ExternalLink, RefreshCw, Activity, Terminal, Zap,
  ChevronRight, ArrowRight, CheckCircle, Navigation
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { touristAPI, emergencyAPI } from '../services/api';

const slideIn = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
};

export default function AdminPage() {
  const [activeTourists, setActiveTourists] = useState([]);
  const [incidents, setIncidents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [tourists, activeIncidents] = await Promise.all([
        touristAPI.getAll().catch(() => []),
        emergencyAPI.getIncidents().catch(() => []),
      ]);
      setActiveTourists(tourists);
      setIncidents(activeIncidents);
    } catch (err) {
      console.error('Admin data fetch failed:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, []);

  const filteredTourists = activeTourists.filter(t => 
    t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.userId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-10 pb-12 font-body">
      {/* Strategic Command Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <motion.div {...slideIn}>
          <div className="flex items-center gap-3 mb-4">
             <div className="w-10 h-10 rounded-2xl bg-danger-500/10 border border-danger-500/20 flex items-center justify-center">
                <Shield size={20} className="text-danger-400" />
             </div>
             <span className="px-3 py-1 rounded-full bg-dark-800 border border-white/5 text-[10px] font-black text-dark-400 uppercase tracking-[0.2em]">
               Operational Authority
             </span>
          </div>
          <h1 className="text-5xl font-display font-black text-white tracking-tighter leading-none">
            Police <span className="text-gradient">Command.</span>
          </h1>
          <p className="text-dark-400 mt-4 font-medium text-lg max-w-md opacity-70">
            Real-time incident dispatching and strategic personnel tracking.
          </p>
        </motion.div>

        <div className="flex items-center gap-4">
           <button 
             onClick={fetchData} 
             className="px-6 py-3 rounded-2xl bg-dark-800 hover:bg-dark-700 border border-white/5 text-dark-300 hover:text-white transition-all flex items-center gap-3 text-xs font-black uppercase tracking-widest shadow-xl group"
           >
              <RefreshCw size={16} className={`${loading ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'}`} />
              Telemetry Sync
           </button>
           <Link to="/map" className="w-12 h-12 rounded-2xl bg-primary-600 flex items-center justify-center text-white shadow-glow-blue border border-white/10 hover:scale-105 active:scale-95 transition-all">
              <Navigation size={20} />
           </Link>
        </div>
      </div>

      {/* Grid for Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Tracking Node', value: activeTourists.length, sub: 'Active Personnel', icon: Users, color: 'from-primary-500 to-primary-600', shadow: 'shadow-glow-blue' },
          { label: 'Risk Vectors', value: activeTourists.filter(t => t.status === 'warning').length, sub: 'Requires Oversight', icon: AlertCircle, color: 'from-warning-400 to-warning-500', shadow: 'shadow-glow-yellow' },
          { label: 'Emergencies', value: incidents.filter(i => i.status === 'active').length, sub: 'Field Dispatch Active', icon: Shield, color: 'from-danger-500 to-danger-600', shadow: 'shadow-glow-red' },
        ].map((stat, i) => (
          <motion.div 
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 + 0.3 }}
            className={`glass-card p-6 border-l-4 ${stat.shadow} border-l-current transition-all hover:-translate-y-1`}
            style={{ borderColor: stat.shadow.includes('blue') ? '#3b82f6' : stat.shadow.includes('yellow') ? '#fbbf24' : '#f43f5e' }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg`}>
                <stat.icon size={22} className="text-white" />
              </div>
              <span className="text-[10px] font-black text-dark-500 uppercase tracking-widest">{stat.label}</span>
            </div>
            <p className="text-4xl font-display font-black text-white tracking-tighter mb-1">{stat.value}</p>
            <p className="text-[10px] font-bold text-dark-500 uppercase tracking-widest leading-none opacity-60">{stat.sub}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
        {/* Active Incidents Table */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 }} className="glass-card overflow-hidden">
          <div className="p-8 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
            <div>
              <h2 className="text-xl font-display font-black text-white tracking-tight flex items-center gap-3">
                <Activity size={20} className="text-danger-400" /> Incident Stream
              </h2>
              <p className="text-[10px] font-bold text-dark-500 uppercase tracking-widest mt-1">Real-time Emergency Dispatch Path</p>
            </div>
            <div className="flex items-center gap-2">
               <span className="w-2 h-2 rounded-full bg-danger-500 animate-pulse shadow-glow-red" />
               <span className="text-[10px] font-black text-danger-400 uppercase tracking-[0.2em]">{incidents.length} Active</span>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-dark-900/40 text-[10px] font-black text-dark-500 uppercase tracking-[0.2em]">
                <tr>
                  <th className="px-8 py-4">Designation</th>
                  <th className="px-8 py-4">Status</th>
                  <th className="px-8 py-4 text-right">Telemetry</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {incidents.length > 0 ? incidents.map((inc) => (
                  <tr key={inc.id} className="hover:bg-white/[0.02] transition-colors cursor-pointer group">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                         <div className="w-10 h-10 rounded-xl bg-danger-500/10 flex items-center justify-center border border-danger-500/20 group-hover:scale-110 transition-transform">
                            <Zap size={18} className="text-danger-400" />
                         </div>
                         <div>
                            <p className="font-bold text-white text-base">{inc.userName}</p>
                            <p className="text-[10px] font-black text-dark-500 uppercase tracking-widest mt-0.5">{inc.type}</p>
                         </div>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-dark-400">
                      <div className="flex items-center gap-2">
                         <span className="w-1.5 h-1.5 rounded-full bg-warning-400 animate-pulse" />
                         <span className="text-xs font-black text-warning-400 uppercase tracking-widest">{inc.status}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                       <p className="text-[10px] font-black text-white uppercase tracking-widest leading-none">{new Date(inc.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                       <p className="text-[10px] text-dark-500 font-bold uppercase tracking-tighter mt-1">{inc.lat.toFixed(3)}, {inc.lng.toFixed(3)}</p>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="5" className="px-8 py-20 text-center">
                       <Terminal size={40} className="mx-auto text-dark-800 mb-4" />
                       <p className="text-[10px] font-black text-dark-500 uppercase tracking-[0.3em]">Incidents Clear — No Active Dispatch</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="p-6 bg-white/[0.01] border-t border-white/5">
             <button className="w-full py-3 rounded-xl bg-dark-900 border border-white/5 text-[10px] font-black text-dark-400 uppercase tracking-widest hover:text-white transition-colors">
                Archived Reports
             </button>
          </div>
        </motion.div>

        {/* Personnel Directory */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.8 }} className="flex flex-col gap-6">
           {/* Directory Search */}
           <div className="glass-card p-8 border-white/10 bg-white/[0.02]">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-display font-black text-white tracking-tight flex items-center gap-3">
                  <Terminal size={20} className="text-primary-400" /> Personnel Log
                </h2>
                <div className="flex -space-x-3">
                   {activeTourists.slice(0, 4).map((t, i) => (
                      <div key={i} className="w-8 h-8 rounded-full border-2 border-dark-950 bg-dark-800 flex items-center justify-center text-[10px] font-black text-white">
                         {t.name.charAt(0)}
                      </div>
                   ))}
                   <div className="w-8 h-8 rounded-full border-2 border-dark-950 bg-primary-600 flex items-center justify-center text-[10px] font-black text-white">
                      +{activeTourists.length}
                   </div>
                </div>
              </div>
              
              <div className="relative">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-dark-500" size={18} />
                <input 
                  type="text" 
                  placeholder="FILTER BY DESIGNATION OR ID_CODE..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-14 pr-6 py-5 rounded-2xl text-[10px] font-black text-white tracking-[0.2em] focus:shadow-glow-blue border border-white/5 bg-dark-950/40"
                />
              </div>
           </div>

           {/* Directory List */}
           <div className="glass-card overflow-hidden flex-1 max-h-[500px] flex flex-col">
              <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-2">
                <AnimatePresence>
                  {filteredTourists.map((tourist, i) => (
                    <motion.div 
                      key={tourist.id} 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-between group hover:border-primary-500/30 transition-all cursor-pointer"
                    >
                      <div className="flex items-center gap-5">
                        <div className="w-12 h-12 rounded-2xl bg-dark-800 flex items-center justify-center text-primary-400 font-black border border-white/5 text-lg group-hover:bg-primary-600 group-hover:text-white transition-colors">
                          {tourist.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-black text-white tracking-tight leading-none mb-1.5">{tourist.name}</p>
                          <div className="flex items-center gap-3">
                             <span className="text-[10px] font-black text-dark-500 uppercase tracking-widest">{tourist.userId}</span>
                             <span className="w-1 h-1 rounded-full bg-dark-700" />
                             <span className="text-[10px] font-black text-primary-400/70 uppercase tracking-widest">{tourist.zone}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-6">
                        <div className="text-right">
                           <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full border ${
                             tourist.status === 'safe' ? 'bg-success-500/10 text-success-400 border-success-500/20' :
                             tourist.status === 'warning' ? 'bg-warning-500/10 text-warning-400 border-warning-500/20' : 
                             'bg-danger-500/10 text-danger-400 border-danger-500/20 shadow-glow-red'
                           }`}>
                             {tourist.status}
                           </span>
                           <p className="text-[10px] text-dark-600 font-bold mt-1.5 uppercase">Stable Relay</p>
                        </div>
                        <ArrowRight size={18} className="text-dark-700 group-hover:text-primary-500 group-hover:translate-x-1 transition-all" />
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              <div className="p-6 bg-white/[0.02] border-t border-white/5">
                <button className="w-full flex items-center justify-center gap-2 text-[10px] font-black text-dark-500 hover:text-white uppercase tracking-widest transition-colors">
                  Generate Analytical Audit <ExternalLink size={14} />
                </button>
              </div>
           </div>
        </motion.div>
      </div>
    </div>
  );
}
