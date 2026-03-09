import { motion } from 'motion/react';
import { Check, Zap } from 'lucide-react';

const tiers = [
  {
    name: 'HYPHEN PLUS',
    price: '$15',
    target: 'The Part-Time Side-Hustler',
    features: [
      'Monitors 3 major platforms',
      '15 AI-generated proposals/mo',
      'Standard withdrawal (3-5 days)',
      '10% platform fee',
    ],
    highlight: false,
    color: 'neon-blue',
  },
  {
    name: 'HYPHEN PRO',
    price: '$39',
    target: 'The Full-Time Freelancer',
    features: [
      'Monitors 10+ platforms & Hidden Web',
      'Unlimited proposals w/ Multi-Voice',
      'Priority Draw (24-hour withdrawals)',
      'Reduced platform fee (5%)',
    ],
    highlight: true,
    color: 'neon-purple',
  },
  {
    name: 'HYPHEN ULTRA',
    price: '$89',
    target: 'The "Agency of One"',
    features: [
      'Global web-scale scouting',
      'Autonomous Mode (Auto-apply)',
      'Instant Draw (Immediate withdrawal)',
      '0% platform fee',
      'Automated tax & contract review',
    ],
    highlight: false,
    color: 'terminal-green',
  },
];

export function Pricing() {
  return (
    <section className="relative min-h-screen flex flex-col justify-center py-32 px-4 bg-deep-space/90 backdrop-blur-md border-t border-white/5">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-24">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            className="text-4xl md:text-5xl font-display font-bold text-white mb-6"
          >
            ACCESS TIERS
          </motion.h2>
          <div className="h-1 w-24 bg-gradient-to-r from-neon-blue to-neon-purple mx-auto" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {tiers.map((tier, index) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              className={`relative p-8 rounded-xl border bg-black/40 backdrop-blur-sm flex flex-col ${
                tier.highlight 
                  ? 'border-neon-purple shadow-[0_0_30px_rgba(188,19,254,0.2)] scale-105 z-10' 
                  : 'border-white/10 hover:border-white/30'
              }`}
            >
              {tier.highlight && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-neon-purple text-white text-xs font-display font-bold tracking-widest rounded-sm">
                  RECOMMENDED
                </div>
              )}

              <div className="mb-8">
                <h3 className={`text-xl font-display font-bold tracking-widest mb-2 ${
                  tier.color === 'neon-blue' ? 'text-neon-blue' :
                  tier.color === 'neon-purple' ? 'text-neon-purple' :
                  'text-red-500'
                }`}>
                  {tier.name}
                </h3>
                <div className="text-slate-400 font-mono text-sm mb-6">{tier.target}</div>
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-display font-bold text-white">{tier.price}</span>
                  <span className="text-slate-500 font-mono">/mo</span>
                </div>
              </div>

              <ul className="space-y-4 mb-12 flex-grow font-mono text-sm text-slate-300">
                {tier.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <Check size={16} className={`mt-1 shrink-0 ${
                      tier.color === 'neon-blue' ? 'text-neon-blue' :
                      tier.color === 'neon-purple' ? 'text-neon-purple' :
                      'text-red-500'
                    }`} />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <button className={`w-full py-4 font-display font-bold tracking-widest uppercase transition-all duration-300 flex items-center justify-center gap-2 ${
                tier.highlight
                  ? 'bg-neon-purple text-white hover:bg-neon-purple/80 hover:shadow-[0_0_20px_rgba(188,19,254,0.5)]'
                  : 'border border-white/20 text-white hover:bg-white/10'
              }`}>
                <Zap size={16} /> INITIALIZE
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
