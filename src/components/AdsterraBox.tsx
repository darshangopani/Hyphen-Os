export function AdsterraBox({ id, width, height }: { id: string; width: number; height: number }) {
  return (
    <div 
      className="relative flex items-center justify-center bg-black/50 border border-neon-purple/30 rounded overflow-hidden group"
      style={{ width, height }}
    >
      {/* Decorative corners */}
      <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-neon-purple" />
      <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-neon-purple" />
      <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-neon-purple" />
      <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-neon-purple" />

      <div className="text-xs font-mono text-neon-purple/50 uppercase tracking-widest text-center">
        [ AD_UNIT_NODE_{id} ]<br/>
        {width}x{height}
      </div>

      {/* Actual Adsterra script would go here in production */}
      {/* <script type="text/javascript" src={`//www.highperformanceformat.com/YOUR_ADSTERRA_KEY/invoke.js`}></script> */}
    </div>
  );
}
