import { Cpu } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Logo() {
  return (
    <Link 
      to="/" 
      className="fixed top-6 left-6 z-[60] flex items-center gap-3 group"
    >
      <div className="relative flex items-center justify-center w-10 h-10 bg-black/50 border border-neon-blue/50 rounded-lg backdrop-blur-md overflow-hidden group-hover:border-neon-blue transition-colors duration-300 shadow-[0_0_15px_rgba(0,243,255,0.2)] group-hover:shadow-[0_0_25px_rgba(0,243,255,0.5)]">
        <div className="absolute inset-0 bg-neon-blue/10 group-hover:bg-neon-blue/20 transition-colors duration-300" />
        <Cpu className="w-5 h-5 text-neon-blue" />
      </div>
      <div className="flex flex-col">
        <span className="font-display font-bold text-lg tracking-widest text-white leading-none group-hover:text-neon-blue transition-colors duration-300">
          HYPHEN
        </span>
        <span className="font-mono text-[10px] tracking-[0.3em] text-neon-purple leading-none mt-1">
          NEXUS_CORE
        </span>
      </div>
    </Link>
  );
}
