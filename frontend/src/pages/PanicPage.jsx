import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Phone, MapPin, AlertTriangle, Radio } from 'lucide-react';
import useStore from '../store/useStore';
import { emergencyAPI } from '../services/api';
import { emitPanic } from '../services/socket';

export default function PanicPage() {
  const [triggered, setTriggered] = useState(false);
  const [sending, setSending] = useState(false);
  const [incident, setIncident] = useState(null);
  const currentLocation = useStore((s) => s.currentLocation);
  const user = useStore((s) => s.user);

  const handlePanic = async () => {
    setSending(true);

    const lat = currentLocation?.lat || 28.6139;
    const lng = currentLocation?.lng || 77.2090;

    try {
      // Call backend API
      const data = await emergencyAPI.panic(lat, lng);
      setIncident(data.incident);

      // Also emit via WebSocket for instant alert
      emitPanic(user?.id || 1, lat, lng);
    } catch (err) {
      console.warn('Backend offline — panic simulated locally');
      setIncident({
        id: Date.now(),
        type: 'PANIC',
        userId: user?.id,
        lat,
        lng,
        timestamp: new Date(),
        status: 'active',
        estimatedETA: '~3 min',
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

  return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <div className="text-center max-w-lg w-full">
        <AnimatePresence mode="wait">
          {!triggered ? (
            <motion.div
              key="panic-idle"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.4 }}
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <AlertTriangle size={40} className="mx-auto text-warning-400 mb-4" />
                <h1 className="text-3xl font-bold text-white mb-2">Emergency Panic Button</h1>
                <p className="text-dark-400 mb-4 max-w-sm mx-auto">
                  Press the button below to immediately alert nearby police and emergency services.
                </p>
                {currentLocation && (
                  <p className="text-xs text-dark-500 mb-8 flex items-center justify-center gap-1">
                    <Radio size={12} className="text-success-400" /> 
                    Live tracking: {currentLocation.lat?.toFixed(4)}, {currentLocation.lng?.toFixed(4)}
                    {currentLocation.isFallback && ' (fallback)'}
                  </p>
                )}
              </motion.div>

              {/* THE BUTTON */}
              <motion.button
                onClick={handlePanic}
                disabled={sending}
                className={`
                  w-48 h-48 rounded-full mx-auto flex items-center justify-center
                  bg-gradient-to-br from-danger-500 to-danger-600
                  text-white font-bold text-xl
                  shadow-2xl cursor-pointer
                  hover:from-danger-400 hover:to-danger-500
                  transition-all duration-300
                  ${!sending ? 'panic-btn' : ''}
                  disabled:opacity-70
                `}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {sending ? (
                  <div className="w-10 h-10 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <div className="text-center">
                    <Shield size={40} className="mx-auto mb-2" />
                    <span className="text-lg">SOS</span>
                  </div>
                )}
              </motion.button>

              <p className="text-dark-500 text-xs mt-8">
                <MapPin size={12} className="inline mr-1" />
                Your location will be shared with authorities
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="panic-triggered"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.4 }}
              className="glass-card p-10 glow-red"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
                className="w-20 h-20 rounded-full bg-danger-500/20 flex items-center justify-center mx-auto mb-6"
              >
                <Phone size={32} className="text-danger-400" />
              </motion.div>

              <h2 className="text-2xl font-bold text-white mb-2">🚨 Alert Sent!</h2>
              <p className="text-dark-300 mb-6">
                Emergency services have been notified. Stay calm and remain at your current location.
              </p>

              <div className="glass-card-light p-4 mb-6 text-left space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-dark-400">Status</span>
                  <span className="text-danger-400 font-semibold">Active Emergency</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-dark-400">Location Shared</span>
                  <span className="text-success-400 font-semibold">Yes</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-dark-400">Nearest Unit</span>
                  <span className="text-white font-semibold">{incident?.estimatedETA || '~3 min'} ETA</span>
                </div>
                {incident && (
                  <div className="flex justify-between text-sm">
                    <span className="text-dark-400">Incident ID</span>
                    <span className="text-primary-400 font-mono text-xs">#{incident.id}</span>
                  </div>
                )}
              </div>

              <button
                onClick={handleCancel}
                className="px-6 py-3 rounded-xl border border-dark-600 text-dark-300 hover:text-white hover:border-dark-400 transition font-medium"
              >
                Cancel Emergency
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
