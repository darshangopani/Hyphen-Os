import { motion } from 'motion/react';
import { Terminal, ShieldCheck, Zap, LogOut } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export function Hero() {
  const [text, setText] = useState('');
  const fullText = "Automate your gig search, clone your proposal voice, and secure your payments in the Escrow Vault. Focus on the work. We handle the business.";
  const { user, logout } = useAuth();

  useEffect(() => {
    let i = 0;
    const timer = setInterval(() => {
      setText(fullText.slice(0, i));
      i++;
      if (i > fullText.length) clearInterval(timer);
    }, 30);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-start pt-20 pb-32 px-4 lg:pl-12 overflow-hidden">
      {/* Grid overlay */}
      <div className="absolute inset-0 z-0 bg-[linear-gradient(rgba(0,243,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(0,243,255,0.05)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_60%_60%_at_0%_50%,#000_70%,transparent_100%)] pointer-events-none" />

      <div className="relative z-10 flex flex-col items-start text-left w-full lg:w-[55%]">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-neon-blue/30 bg-neon-blue/10 backdrop-blur-sm text-neon-blue font-mono text-sm mb-8"
        >
          <Terminal size={16} />
          <span>SYS.BOOT // HYPHEN_OS_ONLINE {user ? `// USER: ${user.email || user.displayName || 'ANONYMOUS'}` : ''}</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1.2, delay: 0.7, ease: 'easeOut' }}
          className="text-5xl md:text-7xl lg:text-8xl font-display font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white via-slate-300 to-slate-600 mb-6 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)] relative"
        >
          <span className="relative inline-block after:content-['THE_COMMAND'] after:absolute after:top-0 after:left-0 after:text-white after:opacity-0 hover:after:opacity-100 hover:after:animate-scan">THE COMMAND</span><br />
          CENTER<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-blue to-neon-purple drop-shadow-[0_0_20px_rgba(0,243,255,0.5)]">
            FOR FREELANCERS
          </span>
        </motion.h1>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="max-w-xl text-lg md:text-xl text-slate-400 font-mono leading-relaxed mb-12 min-h-[100px]"
        >
          <span className="text-neon-blue mr-2">{'>'}</span>
          {text}
          <span className="inline-block w-2 h-5 bg-neon-blue ml-1 animate-pulse" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="flex flex-col sm:flex-row gap-6"
        >
          {user ? (
            <>
              <button className="group relative px-8 py-4 bg-neon-blue text-deep-space font-display font-bold uppercase tracking-widest overflow-hidden rounded-sm hover:shadow-[0_0_30px_rgba(0,243,255,0.6)] transition-all duration-300">
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                <span className="relative flex items-center gap-2">
                  <Zap size={18} /> DASHBOARD
                </span>
              </button>
              <button onClick={() => logout()} className="group px-8 py-4 border border-red-500/50 text-red-400 font-display font-bold uppercase tracking-widest rounded-sm hover:bg-red-500/10 transition-all duration-300">
                <span className="flex items-center gap-2">
                  <LogOut size={18} /> LOGOUT
                </span>
              </button>
            </>
          ) : (
            <>
              <Link to="/signup" className="group relative px-8 py-4 bg-neon-blue text-deep-space font-display font-bold uppercase tracking-widest overflow-hidden rounded-sm hover:shadow-[0_0_30px_rgba(0,243,255,0.6)] transition-all duration-300">
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                <span className="relative flex items-center gap-2">
                  <Zap size={18} /> INITIALIZE
                </span>
              </Link>
              
              <Link to="/login" className="group px-8 py-4 border border-neon-purple text-neon-purple font-display font-bold uppercase tracking-widest rounded-sm hover:bg-neon-purple/10 transition-all duration-300">
                <span className="flex items-center gap-2">
                  <ShieldCheck size={18} /> LOGIN
                </span>
              </Link>
            </>
          )}
        </motion.div>
      </div>
    </section>
  );
}
