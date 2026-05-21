import React, { useState } from 'react';
import { 
  Send, Phone, Mail, MapPin, ShieldCheck, Heart, RotateCcw, Truck
} from 'lucide-react';

interface FooterProps {
  onNotify: (msg: string, type: 'success' | 'error' | 'info') => void;
}

export default function Footer({ onNotify }: FooterProps) {
  const [email, setEmail] = useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      onNotify('Please enter a valid email address to subscribe.', 'error');
      return;
    }
    onNotify('Shukriya! You have successfully subscribed to the fridge.pk Cooling Newsletter.', 'success');
    setEmail('');
  };

  return (
    <footer className="bg-brand-navy-900 text-slate-300 pointer-events-auto" id="brand-footer">
      {/* Brand Value Props */}
      <div className="bg-slate-900/50 border-b border-white/5 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="flex items-start gap-3">
            <Truck className="w-5 h-5 text-brand-mint shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-semibold text-white tracking-wide">Nationwide Shipping</h4>
              <p className="text-xs text-slate-400 mt-1">Insured heavy-haulage dispatch across Lahore, Karachi, Islamabad, and beyond.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <RotateCcw className="w-5 h-5 text-brand-mint shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-semibold text-white tracking-wide">Official Brand Warranties</h4>
              <p className="text-xs text-slate-400 mt-1">Get up to 12 years of official compressor warranties direct from manufacturers.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-brand-mint shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-semibold text-white tracking-wide">100% Genuine Compressors</h4>
              <p className="text-xs text-slate-400 mt-1">No counterfeit parts. Only authentic PEL, Dawlance, Gree & Haier cooling units.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Phone className="w-5 h-5 text-brand-mint shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-semibold text-white tracking-wide">Dedicated Support</h4>
              <p className="text-xs text-slate-400 mt-1">Call our technicians at (042) 111-FRIDGE between 9 AM and 6 PM PKT.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Info */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
        {/* Brand Description */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 group cursor-pointer text-left focus:outline-none" style={{ perspective: '1000px' }}>
            <div 
              className="w-9 h-9 rounded-lg bg-brand-navy-950 flex items-center justify-center text-white font-sans font-black text-xl relative overflow-hidden transition-all duration-500 group-hover:bg-brand-mint"
              style={{ transformStyle: 'preserve-3d', transition: 'all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'rotateY(360deg) scale(1.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'rotateY(0deg) scale(1)';
              }}
            >
              <span className="relative z-10 block">f</span>
              <div className="absolute inset-y-0 right-0 w-1 bg-brand-mint group-hover:bg-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-display text-xl font-black text-white tracking-tight transition-colors duration-300 group-hover:text-brand-mint">
                fridge<span className="text-brand-coral">.pk</span>
              </span>
              <span className="text-[8px] font-mono tracking-widest font-bold uppercase text-slate-400 mt-0.5">
                Verified Energy Hub
              </span>
            </div>
          </div>
          <p className="text-xs leading-relaxed text-slate-400">
            fridge.pk is Pakistan’s premier specialized marketplace for refrigerators, deep freezers, inverter air conditioners, and premium home kitchen cooling solutions. Low-voltage operations are guaranteed.
          </p>
          <div className="space-y-2 pt-2">
            <div className="flex items-center gap-2.5 text-xs">
              <MapPin className="w-4 h-4 text-brand-mint shrink-0" />
              <span>Gulberg III, Lahore, Pakistan</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs">
              <Mail className="w-4 h-4 text-brand-mint shrink-0" />
              <span>care@fridge.pk</span>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="font-display text-sm font-bold text-white uppercase tracking-wider mb-4 border-l-2 border-brand-mint pl-2">Cooling Systems</h4>
          <ul className="space-y-2.5 text-xs">
            <li><a href="#" className="hover:text-brand-mint transition-colors">Double-Door Inverter Fridges</a></li>
            <li><a href="#" className="hover:text-brand-mint transition-colors">No-Frost Single Door Fridges</a></li>
            <li><a href="#" className="hover:text-brand-mint transition-colors">Whisper-Silent Inverter ACs</a></li>
            <li><a href="#" className="hover:text-brand-mint transition-colors">Dual-Cabin Chest Freezers</a></li>
            <li><a href="#" className="hover:text-brand-mint transition-colors">Instant Water Dispensers</a></li>
          </ul>
        </div>

        {/* Brand Cities & Support */}
        <div>
          <h4 className="font-display text-sm font-bold text-white uppercase tracking-wider mb-4 border-l-2 border-brand-mint pl-2">Our Flagship Hubs</h4>
          <ul className="space-y-2.5 text-xs text-slate-400">
            <li>
              <span className="text-white font-medium block">Lahore:</span>
              M.M. Alam Road, Gulberg III
            </li>
            <li>
              <span className="text-white font-medium block">Karachi:</span>
              Dolmen Mall Clifton, Block 4
            </li>
            <li>
              <span className="text-white font-medium block">Islamabad:</span>
              Centaurus Mall, F-8 Sector
            </li>
          </ul>
        </div>

        {/* Newsletter & Sub */}
        <div className="space-y-4">
          <h4 className="font-display text-sm font-bold text-white uppercase tracking-wider border-l-2 border-brand-mint pl-2">Stay Chilled</h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            Be the first to learn about brand flash price cuts, inverter AC clearance deals, and upcoming haulage schedules.
          </p>
          <form onSubmit={handleSubscribe} className="space-y-2">
            <div className="flex relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email address"
                className="w-full text-xs font-medium bg-slate-800 border border-slate-700 rounded-lg px-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-brand-mint focus:border-brand-mint"
                required
                id="newsletter-email"
              />
              <button
                type="submit"
                className="absolute right-1 top-1 bottom-1 px-3 bg-brand-mint text-white rounded-md hover:bg-brand-mint-hover transition-colors flex items-center justify-center cursor-pointer"
                id="subscribe-btn"
                aria-label="Subscribe"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Footer copyright section */}
      <div className="border-t border-white/5 py-6 bg-slate-950/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center gap-6">
          {/* Brand Partner Logos wrapper */}
          <div className="flex flex-wrap items-center justify-center gap-6 border-b border-white/5 pb-5 w-full">
            <span className="text-[10px] uppercase font-mono tracking-widest text-slate-500 font-bold">Authorized Manufacturer Partners:</span>
            <div className="flex items-center gap-4 flex-wrap justify-center" id="brand-logos-row">
              {/* Haier logo badge */}
              <div className="flex items-center gap-1 px-3 py-1 bg-white/5 rounded-lg border border-white/10 hover:border-sky-400 transition-colors duration-300">
                <span className="text-[11px] font-black tracking-tighter text-sky-400 font-sans">Haier</span>
                <span className="text-[7px] text-slate-400 uppercase font-mono tracking-widest pl-1 border-l border-white/10 pl-1.5">Inspire</span>
              </div>
              {/* Dawlance logo badge */}
              <div className="flex items-center gap-1.5 px-3 py-1 bg-white/5 rounded-lg border border-white/10 hover:border-emerald-400 transition-colors duration-300">
                <span className="text-[11px] font-extrabold tracking-tight text-white font-display">Dawlance</span>
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
              </div>
              {/* PEL logo badge */}
              <div className="flex items-center gap-1 px-3 py-1 bg-white/5 rounded-lg border border-white/10 hover:border-red-500 transition-colors duration-300">
                <div className="w-3.5 h-3.5 rounded-full bg-red-500 flex items-center justify-center font-sans text-[8px] text-white font-black">P</div>
                <span className="text-[11px] font-black tracking-wider text-white">PEL</span>
              </div>
              {/* Gree logo badge */}
              <div className="flex items-center gap-1 px-3 py-1 bg-white/5 rounded-lg border border-white/10 hover:border-rose-400 transition-colors duration-300">
                <span className="text-[11px] font-mono font-black text-rose-400 uppercase">Gree</span>
                <span className="text-[6px] text-slate-400 font-mono scale-90">T3 ECO</span>
              </div>
              {/* Waves logo badge */}
              <div className="flex items-center gap-1.5 px-3 py-1 bg-white/5 rounded-lg border border-white/10 hover:border-teal-300 transition-colors duration-300">
                <span className="text-[11px] font-sans font-black italic text-teal-350">WAVES</span>
                <span className="text-[7px] font-mono text-white/30 font-bold bg-white/5 px-1 rounded">~</span>
              </div>
            </div>
          </div>

          {/* Subfooter lower details */}
          <div className="w-full border-t border-white/5 pt-5 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500 text-center md:text-left">
            <div className="space-y-1">
              <p>© 2026 fridge.pk Cooling Systems Private Limited. All rights reserved.</p>
              <p className="text-[11px] text-slate-450">
                Lead Architect: <span className="text-white font-bold">Farmanullah Ansari</span> | Full Stack Software Engineer
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-3 text-slate-400">
              <a href="https://farmanullah1.github.io/My-Portfolio" target="_blank" rel="noreferrer" className="bg-slate-900 border border-white/5 hover:border-brand-mint text-[10px] font-bold text-slate-300 hover:text-brand-mint px-2.5 py-1 rounded transition-colors">Portfolio</a>
              <a href="https://www.linkedin.com/in/farmanullah-ansari/" target="_blank" rel="noreferrer" className="bg-slate-900 border border-white/5 hover:border-[#0077B5] text-[10px] font-bold text-slate-300 hover:text-[#0077B5] px-2.5 py-1 rounded transition-colors">LinkedIn</a>
              <a href="https://github.com/farmanullah1" target="_blank" rel="noreferrer" className="bg-slate-900 border border-white/5 hover:border-white text-[10px] font-bold text-slate-300 hover:text-white px-2.5 py-1 rounded transition-colors">GitHub</a>
            </div>
            <div className="flex items-center gap-1.5 text-[11px]">
              <span>Crafted with</span>
              <Heart className="w-3 h-3 text-brand-mint animate-pulse" />
              <span>by Farmanullah in Pakistan</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
