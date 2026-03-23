import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

let socket = null;

export function connectSocket() {
  if (socket?.connected) return socket;

  socket = io(SOCKET_URL, {
    transports: ['websocket', 'polling'],
    autoConnect: true,
  });

  socket.on('connect', () => {
    console.log('🔌 WebSocket connected:', socket.id);
  });

  socket.on('disconnect', () => {
    console.log('🔌 WebSocket disconnected');
  });

  socket.on('connect_error', (err) => {
    console.log('🔌 WebSocket error:', err.message);
  });

  return socket;
}

export function getSocket() {
  if (!socket) return connectSocket();
  return socket;
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}

// ─── LISTENERS ──────────────────────────────────

export function onLocationUpdated(callback) {
  const s = getSocket();
  s.on('location-updated', callback);
  return () => s.off('location-updated', callback);
}

export function onPanicAlert(callback) {
  const s = getSocket();
  s.on('panic-alert', callback);
  return () => s.off('panic-alert', callback);
}

export function onNewAlert(callback) {
  const s = getSocket();
  s.on('new-alert', callback);
  return () => s.off('new-alert', callback);
}

export function onPanicCancelled(callback) {
  const s = getSocket();
  s.on('panic-cancelled', callback);
  return () => s.off('panic-cancelled', callback);
}

// ─── EMITTERS ───────────────────────────────────

export function emitLocationUpdate(userId, lat, lng) {
  const s = getSocket();
  s.emit('location-update', { userId, lat, lng, timestamp: new Date() });
}

export function emitPanic(userId, lat, lng) {
  const s = getSocket();
  s.emit('panic', { userId, lat, lng });
}

export default {
  connect: connectSocket,
  disconnect: disconnectSocket,
  getSocket,
  onLocationUpdated,
  onPanicAlert,
  onNewAlert,
  onPanicCancelled,
  emitLocationUpdate,
  emitPanic,
};
