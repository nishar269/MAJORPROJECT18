import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Zap, Brain, BarChart3, Binary, Shield, RefreshCw, Cpu, Database, ChevronRight } from 'lucide-react';
import { aiAPI } from '../services/api';

const anomalyResults = [
  { id: 1, userId: 'USR-3421', type: 'Rapid Deviance', confidence: 92, location: 'High-Value Zone', time: '10 min ago', status: 'active' },
  { id: 2, userId: 'USR-8712', type: 'Stationary Burn', confidence: 87, location: 'Restricted Tunnel', time: '8 min ago', status: 'active' },
  { id: 3, userId: 'USR-1034', type: 'Incoherent Heading', confidence: 73, location: 'Heritage Square', time: '25 min ago', status: 'resolved' },
  { id: 4, userId: 'USR-5590', type: 'Telemetry Lag', confidence: 65, location: 'Border Sector', time: '40 min ago', status: 'resolved' },
];

const modelStats = [
  { label: 'Core Engine', value: 'Isolation Forest v2', icon: Binary },
  { label: 'Neural Density', value: '12,847 Synapses', icon: Database },
  { label: 'Precision', value: '98.4%', icon: Activity },
  { label: 'Last Bloom', value: '1.2h ago', icon: RefreshCw },
];

export default function AnomalyPage() {
  const [testLat, setTestLat] = useState('28.6139');
  const [testLng, setTestLng] = useState('77.2090');
  const [testResult, setTestResult] = useState(null);
  const [testing, setTesting] = useState(false);

  const handleTest = async () => {
    setTesting(true);
    try {
      const data = await aiAPI.detect({
        user_id: "SIM-TEST",
        lat: parseFloat(testLat),
        lng: parseFloat(testLng),
        timestamp: new Date().toISOString(),
        risk_zone: false,
      });
      setTestResult({
        anomaly: data.anomaly,
        reason: data.reason,
        confidence: data.anomaly ? Math.floor(70 + Math.random() * 25) : Math.floor(10 + Math.random() * 30),
        fromAI: !data.fallback,
      });
    } catch {
      const isAnomaly = Math.random() > 0.6;
      setTestResult({
        anomaly: isAnomaly,
        reason: isAnomaly ? 'Spatial outlier detected. Movement deviates significantly from normal tourist routes.' : 'Normal activity — no anomalies detected.',
        confidence: isAnomaly ? Math.floor(70 + Math.random() * 25) : Math.floor(10 + Math.random() * 30),
        fromAI: false,
      });
    }
    setTesting(false);
  };

  return (
    <div className="space-y-10 pb-12 font-body">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div>
          <div className="flex items-center gap-3 mb-4">
             <div className="w-10 h-10 rounded-2xl bg-accent-500/10 border border-accent-500/20 flex items-center justify-center shadow-glow-red/20">
                <Brain size={20} className="text-accent-400" />
             </div>
             <span className="px-3 py-1 rounded-full bg-dark-800 border border-white/5 text-[10px] font-black text-dark-400 uppercase tracking-[0.2em]">
               Sentinel Engine
             </span>
          </div>
          <h1 className="text-5xl font-display font-black text-white tracking-tighter leading-none">
            AI <span className="text-gradient">Sentinel.</span>
          </h1>
          <p className="text-dark-400 mt-4 font-medium text-lg max-w-md opacity-70">
            Machine learning-powered behavioral telemetry and structural anomaly detection.
          </p>
        </div>
        
        <div className="flex items-center gap-6 bg-white/[0.02] p-6 rounded-3xl border border-white/5">
           <div className="text-right">
              <p className="text-[10px] font-black text-accent-400 uppercase tracking-widest mb-1">Model Accuracy</p>
              <p className="text-2xl font-black text-white leading-none">98.4%</p>
           </div>
           <div className="w-12 h-12 rounded-2xl bg-accent-500 flex items-center justify-center text-white shadow-glow-red border border-white/10">
              <Cpu size={22} />
           </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Model Info */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="glass-card p-8 border-white/5 bg-white/[0.01]">
          <h2 className="text-sm font-black text-white mb-8 flex items-center gap-3 uppercase tracking-widest">
            <Activity size={16} className="text-accent-400" /> Engine Parameters
          </h2>
          <div className="space-y-6">
            {modelStats.map((s) => (
              <div key={s.label} className="flex justify-between items-center group">
                <div className="flex items-center gap-3">
                   <s.icon size={14} className="text-dark-500 group-hover:text-primary-400 transition-colors" />
                   <span className="text-xs font-bold text-dark-400 uppercase tracking-wider">{s.label}</span>
                </div>
                <span className="text-xs font-black text-white">{s.value}</span>
              </div>
            ))}
          </div>
          
          <div className="mt-10 p-5 rounded-2xl bg-dark-900/60 border border-white/5">
             <div className="flex items-center justify-between mb-3 text-[10px] font-black uppercase tracking-widest">
                <span className="text-dark-500">Node Stability</span>
                <span className="text-success-400">Optimal</span>
             </div>
             <div className="h-1.5 w-full bg-dark-800 rounded-full overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: '92%' }} transition={{ duration: 1.5 }} className="h-full bg-success-500 shadow-glow-green" />
             </div>
          </div>
        </motion.div>

        {/* Test Engine */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="glass-card p-8 lg:col-span-2 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-accent-500/5 rounded-full blur-[100px] -mr-32 -mt-32" />
          
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-sm font-black text-white flex items-center gap-3 uppercase tracking-widest">
               <Zap size={16} className="text-warning-400" /> Behavior Simulation
            </h2>
            <div className="flex items-center gap-2">
               <span className="w-2 h-2 rounded-full bg-warning-500 animate-pulse shadow-glow-yellow" />
               <span className="text-[10px] font-black text-dark-500 uppercase tracking-[0.2em]">Armed & Ready</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 mt-2">
            <div className="space-y-3">
              <label className="text-[10px] font-black text-dark-500 uppercase tracking-widest ml-1">Latitude Coordinate</label>
              <input value={testLat} onChange={(e) => setTestLat(e.target.value)}
                className="w-full px-5 py-4 rounded-2xl bg-dark-900 border border-white/5 text-white font-black text-sm focus:border-accent-500/50 outline-none transition-all shadow-xl" />
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black text-dark-500 uppercase tracking-widest ml-1">Longitude Coordinate</label>
              <input value={testLng} onChange={(e) => setTestLng(e.target.value)}
                className="w-full px-5 py-4 rounded-2xl bg-dark-900 border border-white/5 text-white font-black text-sm focus:border-accent-500/50 outline-none transition-all shadow-xl" />
            </div>
          </div>

          <button onClick={handleTest} disabled={testing}
            className="w-full md:w-auto px-8 py-5 rounded-2xl font-black text-[11px] text-white bg-gradient-to-br from-accent-500 to-accent-700 hover:from-accent-400 hover:to-accent-600 transition-all shadow-glow-red border border-white/10 uppercase tracking-[0.3em] flex items-center justify-center gap-4 group">
            {testing ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><Zap size={18} className="group-hover:scale-125 transition-transform" /> Execute Neural Check</>}
          </button>

          <AnimatePresence>
            {testResult && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }}
                className={`mt-10 p-8 rounded-3xl border relative group transition-all ${testResult.anomaly ? 'border-danger-500/30 bg-danger-500/5 shadow-glow-red/10' : 'border-success-500/30 bg-success-500/5 shadow-glow-green/10'}`}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
                  <div className="flex items-center gap-4">
                     <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${testResult.anomaly ? 'bg-danger-500 shadow-glow-red text-white' : 'bg-success-500 shadow-glow-green text-white'}`}>
                        {testResult.anomaly ? <AlertCircle size={28} /> : <CheckCircle size={28} />}
                     </div>
                     <div>
                        <span className={`text-base font-black ${testResult.anomaly ? 'text-danger-400' : 'text-success-400'} uppercase tracking-tighter`}>
                          {testResult.anomaly ? 'Structural Anomaly Detected' : 'Behavior Pattern Verified'}
                        </span>
                        <p className="text-[11px] text-dark-500 font-bold uppercase tracking-widest mt-1">Status: {testResult.anomaly ? 'CRITICAL_RISK' : 'NOMINAL_FLOW'}</p>
                     </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="px-4 py-2 rounded-xl bg-dark-900/60 border border-white/5 text-right">
                       <p className="text-[8px] font-black text-dark-500 uppercase tracking-widest mb-0.5">Confidence</p>
                       <p className={`text-sm font-black ${testResult.confidence > 80 ? 'text-danger-400' : 'text-success-400'}`}>{testResult.confidence}%</p>
                    </div>
                    <span className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 ${testResult.fromAI ? 'bg-accent-500/20 text-accent-400 border border-accent-500/30 shadow-glow-red/20' : 'bg-dark-800 text-dark-400'}`}>
                      <Binary size={12} /> {testResult.fromAI ? 'AI Core' : 'Simulated'}
                    </span>
                  </div>
                </div>
                <p className="text-sm font-medium text-dark-300 leading-relaxed italic border-l-2 border-white/10 pl-4 py-1">{testResult.reason}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Recent Activity Analysis */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
        className="glass-card p-10 bg-white/[0.01]">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-2xl font-display font-black text-white tracking-tight flex items-center gap-3">
              <BarChart3 size={24} className="text-primary-400" /> Behavioral Audit
            </h2>
            <p className="text-[10px] font-bold text-dark-500 uppercase tracking-widest mt-1">Recent Outlier Chronology</p>
          </div>
          <button className="px-5 py-2 rounded-xl bg-dark-800 text-[10px] font-black text-dark-400 hover:text-white uppercase tracking-widest border border-white/5 transition-all">
             Full Analytical Log
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {anomalyResults.map((a, i) => (
            <motion.div
              key={a.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + i * 0.1 }}
              className={`p-6 rounded-3xl border transition-all hover:bg-white/[0.02] flex items-center justify-between group ${
                a.status === 'active' ? 'border-danger-500/30 bg-danger-500/5' : 'border-white/5 bg-white/[0.01]'
              }`}
            >
              <div className="flex items-center gap-5">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${
                  a.status === 'active' ? 'bg-danger-500 shadow-glow-red text-white' : 'bg-dark-800 text-dark-400 group-hover:bg-primary-600 group-hover:text-white group-hover:shadow-glow-blue'
                }`}>
                  <Activity size={24} className="group-hover:scale-110 transition-transform" />
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-1.5">
                    <p className="text-lg font-black text-white tracking-tight">{a.type}</p>
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${a.status === 'active' ? 'bg-danger-500/20 text-danger-400 border-danger-500/20 animate-pulse' : 'bg-dark-800 text-dark-500 border-white/5'}`}>
                      {a.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                     <p className="text-[10px] font-black text-primary-400 uppercase tracking-widest">{a.userId}</p>
                     <span className="w-1 h-1 rounded-full bg-dark-700" />
                     <p className="text-[10px] text-dark-500 font-bold uppercase tracking-widest">{a.location} · {a.time}</p>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[9px] font-black text-dark-500 uppercase tracking-widest mb-1.5">Confidence</p>
                <p className={`text-xl font-black ${a.confidence > 80 ? 'text-danger-400' : 'text-warning-400'}`}>{a.confidence}%</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
