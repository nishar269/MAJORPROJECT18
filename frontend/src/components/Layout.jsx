import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from './Sidebar';
import useStore from '../store/useStore';
import { connectSocket, disconnectSocket, onPanicAlert, onNewAlert } from '../services/socket';
import useGeolocation from '../hooks/useGeolocation';

export default function Layout() {
  const { addAlert, isAuthenticated, panicActive, user, darkMode } = useStore();

  // Start geolocation tracking
  useGeolocation(isAuthenticated);

  // Connect WebSocket & listen for real-time events
  useEffect(() => {
    if (!isAuthenticated) return;

    // Request notification permission
    if (Notification.permission === 'default') {
      Notification.requestPermission();
    }

    const socket = connectSocket();

    const unsubPanic = onPanicAlert((data) => {
      console.log('🚨 Emergency alert received:', data);
      addAlert({
        id: Date.now(),
        message: `PANIC triggered by ${data.userName || data.userId}`,
        severity: 'critical',
        time: new Date().toISOString(),
        read: false,
      });

      if (Notification.permission === 'granted') {
        new Notification('🚨 EMERGENCY ALERT', {
          body: `Tourist triggered SOS!`,
          icon: '/logo192.png'
        });
      }
    });

    const unsubAlert = onNewAlert((data) => {
      console.log('🔔 New alert:', data);
      addAlert(data);

      if (Notification.permission === 'granted' && (data.severity === 'critical' || data.severity === 'warning')) {
        new Notification('TourSafe Alert', {
          body: data.message,
          icon: '/logo192.png'
        });
      }
    });

    return () => {
      unsubPanic();
      unsubAlert();
      disconnectSocket();
    };
  }, [isAuthenticated, addAlert]);

  return (
    <div className={`flex min-h-screen relative overflow-hidden transition-all duration-1000 ${
      panicActive ? 'bg-black' : (darkMode ? 'bg-dark-950' : 'bg-gray-50')
    }`}>
      
      {/* Dynamic Aurora Background */}
      <div className="aurora-bg" />
      
      {/* Real-time Global Panic Pulse Overlay */}
      <AnimatePresence>
        {panicActive && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.1, 0.25, 0.1] }}
            exit={{ opacity: 0 }}
            transition={{ repeat: Infinity, duration: 2.5 }}
            className="fixed inset-0 pointer-events-none z-[100] bg-danger-500/10 shadow-[inner_0_0_200px_rgba(239,68,68,0.4)]"
          />
        )}
      </AnimatePresence>
      
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Content Area */}
      <main className="flex-1 md:ml-72 min-h-screen transition-all duration-500">
        <div className="max-w-7xl mx-auto p-4 md:p-8 xl:p-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
          >
            <Outlet />
          </motion.div>
        </div>
      </main>

      {/* Global Status Toast (Optional visual flurries) */}
      <div className="fixed bottom-6 right-6 z-50 pointer-events-none">
        <div className="glass-card px-4 py-2 border-white/10 flex items-center gap-3">
           <div className={`w-2 h-2 rounded-full ${isAuthenticated ? 'bg-success-500 shadow-glow-green' : 'bg-danger-500 shadow-glow-red'}`} />
           <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">
             Live {user?.role || 'Guest'} Session
           </span>
        </div>
      </div>
    </div>
  );
}
