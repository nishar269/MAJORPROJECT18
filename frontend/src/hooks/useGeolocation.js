// Real-time Geolocation tracking hook
import { useEffect, useRef, useCallback } from 'react';
import useStore from '../store/useStore';
import { emitLocationUpdate } from '../services/socket';

export function useGeolocation(enabled = true, intervalMs = 10000) {
  const watchId = useRef(null);
  const setCurrentLocation = useStore((s) => s.setCurrentLocation);
  const user = useStore((s) => s.user);

  const startTracking = useCallback(() => {
    if (!navigator.geolocation) {
      console.warn('Geolocation not supported');
      return;
    }

    // Watch position continuously
    watchId.current = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude, accuracy, speed, heading } = position.coords;
        
        const locationData = {
          lat: latitude,
          lng: longitude,
          accuracy,
          speed,
          heading,
          timestamp: new Date().toISOString(),
        };

        setCurrentLocation(locationData);

        // Send to server via WebSocket
        if (user?.id) {
          emitLocationUpdate(user.id, latitude, longitude);
        }
      },
      (error) => {
        console.error('Geolocation error:', error.message);
        // Fallback to a default location (New Delhi)
        setCurrentLocation({
          lat: 28.6139,
          lng: 77.2090,
          accuracy: 0,
          speed: 0,
          heading: 0,
          timestamp: new Date().toISOString(),
          isFallback: true,
        });
      },
      {
        enableHighAccuracy: true,
        maximumAge: intervalMs,
        timeout: 10000,
      }
    );
  }, [user, setCurrentLocation, intervalMs]);

  const stopTracking = useCallback(() => {
    if (watchId.current !== null) {
      navigator.geolocation.clearWatch(watchId.current);
      watchId.current = null;
    }
  }, []);

  useEffect(() => {
    if (enabled) {
      startTracking();
    }
    return () => stopTracking();
  }, [enabled, startTracking, stopTracking]);

  return { startTracking, stopTracking };
}

export default useGeolocation;
