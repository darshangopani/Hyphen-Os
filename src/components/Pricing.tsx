import { motion } from 'motion/react';
import { Check, Zap, Shield, Cpu, Globe } from 'lucide-react';

const tiers = [
  {
    name: 'HYPHEN PLUS',
    price: '$15',
    target: 'Manual search & drafting only',
    icon: Shield,
    features: [
      'No AI-Fulfillment',
      'If you don\'t find a job, keep looking',
      'Basic platform access',
    ],
    highlight: false,
    color: 'brand-primary',
    hexColor: '#f97316',
    sysCode: 'SYS.01.MANUAL',
  },
  {
    name: 'HYPHEN PRO',
    price: '$39',
    target: 'The Pro Safety Net',
    icon: Zap,
    features: [
      'Unlocks 3-5 "Internal" AI Tasks if no match in 48h',
      'AI completes tasks (data cleaning, UI, SEO) under your name',
      'Company pays Hyphen OS, you receive credits',
      '5% commission for AI heavy lifting',
    ],
    highlight: true,
    color: 'brand-secondary',
    hexColor: '#f43f5e',
    sysCode: 'SYS.02.AUTO',
  },
  {
    name: 'HYPHEN ULTRA',
    price: '$89',
    target: 'The Autonomous Agency',
    icon: Cpu,
    features: [
      'Up to 11 AI-Managed Jobs per month',
      'AI works in the background on complex tasks',
      'Credits instantly added to wallet upon completion',
      'Reduced 3% commission for Ultra members',
    ],
    highlight: false,
    color: 'brand-accent',
    hexColor: '#10b981',
    sysCode: 'SYS.03.AGENCY',
  },
];

export function Pricing() {
  return (
    <section className="relative min-h-screen flex flex-col justify-center py-32 px-4 bg-brand-dark/90 backdrop-blur-md border-t border-white/5 overflow-hidden">
      {/* Tech Background Elements */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
      </div>

      <div className="container mx-auto max-w-6xl relative z-10">
        <div className="text-center mb-24">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm mb-6"
          >
            <Globe size={14} className="text-brand-primary" />
            <span className="text-xs font-mono tracking-widest text-zinc-300 uppercase">System Access Levels</span>
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            className="text-4xl md:text-6xl font-display font-bold text-white mb-6 uppercase tracking-tight"
          >
            Select Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary via-brand-secondary to-brand-primary animate-pulse">Protocol</span>
          </motion.h2>
          <div className="h-1 w-32 bg-gradient-to-r from-transparent via-brand-secondary to-transparent mx-auto opacity-50" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
          {tiers.map((tier, index) => {
            const Icon = tier.icon;
            return (
              <motion.div
                key={tier.name}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                whileHover={{ y: -10 }}
                className={`relative p-8 flex flex-col group ${
                  tier.highlight 
                    ? 'bg-black/60 border border-brand-secondary/50 shadow-[0_0_40px_rgba(244,63,94,0.15)] lg:scale-105 z-10 lg:-mx-4 min-h-[600px]' 
                    : 'bg-black/40 border border-white/10 hover:border-white/30 min-h-[550px]'
                }`}
              >
                {/* Tech Corners */}
                <div className={`absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 ${tier.highlight ? 'border-brand-secondary' : 'border-white/20'}`} />
                <div className={`absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 ${tier.highlight ? 'border-brand-secondary' : 'border-white/20'}`} />
                <div className={`absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 ${tier.highlight ? 'border-brand-secondary' : 'border-white/20'}`} />
                <div className={`absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 ${tier.highlight ? 'border-brand-secondary' : 'border-white/20'}`} />

                {/* Scanning Line Effect for Highlighted Tier */}
                {tier.highlight && (
                  <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-0 left-0 w-full h-[2px] bg-brand-secondary/50 shadow-[0_0_10px_rgba(244,63,94,0.8)] animate-scan" />
                  </div>
                )}

                {tier.highlight && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-6 py-1 bg-brand-secondary text-white text-xs font-display font-bold tracking-widest rounded-sm shadow-[0_0_20px_rgba(244,63,94,0.4)]">
                    RECOMMENDED
                  </div>
                )}

                <div className="mb-8 relative z-10">
                  <div className="flex justify-between items-start mb-6">
                    <div className={`p-3 rounded-lg bg-white/5 border border-white/10 ${
                      tier.color === 'brand-primary' ? 'text-brand-primary' :
                      tier.color === 'brand-secondary' ? 'text-brand-secondary' :
                      'text-brand-accent'
                    }`}>
                      <Icon size={24} />
                    </div>
                    <div className="text-[10px] font-mono text-zinc-500 tracking-widest">{tier.sysCode}</div>
                  </div>

                  <h3 className={`text-2xl font-display font-bold tracking-widest mb-2 ${
                    tier.color === 'brand-primary' ? 'text-brand-primary' :
                    tier.color === 'brand-secondary' ? 'text-brand-secondary' :
                    'text-brand-accent'
                  }`}>
                    {tier.name}
                  </h3>
                  <div className="text-zinc-400 font-mono text-sm mb-6 h-10">{tier.target}</div>
                  
                  <div className="flex items-baseline gap-2 pb-6 border-b border-white/10">
                    <span className="text-5xl font-display font-bold text-white">{tier.price}</span>
                    <span className="text-zinc-500 font-mono">/mo</span>
                  </div>
                </div>

                <ul className="space-y-5 mb-12 flex-grow font-mono text-sm text-zinc-300 relative z-10">
                  {tier.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-4">
                      <div className={`mt-1 shrink-0 p-1 rounded-full bg-white/5 ${
                        tier.color === 'brand-primary' ? 'text-brand-primary' :
                        tier.color === 'brand-secondary' ? 'text-brand-secondary' :
                        'text-brand-accent'
                      }`}>
                        <Check size={12} strokeWidth={3} />
                      </div>
                      <span className="leading-relaxed">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button className={`w-full py-4 font-display font-bold tracking-widest uppercase transition-all duration-300 flex items-center justify-center gap-3 relative overflow-hidden group/btn z-10 ${
                  tier.highlight
                    ? 'bg-brand-secondary text-white hover:shadow-[0_0_30px_rgba(244,63,94,0.6)]'
                    : 'bg-white/5 border border-white/20 text-white hover:bg-white/10'
                }`}>
                  <span className="relative z-10 flex items-center gap-2">
                    <Zap size={16} className={tier.highlight ? 'animate-pulse' : ''} /> 
                    INITIALIZE PROTOCOL
                  </span>
                  {/* Button Hover Effect */}
                  <div className={`absolute inset-0 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300 ${
                    tier.highlight ? 'bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:animate-shimmer' : ''
                  }`} />
                </button>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
