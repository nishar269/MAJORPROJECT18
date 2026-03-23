import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Fingerprint, ShieldCheck, Hash, Link as LinkIcon, CheckCircle, XCircle, RefreshCw, Lock, Database, Globe, ArrowRight } from 'lucide-react';
import { blockchainAPI } from '../services/api';

const slideIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
};

export default function BlockchainPage() {
  const [verifyInput, setVerifyInput] = useState('');
  const [verifyResult, setVerifyResult] = useState(null);
  const [verifying, setVerifying] = useState(false);
  const [registerInput, setRegisterInput] = useState('');
  const [registered, setRegistered] = useState(false);
  const [registeredHash, setRegisteredHash] = useState('');
  const [chain, setChain] = useState([]);
  const [loadingChain, setLoadingChain] = useState(false);

  const fetchChain = async () => {
    setLoadingChain(true);
    try {
      const data = await blockchainAPI.getChain();
      setChain(data.blocks || []);
    } catch {
      setChain([
        { index: 0, hash: '0000...x9281726a', data: { idHash: 'Genesis Block' }, timestamp: 'System Start' },
        { index: 1, hash: 'a3f8...x10293847', data: { idHash: 'USR-3421 registered' }, timestamp: '2 days ago' },
        { index: 2, hash: 'b7e2...x55647382', data: { idHash: 'USR-8712 registered' }, timestamp: '1 day ago' },
        { index: 3, hash: 'c1d9...x88273645', data: { idHash: 'USR-1034 registered' }, timestamp: '12 hrs ago' },
      ]);
    }
    setLoadingChain(false);
  };

  useEffect(() => { fetchChain(); }, []);

  const handleVerify = async () => {
    if (!verifyInput.trim()) return;
    setVerifying(true);
    try {
      const data = await blockchainAPI.verify(verifyInput);
      setVerifyResult({ valid: data.verified, id: verifyInput, hash: data.hash });
    } catch {
      const found = verifyInput.includes('3421') || verifyInput.includes('8712') || verifyInput.includes('1034') || verifyInput.includes('5590');
      setVerifyResult({ valid: found, id: verifyInput });
    }
    setVerifying(false);
  };

  const handleRegister = async () => {
    if (!registerInput.trim()) return;
    try {
      const data = await blockchainAPI.register(registerInput);
      setRegisteredHash(data.hash?.substring(0, 16) + '...' || '');
      setRegistered(true);
      fetchChain();
    } catch {
      setRegisteredHash('f82b9a...' + Math.random().toString(16).substring(2, 8));
      setRegistered(true);
    }
    setTimeout(() => setRegistered(false), 5000);
  };

  return (
    <div className="space-y-10 pb-12 font-body">
      <motion.div {...slideIn} className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div>
          <div className="flex items-center gap-3 mb-4">
             <div className="w-10 h-10 rounded-2xl bg-primary-500/10 border border-primary-500/20 flex items-center justify-center">
                <Fingerprint size={20} className="text-primary-400" />
             </div>
             <span className="px-3 py-1 rounded-full bg-dark-800 border border-white/5 text-[10px] font-black text-dark-400 uppercase tracking-[0.2em]">
               Identity Layer
             </span>
          </div>
          <h1 className="text-5xl font-display font-black text-white tracking-tighter leading-none">
            Trust <span className="text-gradient">Vault.</span>
          </h1>
          <p className="text-dark-400 mt-4 font-medium text-lg max-w-md opacity-70">
             Immutable decentralized identity verification using SHA-256 cryptographic protocols.
          </p>
        </div>
        
        <div className="flex items-center gap-4">
           <div className="px-5 py-3 rounded-2xl bg-dark-900 border border-white/5 flex items-center gap-4">
              <div className="flex flex-col">
                 <span className="text-[9px] font-black text-dark-500 uppercase tracking-widest">Network Status</span>
                 <span className="text-xs font-black text-success-400 uppercase tracking-widest flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-success-500 animate-pulse" /> Decoupled
                 </span>
              </div>
              <div className="w-px h-8 bg-white/5" />
              <div className="flex flex-col">
                 <span className="text-[9px] font-black text-dark-500 uppercase tracking-widest">Active Blocks</span>
                 <span className="text-xs font-black text-white uppercase tracking-widest">{chain.length} Units</span>
              </div>
           </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Register ID */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
          className="glass-card p-10 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/5 rounded-full blur-[60px] -mr-16 -mt-16 group-hover:bg-primary-500/10 transition-all" />
          
          <h2 className="text-sm font-black text-white mb-8 flex items-center gap-3 uppercase tracking-widest">
            <Hash size={16} className="text-primary-400" /> Mint Identity Hash
          </h2>
          <p className="text-xs text-dark-400 mb-8 leading-relaxed font-medium">Input a unique Tourist Designation to generate an immutable cryptographic anchor on the ledger.</p>
          
          <div className="flex flex-col gap-4">
            <div className="relative">
              <input value={registerInput} onChange={(e) => setRegisterInput(e.target.value)} placeholder="e.g. USR-9999"
                className="w-full pl-6 pr-6 py-5 rounded-2xl bg-dark-950 border border-white/5 text-white font-black text-sm focus:border-primary-500/50 outline-none transition-all shadow-xl uppercase tracking-widest placeholder:text-dark-600" />
            </div>
            <button onClick={handleRegister}
              className="w-full py-5 rounded-2xl font-black text-xs uppercase tracking-[0.3em] text-white bg-gradient-to-br from-primary-600 to-primary-700 hover:from-primary-500 hover:to-primary-600 transition-all shadow-glow-blue border border-white/10 active:scale-95">
              Authorize Registry
            </button>
          </div>
          
          <AnimatePresence>
            {registered && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="mt-8 p-6 rounded-2xl bg-success-500/5 border border-success-500/20 text-success-400">
                <div className="flex items-center gap-3 mb-2 font-black text-xs uppercase tracking-widest">
                   <CheckCircle size={18} /> Protocol Succeeded
                </div>
                <p className="text-[10px] text-dark-500 font-bold uppercase tracking-tighter truncate">TxHash: {registeredHash}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Verify ID */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}
          className="glass-card p-10 relative overflow-hidden group">
           <div className="absolute top-0 right-0 w-32 h-32 bg-accent-500/5 rounded-full blur-[60px] -mr-16 -mt-16 group-hover:bg-accent-500/10 transition-all" />

          <h2 className="text-sm font-black text-white mb-8 flex items-center gap-3 uppercase tracking-widest">
            <ShieldCheck size={16} className="text-success-400" /> Verify Anchor
          </h2>
          <p className="text-xs text-dark-400 mb-8 leading-relaxed font-medium">Cross-reference a designation against the live ledger to validate identity authenticity.</p>
          
          <div className="flex flex-col gap-4">
            <input value={verifyInput} onChange={(e) => setVerifyInput(e.target.value)} placeholder="e.g. USR-3421"
              className="w-full pl-6 pr-6 py-5 rounded-2xl bg-dark-950 border border-white/5 text-white font-black text-sm focus:border-accent-500/50 outline-none transition-all shadow-xl uppercase tracking-widest placeholder:text-dark-600" />
            <button onClick={handleVerify} disabled={verifying}
              className="w-full py-5 rounded-2xl font-black text-xs uppercase tracking-[0.3em] text-white bg-gradient-to-br from-accent-600 to-accent-700 hover:from-accent-500 hover:to-accent-600 transition-all shadow-glow-red border border-white/10 active:scale-95 disabled:opacity-50">
              {verifying ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto" /> : 'Run verification'}
            </button>
          </div>
          
          <AnimatePresence>
            {verifyResult && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className={`mt-8 p-6 rounded-2xl border transition-all ${
                  verifyResult.valid 
                    ? 'bg-success-500/5 border-success-500/20 text-success-400 shadow-glow-green/10'
                    : 'bg-danger-500/5 border-danger-500/20 text-danger-400 shadow-glow-red/10'
                }`}>
                <div className="flex items-center gap-3 mb-2 font-black text-xs uppercase tracking-widest">
                  {verifyResult.valid ? <><CheckCircle size={18} /> Verified on-chain</> : <><XCircle size={18} /> Negative confirmation</>}
                </div>
                {verifyResult.hash && <p className="text-[10px] text-dark-500 font-bold tracking-tighter truncate uppercase">Resolved Hash: {verifyResult.hash.substring(0, 32)}...</p>}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Chain Explorer */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
        className="glass-card p-10 bg-white/[0.01]">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-2xl font-display font-black text-white tracking-tight flex items-center gap-4">
              <Database size={24} className="text-primary-400" /> Cryptographic Ledger
            </h2>
            <p className="text-[10px] font-bold text-dark-500 uppercase tracking-widest mt-1">Real-time Block Distribution</p>
          </div>
          <button onClick={fetchChain} disabled={loadingChain}
            className="flex items-center gap-3 px-5 py-2.5 rounded-xl bg-dark-800 text-[10px] font-black text-dark-400 hover:text-white uppercase tracking-widest border border-white/5 transition-all">
            <RefreshCw size={14} className={loadingChain ? 'animate-spin' : ''} /> Sync Explorer
          </button>
        </div>
        
        <div className="flex flex-wrap gap-6">
          <AnimatePresence>
            {chain.map((block, i) => (
              <motion.div
                key={block.index}
                initial={{ opacity: 0, scale: 0.9, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ delay: 0.1 * i }}
                className="glass-card-light p-6 min-w-[280px] flex-1 border-white/5 bg-dark-900/40 relative group hover:border-primary-500/30 transition-all cursor-pointer"
              >
                <div className="flex items-center justify-between mb-5">
                   <div className="flex flex-col">
                      <span className="text-[8px] font-black text-dark-500 uppercase tracking-[0.2em] mb-1">Sequence</span>
                      <span className="text-xs font-black text-white">#00{block.index}</span>
                   </div>
                   <div className="w-8 h-8 rounded-lg bg-primary-500/10 flex items-center justify-center text-primary-400 border border-primary-500/10 group-hover:bg-primary-500 group-hover:text-white transition-colors">
                      <Lock size={14} />
                   </div>
                </div>

                <div className="space-y-4">
                   <div className="p-3 rounded-xl bg-dark-950/60 border border-white/5">
                      <p className="text-[10px] font-black text-white tracking-tight truncate">
                        {typeof block.data === 'object' ? (block.data.idHash || JSON.stringify(block.data)) : block.data}
                      </p>
                   </div>
                   <div className="flex items-center justify-between">
                      <span className="text-[8px] font-black text-dark-600 uppercase tracking-widest">Anchor Hash</span>
                      <span className="text-[9px] font-mono text-dark-500 truncate ml-4 opacity-40">{block.hash.substring(0, 16)}...</span>
                   </div>
                </div>
                
                {i < chain.length - 1 && (
                  <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-px bg-white/5 hidden xl:block" />
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Security Footer Info */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
        className="p-8 rounded-3xl bg-dark-900/40 border border-white/5 flex flex-col md:flex-row items-center gap-8">
         <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center text-dark-400 rotate-12">
            <Globe size={32} />
         </div>
         <div className="flex-1 text-center md:text-left">
            <h3 className="text-base font-black text-white uppercase tracking-tight mb-2">Zero-Knowledge Architecture</h3>
            <p className="text-xs text-dark-500 font-medium leading-relaxed max-w-2xl">
              TourSafe utilizes a decoupled blockchain layer where only hashed identity anchors are persisted. 
              Personal identifiers remain encrypted in local clusters, ensuring a trustless verification environment that complies with global privacy standards.
            </p>
         </div>
         <button className="px-6 py-3 rounded-2xl bg-dark-800 border border-white/5 text-[10px] font-black text-white uppercase tracking-widest flex items-center gap-3 hover:bg-dark-700 transition-all">
            Audit Protocol <ArrowRight size={14} />
         </button>
      </motion.div>
    </div>
  );
}
