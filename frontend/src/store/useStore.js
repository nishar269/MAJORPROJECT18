import { create } from 'zustand';

const useStore = create((set, get) => ({
  // Auth
  user: JSON.parse(localStorage.getItem('user')) || null,
  token: localStorage.getItem('token') || null,
  isAuthenticated: !!localStorage.getItem('token'),
  
  login: (user, token) => {
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('token', token);
    set({ user, token, isAuthenticated: true });
  },
  
  logout: () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    set({ user: null, token: null, isAuthenticated: false, alerts: [], unreadCount: 0, panicActive: false });
  },

  // Location
  currentLocation: null,
  setCurrentLocation: (loc) => set({ currentLocation: loc }),

  // Alerts
  alerts: [],
  unreadCount: 0,
  
  setAlerts: (alerts) => {
    const unread = alerts.filter(a => !a.read).length;
    const critical = alerts.some(a => !a.read && a.severity === 'critical');
    set({ alerts, unreadCount: unread, panicActive: critical });
  },
  
  addAlert: (alert) => {
    set((state) => {
      const newAlerts = [alert, ...state.alerts];
      const unread = newAlerts.filter(a => !a.read).length;
      const critical = newAlerts.some(a => !a.read && a.severity === 'critical');
      return { alerts: newAlerts, unreadCount: unread, panicActive: critical };
    });
  },

  markAlertRead: (id) => {
    set((state) => {
      const newAlerts = state.alerts.map(a => a.id === id ? { ...a, read: true } : a);
      const unread = newAlerts.filter(a => !a.read).length;
      const critical = newAlerts.some(a => !a.read && a.severity === 'critical');
      return { alerts: newAlerts, unreadCount: unread, panicActive: critical };
    });
  },

  // Panic
  panicActive: false,
  setPanicActive: (val) => set({ panicActive: val }),

  // Theme
  darkMode: true,
  toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),
}));

export default useStore;
