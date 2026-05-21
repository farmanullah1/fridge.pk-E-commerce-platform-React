import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Zap, Sun, Battery, Cpu, CheckCircle2, ArrowRight, RotateCcw, 
  Info, Sparkles, Wind, Snowflake, ShieldCheck, HelpCircle, 
  Lightbulb, ShoppingCart, Heart, RefreshCw, Eye
} from 'lucide-react';
import { Product, CartItem } from '../types';

interface ApplianceMatcherQuizViewProps {
  products: Product[];
  onProductClick: (product: Product) => void;
  onAddToCart: (product: Product, size: CartItem['size']) => void;
  setView: (view: any) => void;
  onNotify: (msg: string, type: 'success' | 'error' | 'info') => void;
}

export default function ApplianceMatcherQuizView({
  products,
  onProductClick,
  onAddToCart,
  setView,
  onNotify
}: ApplianceMatcherQuizViewProps) {
  // Step tracker
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;

  // Selected Answers State
  const [applianceType, setApplianceType] = useState<string>(''); // 'refrigerator', 'ac', 'freezer'
  const [capacityNeed, setCapacityNeed] = useState<string>(''); // 'small', 'medium', 'large'
  const [loadSheddingHours, setLoadSheddingHours] = useState<number>(2); // 0, 2, 4, 6+
  const [powerSource, setPowerSource] = useState<string>(''); // 'grid', 'solar', 'ups'

  // Calculated Results
  const results = useMemo(() => {
    if (currentStep <= totalSteps) return null;

    // 1. Filter products based on selections
    let recommendedCategory = 'double-door';
    if (applianceType === 'refrigerator') {
      if (capacityNeed === 'small') recommendedCategory = 'single-door';
      else if (capacityNeed === 'medium') recommendedCategory = 'double-door';
      else recommendedCategory = 'side-by-side';
    } else if (applianceType === 'ac') {
      recommendedCategory = 'air-conditioner';
    } else if (applianceType === 'freezer') {
      recommendedCategory = 'deep-freezer';
    }

    // Filter available catalog
    const matchingProducts = products.filter(p => p.category === recommendedCategory && p.inStock);
    const primaryRecommendation = matchingProducts[0] || products.find(p => p.category === 'double-door');

    // 2. Solar Panel Requirements
    // Estimate peak power draw based on recommendations or standard
    let estimatedRunningWatts = 120;
    if (applianceType === 'ac') {
      estimatedRunningWatts = capacityNeed === 'small' ? 550 : capacityNeed === 'medium' ? 750 : 1100;
    } else if (applianceType === 'freezer') {
      estimatedRunningWatts = 160;
    } else {
      estimatedRunningWatts = capacityNeed === 'small' ? 80 : capacityNeed === 'medium' ? 120 : 220;
    }

    // Solar Plates count calculation (assuming 550W mono-perc half-cut plates)
    const safetyMargin = 1.3; // inverter losses
    const activePlatesRequired = Math.ceil((estimatedRunningWatts * safetyMargin) / 550) || 1;

    // 3. Battery Storage & UPS specs
    // Ah required at 12V
    // RunningWatts * hours / (batteryEfficiency * voltage)
    const volts = applianceType === 'ac' ? 48 : 12; // High load ACs run on 48V grid
    const batteryAhRequired = Math.ceil((estimatedRunningWatts * loadSheddingHours * safetyMargin) / (0.85 * volts));
    
    // Inverter size Recommendation
    const recommendedInverterKVA = applianceType === 'ac' 
      ? (capacityNeed === 'large' ? '3.2 KVA' : '2.2 KVA')
      : '1.2 KVA';

    return {
      primary: primaryRecommendation,
      alternatives: matchingProducts.slice(1, 4),
      runningWatts: estimatedRunningWatts,
      solarPlates: activePlatesRequired,
      batteryAh: batteryAhRequired,
      inverterKVA: recommendedInverterKVA,
      batteryV: volts
    };
  }, [applianceType, capacityNeed, loadSheddingHours, powerSource, currentStep, products]);

  // Handle Forward progression
  const nextStep = () => {
    if (currentStep === 1 && !applianceType) {
      onNotify('Please select an appliance category to proceed!', 'error');
      return;
    }
    if (currentStep === 2 && !capacityNeed) {
      onNotify('Please pick a capacity indicator!', 'error');
      return;
    }
    if (currentStep === 4 && !powerSource) {
      onNotify('Select your current or future planned power source!', 'error');
      return;
    }
    setCurrentStep(prev => prev + 1);
  };

  // Handle Backward progression
  const prevStep = () => {
    setCurrentStep(prev => Math.max(1, prev - 1));
  };

  // Reset quiz
  const handleReset = () => {
    setApplianceType('');
    setCapacityNeed('');
    setLoadSheddingHours(2);
    setPowerSource('');
    setCurrentStep(1);
    onNotify('Diagnostic questionnaire reset!', 'info');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10" id="smart-appliance-quiz-container">
      {/* Upper header segment */}
      <div className="text-center space-y-3 mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-navy-900 text-brand-mint text-[10px] font-mono tracking-widest uppercase rounded-full border border-brand-mint/20">
          <Sparkles className="w-4 h-4 text-brand-mint animate-spin" style={{ animationDuration: '3s' }} />
          <span>Pakistan Smart Energy Lab</span>
        </div>
        <h1 className="text-3xl font-display font-black text-brand-navy-950 tracking-tight uppercase">
          Climate & Solar Matching Advisor
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto font-medium">
          Answer a few domestic load parameters to estimate accurate solar setups, battery backups, and find the perfect certified inverters for your budget.
        </p>
      </div>

      {/* Progress scale */}
      {currentStep <= totalSteps && (
        <div className="mb-8 max-w-lg mx-auto">
          <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
            <span>Progress Parameter</span>
            <span>Step {currentStep} of {totalSteps}</span>
          </div>
          <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-brand-coral transition-all duration-300"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* STEP INTERACTIVE MODULES IN ANIMATION PRESENCE */}
      <AnimatePresence mode="wait">
        
        {/* STEP 1: Appliance Selection */}
        {currentStep === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="bg-white rounded-3xl border border-slate-150/60 p-6 sm:p-10 shadow-lg space-y-6"
          >
            <div className="text-center sm:text-left">
              <span className="text-xs font-mono font-bold text-brand-coral uppercase">Operational Context</span>
              <h2 className="text-xl font-black text-brand-navy-950 mt-1 uppercase">What system matches your load update?</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { id: 'refrigerator', label: 'E-Inverter Refrigerator', desc: 'Maintains prolonged food freshness at extreme Pakistan summer temp thresholds.', icon: Snowflake },
                { id: 'ac', label: 'Inverter Air Conditioner', desc: 'Extreme quick-chill solutions with dual rotary variable speeds for rapid cooling.', icon: Wind },
                { id: 'freezer', label: 'Chest Deep Freezer', desc: 'Massive thermal density built with copper coils to sustain long load-shedding shutoffs.', icon: Zap }
              ].map(item => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => setApplianceType(item.id)}
                    className={`p-5 rounded-2xl border text-left flex flex-col justify-between h-44 cursor-pointer transition-all ${
                      applianceType === item.id
                        ? 'border-brand-navy-900 bg-brand-neutral-50 shadow-md ring-1 ring-brand-navy-900'
                        : 'border-slate-100 bg-slate-50/50 text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${applianceType === item.id ? 'bg-brand-navy-900 text-white border-brand-navy-900' : 'bg-white text-slate-600 border-slate-200'}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-brand-navy-950 uppercase tracking-tight">{item.label}</h4>
                      <p className="text-[10px] text-slate-400 mt-1 lines-clamp-2">{item.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="pt-4 flex justify-end">
              <button
                onClick={nextStep}
                className="px-6 py-3 bg-brand-navy-900 hover:bg-brand-coral text-white text-xs font-bold uppercase tracking-widest rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4 text-brand-mint" />
              </button>
            </div>
          </motion.div>
        )}

        {/* STEP 2: Sizing Requirements */}
        {currentStep === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="bg-white rounded-3xl border border-slate-150/60 p-6 sm:p-10 shadow-lg space-y-6"
          >
            <div className="text-center sm:text-left">
              <span className="text-xs font-mono font-bold text-brand-coral uppercase">Volumetric Demand</span>
              <h2 className="text-xl font-black text-brand-navy-950 mt-1 uppercase">Determine physical sizing & capacity specs</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { 
                  id: 'small', 
                  label: 'Compact Usage', 
                  desc: applianceType === 'ac' ? '1.0 Ton Class (Up to 120 sq ft room size)' : '12–14 Cubic Feet (Perfect for 2-4 persons)',
                  details: 'Loads average strictly under 110W once speed stabilized.'
                },
                { 
                  id: 'medium', 
                  label: 'Standard Family Size', 
                  desc: applianceType === 'ac' ? '1.5 Ton Class (Ideal 150-180 sq ft space)' : '15–18 Cubic Feet (Most popular for 4-6 members)',
                  details: 'Optimized high-efficiency dual stage compressors.'
                },
                { 
                  id: 'large', 
                  label: 'Enormous Capacity', 
                  desc: applianceType === 'ac' ? '2.0+ Ton Class (For spacious drawing rooms)' : '20+ Cubic Feet (Large families and premium side-by-side grids)',
                  details: 'Requires robust backup and solar plates grids.'
                }
              ].map(item => (
                <button
                  key={item.id}
                  onClick={() => setCapacityNeed(item.id)}
                  className={`p-5 rounded-2xl border text-left flex flex-col justify-between h-44 cursor-pointer transition-all ${
                    capacityNeed === item.id
                      ? 'border-brand-navy-900 bg-brand-neutral-50 shadow-md ring-1 ring-brand-navy-900'
                      : 'border-slate-100 bg-slate-50/50 text-slate-700 hover:border-slate-300'
                  }`}
                >
                  <span className={`text-[10px] font-mono tracking-wider font-extrabold uppercase px-2.5 py-1 rounded-full ${capacityNeed === item.id ? 'bg-brand-navy-900 text-brand-mint' : 'bg-slate-200 text-slate-600'}`}>
                    {item.label}
                  </span>
                  <div>
                    <p className="text-[11px] font-bold text-slate-700 leading-snug">{item.desc}</p>
                    <p className="text-[9px] text-brand-coral font-medium mt-1 uppercase">{item.details}</p>
                  </div>
                </button>
              ))}
            </div>

            <div className="pt-4 flex justify-between">
              <button
                onClick={prevStep}
                className="px-5 py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold uppercase tracking-widest rounded-xl transition-colors cursor-pointer"
              >
                Back
              </button>
              <button
                onClick={nextStep}
                className="px-6 py-3 bg-brand-navy-900 hover:bg-brand-coral text-white text-xs font-bold uppercase tracking-widest rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4 text-brand-mint" />
              </button>
            </div>
          </motion.div>
        )}

        {/* STEP 3: Load Shedding Parameters */}
        {currentStep === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="bg-white rounded-3xl border border-slate-150/60 p-6 sm:p-10 shadow-lg space-y-6"
          >
            <div className="text-center sm:text-left">
              <span className="text-xs font-mono font-bold text-brand-coral uppercase">Utility Reliability</span>
              <h2 className="text-xl font-black text-brand-navy-950 mt-1 uppercase">What are daily load shedding patterns?</h2>
            </div>

            <div className="space-y-6">
              <div className="flex justify-between items-center bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-500 border border-amber-100 flex items-center justify-center shrink-0">
                    <Zap className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-xs text-brand-navy-900 uppercase">Load Shedding Duration</h4>
                    <p className="text-[10px] text-slate-400 font-medium">Determines battery standby capacities needed.</p>
                  </div>
                </div>
                <span className="text-sm font-black text-slate-700 font-mono bg-white px-3 py-1 rounded-lg border">
                  {loadSheddingHours === 0 ? 'Pure Grid Continuity' : `${loadSheddingHours} Hours Daily`}
                </span>
              </div>

              <div className="space-y-4 pt-2">
                <input 
                  type="range"
                  min="0"
                  max="10"
                  step="1"
                  value={loadSheddingHours}
                  onChange={(e) => setLoadSheddingHours(Number(e.target.value))}
                  className="w-full accent-brand-coral"
                />
                <div className="flex justify-between text-[9px] font-extrabold text-slate-400 uppercase tracking-widest font-mono">
                  <span>0 hrs (No Shedding)</span>
                  <span>4 hrs (Average)</span>
                  <span>8 hrs (Severe)</span>
                  <span>10 hrs (Extreme Grid)</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-brand-mint/10 border border-brand-mint/20 text-brand-navy-950 text-xs flex gap-3">
                <Info className="w-4 h-4 text-brand-navy-900 shrink-0 mt-0.5" />
                <p className="font-medium leading-relaxed">
                  <strong>Did you know?</strong> Traditional compressors risk damage from immediate grid restart voltage spikes. Our recommended inverter lineup is equipped with robust integrated **low-voltage startup buffers (down to 135V)**, eliminating stabilizer equipment needs completely.
                </p>
              </div>
            </div>

            <div className="pt-4 flex justify-between">
              <button
                onClick={prevStep}
                className="px-5 py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold uppercase tracking-widest rounded-xl transition-colors cursor-pointer"
              >
                Back
              </button>
              <button
                onClick={nextStep}
                className="px-6 py-3 bg-brand-navy-900 hover:bg-brand-coral text-white text-xs font-bold uppercase tracking-widest rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4 text-brand-mint" />
              </button>
            </div>
          </motion.div>
        )}

        {/* STEP 4: Secondary Power source */}
        {currentStep === 4 && (
          <motion.div
            key="step4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="bg-white rounded-3xl border border-slate-150/60 p-6 sm:p-10 shadow-lg space-y-6"
          >
            <div className="text-center sm:text-left">
              <span className="text-xs font-mono font-bold text-brand-coral uppercase">Supply Strategy</span>
              <h2 className="text-xl font-black text-brand-navy-950 mt-1 uppercase">Select your auxiliary grid source</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { id: 'grid', label: 'WAPDA/KE Direct Grid', desc: 'Strictly reliant on utility supply network lines. Backed by local in-device cooling shielding.', icon: ShieldCheck },
                { id: 'solar', label: 'Net-Meter Hybrid Solar', desc: 'Operated via dedicated DC-to-AC solar panels during sunlight shifts. High ROI value.', icon: Sun },
                { id: 'ups', label: 'UPS / Liquid Batteries', desc: 'Maintained via traditional simulated sine inverters on local auto-charging batteries.', icon: Battery }
              ].map(item => {
                const Icon2 = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => setPowerSource(item.id)}
                    className={`p-5 rounded-2xl border text-left flex flex-col justify-between h-44 cursor-pointer transition-all ${
                      powerSource === item.id
                        ? 'border-brand-navy-900 bg-brand-neutral-50 shadow-md ring-1 ring-brand-navy-900'
                        : 'border-slate-100 bg-slate-50/50 text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${powerSource === item.id ? 'bg-brand-navy-900 text-white border-brand-navy-900' : 'bg-white text-slate-600 border-slate-200'}`}>
                      <Icon2 className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-brand-navy-950 uppercase tracking-tight">{item.label}</h4>
                      <p className="text-[10px] text-slate-400 mt-1 lines-clamp-2">{item.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="pt-4 flex justify-between">
              <button
                onClick={prevStep}
                className="px-5 py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold uppercase tracking-widest rounded-xl transition-colors cursor-pointer"
              >
                Back
              </button>
              <button
                onClick={nextStep}
                className="px-6 py-3 bg-brand-navy-900 hover:bg-brand-mint text-white text-xs font-extrabold uppercase tracking-widest rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shadow-md"
              >
                <span>Analyze Specifications</span>
                <CheckCircle2 className="w-4 h-4 text-brand-mint animate-bounce" />
              </button>
            </div>
          </motion.div>
        )}

        {/* RESULTS PAGE VIEW */}
        {currentStep > totalSteps && results && (
          <motion.div
            key="results"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-8"
          >
            {/* Upper summary diagnostics cards */}
            <div className="bg-gradient-to-r from-brand-navy-950 via-slate-900 to-brand-navy-950 p-6 sm:p-8 rounded-3xl border border-white/10 text-white grid grid-cols-1 md:grid-cols-3 gap-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-80 h-80 bg-brand-mint/5 rounded-full blur-3xl pointer-events-none" />
              
              <div className="md:border-r border-white/10 pr-6 space-y-2">
                <span className="text-[10px] font-mono tracking-widest uppercase text-brand-mint font-extrabold flex items-center gap-1">
                  <Cpu className="w-3.5 h-3.5" /> Calculated Net Consumption
                </span>
                <h3 className="text-2xl font-black font-mono text-white tracking-tight">{results.runningWatts} Watts</h3>
                <p className="text-[10px] text-slate-450 leading-relaxed font-bold uppercase">Estimated maximum load consumption once speed cycles stabilize.</p>
              </div>

              <div className="md:border-r border-white/10 md:px-6 space-y-2">
                <span className="text-[10px] font-mono tracking-widest uppercase text-brand-coral font-extrabold flex items-center gap-1">
                  <Sun className="w-3.5 h-3.5 animate-pulse" /> Off-grid Solar Formula
                </span>
                <h3 className="text-2xl font-black font-mono text-white tracking-tight">{results.solarPlates} × 550W Plates</h3>
                <p className="text-[10px] text-slate-450 leading-relaxed font-bold uppercase">Recommended Mono-Perc Half-Cut panels to support direct zero-cost day runs.</p>
              </div>

              <div className="md:pl-6 space-y-2">
                <span className="text-[10px] font-mono tracking-widest uppercase text-brand-mint font-extrabold flex items-center gap-1">
                  <Battery className="w-3.5 h-3.5" /> Back-up Batteries Spec
                </span>
                <h3 className="text-2xl font-black font-mono text-white tracking-tight">{results.batteryAh} Ah ({results.batteryV}V)</h3>
                <p className="text-[10px] text-slate-450 leading-relaxed font-bold uppercase">Estimated deep cycle batteries capacity required to handle continuous load-shedding cycles.</p>
              </div>
            </div>

            {/* Main Primary recommendation box info */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              <div className="lg:col-span-8 bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-xl space-y-6">
                <div>
                  <h3 className="font-display font-black text-lg text-brand-navy-900 border-b border-slate-100 pb-3 uppercase flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" /> Matches Curated System Found
                  </h3>
                </div>

                {results.primary ? (
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
                    {/* Picture visual */}
                    <div className="sm:col-span-5 aspect-[4/5] rounded-2xl bg-slate-50 border overflow-hidden relative group">
                      <img 
                        src={results.primary.image} 
                        alt={results.primary.name} 
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                      />
                      {results.primary.isFlashSale && (
                        <div className="absolute top-2 left-2 bg-brand-coral text-white text-[9px] font-bold px-2 py-0.5 rounded uppercase">Flash Discount active</div>
                      )}
                    </div>

                    {/* Meta info & parameters details */}
                    <div className="sm:col-span-7 space-y-4 text-left">
                      <div className="flex gap-2 items-center text-[10px] font-bold uppercase tracking-widest text-slate-400">
                        <span>{results.primary.brand}</span>
                        <span>•</span>
                        <span className="text-brand-coral">{results.primary.category}</span>
                      </div>
                      
                      <h4 className="font-display font-black text-lg text-brand-navy-950 uppercase leading-snug">
                        {results.primary.name}
                      </h4>

                      <p className="text-xs text-slate-550 leading-relaxed font-medium">
                        {results.primary.description}
                      </p>

                      <div className="text-xl font-extrabold text-brand-navy-900 tracking-tight font-serif">
                        Rs. {results.primary.price.toLocaleString()}
                      </div>

                      {/* Diagnostic tags */}
                      <div className="flex flex-wrap gap-2 pt-2">
                        <span className="text-[9px] font-mono font-bold bg-slate-105 border border-slate-200 text-slate-650 px-2 py-0.5 rounded">Inverter Ready</span>
                        <span className="text-[9px] font-mono font-bold bg-brand-mint/15 text-brand-navy-950 px-2.5 py-0.5 rounded">Low Startup Guaranteed</span>
                        <span className="text-[9px] font-mono font-bold bg-brand-coral/10 text-brand-coral px-2.5 py-0.5 rounded">ECO-Friendly Gas</span>
                      </div>

                      {/* CTA operations row */}
                      <div className="flex flex-wrap gap-2 pt-3">
                        <button
                          onClick={() => onProductClick(results.primary)}
                          className="px-4 py-2 bg-slate-100 hover:bg-slate-250 text-slate-700 text-xs font-bold uppercase tracking-wider rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Technical Details</span>
                        </button>
                        <button
                          onClick={() => {
                            onAddToCart(results.primary, 'M');
                            onNotify('Successfully appended to cart from recomendations!', 'success');
                          }}
                          className="px-5 py-2.5 bg-brand-coral hover:bg-brand-navy-900 text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all hover:scale-[1.03] active:scale-95 shadow-md shadow-brand-coral/20 cursor-pointer flex items-center gap-1.5"
                        >
                          <ShoppingCart className="w-3.5 h-3.5" />
                          <span>Direct Order Option</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-8 text-center text-slate-400">
                    <p>No directly matches found for this specific parameters bundle. Explore full catalog instead.</p>
                  </div>
                )}
              </div>

              {/* Energy Advice Sidebar info cards */}
              <div className="lg:col-span-4 bg-slate-50 border border-slate-100 p-6 rounded-3xl space-y-6">
                <h4 className="font-display font-black text-xs text-brand-navy-900 tracking-wider uppercase border-b pb-2">Advisor Diagnostic Checklist</h4>
                
                <div className="space-y-4">
                  <div className="flex gap-3 text-xs leading-normal">
                    <Lightbulb className="w-5 h-5 text-brand-mint shrink-0" />
                    <p className="text-slate-600 font-medium">
                      <strong>Inverter Choice</strong>: Direct current variable frequency microchips use up to 60% less juice during operational lock state compared to fixed traditional models.
                    </p>
                  </div>

                  <div className="flex gap-3 text-xs leading-normal">
                    <HelpCircle className="w-5 h-5 text-brand-coral shrink-0" />
                    <p className="text-slate-600 font-medium">
                      <strong>UPS Standby Limit</strong>: Ensure your battery cells are deep discharge gel units rather than standard acid water plates. This enhances equipment longevity dramatically under Pakistani heating.
                    </p>
                  </div>

                  <div className="flex gap-3 text-xs leading-normal">
                    <ShieldCheck className="w-5 h-5 text-emerald-500 shrink-0" />
                    <p className="text-slate-600 font-medium">
                      <strong>Automatic Low Voltage startup</strong> support means no stabilizer hardware stands in your circuit list.
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-200 flex flex-col gap-2">
                  <button
                    onClick={handleReset}
                    className="w-full py-2.5 border border-slate-250 text-slate-600 hover:text-brand-navy-900 bg-white hover:bg-slate-50 text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '4s' }} />
                    <span>Recalculate Specs</span>
                  </button>
                  <button
                    onClick={() => setView('products')}
                    className="w-full py-2.5 bg-brand-navy-900 hover:bg-brand-coral text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer text-center"
                  >
                    Browse Complete List
                  </button>
                </div>
              </div>

            </div>

            {/* Symmetrical Alternative recommendations */}
            {results.alternatives && results.alternatives.length > 0 && (
              <div className="space-y-4">
                <h4 className="font-display font-black text-sm text-brand-navy-900 uppercase tracking-wide">
                  Alternative Approved Models matching criteria
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {results.alternatives.map(p => (
                    <div 
                      key={p.id}
                      onClick={() => onProductClick(p)}
                      className="bg-white border hover:border-brand-navy-900 p-4 rounded-2xl flex items-center gap-3 cursor-pointer transition-all hover:-translate-y-1 duration-200"
                    >
                      <div className="w-12 h-16 rounded-xl overflow-hidden shrink-0 border">
                        <img src={p.image} alt={p.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      </div>
                      <div className="space-y-1 overflow-hidden">
                        <h5 className="font-bold text-xs text-brand-navy-900 truncate leading-snug">{p.name}</h5>
                        <div className="text-[10px] text-brand-coral font-bold uppercase">{p.brand}</div>
                        <div className="text-[11px] font-black text-slate-800">Rs. {p.price.toLocaleString()}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
