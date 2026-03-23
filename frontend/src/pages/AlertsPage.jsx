import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bell, Filter, Search, CheckCircle, Clock, 
  MapPin, AlertCircle, RefreshCw, Activity, Terminal
} from 'lucide-react';
import { alertsAPI } from '../services/api';

const severityStyles = {
  critical: 'border-danger-500/30 bg-danger-500/5 text-danger-400 shadow-glow-red',
  warning: 'border-warning-500/30 bg-warning-500/5 text-warning-400 shadow-glow-yellow',
  info: 'border-primary-500/30 bg-primary-500/5 text-primary-400 shadow-glow-blue',
  success: 'border-success-500/30 bg-success-500/5 text-success-400 shadow-glow-green',
};

export default function AlertsPage() {
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, critical: 0, warning: 0, unread: 0 });

  const fetchAlerts = async () => {
    setLoading(true);
    try {
      const data = await alertsAPI.getAll(filter === 'all' ? null : filter);
      setAlerts(data);
      
      const allAlerts = filter === 'all' ? data : await alertsAPI.getAll();
      setStats({
        total: allAlerts.length,
        critical: allAlerts.filter(a => a.severity === 'critical').length,
        warning: allAlerts.filter(a => a.severity === 'warning').length,
        unread: allAlerts.filter(a => !a.read).length,
      });
    } catch (err) {
      console.error('Alert fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, [filter]);

  const handleMarkRead = async (id) => {
    try {
      await alertsAPI.markRead(id);
      setAlerts(alerts.map(a => a.id === id ? { ...a, read: true } : a));
      setStats(prev => ({ ...prev, unread: Math.max(0, prev.unread - 1) }));
    } catch (err) {
      console.error('Mark read error:', err);
    }
  };

  const filteredAlerts = alerts.filter(alert => 
    alert.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (alert.touristId && alert.touristId.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-8 font-body pb-12">
      {/* Strategic Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
           <div className="flex items-center gap-2 mb-3">
              <Terminal size={14} className="text-primary-400" />
              <span className="text-[10px] font-black text-dark-500 uppercase tracking-widest">Signal Intelligence</span>
           </div>
           <h1 className="text-4xl font-display font-black text-white tracking-tighter">
             Safety <span className="text-gradient">Stream.</span>
           </h1>
           <p className="text-dark-500 mt-2 font-medium text-sm">Synchronized incident reports from all Neural Mesh sectors.</p>
        </div>
        <button 
          onClick={fetchAlerts}
          className="flex items-center gap-3 px-6 py-3 glass-card bg-primary-500/10 border-primary-500/20 text-[10px] font-black text-primary-400 uppercase tracking-widest hover:bg-primary-500 hover:text-white transition-all shadow-glow-blue active:scale-95"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Rescan Feed
        </button>
      </div>

      {/* Intelligence Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Vector', value: stats.total, color: 'text-white' },
          { label: 'Critical Threat', value: stats.critical, color: 'text-danger-400' },
          { label: 'System Caution', value: stats.warning, color: 'text-warning-400' },
          { label: 'Unprocessed', value: stats.unread, color: 'text-accent-400' },
        ].map((s) => (
          <div key={s.label} className="glass-card p-6 border-white/5 relative group overflow-hidden">
             <div className="absolute top-0 left-0 w-1 h-full bg-white/5 group-hover:bg-current transition-colors" />
             <p className="text-[10px] font-black text-dark-500 uppercase tracking-[0.2em] mb-2">{s.label}</p>
             <p className={`text-3xl font-display font-black ${s.color} tracking-tighter`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Control Console */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-600 group-focus-within:text-primary-400 transition-colors" size={20} />
          <input 
            type="text" 
            placeholder="Search incident signatures..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-6 py-4 rounded-2xl text-sm font-semibold transition-all focus:shadow-glow-blue"
          />
        </div>
        <div className="flex p-1.5 glass-card bg-white/[0.02] border-white/10">
          {['all', 'critical', 'warning', 'info'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                filter === f 
                ? 'bg-primary-500 text-white shadow-glow-blue' 
                : 'text-dark-500 hover:text-white'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Signal Log */}
      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
               <div className="w-12 h-12 border-4 border-primary-500/10 border-t-primary-500 rounded-full animate-spin shadow-glow-blue" />
               <p className="text-[10px] font-black text-dark-500 uppercase tracking-widest">Decrypting signals...</p>
            </div>
          ) : filteredAlerts.length > 0 ? (
            filteredAlerts.map((alert, i) => (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className={`glass-card p-6 border flex gap-6 group transition-all duration-500 ${severityStyles[alert.severity] || severityStyles.info} ${alert.read ? 'opacity-40 grayscale-[0.5]' : 'hover:bg-white/[0.03]'}`}
              >
                <div className="mt-1">
                  <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center">
                    {alert.severity === 'critical' ? <AlertCircle size={24} className="animate-pulse" /> : <Activity size={24} />}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] font-black uppercase tracking-[0.2em]">
                        Sig-{alert.id.toString().slice(-4)}
                      </span>
                      <span className="w-1 h-1 rounded-full bg-dark-700" />
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60">
                         {new Date(alert.time).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit', second:'2-digit'})}
                      </span>
                    </div>
                    {!alert.read && (
                      <button 
                        onClick={() => handleMarkRead(alert.id)}
                        className="text-[9px] font-black text-white hover:text-primary-400 uppercase tracking-widest transition-all bg-white/5 px-3 py-1 rounded-full border border-white/5 hover:border-primary-500/30"
                      >
                        Acknowledge
                      </button>
                    )}
                  </div>
                  <h3 className="text-sm font-bold text-white mb-2 leading-relaxed">
                    {alert.message}
                  </h3>
                  <div className="flex items-center gap-6 pt-4 mt-4 border-t border-white/5">
                    {alert.touristId && (
                      <div className="flex items-center gap-2">
                         <span className="text-[9px] font-black text-dark-500 uppercase tracking-widest">Node:</span>
                         <span className="text-[10px] font-black text-primary-400 tracking-tight">{alert.touristId}</span>
                      </div>
                    )}
                    {alert.lat && (
                       <div className="flex items-center gap-2">
                          <MapPin size={10} className="text-dark-500" />
                          <span className="text-[10px] font-bold text-dark-400">{alert.lat.toFixed(5)}, {alert.lng.toFixed(5)}</span>
                       </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-24 glass-card border-white/5">
              <Bell size={48} className="mx-auto text-dark-800 mb-6 opacity-20" />
              <p className="text-[10px] font-black text-dark-600 uppercase tracking-[0.3em]">No valid signatures detected</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
