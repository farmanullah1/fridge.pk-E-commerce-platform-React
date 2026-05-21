import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  User as UserIcon, Briefcase, Code, MapPin, ExternalLink, Linkedin, Github, Globe, 
  Terminal, Award, Cpu, ShieldCheck, Heart, Sparkles, Send, CheckCircle2, MessageSquare
} from 'lucide-react';
import { ActiveView } from '../types';

interface DeveloperProfileProps {
  setView: (view: ActiveView) => void;
  onNotify: (msg: string, type: 'success' | 'error' | 'info') => void;
}

export default function DeveloperProfileView({ setView, onNotify }: DeveloperProfileProps) {
  const [feedback, setFeedback] = useState('');
  const [feedbackEmail, setFeedbackEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const stats = [
    { label: 'Core Engineering', value: '5+ Years' },
    { label: 'Production Apps', value: '18+' },
    { label: 'GitHub Commits', value: '2,400+' },
    { label: 'APIs Designed', value: '45+' }
  ];

  const technologies = [
    { name: 'TypeScript / React / Next.js', level: 95, color: 'bg-brand-coral' },
    { name: 'Node.js / Express / CJS-ESM', level: 90, color: 'bg-emerald-400' },
    { name: 'Tailwind CSS / Motion Animations', level: 98, color: 'bg-brand-mint' },
    { name: 'Software Architecture / Clean Code', level: 88, color: 'bg-rose-400' },
    { name: 'Cloud Ingress / Cloud Run Containers', level: 85, color: 'bg-sky-400' },
    { name: 'DevOps / GitHub CI-CD Solutions', level: 92, color: 'bg-indigo-400' }
  ];

  const projectContributions = [
    {
      title: 'Active Voltage & Bill Estimator',
      desc: 'Developed a custom mathematical system calculating exact electricity tariffs, load values, and recommendation algorithms based on K-Electric, LESCO, and GEPCO national grids.',
      complexity: 'Mathematical Model Grid'
    },
    {
      title: '3D AR Appliance Placement Planner',
      desc: 'Designed an interactive viewport mapping tool simulating refrigerators and split AC space configurations in real time, avoiding manual structural sizing errors.',
      complexity: 'Dynamic Canvas Sizer'
    },
    {
      title: 'Live Intelligent AI support desk',
      desc: 'Built the serverless natural language support assistant with local preset memory chips, optimizing responsive times to instantaneous dispatches.',
      complexity: 'Contextual AI Tuning'
    }
  ];

  const handleSendFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedback.trim()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      onNotify('Your message has been directly channeled to Farmanullah Ansari!', 'success');
      setFeedback('');
      setFeedbackEmail('');
      setIsSubmitting(false);
      setSubmitted(true);
    }, 1200);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Intro Hero Badge */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-brand-navy-950 via-slate-900 to-brand-navy-950 text-white p-8 sm:p-12 border border-white/10 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-mint/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-brand-coral/5 rounded-full blur-3xl -ml-20 -mb-20 pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Avatar and Info */}
          <div className="lg:col-span-8 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/10">
              <Sparkles className="w-4 h-4 text-brand-mint animate-pulse" />
              <span className="text-[10px] font-mono tracking-widest uppercase text-slate-300 font-bold">Verified Creator Profile</span>
            </div>

            <div className="space-y-2">
              <h1 className="font-display font-black text-3xl sm:text-5xl tracking-tight leading-none">
                Farmanullah Ansari
              </h1>
              <p className="text-lg text-brand-mint font-bold uppercase tracking-wider font-mono">
                Full Stack Software Engineer
              </p>
            </div>

            <p className="text-sm font-medium text-slate-350 max-w-2xl leading-relaxed">
              Passionate engineer specialized in crafting pixel-perfect, highly performant Web ecosystems and interactive enterprise architectures. Focused on React frameworks, TypeScript safety, optimal container orchestration, and server-side engine configurations.
            </p>

            {/* Social Connect Triggers */}
            <div className="flex flex-wrap gap-3">
              <a
                href="https://farmanullah1.github.io/My-Portfolio"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-mint text-brand-navy-950 font-black text-xs uppercase tracking-wider rounded-xl hover:bg-white hover:scale-[1.03] active:scale-95 transition-all shadow-lg"
              >
                <Globe className="w-4 h-4" />
                <span>Visit My Portfolio</span>
                <ExternalLink className="w-3 h-3" />
              </a>

              <a
                href="https://www.linkedin.com/in/farmanullah-ansari/"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-wider rounded-xl border border-white/10 hover:scale-[1.03] active:scale-95 transition-all"
              >
                <Linkedin className="w-4 h-4 text-[#0077B5]" />
                <span>LinkedIn Connect</span>
                <ExternalLink className="w-3 h-3 text-white/50" />
              </a>

              <a
                href="https://github.com/farmanullah1"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-wider rounded-xl border border-white/10 hover:scale-[1.03] active:scale-95 transition-all"
              >
                <Github className="w-4 h-4 text-white" />
                <span>GitHub Repository</span>
                <ExternalLink className="w-3 h-3 text-white/50" />
              </a>
            </div>
          </div>

          {/* Symmetrical Stats Badge board */}
          <div className="lg:col-span-4 grid grid-cols-2 gap-4">
            {stats.map((stat, i) => (
              <div 
                key={i} 
                className="p-5 rounded-2xl bg-white/5 border border-white/5 flex flex-col justify-between hover:bg-white/8 transition-all group"
              >
                <span className="text-2xl font-black text-brand-coral group-hover:scale-105 transition-transform block">
                  {stat.value}
                </span>
                <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 font-bold block mt-1">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Grid containing Skills & Contributions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Left Column: Tech Stack & Skill Ratios */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-xl space-y-6">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-brand-navy-900 flex items-center justify-center text-brand-mint">
              <Code className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-lg font-black text-brand-navy-900 leading-none">Engineering Competency</h2>
              <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-slate-400">Technical Proficiency Indexes</span>
            </div>
          </div>

          <div className="space-y-4">
            {technologies.map((tech, idx) => (
              <div key={idx} className="space-y-1.5 p-3 rounded-2xl bg-slate-50 border border-slate-100/50 group hover:bg-white hover:border-slate-200 transition-all">
                <div className="flex justify-between items-center text-xs font-bold text-slate-700">
                  <span>{tech.name}</span>
                  <span className="font-mono text-slate-450">{tech.level}%</span>
                </div>
                <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${tech.color} transition-all duration-1000 ease-out`}
                    style={{ width: `${tech.level}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Platform Architecture & Highlights */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-xl space-y-6">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-brand-navy-900 flex items-center justify-center text-brand-mint">
              <Cpu className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-lg font-black text-brand-navy-900 leading-none">System Architecture Built</h2>
              <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-slate-400">Active Core Contributions</span>
            </div>
          </div>

          <div className="space-y-4">
            {projectContributions.map((contrib, idx) => (
              <div 
                key={idx} 
                className="p-4 rounded-2xl bg-slate-50 border border-slate-150/40 relative overflow-hidden flex flex-col justify-between hover:bg-white hover:border-slate-300 transition-all hover:shadow-md"
              >
                <div className="absolute top-2 right-2 px-2 py-0.5 bg-brand-navy-900 text-brand-mint text-[8px] font-mono font-bold rounded uppercase">
                  {contrib.complexity}
                </div>
                <div>
                  <h4 className="font-bold text-xs text-brand-navy-900 tracking-tight pr-24 uppercase">
                    {contrib.title}
                  </h4>
                  <p className="text-xs text-slate-500 mt-2 font-medium leading-relaxed">
                    {contrib.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Communication Feedback Channel */}
      <div className="bg-gradient-to-br from-slate-50 to-white p-6 sm:p-10 rounded-3xl border border-slate-100 shadow-xl max-w-3xl mx-auto">
        <div className="text-center space-y-2 mb-8">
          <div className="w-12 h-12 rounded-full bg-brand-mint/15 flex items-center justify-center text-brand-mint mx-auto">
            <MessageSquare className="w-6 h-6" />
          </div>
          <h3 className="font-display font-black text-xl text-brand-navy-900 uppercase tracking-tight">
            Deployer Direct Inquiry Channel
          </h3>
          <p className="text-xs text-slate-500 leading-normal max-w-md mx-auto font-medium">
            Send a customized diagnostic ping, career opportunities, or message directly to Farmanullah Ansari.
          </p>
        </div>

        {submitted ? (
          <div className="p-8 text-center bg-emerald-50 rounded-2xl border border-emerald-200 space-y-3">
            <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
            <h4 className="font-extrabold text-sm text-emerald-800">Message Dispatched Successfully!</h4>
            <p className="text-xs text-emerald-600 font-medium">Thank you! Farmanullah Ansari has received your diagnostic inquiries.</p>
            <button
              onClick={() => setSubmitted(false)}
              className="text-xs font-bold text-brand-navy-900 border border-slate-200 bg-white px-4 py-1.5 rounded-full hover:bg-slate-50 mt-2 cursor-pointer"
            >
              Send Another Ping
            </button>
          </div>
        ) : (
          <form onSubmit={handleSendFeedback} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-slate-500 tracking-wider">Your Official Email</label>
                <input
                  type="email"
                  required
                  value={feedbackEmail}
                  onChange={(e) => setFeedbackEmail(e.target.value)}
                  placeholder="name@organization.com"
                  className="w-full text-xs font-semibold px-4 py-2.5 bg-white border border-slate-200 focus:outline-none focus:ring-1 focus:ring-brand-coral rounded-xl text-brand-navy-900"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-slate-500 tracking-wider font-sans">Corporate Scope</label>
                <select className="w-full text-xs font-semibold px-3 py-2.5 bg-white border border-slate-200 focus:outline-none focus:ring-1 focus:ring-brand-coral rounded-xl text-brand-navy-900">
                  <option>Software Consultation</option>
                  <option>Full-Time Technical Staffing</option>
                  <option>Custom Inverter Software Solutions</option>
                  <option>Diagnostic System Feedback</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase text-slate-500 tracking-wider">Inquiry Body Message</label>
              <textarea
                required
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Write your brief technical message here..."
                rows={4}
                className="w-full text-xs font-semibold px-4 py-3 bg-white border border-slate-200 focus:outline-none focus:ring-1 focus:ring-brand-coral rounded-xl text-brand-navy-900"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-brand-navy-900 hover:bg-brand-coral active:scale-98 text-white text-xs font-extrabold uppercase tracking-widest rounded-xl transition-all shadow-md shadow-brand-navy-900/10 cursor-pointer flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent animate-spin rounded-full" />
                  <span>Channelling Telemetry...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 text-brand-mint" />
                  <span>Dispatch Secure Message</span>
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
