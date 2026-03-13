import { motion } from 'motion/react';
import { Search, PenTool, Lock, DollarSign } from 'lucide-react';

const features = [
  {
    id: 'scout',
    title: 'AI SCOUT NODE',
    description: 'Scans the entire web and major job boards in real-time to find gigs that match your specific skills and "vibe."',
    icon: Search,
    colorClass: 'text-brand-primary border-brand-primary/30 shadow-[0_0_15px_rgba(249,115,22,0.3)]',
  },
  {
    id: 'proposal',
    title: 'AUTO-PROPOSAL ENGINE',
    description: 'Uses a "Voice Clone" of your writing style to draft and send professional, high-conversion proposals instantly.',
    icon: PenTool,
    colorClass: 'text-brand-secondary border-brand-secondary/30 shadow-[0_0_15px_rgba(244,63,94,0.3)]',
  },
  {
    id: 'escrow',
    title: 'THE ESCROW VAULT',
    description: 'A secure payment bridge. Companies deposit funds into the platform; these appear as "Credits" in your wallet.',
    icon: Lock,
    colorClass: 'text-brand-accent border-brand-accent/30 shadow-[0_0_15px_rgba(16,185,129,0.3)]',
  },
  {
    id: 'finance',
    title: 'FINANCIAL MANAGEMENT',
    description: 'Automatically tracks taxes and commissions, ensuring you only see your "real" take-home pay.',
    icon: DollarSign,
    colorClass: 'text-zinc-300 border-zinc-300/30 shadow-[0_0_15px_rgba(203,213,225,0.3)]',
  },
];

export function Features() {
  return (
    <section className="relative min-h-screen flex flex-col justify-center py-32 px-4 bg-brand-dark/80 backdrop-blur-md border-y border-white/5">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-24">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            className="text-4xl md:text-5xl font-display font-bold text-white mb-6"
          >
            SYSTEM MODULES
          </motion.h2>
          <div className="h-1 w-24 bg-gradient-to-r from-brand-primary to-brand-secondary mx-auto" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {features.map((feature, index) => (
            <motion.div
              key={feature.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              className="group relative p-8 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-colors overflow-hidden"
            >
              <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500 bg-gradient-to-br from-brand-primary via-transparent to-brand-secondary" />
              
              <div className="relative z-10 flex flex-col h-full">
                <div className="flex items-center gap-4 mb-6">
                  <div className={`p-4 rounded-lg bg-black/50 border ${feature.colorClass}`}>
                    <feature.icon size={32} />
                  </div>
                  <h3 className="text-2xl font-display font-bold tracking-wide text-zinc-200">
                    {feature.title}
                  </h3>
                </div>
                
                <p className="text-zinc-400 font-mono leading-relaxed flex-grow">
                  {feature.description}
                </p>

                <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between text-xs font-mono text-zinc-500">
                  <span>STATUS: <span className="text-red-500">ONLINE</span></span>
                  <span>MODULE_ID: {feature.id.toUpperCase()}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
