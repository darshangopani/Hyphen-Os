import { Terminal } from 'lucide-react';

export function Footer() {
  return (
    <footer className="relative bg-black py-12 px-4 border-t border-white/5">
      <div className="container mx-auto max-w-6xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2 text-brand-primary font-display font-bold tracking-widest">
          <Terminal size={24} />
          <span>HYPHEN_OS</span>
        </div>
        
        <div className="text-zinc-500 font-mono text-xs text-center md:text-left">
          &copy; {new Date().getFullYear()} HYPHEN OS. ALL SYSTEMS OPERATIONAL.<br/>
          DESIGNED FOR MULTI-HYPHENATE FREELANCERS.
        </div>

        <div className="flex gap-6 text-zinc-400 font-mono text-xs">
          <a href="#" className="hover:text-brand-primary transition-colors">TERMS</a>
          <a href="#" className="hover:text-brand-secondary transition-colors">PRIVACY</a>
          <a href="#" className="hover:text-brand-accent transition-colors">STATUS</a>
        </div>
      </div>
    </footer>
  );
}
