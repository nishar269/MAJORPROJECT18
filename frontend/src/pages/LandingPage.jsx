import { motion } from 'framer-motion';
import { Shield, Globe, Zap, ArrowRight, ShieldCheck, Activity, Fingerprint, Lock, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-dark-950 text-white font-body selection:bg-primary-500/30 overflow-x-hidden">
      {/* Dynamic Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[10%] left-[-5%] w-[40%] h-[40%] bg-primary-500/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[10%] right-[-5%] w-[40%] h-[40%] bg-accent-500/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="aurora-bg opacity-30" />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 w-full z-50 border-b border-white/5 bg-dark-950/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-glow-blue border border-white/10">
              <Shield size={20} className="text-white" />
            </div>
            <span className="text-xl font-display font-black tracking-tight">TourSafe</span>
          </div>
          
          <div className="hidden md:flex items-center gap-10">
            {['Architecture', 'AI Sentinel', 'Blockchain ID', 'Safety Network'].map(item => (
              <a key={item} href={`#${item.toLowerCase().replace(' ', '-')}`} className="text-[10px] font-black uppercase tracking-[0.2em] text-dark-400 hover:text-white transition-colors">
                {item}
              </a>
            ))}
          </div>

          <Link to="/login" className="px-6 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 text-[10px] font-black uppercase tracking-widest transition-all hover:bg-white/10">
            Operator Access
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-40 pb-32 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div {...fadeIn} className="flex items-center justify-center gap-2 mb-8">
             <span className="px-3 py-1 rounded-full bg-primary-500/10 border border-primary-500/20 text-[10px] font-black text-primary-400 uppercase tracking-widest">
               v2.0 Neural Safety Protocol
             </span>
             <span className="w-1.5 h-1.5 rounded-full bg-success-500 animate-pulse shadow-glow-green" />
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="text-6xl md:text-8xl font-display font-black tracking-tighter leading-[0.9] mb-8"
          >
            The Next Generation of <br/>
            <span className="text-gradient">Tourist Intelligence.</span>
          </h1 >
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="text-lg md:text-xl text-dark-400 max-w-2xl mx-auto font-medium mb-12 opacity-80"
          >
            An AI-powered safety sentinel providing real-time behavioral telemetry, 
            decentralized identity verification, and predictive anomaly detection.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link to="/register" className="w-full sm:w-auto px-10 py-5 rounded-2xl bg-gradient-to-br from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400 text-white font-black text-xs uppercase tracking-[0.2em] shadow-glow-blue transition-all active:scale-95 border border-white/10 flex items-center justify-center gap-3">
              Establish ID <ArrowRight size={18}/>
            </Link>
            <a href="#features" className="w-full sm:w-auto px-10 py-5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 text-white font-black text-xs uppercase tracking-[0.2em] transition-all">
              Explore Network
            </a>
          </motion.div>
        </div>
        
        {/* Floating Mockup Preview */}
        <motion.div 
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.8 }}
          className="mt-24 max-w-5xl mx-auto relative group"
        >
          <div className="absolute inset-0 bg-primary-500/20 rounded-[2.5rem] blur-[80px] opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="glass-card p-4 border-white/10 shadow-2xl relative overflow-hidden">
             <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-500 to-accent-500" />
             <img 
               src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=2070" 
               alt="System Dashboard" 
               className="w-full h-auto rounded-xl opacity-80"
             />
             <div className="absolute inset-0 bg-gradient-to-t from-dark-950/80 via-transparent to-transparent" />
             <div className="absolute bottom-10 left-10 flex items-center gap-6">
                <div className="glass-card-light p-4 flex items-center gap-4">
                  <Activity size={24} className="text-primary-400 animate-pulse" />
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-dark-500">ML Engine</p>
                    <p className="text-sm font-bold text-white tracking-widest">ISOLATION FOREST V3</p>
                  </div>
                </div>
                <div className="glass-card-light p-4 flex items-center gap-4">
                  <Fingerprint size={24} className="text-success-400" />
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-dark-500">ID Verification</p>
                    <p className="text-sm font-bold text-white tracking-widest">BLOCKCHAIN SYNCED</p>
                  </div>
                </div>
             </div>
          </div>
        </motion.div>
      </section>

      {/* Feature Pillar Grid */}
      <section id="features" className="py-32 px-6 border-t border-white/5 bg-dark-950/50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { 
                icon: Zap, 
                title: "AI Sentinel Engine", 
                desc: "Real-time anomaly detection using Isolation Forest models to identify spatial outliers and irregular tourist behaviors before they escalate.",
                color: "primary"
              },
              { 
                icon: Fingerprint, 
                title: "Blockchain Identity", 
                desc: "Tamper-proof identity anchors hashed on an immutable SHA-256 ledger. Privacy-first, verification-ready safety infrastructure.",
                color: "success"
              },
              { 
                icon: Globe, 
                title: "Neural Safety Mesh", 
                desc: "Dynamic geo-fencing and real-time telemetry across sectors, synchronized with central command dashboards for sub-second response.",
                color: "accent"
              }
            ].map((f, i) => (
              <motion.div 
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="glass-card p-10 border-white/5 hover:border-white/10 transition-all group"
              >
                <div className={`w-16 h-16 rounded-2xl bg-${f.color}-500/10 flex items-center justify-center mb-8 shadow-glow-${f.color} border border-${f.color}-500/20 group-hover:scale-110 transition-transform`}>
                   <f.icon size={32} className={`text-${f.color}-400`} />
                </div>
                <h3 className="text-2xl font-display font-black text-white mb-4 tracking-tight">{f.title}</h3>
                <p className="text-dark-500 font-medium leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Global Status Banner */}
      <section className="py-20 bg-primary-600">
         <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-center md:text-left">
               <h2 className="text-3xl md:text-5xl font-display font-black text-white tracking-tighter mb-2">Build a safer heritage network.</h2>
               <p className="text-primary-100 font-medium opacity-80 uppercase tracking-widest text-[10px]">Secure your tourism sector with TourSafe ID</p>
            </div>
            <Link to="/register" className="px-10 py-5 rounded-2xl bg-white text-primary-600 font-black text-xs uppercase tracking-[0.2em] shadow-2xl hover:bg-primary-50 transition-all active:scale-95">
               Establish Terminal Access
            </Link>
         </div>
      </section>

      {/* Footer */}
      <footer className="py-20 px-6 border-t border-white/5 bg-dark-950">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-dark-800 flex items-center justify-center border border-white/10">
              <Shield size={16} className="text-primary-400" />
            </div>
            <span className="text-sm font-black uppercase tracking-widest text-dark-400">TourSafe © 2026</span>
          </div>
          <div className="flex items-center gap-8">
             {['Privacy', 'Governance', 'API Archive', 'Network Status'].map(item => (
               <a key={item} href="#" className="text-[10px] font-bold uppercase tracking-widest text-dark-600 hover:text-white transition-colors">
                 {item}
               </a>
             ))}
          </div>
          <div className="flex items-center gap-4">
             <div className="w-2 h-2 rounded-full bg-success-500" />
             <span className="text-[10px] font-black text-dark-500 uppercase tracking-widest">System Synchronized</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
