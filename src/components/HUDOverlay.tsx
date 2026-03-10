import { useEffect, useState } from 'react';

export function HUDOverlay() {
  const [time, setTime] = useState('');
  const [hex, setHex] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      const d = new Date();
      setTime(`${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}:${d.getSeconds().toString().padStart(2, '0')} UTC`);
      setHex(Math.floor(Math.random() * 16777215).toString(16).toUpperCase().padStart(6, '0'));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-40 p-6 flex flex-col justify-between font-mono text-[10px] text-neon-blue/50 tracking-widest uppercase mix-blend-screen">
      <div className="flex justify-between items-start">
        <div className="flex flex-col gap-1">
          <div className="text-neon-blue font-bold tracking-[0.2em] flex items-center gap-2">
            <div className="w-2 h-2 bg-neon-blue animate-pulse rounded-full" />
            HYPHEN_OS // V.2.4.1
          </div>
          <div className="pl-4 border-l border-neon-blue/30 text-slate-400">SYS.CORE.ONLINE</div>
        </div>
        <div className="text-right flex flex-col gap-1">
          <div className="text-white/80">{time}</div>
          <div className="text-terminal-green">LATENCY: 12ms</div>
        </div>
      </div>
      
      <div className="flex justify-between items-end">
        <div className="flex flex-col gap-1">
          <div className="text-neon-purple">UPLINK: SECURE</div>
          <div className="text-slate-500">NODE: ALPHA-7</div>
        </div>
        <div className="text-right flex flex-col gap-1">
          <div className="text-slate-400">MEM_ALLOC: 42%</div>
          <div className="text-neon-blue">0x{hex}</div>
        </div>
      </div>
    </div>
  );
}
