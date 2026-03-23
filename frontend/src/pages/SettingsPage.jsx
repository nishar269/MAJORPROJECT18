import { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings, User, Bell, Shield, Moon, Sun, Monitor, Globe, ChevronRight, Save, Trash2 } from 'lucide-react';
import useStore from '../store/useStore';

export default function SettingsPage() {
  const { user, darkMode, toggleDarkMode } = useStore();
  const [activeTab, setActiveTab] = useState('profile');
  const [saving, setSaving] = useState(false);

  const tabs = [
    { id: 'profile', icon: User, label: 'Profile' },
    { id: 'notifications', icon: Bell, label: 'Notifications' },
    { id: 'safety', icon: Shield, label: 'Safety & Privacy' },
    { id: 'appearance', icon: Monitor, label: 'Appearance' },
  ];

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      alert('Settings saved successfully!');
    }, 1000);
  };

  const isPolice = user?.role === 'police';

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 rounded-2xl bg-primary-500/20 flex items-center justify-center text-primary-400">
          <Settings size={24} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">System Settings</h1>
          <p className="text-dark-400 text-sm">Manage your preferences and security</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar Tabs */}
        <div className="w-full md:w-64 space-y-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition ${
                activeTab === tab.id 
                  ? 'bg-primary-500 text-white shadow-glow-blue' 
                  : 'text-dark-400 hover:bg-dark-800/60 hover:text-white'
              }`}
            >
              <tab.icon size={18} />
              {tab.label}
              <ChevronRight size={14} className={`ml-auto opacity-50 ${activeTab === tab.id ? 'translate-x-0' : '-translate-x-2 opacity-0'} transition-all`} />
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-1 glass-card p-6 min-h-[500px]">
          {activeTab === 'profile' && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
              <div className="flex items-center gap-6 pb-6 border-b border-dark-700/50">
                <div className="w-20 h-20 rounded-full bg-dark-700 flex items-center justify-center text-3xl font-bold text-primary-400 border-2 border-primary-500/20 relative">
                  {user?.name?.charAt(0) || 'U'}
                  <button className="absolute bottom-0 right-0 p-1.5 rounded-full bg-primary-500 text-white border-2 border-dark-950">
                    <monitor size={12}/>
                  </button>
                </div>
                <div>
                   <h3 className="text-lg font-bold text-white">{user?.name}</h3>
                   <p className="text-sm text-dark-500">{user?.role === 'police' ? 'Police / Admin Authority' : 'Registered Tourist'}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div className="space-y-1.5">
                   <label className="text-xs font-semibold text-dark-400 uppercase tracking-wider">Display Name</label>
                   <input type="text" defaultValue={user?.name} className="w-full px-4 py-2.5 rounded-lg bg-dark-800 border border-dark-700 text-white text-sm focus:border-primary-500 outline-none transition" />
                 </div>
                 <div className="space-y-1.5">
                   <label className="text-xs font-semibold text-dark-400 uppercase tracking-wider">Email Address</label>
                   <input type="email" defaultValue={user?.email} className="w-full px-4 py-2.5 rounded-lg bg-dark-800 border border-dark-700 text-white text-sm focus:border-primary-500 outline-none transition" />
                 </div>
              </div>

              {isPolice ? (
                <div className="p-4 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs leading-relaxed">
                   🚨 <strong>Authority Notice:</strong> Your profile is linked to an official safety account. Any changes to your identity must be verified by the central command.
                </div>
              ) : (
                <div className="space-y-4">
                  <h4 className="text-sm font-semibold text-white">Emergency Contact</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input type="text" placeholder="Contact Name" className="w-full px-4 py-2.5 rounded-lg bg-dark-800 border border-dark-700 text-white text-sm focus:border-primary-500 outline-none" />
                    <input type="tel" placeholder="Phone Number" className="w-full px-4 py-2.5 rounded-lg bg-dark-800 border border-dark-700 text-white text-sm focus:border-primary-500 outline-none" />
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'notifications' && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
               <h3 className="text-lg font-bold text-white mb-4">Notification Preferences</h3>
               <div className="space-y-4">
                 {[
                   { id: 'browser', label: 'Browser Notifications', desc: 'Alerts when the app is in background', active: true },
                   { id: 'sms', label: 'SMS Emergency Alerts', desc: 'Critical alerts via text message', active: false },
                   { id: 'geofence', label: 'Geo-fence Alerts', desc: 'When entering or leaving safety zones', active: true },
                   { id: 'ai', label: 'AI Anomaly Alerts', desc: 'Predictive behavior warnings', active: true },
                 ].map(item => (
                   <div key={item.id} className="flex items-center justify-between p-4 bg-dark-800/40 rounded-xl border border-dark-700/30">
                     <div>
                       <p className="text-sm font-semibold text-white">{item.label}</p>
                       <p className="text-xs text-dark-500">{item.desc}</p>
                     </div>
                     <div className="w-12 h-6 bg-dark-700 rounded-full relative p-1 cursor-pointer">
                        <div className={`w-4 h-4 rounded-full transition-all ${item.active ? 'bg-primary-500 translate-x-6 shadow-glow-blue' : 'bg-dark-500 translate-x-0'}`} />
                     </div>
                   </div>
                 ))}
               </div>
            </motion.div>
          )}

          {activeTab === 'safety' && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
               <h3 className="text-lg font-bold text-white mb-4">Security & Tracking</h3>
               <div className="space-y-4">
                  <div className="p-4 bg-dark-800/40 rounded-xl border border-dark-700/30">
                    <div className="flex items-center justify-between mb-2">
                       <p className="text-sm font-semibold text-white">Live Tracking Frequency</p>
                       <span className="text-xs text-primary-400 font-bold">8.0 seconds</span>
                    </div>
                    <input type="range" className="w-full accent-primary-500" min="5" max="60" defaultValue="8" />
                  </div>
                  
                  <div className="space-y-1.5 p-4 bg-dark-800/40 rounded-xl border border-dark-700/30">
                    <div className="flex items-center justify-between">
                       <p className="text-sm font-semibold text-white">Blockchain Identity</p>
                       <span className="text-[10px] bg-success-500/10 text-success-400 px-2 py-0.5 rounded-full border border-success-500/20 uppercase font-bold tracking-wider">Verified</span>
                    </div>
                    <p className="text-xs text-dark-500 mt-2 font-mono">HASH: 4b2c...9e2a</p>
                    <button className="text-xs text-primary-400 font-semibold mt-3 hover:underline">Download Identity Certificate</button>
                  </div>

                  <div className="p-4 bg-danger-500/5 rounded-xl border border-danger-500/20 mt-10">
                    <h4 className="text-sm font-bold text-danger-400 flex items-center gap-2 mb-2">
                      <Trash2 size={16}/> Critical Danger Zone
                    </h4>
                    <p className="text-xs text-dark-400 mb-4">All data is encrypted and permanently anonymized. You can request account deletion at any time.</p>
                    <button className="px-4 py-2 bg-danger-500/20 text-danger-400 hover:bg-danger-500 transition-all rounded-lg text-xs font-bold border border-danger-500/30">DELETE ACCOUNT</button>
                  </div>
               </div>
            </motion.div>
          )}

          {activeTab === 'appearance' && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
               <h3 className="text-lg font-bold text-white mb-4">Interface Customization</h3>
               <div className="grid grid-cols-2 gap-4">
                  <button 
                    onClick={() => !darkMode && toggleDarkMode()}
                    className={`p-6 rounded-2xl border transition-all flex flex-col items-center gap-4 ${
                      darkMode ? 'bg-primary-500/10 border-primary-500/50 shadow-glow-blue' : 'bg-dark-800 border-dark-700 hover:border-dark-500'
                    }`}
                  >
                    <Moon size={32} className={darkMode ? 'text-primary-400' : 'text-dark-500'} />
                    <span className="text-sm font-bold text-white uppercase tracking-tighter">Dark Mode</span>
                  </button>
                  <button 
                    onClick={() => darkMode && toggleDarkMode()}
                    className={`p-6 rounded-2xl border transition-all flex flex-col items-center gap-4 ${
                      !darkMode ? 'bg-orange-500/10 border-orange-500/50 shadow-glow-red' : 'bg-dark-800 border-dark-700 hover:border-dark-500'
                    }`}
                  >
                    <Sun size={32} className={!darkMode ? 'text-orange-400' : 'text-dark-500'} />
                    <span className="text-sm font-bold text-white uppercase tracking-tighter">Light Mode</span>
                  </button>
               </div>
               
               <div className="space-y-4 pt-6 mt-6 border-t border-dark-700/50">
                  <div className="flex items-center justify-between">
                     <div className="flex items-center gap-3">
                        <Globe size={18} className="text-dark-500" />
                        <span className="text-sm text-dark-200">System Language</span>
                     </div>
                     <select className="bg-dark-800 border border-dark-700 text-white text-xs rounded-lg px-3 py-1.5 focus:border-primary-500 outline-none">
                       <option>English (US)</option>
                       <option>Spanish</option>
                       <option>French</option>
                       <option>Hindi</option>
                     </select>
                  </div>
               </div>
            </motion.div>
          )}
        </div>
      </div>

      <div className="flex items-center justify-end gap-4 pt-6 border-t border-dark-800">
        <button className="px-6 py-2.5 rounded-xl text-sm font-bold text-dark-500 hover:text-white transition">Cancel</button>
        <button 
          onClick={handleSave}
          disabled={saving}
          className="px-8 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-500 text-white font-bold text-sm transition-all shadow-glow-blue flex items-center gap-2"
        >
          {saving ? 'Saving...' : <><Save size={18}/> Save Changes</>}
        </button>
      </div>
    </div>
  );
}
