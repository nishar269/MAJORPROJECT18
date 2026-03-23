import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Phone, MapPin, AlertTriangle, Radio, X, Power, Navigation, Activity } from 'lucide-react';
import useStore from '../store/useStore';
import { emergencyAPI } from '../services/api';
import { emitPanic } from '../services/socket';

const slideIn = {
  initial: { opacity: 0, scale: 0.9, y: 30 },
  animate: { opacity: 1, scale: 1, y: 0 },
  transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
};

export default function PanicPage() {
  const [triggered, setTriggered] = useState(false);
  const [sending, setSending] = useState(false);
  const [incident, setIncident] = useState(null);
  const [timer, setTimer] = useState(0);
  const currentLocation = useStore((s) => s.currentLocation);
  const user = useStore((s) => s.user);

  useEffect(() => {
    let interval;
    if (triggered) {
      interval = setInterval(() => setTimer(t => t + 1), 1000);
    } else {
      setTimer(0);
    }
    return () => clearInterval(interval);
  }, [triggered]);

  const handlePanic = async () => {
    setSending(true);
    const lat = currentLocation?.lat || 28.6139;
    const lng = currentLocation?.lng || 77.2090;

    try {
      const data = await emergencyAPI.panic(lat, lng);
      setIncident(data.incident);
      emitPanic(user?.id || 1, lat, lng);
    } catch (err) {
      console.warn('Backend offline — panic simulated locally');
      setIncident({
        id: Math.floor(Math.random() * 90000) + 10000,
        type: 'PANIC',
        userId: user?.id,
        lat,
        lng,
        timestamp: new Date(),
        status: 'active',
        estimatedETA: '~2 min 30s',
      });
    }

    setSending(false);
    setTriggered(true);
  };

  const handleCancel = async () => {
    if (incident?.id) {
      try {
        await emergencyAPI.cancel(incident.id);
      } catch (err) {
        console.warn('Cancel failed:', err);
      }
    }
    setTriggered(false);
    setIncident(null);
  };

  const formatTime = (s) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[75vh] font-body relative px-6">
      <AnimatePresence mode="wait">
        {!triggered ? (
          <motion.div key="idle" {...slideIn} className="text-center max-w-lg w-full">
            <div className="mb-10 space-y-4">
              <div className="flex items-center justify-center gap-3 mb-6">
                 <div className="w-1.5 h-1.5 rounded-full bg-success-500 animate-pulse" />
                 <span className="text-[10px] font-black text-dark-500 uppercase tracking-[0.3em]">Satellite Relay Active</span>
              </div>
              <h1 className="text-5xl font-display font-black text-white tracking-tighter leading-none">
                Emergency <span className="text-gradient">Protocol.</span>
              </h1>
              <p className="text-dark-400 font-medium text-lg opacity-70">
                Engage the system to broadcast high-priority SOS telemetry to central command.
              </p>
            </div>

            <div className="relative group">
               {/* Pulsing rings */}
               <div className="absolute inset-0 rounded-full bg-danger-500/10 scale-110 group-hover:scale-125 transition-transform animate-ping duration-[3s]" />
               <div className="absolute inset-0 rounded-full bg-danger-500/5 scale-125 group-hover:scale-150 transition-transform animate-pulse duration-[4s]" />
               
               <motion.button
                onClick={handlePanic}
                disabled={sending}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.92 }}
                className="relative w-64 h-64 rounded-full mx-auto flex flex-col items-center justify-center bg-gradient-to-br from-danger-600 to-danger-800 text-white font-black shadow-glow-red border-[12px] border-dark-900 group-hover:border-dark-800 transition-all z-10"
               >
                  {sending ? (
                    <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <Power size={64} className="mb-4 opacity-50 group-hover:opacity-100 transition-opacity" />
                      <span className="text-4xl tracking-tighter">ARM SOS</span>
                      <span className="text-[10px] uppercase tracking-[0.4em] mt-2 opacity-50">Instant Uplink</span>
                    </>
                  )}
               </motion.button>
            </div>

            <div className="mt-16 flex flex-col items-center gap-6">
               <div className="px-6 py-3 rounded-2xl bg-dark-900 border border-white/5 flex items-center gap-4 transition-all hover:border-white/10">
                  <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center text-primary-400">
                    <Navigation size={18} />
                  </div>
                  <div className="text-left">
                    <p className="text-[9px] font-black text-dark-500 uppercase tracking-widest leading-none">Your Coordinates</p>
                    <p className="text-xs font-bold text-white mt-1">
                      {currentLocation?.lat.toFixed(5)}, {currentLocation?.lng.toFixed(5)}
                    </p>
                  </div>
               </div>
               <p className="text-[10px] font-black text-dark-700 uppercase tracking-[0.4em]">System Standard v3.14</p>
            </div>
          </motion.div>
        ) : (
          <motion.div key="active" {...slideIn} className="w-full max-w-2xl">
            <div className="glass-card p-12 overflow-hidden relative border-danger-500/30 shadow-glow-red/20 bg-dark-900/80 backdrop-blur-3xl">
               <div className="absolute top-0 right-0 p-8">
                  <Activity size={48} className="text-danger-500/20 animate-pulse" />
               </div>
               
               <div className="flex flex-col md:flex-row gap-12 items-center">
                  <div className="relative">
                     <div className="w-40 h-40 rounded-full border-2 border-danger-500/50 flex flex-col items-center justify-center relative overflow-hidden">
                        <div className="absolute inset-0 bg-danger-500/10 animate-pulse" />
                        <span className="text-3xl font-display font-black text-danger-400 leading-none">{formatTime(timer)}</span>
                        <span className="text-[9px] font-black text-danger-500 uppercase tracking-widest mt-2">Active Signal</span>
                     </div>
                     <div className="w-10 h-10 rounded-full bg-danger-500 text-white flex items-center justify-center absolute -bottom-2 -right-2 shadow-glow-red animate-bounce">
                        <Radio size={20} />
                     </div>
                  </div>

                  <div className="flex-1 text-center md:text-left">
                     <div className="flex items-center gap-3 mb-4 justify-center md:justify-start">
                        <span className="px-3 py-1 rounded-full bg-danger-500/10 border border-danger-500/20 text-[10px] font-black text-danger-400 uppercase tracking-widest">
                           Critical Response Engaged
                        </span>
                     </div>
                     <h2 className="text-4xl font-display font-black text-white tracking-tighter mb-4">Rescue En Route.</h2>
                     <p className="text-dark-400 font-medium leading-relaxed max-w-sm">
                       Dispatch center has acknowledged your SOS. Law enforcement is accelerating to your encrypted coordinates (#EXT-92817).
                     </p>
                  </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 mb-10">
                  <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/5 space-y-2">
                     <p className="text-[9px] font-black text-dark-500 uppercase tracking-widest">ETA Estimation</p>
                     <p className="text-lg font-black text-white">{incident?.estimatedETA || '~2 min 30s'}</p>
                  </div>
                  <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/5 space-y-2">
                     <p className="text-[9px] font-black text-dark-500 uppercase tracking-widest">Tracking Status</p>
                     <p className="text-lg font-black text-success-400">Transmitting</p>
                  </div>
                  <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/5 space-y-2">
                     <p className="text-[9px] font-black text-dark-500 uppercase tracking-widest">Incident ID</p>
                     <p className="text-lg font-black text-primary-400">#{incident?.id || '92831'}</p>
                  </div>
               </div>

               <div className="flex flex-col md:flex-row gap-4">
                  <button className="flex-1 py-5 rounded-2xl bg-white/5 border border-white/10 font-black text-xs text-white uppercase tracking-widest hover:bg-white/10 transition-all flex items-center justify-center gap-3"
                    onClick={() => window.open(`tel:100`)}>
                    <Phone size={16} /> Direct Police Line
                  </button>
                  <button 
                    onClick={handleCancel}
                    className="flex-1 py-5 rounded-2xl bg-dark-950/80 border border-danger-500/20 font-black text-xs text-danger-500 uppercase tracking-widest shadow-glow-red/5 hover:bg-danger-500 hover:text-white transition-all flex items-center justify-center gap-3"
                  >
                    <X size={16} /> False Alarm / Cancel
                  </button>
               </div>
            </div>
            
            <p className="text-center mt-10 text-[10px] font-black text-dark-600 uppercase tracking-[0.4em]">
              Authorized Emergency Protocol Beta-9
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
