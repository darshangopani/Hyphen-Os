/// <reference types="vite/client" />
import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { GoogleGenAI, Type } from '@google/genai';
import { motion } from 'motion/react';
import { Briefcase, Zap, Coins, Building, ChevronRight, CheckCircle2, ArrowRight } from 'lucide-react';

interface JobMatch {
  title: string;
  description: string;
  additionalSkills: string[];
  companies: string[];
}

export function Dashboard() {
  const { user } = useAuth();
  const [skills, setSkills] = useState('');
  const [jobMatches, setJobMatches] = useState<JobMatch[]>([]);
  const [loading, setLoading] = useState(false);
  const [credits, setCredits] = useState(1000);
  const [withdrawMessage, setWithdrawMessage] = useState('');

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const analyzeSkills = async () => {
    if (!skills.trim()) return;
    if (credits < 10) {
      alert("Not enough credits! You need at least 10 credits to analyze skills.");
      return;
    }

    setLoading(true);
    setCredits(prev => prev - 10);
    setJobMatches([]);

    try {
      const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `I have the following skills: ${skills}. Provide a list of 3 job roles that fit these skills. For each role, list 3 additional skills I should learn to be highly competitive, and 3 real companies known to hire for this role.`,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING, description: "Job title" },
                description: { type: Type.STRING, description: "Brief description of the role" },
                additionalSkills: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: "3 additional skills to learn"
                },
                companies: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: "3 real companies hiring for this role"
                }
              },
              required: ["title", "description", "additionalSkills", "companies"]
            }
          }
        }
      });

      const text = response.text;
      if (text) {
        const parsed = JSON.parse(text);
        setJobMatches(parsed);
      }
    } catch (error) {
      console.error("Error analyzing skills:", error);
      alert("Failed to analyze skills. Please try again.");
      // Refund credits on failure
      setCredits(prev => prev + 10);
    } finally {
      setLoading(false);
    }
  };

  const handleWithdraw = () => {
    if (credits < 500) {
      setWithdrawMessage("Minimum withdrawal is 500 credits.");
      setTimeout(() => setWithdrawMessage(''), 3000);
      return;
    }
    
    // Simulate withdrawal process
    setCredits(prev => prev - 500);
    setWithdrawMessage("Successfully withdrew 500 credits to your linked account!");
    setTimeout(() => setWithdrawMessage(''), 5000);
  };

  return (
    <div className="relative z-10 min-h-screen pt-32 pb-20 px-4 md:px-8 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Input & Credits */}
        <div className="lg:col-span-1 space-y-8">
          
          {/* Credits Panel */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-black/40 border border-brand-primary/30 rounded-xl p-6 backdrop-blur-md"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-display font-bold text-white flex items-center gap-2">
                <Coins className="text-brand-primary" />
                CREDIT BALANCE
              </h2>
              <span className="text-2xl font-mono text-brand-primary">{credits}</span>
            </div>
            <p className="text-sm text-zinc-400 mb-6">
              Credits are used to power AI analysis. Earn more by completing tasks or upgrade your plan.
            </p>
            
            <button 
              onClick={handleWithdraw}
              className="w-full py-3 bg-brand-secondary/20 border border-brand-secondary text-brand-secondary font-mono uppercase tracking-widest rounded-sm hover:bg-brand-secondary hover:text-white transition-all duration-300"
            >
              Withdraw Credits
            </button>
            {withdrawMessage && (
              <p className="mt-3 text-sm text-brand-accent font-mono text-center">
                {withdrawMessage}
              </p>
            )}
          </motion.div>

          {/* Skills Input Panel */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-black/40 border border-brand-primary/30 rounded-xl p-6 backdrop-blur-md"
          >
            <h2 className="text-xl font-display font-bold text-white mb-4 flex items-center gap-2">
              <Zap className="text-brand-primary" />
              SKILL ANALYSIS
            </h2>
            <p className="text-sm text-zinc-400 mb-4">
              Enter your current skills (comma separated) to discover matching roles, skill gaps, and hiring companies.
            </p>
            
            <textarea
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              placeholder="e.g. React, TypeScript, Node.js, UI/UX Design..."
              className="w-full h-32 bg-black/50 border border-zinc-700 rounded-lg p-4 text-white font-mono text-sm focus:border-brand-primary focus:ring-1 focus:ring-brand-primary outline-none resize-none mb-4 transition-all"
            />
            
            <button 
              onClick={analyzeSkills}
              disabled={loading || !skills.trim()}
              className="w-full py-3 bg-brand-primary text-brand-dark font-display font-bold uppercase tracking-widest rounded-sm hover:shadow-[0_0_20px_rgba(249,115,22,0.4)] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2"
            >
              {loading ? (
                <span className="animate-pulse">ANALYZING...</span>
              ) : (
                <>
                  GENERATE MATCHES <ArrowRight size={18} />
                </>
              )}
            </button>
            <p className="text-xs text-zinc-500 text-center mt-3 font-mono">
              Cost: 10 Credits
            </p>
          </motion.div>
        </div>

        {/* Right Column: Results */}
        <div className="lg:col-span-2">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="h-full"
          >
            <h2 className="text-2xl font-display font-bold text-white mb-6 flex items-center gap-3">
              <Briefcase className="text-brand-secondary" />
              CAREER TRAJECTORIES
            </h2>

            {jobMatches.length === 0 && !loading && (
              <div className="h-64 flex flex-col items-center justify-center border border-dashed border-zinc-700 rounded-xl bg-black/20">
                <Briefcase className="w-12 h-12 text-zinc-600 mb-4" />
                <p className="text-zinc-400 font-mono text-center max-w-md">
                  Awaiting skill input. Initialize analysis to generate career trajectories and hiring targets.
                </p>
              </div>
            )}

            {loading && (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-48 bg-zinc-800/50 animate-pulse rounded-xl border border-zinc-700/50" />
                ))}
              </div>
            )}

            {!loading && jobMatches.length > 0 && (
              <div className="space-y-6">
                {jobMatches.map((job, idx) => (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="bg-black/40 border border-zinc-700 hover:border-brand-primary/50 rounded-xl p-6 backdrop-blur-md transition-all duration-300 group"
                  >
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-brand-primary transition-colors">
                      {job.title}
                    </h3>
                    <p className="text-zinc-400 text-sm mb-6 leading-relaxed">
                      {job.description}
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Skills to Learn */}
                      <div>
                        <h4 className="text-xs font-mono text-brand-secondary uppercase tracking-widest mb-3 flex items-center gap-2">
                          <CheckCircle2 size={14} /> Required Upgrades
                        </h4>
                        <ul className="space-y-2">
                          {job.additionalSkills.map((skill, sIdx) => (
                            <li key={sIdx} className="text-sm text-zinc-300 flex items-start gap-2">
                              <ChevronRight size={16} className="text-brand-secondary shrink-0 mt-0.5" />
                              {skill}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Hiring Companies */}
                      <div>
                        <h4 className="text-xs font-mono text-brand-accent uppercase tracking-widest mb-3 flex items-center gap-2">
                          <Building size={14} /> Active Recruiters
                        </h4>
                        <ul className="space-y-2">
                          {job.companies.map((company, cIdx) => (
                            <li key={cIdx} className="text-sm text-zinc-300 flex items-start gap-2">
                              <ChevronRight size={16} className="text-brand-accent shrink-0 mt-0.5" />
                              {company}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </div>

      </div>
    </div>
  );
}
