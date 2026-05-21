import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, ShieldCheck, Truck, Award, ArrowRight, Star,
  Zap, ChevronDown, Check, Info, Thermometer, BatteryCharging,
  DollarSign, RefreshCw, Layers, ShieldCheck as ShieldIcon, HelpCircle,
  Sun, Moon
} from 'lucide-react';
import { Product } from '../types';

interface LandingViewProps {
  featuredProducts: Product[];
  setView: (view: any) => void;
  onProductClick: (product: Product) => void;
  isDark?: boolean;
  setIsDark?: (isDark: boolean) => void;
}

const TEASER_ITEMS = [
  {
    id: 't1',
    name: 'Glacier Smart Inverter Refrigerator',
    brand: 'Pel Pride Series',
    image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=600',
    price: 72000,
    originalPrice: 85000,
    discount: '15% OFF',
    efficiency: '5-Star ES Rating',
    tech: 'Twin-Eco Compressor'
  },
  {
    id: 't2',
    name: 'Arctic Pearl Multi-Cabinet Freezer',
    brand: 'Dawlance Energy-Max',
    image: 'https://images.unsplash.com/photo-1601004890684-d8cbf643f5f2?auto=format&fit=crop&q=80&w=600',
    price: 89000,
    originalPrice: 105000,
    discount: '15% OFF',
    efficiency: 'Ultra-Low 0.9A Start',
    tech: 'Thick Pentane Shielding'
  }
];

const REFRIGERATOR_HOTSPOTS = [
  {
    id: 'compressor',
    top: '80%',
    left: '50%',
    title: 'Twin-Eco Variable Compressor',
    desc: 'Modulates speeds autonomously from 1000 to 4300 RPM. Avoids standard full-load spike fatigue on UPS setups.'
  },
  {
    id: 'evaporator',
    top: '25%',
    left: '70%',
    title: 'Smart Defrost Evaporator',
    desc: 'Intelligent multi-sensor array prevents heavy frost buildup, saving up to 18% general electricity overhead.'
  },
  {
    id: 'insulation',
    top: '48%',
    left: '20%',
    title: 'Pentane High-Density Cavity',
    desc: 'Premium polyurethane foam maintains frozen temperatures for up to 18 continuous hours during grid failure.'
  }
];

export default function LandingView({ 
  featuredProducts, 
  setView, 
  onProductClick,
  isDark = false,
  setIsDark
}: LandingViewProps) {
  const [activeTeaser, setActiveTeaser] = useState(0);
  const [billValue, setBillValue] = useState(25000); // Monthly bill in PKR
  const [activeHotspot, setActiveHotspot] = useState<string | null>('compressor');
  const [faqOpen, setFaqOpen] = useState<number | null>(null);

  // PKR Math estimates with and without smart inverter
  const calculatedSavings = Math.round(billValue * 0.62); // ~62% potential savings on refrigeration fraction
  const adjustedBill = billValue - calculatedSavings;
  const yearlySavings = calculatedSavings * 12;

  // Stagger variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 25 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 90 } }
  };

  const trustBadges = [
    { 
      icon: ShieldCheck, 
      title: "100% Secure Payments", 
      desc: "Instant Cash On Delivery, secure bank transfers, EasyPaisa, or JazzCash with complete escrow protection." 
    },
    { 
      icon: Truck, 
      title: "Insured Free Delivery", 
      desc: "Complimentary direct doorstep transit across major hubs and rural towns on orders above Rs. 50,000." 
    },
    { 
      icon: Award, 
      title: "1-Year Official Warranty", 
      desc: "Authorized manufacturer brand certificate with 10 to 12-year Compressor replacement guarantees." 
    }
  ];

  const FAQ_ITEMS = [
    {
      q: "Will these smart inverter refrigerators work directly with my solar setup?",
      a: "Yes! Traditional refrigerators require a high startup surge current (sometimes up to 10 Amps) that trips small solar inverters. Our approved inverter models features soft-start tech that ramps up consumption gradually, matching standard 1kVA solar setups easily."
    },
    {
      q: "How does the PKR Bill Estimator calculate the 60% electricity savings?",
      a: "Standard non-inverter cooling units power on and off at peak amps. Eco Inverter units run continuously at microscopic wattages (as low as 65 watts). WAPDA single-phase rates escalate exponentially; saving baseline units drops your tariff slab, lowering your bills significantly."
    },
    {
      q: "Do you offer physical brand warranty cards inside the box?",
      a: "Absolutely! Every single appliance is sourced directly from original manufacturers (Pel, Haier, Dawlance, Changhong Ruba) with completely unfilled official warranty cards and authorized service contact channels."
    }
  ];

  const handleEnterSite = () => {
    localStorage.setItem('fringe_visited_before', 'true');
    setView('home');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 dark:bg-slate-950 dark:text-slate-100 transition-colors duration-300" id="landing-luxury-viewport">
      
      {/* 2.1 Navigation Bar (Minimal & High Contrast) */}
      <header className="w-full border-b border-slate-200 dark:border-slate-900 sticky top-0 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md z-50 shadow-sm transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex justify-between items-center">
          
          {/* Brand Identity / Logo with 3D Perspective Hover rotation */}
          <button
            onClick={handleEnterSite}
            className="flex items-center gap-2 group cursor-pointer text-left focus:outline-none"
            style={{ perspective: '1000px' }}
          >
            <div 
              className="w-9 h-9 rounded-lg bg-[#0A3D62] flex items-center justify-center text-white font-sans font-black text-xl relative overflow-hidden transition-all duration-500 group-hover:bg-[#00B894]"
              style={{ transformStyle: 'preserve-3d', transition: 'all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'rotateY(360deg) scale(1.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'rotateY(0deg) scale(1)';
              }}
            >
              <span className="relative z-10 block">f</span>
              <div className="absolute inset-y-0 right-0 w-1 bg-[#00B894] group-hover:bg-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-display font-black text-xl text-[#0A3D62] dark:text-white leading-none tracking-tight uppercase transition-colors duration-300 group-hover:text-[#00B894]">
                fridge<span className="text-[#FF6B6B]">.pk</span>
              </span>
              <span className="text-[8px] font-mono tracking-widest font-bold uppercase text-slate-400 dark:text-slate-500 mt-0.5">
                Verified Energy Hub
              </span>
            </div>
          </button>

          {/* Action CTAs and Theme Toggle */}
          <div className="flex items-center gap-4">
            {setIsDark && (
              <button
                onClick={() => setIsDark(!isDark)}
                className={`p-2 rounded-lg cursor-pointer transition-colors ${isDark ? 'text-amber-400 hover:bg-slate-900' : 'text-slate-600 hover:bg-slate-100'}`}
                title={isDark ? 'Activate Standard Light Mode' : 'Activate Eye-Care Dark Mode'}
              >
                {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
            )}
            
            <button
              onClick={() => setView('login')}
              className="px-4 py-2 text-xs font-black uppercase tracking-wider text-[#0A3D62] dark:text-slate-300 hover:text-[#00B894] transition-colors cursor-pointer"
            >
              Sign In
            </button>
            <button
              onClick={() => setView('signup')}
              className="px-6 py-3 bg-[#0A3D62] dark:bg-[#00B894] hover:bg-[#00B894] dark:hover:bg-brand-mint-hover text-white dark:text-slate-950 text-xs font-black uppercase tracking-widest rounded-xl transition-all hover:scale-[1.03] active:scale-95 shadow-md shadow-[#0A3D62]/20 cursor-pointer"
            >
              Join Free
            </button>
          </div>
        </div>
      </header>

      {/* 2.2 Modern Hero Section with Switcher */}
      <section className="relative overflow-hidden bg-white dark:bg-slate-900 py-16 lg:py-24 border-b border-slate-200 dark:border-slate-800 transition-colors duration-300">
        {/* Glow Spheres */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#00B894]/5 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#0A3D62]/3 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Hero Grid: Text and Action items */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-emerald-50 dark:bg-emerald-950/25 border border-emerald-100 dark:border-emerald-905 rounded-full text-xs font-bold text-emerald-700 dark:text-emerald-350 mx-auto lg:mx-0">
              <Sparkles className="w-4 h-4 text-[#FF6B6B] animate-spin" style={{ animationDuration: '4s' }} />
              <span className="uppercase tracking-widest font-mono text-[9px]">Verified Smart Inverter cooling Hub</span>
            </div>

            <h1 className="font-display font-black text-4xl sm:text-6xl text-[#0A3D62] dark:text-white tracking-tight leading-none uppercase transition-colors duration-300">
              Chill <span className="text-[#FF6B6B]">at the</span> <br />
              Best Prices
            </h1>

            <p className="text-sm sm:text-lg text-slate-500 dark:text-slate-400 max-w-xl mx-auto lg:mx-0 font-medium leading-relaxed">
              Pakistan's leading platform engineered specifically for energy compatibility. Avoid heavy tariff penalties, match dynamic solar grids, and order authentic cooling hardware with certified national warranty coverage.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
              <button
                onClick={handleEnterSite}
                className="w-full sm:w-auto px-8 py-4.5 bg-[#0A3D62] dark:bg-[#00B894] hover:bg-[#00B894] dark:hover:bg-brand-mint-hover text-white dark:text-slate-950 text-xs font-black uppercase tracking-widest rounded-xl transition-all shadow-xl shadow-[#0A3D62]/20 dark:shadow-[#00B894]/10 relative group hover:scale-[1.03] active:scale-95 cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Enter Main Marketplace</span>
                <ArrowRight className="w-4 h-4 text-white dark:text-slate-950 group-hover:translate-x-1 transition-transform" />
              </button>
              
              <button
                onClick={() => setView('appliance-matcher')}
                className="w-full sm:w-auto px-6 py-4.5 border-2 border-slate-200 dark:border-slate-800 hover:border-[#0A3D62] dark:hover:border-white bg-white dark:bg-slate-950 text-[#0A3D62] dark:text-slate-100 text-xs font-black uppercase tracking-widest rounded-xl hover:scale-[1.03] active:scale-95 transition-all text-center cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Solar Advisor Tool</span>
              </button>
            </div>

            {/* Mini Core Statistics Indicators */}
            <div className="grid grid-cols-3 gap-6 pt-8 max-w-md mx-auto lg:mx-0 border-t border-slate-200 dark:border-slate-800 transition-colors">
              <div>
                <span className="block text-2xl sm:text-3xl font-black text-[#0A3D62] dark:text-white">45,000+</span>
                <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest font-mono block mt-1">Appliances Delivered</span>
              </div>
              <div>
                <span className="block text-2xl sm:text-3xl font-black text-[#00B894]">62% Saved</span>
                <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest font-mono block mt-1">On Compressor Watts</span>
              </div>
              <div>
                <span className="block text-2xl sm:text-3xl font-black text-[#FF6B6B]">4.9 / 5.0</span>
                <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest font-mono block mt-1">Trustpilot score</span>
              </div>
            </div>
          </div>

          {/* Right Hero Grid: Beautiful Appliance Switcher Card */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-[#0A3D62]/5 dark:bg-slate-800 p-1.5 rounded-2xl flex gap-1.5 max-w-sm mx-auto transition-colors">
              {TEASER_ITEMS.map((item, idx) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTeaser(idx)}
                  className={`flex-1 text-center py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                    activeTeaser === idx 
                      ? 'bg-white dark:bg-slate-950 text-[#0A3D62] dark:text-brand-mint shadow-sm' 
                      : 'text-slate-500 hover:text-[#0A3D62] dark:hover:text-white'
                  }`}
                >
                  {idx === 0 ? '🏆 Refrigerator' : '❄️ Deep Freezer'}
                </button>
              ))}
            </div>

            <div className="relative group max-w-md mx-auto">
              <div className="absolute -inset-1.5 bg-gradient-to-r from-[#00B894] to-[#0A3D62] rounded-3xl blur opacity-15 group-hover:opacity-30 transition duration-500" />
              
              <div className="relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-2xl space-y-4 transition-colors">
                <div className="aspect-[4/5] bg-slate-50 dark:bg-slate-950 rounded-2xl overflow-hidden relative border border-slate-100 dark:border-slate-800">
                  <AnimatePresence mode="wait">
                    <motion.img 
                      key={activeTeaser}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 1.05 }}
                      transition={{ duration: 0.3 }}
                      src={TEASER_ITEMS[activeTeaser].image} 
                      alt={TEASER_ITEMS[activeTeaser].name} 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </AnimatePresence>

                  <div className="absolute top-3 left-3 bg-[#FF6B6B] text-white text-[8px] font-black uppercase tracking-wider px-3 py-1.5 rounded-full shadow-md animate-bounce">
                    {TEASER_ITEMS[activeTeaser].discount}
                  </div>

                  <div className="absolute bottom-3 left-3 right-3 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-3 rounded-xl border border-white/40 dark:border-slate-800/40 flex justify-between items-center">
                    <span className="text-[9px] font-mono font-black text-[#0A3D62] dark:text-white uppercase tracking-wider">
                      ✨ {TEASER_ITEMS[activeTeaser].efficiency}
                    </span>
                    <span className="text-[9px] font-mono font-black text-[#00B894] uppercase tracking-wider">
                      ⚡ {TEASER_ITEMS[activeTeaser].tech}
                    </span>
                  </div>
                </div>

                <div className="flex justify-between items-start gap-3">
                  <div className="text-left">
                    <span className="text-[9px] font-mono font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                      {TEASER_ITEMS[activeTeaser].brand}
                    </span>
                    <h4 className="font-extrabold text-sm text-[#0A3D62] dark:text-slate-100 uppercase tracking-tight leading-tight mt-0.5">
                      {TEASER_ITEMS[activeTeaser].name}
                    </h4>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-slate-400 dark:text-slate-500 line-through text-[10px] block font-mono">
                      Rs. {TEASER_ITEMS[activeTeaser].originalPrice.toLocaleString()}
                    </span>
                    <span className="text-sm font-black text-[#00B894] font-serif block">
                      Rs. {TEASER_ITEMS[activeTeaser].price.toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="pt-2">
                  <button 
                    onClick={handleEnterSite}
                    className="w-full py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-[#0A3D62] dark:hover:bg-[#00B894] hover:text-white dark:hover:text-slate-950 rounded-xl text-center text-xs font-black uppercase text-[#0A3D62] dark:text-slate-200 tracking-wider transition-colors cursor-pointer"
                  >
                    View Specs & Details →
                  </button>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* NEW SECTION: Interactive PKR Bill Savings Calculator */}
      <section className="bg-gradient-to-br from-[#0A3D62] to-[#04243C] text-white py-16 scroll-mt-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#00B894]/10 rounded-full blur-[80px]" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Interactive sliders descriptor info */}
            <div className="lg:col-span-6 space-y-6 text-left">
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#00B894]/20 border border-[#00B894]/30 rounded text-[#00B894] text-[9px] font-bold uppercase tracking-widest font-mono">
                <Zap className="w-3 h-3 text-[#00B894] animate-pulse" /> Advanced Tariff Protection Indicator
              </span>
              <h2 className="font-display font-black text-3xl sm:text-4xl uppercase tracking-tight leading-none">
                Predict Your Immediate <br />
                <span className="text-[#00B894]">Electricity Bill Savings</span>
              </h2>
              <p className="text-sm text-slate-350 leading-relaxed font-semibold">
                WAPDA and Karachi K-Electric rates feature sharp tariff slab escalations once household units cross 100, 200, and 300 unit marks. Reducing your home's thermal load drops you into basic slabs instantly. Try dragging the slider to measure your current monthly bill.
              </p>

              <div className="space-y-4 pt-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#00B894]/10 flex items-center justify-center text-[#00B894] shrink-0">
                    <Check className="w-5 h-5" />
                  </div>
                  <p className="text-xs font-bold text-slate-300">Eliminates heavy mechanical peak starts at 2:00 AM</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#00B894]/10 flex items-center justify-center text-[#00B894] shrink-0">
                    <Check className="w-5 h-5" />
                  </div>
                  <p className="text-xs font-bold text-slate-300">Avoids UPS over-temperature and inverter failure shutdowns</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#00B894]/10 flex items-center justify-center text-[#00B894] shrink-0">
                    <Check className="w-5 h-5" />
                  </div>
                  <p className="text-xs font-bold text-slate-300">Continuous 65-Watt eco trickle cycle keeps food safe for longer</p>
                </div>
              </div>
            </div>

            {/* The interactive widget box */}
            <div className="lg:col-span-6">
              <div className="bg-white/5 border border-white/10 backdrop-blur-md p-6 sm:p-8 rounded-3xl space-y-6 text-left">
                
                {/* Header detail of the slider */}
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-[10px] font-mono tracking-wider text-slate-400 uppercase font-bold block">Current Average Bill</span>
                    <span className="text-2xl font-black text-white font-serif tracking-tight">
                      PKR {billValue.toLocaleString()} <span className="text-xs font-sans text-slate-400">/ month</span>
                    </span>
                  </div>
                  <div className="bg-[#00B894]/20 border border-[#00B894]/30 px-3 py-1.5 rounded-lg">
                    <span className="text-[10px] font-mono font-black text-[#00B894] uppercase tracking-wider">
                      62% Savings Ratio
                    </span>
                  </div>
                </div>

                {/* Range Slider controls */}
                <div className="space-y-2">
                  <input 
                    type="range" 
                    min={5000} 
                    max={150000} 
                    step={1000}
                    value={billValue}
                    onChange={(e) => setBillValue(Number(e.target.value))}
                    className="w-full accent-[#00B894] cursor-pointer h-2 bg-slate-700 rounded-lg outline-none"
                    id="pkr-savings-calculator-slider"
                  />
                  <div className="flex justify-between text-[10px] font-mono text-slate-400 font-bold uppercase">
                    <span>Rs. 5,000</span>
                    <span>Rs. 75,000</span>
                    <span>Rs. 150,000</span>
                  </div>
                </div>

                {/* Dynamic mathematical estimations */}
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10">
                  <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                    <span className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-widest block">Predicted New Bill</span>
                    <span className="text-lg font-black text-[#00B894] font-serif block mt-1">
                      PKR {adjustedBill.toLocaleString()}
                    </span>
                    <span className="text-[9px] font-semibold text-slate-400 block mt-0.5">Estimated with Eco-Inverter</span>
                  </div>

                  <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                    <span className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-widest block">Monthly cash kept</span>
                    <span className="text-lg font-black text-[#FF6B6B] font-serif block mt-1">
                      PKR {calculatedSavings.toLocaleString()}
                    </span>
                    <span className="text-[9px] font-semibold text-slate-400 block mt-0.5">Slashed tariff penalties</span>
                  </div>
                </div>

                {/* Spectacular Yearly Saving Box */}
                <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-950/45 to-emerald-900/30 border border-[#00B894]/25 flex items-center justify-between">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono font-black text-[#00B894] uppercase tracking-widest block">Accumulated 1-Year Utility Savings</span>
                    <p className="text-xs text-slate-300 font-medium">Equal to buying a brand new appliance every 12 months.</p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-xl sm:text-2xl font-black text-white font-serif block text-[#00B894]">
                      PKR {yearlySavings.toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="pt-2 text-center">
                  <button
                    onClick={handleEnterSite}
                    className="w-full py-4 bg-[#00B894] hover:bg-white text-[#0A3D62] text-xs font-black uppercase tracking-widest rounded-xl transition-all hover:scale-[1.01] active:scale-95 shadow-md shadow-[#00B894]/10 cursor-pointer text-center"
                  >
                    Select Eligible 5-star Rated Models Immediately →
                  </button>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* NEW SECTION: Interactive Tech-Hotspot Diagram Explorer */}
      <section className="bg-white dark:bg-slate-900 py-16 sm:py-24 border-b border-slate-200 dark:border-slate-800 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center space-y-2">
            <span className="text-xs font-mono font-black text-[#FF6B6B] uppercase tracking-widest">Hardware Anatomy Inspection</span>
            <h2 className="font-display font-black text-2xl sm:text-4xl text-[#0A3D62] dark:text-white uppercase tracking-tight">
              Anatomy Of An Eco-Inverter System
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-xl mx-auto font-semibold">
              Tap the active radar markers to discover how modern low-amp circuitry stabilizes voltages and holds cold temperatures.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left side: Interactive mockup frame containing markers */}
            <div className="lg:col-span-7 flex justify-center">
              <div className="relative max-w-sm w-full aspect-[4/5] bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-3xl p-4 shadow-xl overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1571175432244-5f025856988d?auto=format&fit=crop&q=80&w=600" 
                  alt="Inverter Interior layout"
                  className={`w-full h-full object-cover rounded-2xl transition-all duration-300 ${isDark ? 'opacity-40 invert' : 'opacity-90 mix-blend-multiply'}`}
                  referrerPolicy="no-referrer"
                />

                {/* Radar Hotspots */}
                {REFRIGERATOR_HOTSPOTS.map((hot) => (
                  <button
                    key={hot.id}
                    onClick={() => setActiveHotspot(hot.id)}
                    className="absolute cursor-pointer group"
                    style={{ top: hot.top, left: hot.left }}
                    title={hot.title}
                  >
                    <span className="relative flex h-8 w-8 items-center justify-center">
                      <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                        activeHotspot === hot.id ? 'bg-[#FF6B6B]' : 'bg-[#00B894]'
                      }`} />
                      <span className={`relative inline-flex rounded-full h-4 w-4 shadow ${
                        activeHotspot === hot.id ? 'bg-[#FF6B6B]' : 'bg-[#00B894]'
                      }`} />
                    </span>
                  </button>
                ))}

                <div className="absolute bottom-4 left-4 right-4 bg-slate-900/90 backdrop-blur text-white p-3 rounded-xl text-center text-[10px] font-bold font-mono uppercase tracking-wider">
                  🎯 Click on the glowing circles to inspect
                </div>
              </div>
            </div>

            {/* Right side: Hotspot metadata description viewer */}
            <div className="lg:col-span-5 space-y-6 text-left">
              <AnimatePresence mode="wait">
                {activeHotspot ? (
                  (() => {
                    const selectedData = REFRIGERATOR_HOTSPOTS.find(h => h.id === activeHotspot);
                    if (!selectedData) return null;
                    return (
                      <motion.div
                        key={selectedData.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.2 }}
                        className="p-6 rounded-2xl bg-slate-100 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800/60 shadow-md space-y-4"
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="w-8 h-8 rounded-lg bg-[#0A3D62] dark:bg-[#00B894] text-white dark:text-slate-950 flex items-center justify-center font-black text-xs font-mono">
                            i
                          </span>
                          <span className="text-[10px] font-mono tracking-widest font-black text-[#FF6B6B] uppercase">
                            Approved Component
                          </span>
                        </div>

                        <h3 className="font-display font-black text-xl text-[#0A3D62] dark:text-white uppercase tracking-tight">
                          {selectedData.title}
                        </h3>

                        <p className="text-xs text-slate-550 dark:text-slate-400 leading-relaxed font-semibold">
                          {selectedData.desc}
                        </p>

                        <div className="p-3.5 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 flex justify-between items-center text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400">
                          <span>WAPDA Slabs Slashed</span>
                          <span className="text-[#00B894] font-mono font-black">✔ Verified</span>
                        </div>
                      </motion.div>
                    );
                  })()
                ) : (
                  <div className="p-6 rounded-2xl bg-slate-100 dark:bg-slate-950 border border-slate-205 dark:border-slate-800 border-dashed text-center text-slate-400 py-12">
                    <Info className="w-8 h-8 mx-auto text-slate-350 block mb-2" />
                    Please click or tap any radar circle widget on the refrigerator diagram to explore premium specifications.
                  </div>
                )}
              </AnimatePresence>

              {/* General summary detail */}
              <div className="p-4 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/40 rounded-xl">
                <p className="text-[10px] font-bold text-emerald-800 dark:text-emerald-350 leading-relaxed">
                  💡 <strong>Inverter Tip:</strong> Conventional compressors turn on 38+ times daily, triggering substantial reactive energy costs. Smart eco-inverters step down instantly to run continuously at single-digit wattages.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2.2 Trust Badges */}
      <section className="bg-slate-50 dark:bg-slate-950 py-16 border-b border-slate-200 dark:border-slate-900 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {trustBadges.map((badge, idx) => {
              const IconComponent = badge.icon;
              return (
                <div key={idx} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex gap-4 text-left transition-all hover:shadow-md transition-colors">
                  <div className="w-12 h-12 rounded-xl bg-[#0A3D62] text-[#00B894] flex items-center justify-center shrink-0 shadow-md shadow-[#0A3D62]/10">
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-extrabold text-sm text-[#0A3D62] dark:text-white uppercase tracking-tight">{badge.title}</h3>
                    <p className="text-xs text-slate-550 dark:text-slate-400 font-medium leading-relaxed">{badge.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 2.2 Featured Products Teaser */}
      <section className="py-16 sm:py-24 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center space-y-2">
            <span className="text-xs font-mono font-black text-[#FF6B6B] uppercase tracking-widest">Active Store Best Sellers</span>
            <h2 className="font-display font-black text-2xl sm:text-4xl text-[#0A3D62] dark:text-white uppercase tracking-tight">
              Reclaim Your Kitchen Comfort
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-xl mx-auto font-medium">
              Browse top-tier refrigeration systems specifically built to endure Pakistan's heavy power-surges with instant heat release mechanisms.
            </p>
          </div>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {featuredProducts.length > 0 ? (
              featuredProducts.map((prod) => (
                <motion.div
                  key={prod.id}
                  variants={itemVariants}
                  onClick={() => onProductClick(prod)}
                  className="bg-white dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 flex flex-col justify-between h-[390px] cursor-pointer hover:-translate-y-1.5 hover:shadow-xl transition-all duration-300 relative group transition-colors"
                >
                  <div className="aspect-square rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 relative">
                    <img 
                      src={prod.image} 
                      alt={prod.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-2 right-2 bg-[#0A3D62] text-white text-[9px] font-mono font-bold px-2 py-0.5 rounded uppercase">
                      {prod.category}
                    </div>
                  </div>

                  <div className="space-y-2 mt-4 text-left">
                    <div className="flex justify-between items-center text-[10px] uppercase font-bold text-slate-400">
                      <span>{prod.brand || 'Approved Model'}</span>
                      <span className="flex items-center gap-0.5 text-amber-500 font-mono">
                        <Star className="w-3.5 h-3.5 fill-current" /> {prod.rating}
                      </span>
                    </div>

                    <h4 className="font-bold text-xs text-[#0A3D62] dark:text-white uppercase tracking-tight min-h-8 line-clamp-2">
                      {prod.name}
                    </h4>

                    <div className="flex items-baseline gap-2 pt-1 border-t border-slate-100 dark:border-slate-850 mt-2">
                      <span className="text-sm font-black text-[#0A3D62] dark:text-white font-serif">Rs. {prod.price.toLocaleString()}</span>
                      {prod.originalPrice && (
                        <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono line-through font-medium">Rs. {prod.originalPrice.toLocaleString()}</span>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="col-span-full py-12 text-center text-slate-400">
                Fetching trending appliance list...
              </div>
            )}
          </motion.div>

          {/* Load More Button */}
          <div className="text-center pt-4">
            <button
              onClick={handleEnterSite}
              className="px-8 py-3 bg-[#0A3D62] dark:bg-[#00B894] hover:bg-[#00B894] dark:hover:bg-brand-mint-hover hover:text-[#0A3D62] dark:hover:text-[#0A3D62] text-white dark:text-slate-950 text-xs font-black uppercase tracking-widest rounded-xl transition-all hover:scale-[1.03] active:scale-95 shadow-md cursor-pointer transition-colors"
            >
              Browse Complete Catalog ({featuredProducts.length}+ Models)
            </button>
          </div>

        </div>
      </section>

      {/* 2.2 How It Works */}
      <section className="bg-slate-50 dark:bg-slate-950 py-16 border-b border-slate-200 dark:border-slate-900 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center space-y-2">
            <span className="text-xs font-mono font-black text-[#FF6B6B] uppercase tracking-widest">Simplifying Appliances</span>
            <h2 className="font-display font-black text-2xl sm:text-4xl text-[#0A3D62] dark:text-white uppercase tracking-tight">
              Order Your Cooling Unit In 3 Simple Steps
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            
            {/* Steps connection line (desktop only) */}
            <div className="hidden md:block absolute top-10 left-[16%] right-[16%] h-0.5 bg-dashed border-t border-dashed border-slate-200 dark:border-slate-800 -z-1" />

            {[
              { 
                step: "01", 
                title: "Browse Catalog", 
                desc: "Explore direct factory pricing, double door configurations, or analyze solar panels load ratio directly." 
              },
              { 
                step: "02", 
                title: "Confirm Your Order", 
                desc: "Check out safely in 3 clicks with Cash on Delivery or Secure Direct Bank Transfer. Zero mandatory sign-up steps." 
              },
              { 
                step: "03", 
                title: "Express Guard Shipping", 
                desc: "Our freight vectors transport appliances directly inside safety crates to avoid standard delivery bumps." 
              }
            ].map((st, i) => (
              <div key={i} className="text-center space-y-3 p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:border-[#0A3D62] dark:hover:border-[#00B894] transition-all transition-colors duration-300">
                <span className="w-12 h-12 rounded-full bg-[#0A3D62] dark:bg-slate-800 text-white dark:text-[#00B894] font-black text-xs font-mono flex items-center justify-center mx-auto shadow-md transition-colors">
                  {st.step}
                </span>
                <h3 className="font-extrabold text-[#0A3D62] dark:text-white uppercase text-sm mt-3">{st.title}</h3>
                <p className="text-xs text-slate-550 dark:text-slate-400 font-medium leading-relaxed max-w-xs mx-auto mt-1">{st.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* NEW SECTION: Frequently Asked Questions (Premium Dropdown Accordion) */}
      <section className="bg-white dark:bg-slate-900 py-16 sm:py-24 border-b border-slate-200 dark:border-slate-800 transition-colors duration-300">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center space-y-2">
            <span className="text-xs font-mono font-black text-[#FF6B6B] uppercase tracking-widest">Got Questions?</span>
            <h2 className="font-display font-black text-2xl sm:text-4xl text-[#0A3D62] dark:text-white uppercase tracking-tight">
              Solar & Energy FAQs
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-semibold font-sans">
              Everything you need to know about purchasing cooling systems for load-shedding areas.
            </p>
          </div>

          <div className="space-y-4">
            {FAQ_ITEMS.map((faq, i) => {
              const isOpen = faqOpen === i;
              return (
                <div 
                  key={i} 
                  className="rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden bg-slate-50 dark:bg-slate-950 transition-colors hover:bg-slate-100/50 dark:hover:bg-slate-900"
                >
                  <button
                    onClick={() => setFaqOpen(isOpen ? null : i)}
                    className="w-full p-5 flex justify-between items-center text-left font-extrabold text-sm uppercase text-[#0A3D62] dark:text-slate-100 select-none cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-250 ${
                      isOpen ? 'rotate-180 text-[#00B894]' : ''
                    }`} />
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: "auto" }}
                        exit={{ height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="px-5 pb-5 pt-1 text-xs text-slate-500 dark:text-slate-300 font-medium leading-relaxed border-t border-slate-200/50 dark:border-slate-800/30">
                          {faq.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* 2.2 Footer (Minimal) */}
      <footer className="bg-[#0A3D62] dark:bg-slate-950 text-white dark:text-slate-100 py-16 border-t border-transparent dark:border-slate-900 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          
          <div className="flex flex-wrap justify-center gap-8 text-xs text-slate-300">
            <button onClick={handleEnterSite} className="hover:text-[#00B894] transition-colors cursor-pointer uppercase font-bold tracking-wider">About Us</button>
            <button onClick={() => setView('faq')} className="hover:text-[#00B894] transition-colors cursor-pointer uppercase font-bold tracking-wider">Contact Helpdesk</button>
            <button onClick={() => setView('returns-policy')} className="hover:text-[#00B894] transition-colors cursor-pointer uppercase font-bold tracking-wider">Privacy Policy</button>
            <button onClick={handleEnterSite} className="hover:text-[#00B894] transition-colors cursor-pointer uppercase font-bold tracking-wider">Terms of Service</button>
          </div>

          <div className="max-w-md mx-auto p-4 bg-white/5 dark:bg-slate-900/50 border border-white/5 dark:border-slate-800/60 rounded-2xl space-y-1 transition-colors">
            <span className="text-[10px] font-mono font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest block">CREATOR PORTFOLIO SPOTLIGHT</span>
            <p className="text-[11px] text-slate-300 dark:text-slate-450 font-medium leading-relaxed">
              Designed and built by <strong>Farmanullah Ansari</strong>. Experienced engineer focused on custom high-load system architectures.
            </p>
          </div>

          <p className="text-[11px] text-slate-400 dark:text-slate-500">
            © 2026 fridge.pk Cooling Systems Private Limited. Authorized brand partner network across Pakistan. All trademarks protected.
          </p>
        </div>
      </footer>

    </div>
  );
}
