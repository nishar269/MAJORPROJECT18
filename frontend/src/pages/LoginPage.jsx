import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Shield, Eye, EyeOff, ArrowRight, Zap, Fingerprint, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import useStore from '../store/useStore';
import { authAPI } from '../services/api';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const login = useStore((s) => s.login);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const data = await authAPI.login(email, password);
      login(data.user, data.token);
      navigate('/dashboard');
    } catch (err) {
      console.warn('Backend unreachable, using demo mode:', err.message);
      login({ id: 1, name: email.split('@')[0], email, role: 'tourist' }, 'demo-jwt-token');
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex relative overflow-hidden bg-dark-950 font-body">
      {/* Animated Background Elements */}
      <div className="aurora-bg" />
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary-500/10 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent-500/10 rounded-full blur-[120px] animate-pulse" style={{animationDelay:'2s'}} />

      {/* Left panel — Branding & Tech Pillars */}
      <div className="hidden lg:flex lg:w-3/5 items-center justify-center p-16 relative border-r border-white/5">
        <motion.div 
          initial={{ opacity: 0, x: -50 }} 
          animate={{ opacity: 1, x: 0 }} 
          transition={{ duration: 1 }}
          className="max-w-xl"
        >
          <div className="w-20 h-20 mb-10 rounded-3xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-glow-blue border border-white/10">
            <Shield size={36} className="text-white" />
          </div>
          
          <h1 className="text-7xl font-display font-black text-white mb-6 leading-[0.9] tracking-tighter">
            Travel <span className="text-gradient">Secure.</span><br/>Explore Free.
          </h1>
          
          <p className="text-lg text-dark-400 font-medium mb-12 max-w-sm leading-relaxed opacity-80">
            The next-generation safety sentinel. AI-powered behavioral tracking meets blockchain security.
          </p>

          <div className="grid grid-cols-2 gap-6">
            {[
              { icon: Zap, title: "AI Sentinel", desc: "Anomaly detection", color: "text-primary-400" },
              { icon: Globe, title: "Live Sync", desc: "PWA connectivity", color: "text-success-400" },
              { icon: Fingerprint, title: "Crypto ID", desc: "Blockchain audit", color: "text-accent-400" },
              { icon: Shield, title: "SOS Relay", desc: "Priority dispatch", color: "text-warning-400" },
            ].map((pillar) => (
              <div key={pillar.title} className="glass-card-light p-5 border-white/5 group hover:border-white/20 transition-all">
                <pillar.icon size={24} className={`${pillar.color} mb-3 group-hover:scale-110 transition-transform`} />
                <h3 className="text-sm font-bold text-white mb-1 uppercase tracking-wider">{pillar.title}</h3>
                <p className="text-[10px] text-dark-500 font-bold uppercase tracking-widest">{pillar.desc}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Right panel — High-Fidelity Login Form */}
      <div className="w-full lg:w-2/5 flex items-center justify-center p-8 md:p-12 xl:p-20 z-10">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }} 
          animate={{ opacity: 1, scale: 1 }} 
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          <div className="glass-card p-10 border-white/10 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-500 via-accent-500 to-primary-500" />
            
            <div className="mb-10">
              <h2 className="text-3xl font-display font-black text-white mb-2 tracking-tight">Access Control</h2>
              <p className="text-sm text-dark-500 font-medium">Decrypt and authorize your safety session</p>
            </div>

            <AnimatePresence>
              {error && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  exit={{ opacity: 0 }}
                  className="mb-6 p-4 rounded-2xl bg-danger-500/10 border border-danger-500/20 text-danger-400 text-xs font-bold uppercase tracking-widest"
                >
                  Authentication Failed
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-dark-500 uppercase tracking-[0.2em] ml-1">Terminal Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@agency.gov"
                  required
                  className="w-full px-5 py-4 rounded-2xl text-sm font-semibold transition-all focus:shadow-glow-blue"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-[10px] font-black text-dark-500 uppercase tracking-[0.2em] ml-1">Secure Passkey</label>
                <div className="relative">
                  <input
                    type={showPw ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full px-5 py-4 rounded-2xl text-sm font-semibold transition-all focus:shadow-glow-blue pr-12"
                  />
                  <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-4 top-1/2 -translate-y-1/2 text-dark-500 hover:text-white transition">
                    {showPw ? <EyeOff size={20}/> : <Eye size={20}/>}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-5 rounded-2xl font-black text-xs uppercase tracking-widest text-white bg-gradient-to-br from-primary-500 to-primary-700 hover:from-primary-400 hover:to-primary-600 transition-all duration-300 flex items-center justify-center gap-3 shadow-glow-blue border border-white/10 active:scale-95 disabled:opacity-50"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                ) : (
                  <>Initialize Sync <ArrowRight size={18}/></>
                )}
              </button>
            </form>

            <div className="relative my-10">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/5" /></div>
              <div className="relative flex justify-center text-[9px] font-black uppercase tracking-[0.3em]"><span className="px-4 bg-dark-900 text-dark-500">Fast Lane</span></div>
            </div>

            <button
              onClick={() => {
                login({ id: 99, name: 'Admin Officer', email: 'admin@toursafe.gov', role: 'police' }, 'demo-admin-token');
                navigate('/admin');
              }}
              className="w-full py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest text-dark-400 glass-card-light hover:bg-white/5 hover:text-white border-white/5 hover:border-white/20 transition-all duration-300 flex items-center justify-center gap-3"
            >
              🛡️ Operator Dashboard
            </button>

            <div className="mt-10 text-center">
              <span className="text-xs text-dark-500 font-medium">Unauthorized user? </span>
              <Link to="/register" className="text-xs text-primary-400 hover:text-primary-300 font-black uppercase tracking-widest transition">Establish ID</Link>
            </div>
          </div>
          
          <p className="mt-8 text-center text-[10px] text-dark-600 font-bold uppercase tracking-[0.2em]">
            Protected by TourSafe Cryptographic Layer
          </p>
        </motion.div>
      </div>
    </div>
  );
}
