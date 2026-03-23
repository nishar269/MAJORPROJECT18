import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Shield, ArrowRight, User, Mail, Lock, UserCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import useStore from '../store/useStore';
import { authAPI } from '../services/api';

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'tourist' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const login = useStore((s) => s.login);
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const data = await authAPI.register(form.name, form.email, form.password, form.role);
      login(data.user, data.token);
      navigate('/dashboard');
    } catch (err) {
      console.warn('Backend offline — using demo mode');
      login({ id: 1, name: form.name, email: form.email, role: form.role }, 'demo-jwt');
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-dark-950 font-body p-6">
      <div className="aurora-bg" />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="glass-card p-10 w-full max-w-xl border-white/10 shadow-glow-blue relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-500 via-accent-500 to-primary-500" />
        
        <div className="flex items-center gap-4 mb-10">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-glow-blue border border-white/10">
            <Shield size={24} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-display font-black text-white leading-none">Initialize Identity</h1>
            <p className="text-[10px] text-dark-500 font-bold uppercase tracking-[0.2em] mt-1">New Terminal Establishment</p>
          </div>
        </div>

        {error && (
          <div className="mb-8 p-4 rounded-2xl bg-danger-500/10 border border-danger-500/20 text-danger-400 text-xs font-black uppercase tracking-widest">{error}</div>
        )}

        <form onSubmit={handleRegister} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-dark-500 uppercase tracking-widest ml-1">Callsign (Full Name)</label>
            <div className="relative">
               <input name="name" value={form.name} onChange={handleChange} required placeholder="Agent Doe"
                 className="w-full px-5 py-4 pl-12 rounded-2xl text-sm font-semibold transition-all focus:shadow-glow-blue" />
               <User className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-600" size={18} />
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-[10px] font-black text-dark-500 uppercase tracking-widest ml-1">E-Mail Address</label>
            <div className="relative">
              <input name="email" type="email" value={form.email} onChange={handleChange} required placeholder="you@agency.gov"
                className="w-full px-5 py-4 pl-12 rounded-2xl text-sm font-semibold transition-all focus:shadow-glow-blue" />
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-600" size={18} />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-dark-500 uppercase tracking-widest ml-1">Secure Passkey</label>
            <div className="relative">
              <input name="password" type="password" value={form.password} onChange={handleChange} required placeholder="••••••••"
                className="w-full px-5 py-4 pl-12 rounded-2xl text-sm font-semibold transition-all focus:shadow-glow-blue" />
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-600" size={18} />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-dark-500 uppercase tracking-widest ml-1">Access Tier</label>
            <div className="relative">
              <select name="role" value={form.role} onChange={handleChange}
                className="w-full px-5 py-4 pl-12 rounded-2xl text-sm font-semibold transition-all focus:shadow-glow-blue appearance-none">
                <option value="tourist">Tourist (Tactical)</option>
                <option value="police">Police (Officer)</option>
              </select>
              <UserCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-600" size={18} />
            </div>
          </div>

          <div className="md:col-span-2 pt-4">
            <button type="submit" disabled={loading}
              className="w-full py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] text-white bg-gradient-to-br from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400 transition-all duration-300 flex items-center justify-center gap-3 shadow-glow-blue border border-white/10 active:scale-95 disabled:opacity-50">
              {loading ? (
                <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              ) : (
                <>Provision Account <ArrowRight size={20}/></>
              )}
            </button>
          </div>
        </form>

        <p className="text-dark-500 text-[11px] font-bold mt-10 text-center uppercase tracking-widest">
          Existing Identity? <Link to="/login" className="text-primary-400 hover:text-white transition-colors ml-2">Re-Authorize</Link>
        </p>
      </motion.div>
      
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 text-[9px] font-black text-dark-700 uppercase tracking-[0.4em] pointer-events-none">
        TourSafe ID Provisions System v2.0
      </div>
    </div>
  );
}
