import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, RefreshCw, Target, Activity, Search, Navigation, 
  Flame, Map as MapIcon, Layers, ShieldAlert, Eye, EyeOff
} from 'lucide-react';
import { touristAPI } from '../services/api';
import useStore from '../store/useStore';
import { emitLocationUpdate } from '../services/socket';

export default function MapPage() {
  const [selectedTourist, setSelectedTourist] = useState(null);
  const [tourists, setTourists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [showMarkers, setShowMarkers] = useState(true);
  const mapRef = useRef(null);
  const googleMapRef = useRef(null);
  const heatmapLayerRef = useRef(null);
  const markersRef = useRef([]);

  const { user } = useStore();

  // BITS Visakhapatnam Center (User context)
  const BITS_CENTER = { lat: 17.8931, lng: 83.3364 };

  const fetchData = async () => {
    try {
      const touristData = await touristAPI.getAll().catch(() => []);
      setTourists(touristData);
    } catch (err) {
      console.error('Data error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 8000);
    return () => clearInterval(interval);
  }, []);

  // Initialize Map
  useEffect(() => {
    if (!loading && window.google && !googleMapRef.current) {
      const gMap = new window.google.maps.Map(mapRef.current, {
        center: BITS_CENTER,
        zoom: 16,
        disableDefaultUI: false,
        backgroundColor: '#020617',
        styles: [
          { "elementType": "geometry", "stylers": [{ "color": "#1e293b" }] },
          { "elementType": "labels.text.fill", "stylers": [{ "color": "#94a3b8" }] },
          { "elementType": "labels.text.stroke", "stylers": [{ "color": "#020617" }] },
          { "featureType": "administrative", "elementType": "geometry", "stylers": [{ "color": "#334155" }] },
          { "featureType": "poi", "elementType": "labels.text.fill", "stylers": [{ "color": "#3b82f6" }] },
          { "featureType": "road", "elementType": "geometry", "stylers": [{ "color": "#334155" }] },
          { "featureType": "road", "elementType": "geometry.stroke", "stylers": [{ "color": "#1e293b" }] },
          { "featureType": "road.highway", "elementType": "geometry", "stylers": [{ "color": "#3b82f6" }] },
          { "featureType": "transit", "elementType": "geometry", "stylers": [{ "color": "#334155" }] },
          { "featureType": "water", "elementType": "geometry", "stylers": [{ "color": "#0f172a" }] }
        ]
      });
      googleMapRef.current = gMap;

      gMap.addListener('click', (e) => {
        const lat = e.latLng.lat();
        const lng = e.latLng.lng();
        emitLocationUpdate(user?.id || 'TEST-OPERATOR', lat, lng);
      });
    }
  }, [loading]);

  // Handle Markers & Heatmap
  useEffect(() => {
    if (!googleMapRef.current || !window.google) return;

    // Clear old markers
    markersRef.current.forEach(m => m.setMap(null));
    markersRef.current = [];

    if (showMarkers) {
      tourists.forEach(t => {
        const marker = new window.google.maps.Marker({
          position: { lat: t.lat, lng: t.lng },
          map: googleMapRef.current,
          title: t.name,
          animation: t.status !== 'safe' ? window.google.maps.Animation.BOUNCE : null,
          icon: {
            path: window.google.maps.SymbolPath.CIRCLE,
            fillColor: t.status === 'danger' ? '#f43f5e' : t.status === 'warning' ? '#fbbf24' : '#10b981',
            fillOpacity: 1,
            strokeWeight: 2,
            strokeColor: '#fff',
            scale: 8
          }
        });

        const infoWindow = new window.google.maps.InfoWindow({
          content: `<div style="color:#333; padding:10px; font-family: 'Inter', sans-serif;">
                      <h3 style="margin:0; font-weight:900; font-size:14px;">${t.name}</h3>
                      <p style="margin:5px 0; font-size:10px; color:#666;">ZONE: ${t.zone || 'UNKNOWN'}</p>
                      <span style="display:inline-block; padding:2px 8px; border-radius:10px; font-size:9px; font-weight:bold; color:white; background:${t.status === 'safe' ? '#10b981' : '#f43f5e'}">${t.status.toUpperCase()}</span>
                    </div>`
        });

        marker.addListener('click', () => infoWindow.open(googleMapRef.current, marker));
        markersRef.current.push(marker);
      });
    }

    // Update Heatmap
    if (showHeatmap) {
      const data = tourists.map(t => ({
        location: new window.google.maps.LatLng(t.lat, t.lng),
        weight: t.status === 'danger' ? 5 : t.status === 'warning' ? 3 : 1
      }));

      if (heatmapLayerRef.current) {
        heatmapLayerRef.current.setData(data);
      } else {
        heatmapLayerRef.current = new window.google.maps.visualization.HeatmapLayer({
          data: data,
          map: googleMapRef.current,
          radius: 40,
          opacity: 0.8,
          gradient: [
            'rgba(0, 255, 255, 0)',
            'rgba(0, 255, 255, 1)',
            'rgba(0, 191, 255, 1)',
            'rgba(0, 127, 255, 1)',
            'rgba(0, 63, 255, 1)',
            'rgba(0, 0, 255, 1)',
            'rgba(0, 0, 223, 1)',
            'rgba(0, 0, 191, 1)',
            'rgba(0, 0, 159, 1)',
            'rgba(0, 0, 127, 1)',
            'rgba(63, 0, 91, 1)',
            'rgba(127, 0, 63, 1)',
            'rgba(191, 0, 31, 1)',
            'rgba(255, 0, 0, 1)'
          ]
        });
      }
    } else {
      if (heatmapLayerRef.current) {
        heatmapLayerRef.current.setMap(null);
        heatmapLayerRef.current = null;
      }
    }

  }, [tourists, showMarkers, showHeatmap]);

  return (
    <div className="h-[calc(100vh-10rem)] flex flex-col gap-6 font-body relative">
      {/* Strategic Header Overlay */}
      <div className="flex items-center justify-between pointer-events-none z-10 absolute top-4 left-6 right-6">
         <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
           className="glass-card bg-dark-900/90 border-white/5 p-4 shadow-2xl flex items-center gap-4 pointer-events-auto">
            <div className="w-10 h-10 rounded-2xl bg-primary-600 flex items-center justify-center text-white shadow-glow-blue border border-white/10">
               <Target size={20} />
            </div>
            <div>
               <h3 className="text-sm font-black text-white tracking-tight leading-none uppercase">Security Radar</h3>
               <p className="text-[10px] text-dark-500 font-bold uppercase tracking-[0.2em] mt-1.5">{tourists.length} Monitored Terminals</p>
            </div>
         </motion.div>
         
         <div className="flex items-center gap-3 self-start">
            {/* Heatmap Toggle */}
            <button 
              onClick={() => setShowHeatmap(!showHeatmap)}
              className={`glass-card p-4 flex items-center gap-3 pointer-events-auto transition-all border ${showHeatmap ? 'bg-accent-600 text-white border-white/20' : 'bg-dark-900/90 text-dark-400 border-white/5'}`}
            >
               <Flame size={18} className={showHeatmap ? 'animate-pulse' : ''} />
               <span className="text-[10px] font-black uppercase tracking-widest">{showHeatmap ? 'Heatmap: Active' : 'Heatmap: Off'}</span>
            </button>
            <button 
              onClick={() => setShowMarkers(!showMarkers)}
              className={`glass-card p-4 flex items-center gap-3 pointer-events-auto transition-all border ${showMarkers ? 'bg-primary-600 text-white border-white/20' : 'bg-dark-900/90 text-dark-400 border-white/5'}`}
            >
               {showMarkers ? <Eye size={18} /> : <EyeOff size={18} />}
               <span className="text-[10px] font-black uppercase tracking-widest">{showMarkers ? 'Markers: Visible' : 'Markers: Hidden'}</span>
            </button>
         </div>
      </div>

      {/* Main Full-Size Map Canvas */}
      <div className="flex-1 relative rounded-[2rem] overflow-hidden shadow-2xl border border-white/10 bg-dark-950">
        <div ref={mapRef} className="w-full h-full grayscale-[0.2] contrast-[1.1]" id="google-map" />
        
        {!window.google && (
          <div className="absolute inset-0 flex items-center justify-center bg-dark-950 z-50">
             <div className="text-center">
                <div className="w-14 h-14 border-4 border-primary-500/10 border-t-primary-500 rounded-full animate-spin mx-auto mb-6" />
                <p className="text-[10px] font-black text-white uppercase tracking-[0.4em]">Bridging Satellite Relay...</p>
                <p className="text-[9px] text-dark-500 mt-3 font-bold uppercase tracking-widest">Verify API Credentials in index.html</p>
             </div>
          </div>
        )}

        {/* Sidebar Mini-Console (Floating) */}
        <AnimatePresence>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="absolute bottom-6 left-6 w-80 glass-card bg-dark-900/90 border-white/5 shadow-2xl p-6 pointer-events-auto z-10 hover:border-primary-500/30 transition-all">
             <div className="flex items-center justify-between mb-6">
                <h2 className="text-xs font-black text-white uppercase tracking-[0.2em] flex items-center gap-3">
                   <Activity size={14} className="text-primary-500" /> Operational Feed
                </h2>
                <div className="flex items-center gap-1.5">
                   <span className="w-1.5 h-1.5 rounded-full bg-success-500 animate-pulse" />
                   <span className="text-[10px] font-black text-dark-500 uppercase tracking-widest">Live</span>
                </div>
             </div>
             
             <div className="space-y-3 max-h-48 overflow-y-auto pr-2 custom-scrollbar custom-scrollbar-dark">
                {tourists.map(t => (
                  <div key={t.id} className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-between group hover:border-primary-500/30 transition-all cursor-pointer">
                     <div className="flex items-center gap-4">
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-[10px] font-black border ${
                           t.status === 'safe' ? 'bg-success-500/10 text-success-500 border-success-500/10' : 'bg-danger-500/10 text-danger-500 border-danger-500/10'
                        }`}>
                           {t.name.charAt(0)}
                        </div>
                        <div>
                           <p className="text-[11px] font-black text-white uppercase tracking-tight">{t.name}</p>
                           <p className="text-[9px] text-dark-500 font-bold uppercase tracking-widest mt-0.5">{t.userId}</p>
                        </div>
                     </div>
                     <Navigation size={12} className="text-dark-600 group-hover:text-primary-500 transition-colors" />
                  </div>
                ))}
             </div>
             
             <button className="w-full mt-6 py-4 rounded-2xl bg-gradient-to-br from-primary-600 to-primary-800 text-[10px] font-black text-white uppercase tracking-[0.3em] shadow-glow-blue border border-white/10 active:scale-95 transition-all">
                Global Alert Protocol
             </button>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
