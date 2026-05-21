import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { 
  Zap, Calendar, Sun, DollarSign, Calculator, Info, CheckCircle, 
  ArrowLeft, ArrowRight, ShieldCheck, Sparkles, TrendingDown
} from 'lucide-react';
import { Product } from '../types';

interface BillCalculatorProps {
  products: Product[];
  onNotify: (msg: string, type: 'success' | 'error' | 'info') => void;
  setView: (view: string) => void;
}

export default function BillCalculatorView({ products = [], onNotify, setView }: BillCalculatorProps) {
  // Pre-configured typical values for appliances in Pakistan
  const presetAppliances = [
    { id: 'inverter-refrigerator', name: 'Smart Inverter Refrigerator (Average)', loadWatts: 110, defaultHours: 24, description: 'PEL/Dawlance smart inverters that cycle down to 70W load once cooled.' },
    { id: 'standard-refrigerator', name: 'Traditional Non-Inverter Refrigerator', loadWatts: 350, defaultHours: 18, description: 'Older stator models that cycle on/off at high maximum loads.' },
    { id: 'inverter-ac-15', name: 'Inverter Air Conditioner 1.5 Ton', loadWatts: 650, defaultHours: 10, description: 'E.g., Gree GS-18PITH11W in ECO-mode average load once locked.' },
    { id: 'standard-ac-15', name: 'Standard Non-Inverter AC 1.5 Ton', loadWatts: 1750, defaultHours: 10, description: 'Older high-consumption units that continuously pull high load.' },
    { id: 'deep-freezer', name: 'Waves Inverter Deep Chest Freezer', loadWatts: 140, defaultHours: 16, description: 'High-retention compressor optimized for frequent load shedding.' }
  ];

  const [selectedPreset, setSelectedPreset] = useState(presetAppliances[0]);
  const [customWatts, setCustomWatts] = useState(110);
  const [hoursPerDay, setHoursPerDay] = useState(12);
  const [nepraRate, setNepraRate] = useState(48); // Current average average unit cost in PKR
  const [solarOffset, setSolarOffset] = useState(40); // 40% on solar

  // When preset drops, sync load and hours
  const handlePresetChange = (presetId: string) => {
    const preset = presetAppliances.find(p => p.id === presetId);
    if (preset) {
      setSelectedPreset(preset);
      setCustomWatts(preset.loadWatts);
      setHoursPerDay(preset.defaultHours);
      onNotify(`Loaded presets for ${preset.name}!`, 'info');
    }
  };

  // Calculations
  const calculations = useMemo(() => {
    // 1 unit = 1 kWh
    const dailyKWh = (customWatts * hoursPerDay) / 1000;
    const monthlyKWh = dailyKWh * 30;

    // Solar subsidized calculations
    const solarFraction = solarOffset / 100;
    const effectiveMonthlyKWh = monthlyKWh * (1 - solarFraction);

    // Costs
    const standardMonthlyBillObj = monthlyKWh * nepraRate;
    const solarSubsidizedBillObj = effectiveMonthlyKWh * nepraRate;
    const monthlySavingsObj = standardMonthlyBillObj - solarSubsidizedBillObj;

    // Static comparison: traditional non-inverter refrigerator/AC consumes average ~3x more!
    const baselineWatts = selectedPreset.id.includes('inverter') 
      ? customWatts * 2.8 
      : customWatts;
    
    const baselineDailyKWh = (baselineWatts * hoursPerDay) / 1000;
    const baselineMonthlyKWh = baselineDailyKWh * 30;
    const baselineMonthlyBill = baselineMonthlyKWh * nepraRate;
    const potentialInverterSavings = baselineMonthlyBill - standardMonthlyBillObj;

    return {
      monthlyUnits: Math.round(monthlyKWh),
      monthlyUnitsSolar: Math.round(effectiveMonthlyKWh),
      standardBill: Math.round(standardMonthlyBillObj),
      subsidizedBill: Math.round(solarSubsidizedBillObj),
      monthlySavings: Math.round(monthlySavingsObj),
      potentialInverterSavings: Math.round(potentialInverterSavings > 0 ? potentialInverterSavings : 0)
    };
  }, [customWatts, hoursPerDay, nepraRate, solarOffset, selectedPreset]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" id="bill-calculator-page">
      {/* Top Breadcrumb Header */}
      <div className="mb-8 flex md:flex-row flex-col justify-between items-start md:items-center gap-4 border-b border-slate-100 pb-6">
        <div>
          <button
            onClick={() => setView('ai-assistant')}
            className="flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-brand-coral uppercase tracking-wider mb-2 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to AI Assistant</span>
          </button>
          <div className="flex items-center gap-2 mb-1 text-brand-mint font-sans font-bold text-xs uppercase tracking-widest">
            <Calculator className="w-4 h-4 text-brand-mint" />
            <span>Virtual Wattage Estimant</span>
          </div>
          <h1 className="text-3xl font-display font-black text-brand-navy-900 tracking-tight">
            Electricity Bill & <span className="text-brand-coral">Solar Synergy Calculator</span>
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Calculate estimated running electricity bills and understand solar power conversion benefits.
          </p>
        </div>

        <button
          onClick={() => setView('products')}
          className="px-5 py-2.5 bg-brand-navy-900 hover:bg-brand-mint hover:text-white text-white text-xs font-bold uppercase tracking-widest rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer"
        >
          <span>Explore Inverter Models</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Input Sliders parameters panel */}
        <div className="lg:col-span-7 space-y-6">
          <motion.div 
            initial={{ opacity: 0, x: -15 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-2xl border border-slate-100 p-6 shadow-xs"
          >
            <h3 className="font-display font-bold text-lg text-brand-navy-900 border-b border-slate-100 pb-3 mb-6">
              1. Input Appliance Specifications
            </h3>

            <div className="space-y-6">
              {/* Select Preset */}
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase block mb-1.5 font-sans">
                  Choose Appliance Preset
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {presetAppliances.map(app => (
                    <button
                      key={app.id}
                      onClick={() => handlePresetChange(app.id)}
                      className={`text-left p-3 rounded-xl border text-xs font-medium cursor-pointer transition-all ${
                        selectedPreset.id === app.id
                          ? 'border-brand-mint bg-brand-mint/5 text-brand-navy-900'
                          : 'border-slate-100 bg-slate-50 text-slate-600 hover:border-slate-200'
                      }`}
                    >
                      <div className="font-bold mb-0.5">{app.name}</div>
                      <div className="text-[10px] text-slate-400 font-normal">{app.loadWatts} Watts</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Slider for custom Watts */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase block">
                    Appliance Running Power (Watts)
                  </label>
                  <span className="text-xs font-mono font-black text-brand-navy-900 bg-slate-100 px-2 py-0.5 rounded-md">
                    {customWatts} W
                  </span>
                </div>
                <input
                  type="range"
                  min="30"
                  max="2200"
                  step="10"
                  value={customWatts}
                  onChange={(e) => {
                    setCustomWatts(Number(e.target.value));
                    setSelectedPreset(presetAppliances[presetAppliances.length - 1]); // custom
                  }}
                  className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-brand-mint"
                />
                <span className="text-[9px] text-slate-400 block mt-1 leading-relaxed">
                  *PEL/Dawlance smart single refrigerators cycle downward to **70W - 110W**. Inverter ACs reach **400W - 650W** once temperature is locked.
                </span>
              </div>

              {/* Slider for Hours running per day */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase block">
                    Daily Usage Duration (Hours / Day)
                  </label>
                  <span className="text-xs font-mono font-black text-brand-navy-900 bg-slate-100 px-2 py-0.5 rounded-md">
                    {hoursPerDay} Hrs
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="24"
                  step="1"
                  value={hoursPerDay}
                  onChange={(e) => setHoursPerDay(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-brand-mint"
                />
              </div>

              {/* Slash Divider */}
              <div className="border-t border-slate-100 my-4" />

              <h3 className="font-display font-bold text-lg text-brand-navy-900 pb-1 pt-2">
                2. Grid Tariff & Solar Synergy Setup
              </h3>

              {/* NEPRA Electricity Rate slider */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase block">
                    Grid Electricity Tariff (PKR Rs. per Unit)
                  </label>
                  <span className="text-xs font-mono font-black text-brand-coral bg-brand-coral/5 px-2.5 py-0.5 rounded-md">
                    Rs. {nepraRate} / kWh
                  </span>
                </div>
                <input
                  type="range"
                  min="25"
                  max="80"
                  step="1"
                  value={nepraRate}
                  onChange={(e) => setNepraRate(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-brand-coral"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                  <span>Basics / Protected (Rs. 25)</span>
                  <span>Average Grid Rate (Rs. 48)</span>
                  <span>Peak / Commercial (Rs. 80)</span>
                </div>
              </div>

              {/* Solar Synergy offset slider */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase block">
                    Solar Panel Coverage Support (%)
                  </label>
                  <span className="text-xs font-mono font-black text-emerald-500 bg-emerald-50 px-2.5 py-0.5 rounded-md flex items-center gap-1">
                    <Sun className="w-3 h-3 text-emerald-500" />
                    <span>{solarOffset}% Off-Grid</span>
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={solarOffset}
                  onChange={(e) => setSolarOffset(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
                <span className="text-[9px] text-slate-400 block mt-1 leading-relaxed">
                  How much of the daytime appliance run hours are supported directly from solar plates generation.
                </span>
              </div>
            </div>
          </motion.div>

          {/* Quick Technical Comparison Sheet */}
          <div className="bg-slate-50 rounded-2xl border border-slate-100 p-6 space-y-4">
            <h4 className="text-xs font-bold text-brand-navy-950 uppercase tracking-widest flex items-center gap-2">
              <ShieldCheck className="w-4.5 h-4.5 text-brand-mint" />
              <span>Inverter Technology Verification Report</span>
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="bg-white p-4 rounded-xl border border-slate-105 space-y-1">
                <span className="font-bold text-brand-navy-900 block font-display">Variable Speed Compressors</span>
                <span className="text-slate-500 text-[11px] leading-relaxed block">
                  Avoid constant high-current start peaks. Adjust dynamically, consuming up to 60% lower grid load.
                </span>
              </div>
              <div className="bg-white p-4 rounded-xl border border-slate-105 space-y-1">
                <span className="font-bold text-brand-navy-900 block font-display">Eco Friendly R600a Gas</span>
                <span className="text-slate-500 text-[11px] leading-relaxed block">
                  Zero ozone depletion factor. Safer heat dissipation requires less pressure work from motor.
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Output Calculations panel */}
        <div className="lg:col-span-5 space-y-6">
          <motion.div 
            initial={{ opacity: 0, x: 15 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-brand-navy-900 text-white rounded-3xl p-6 shadow-lg border border-brand-navy-950 relative overflow-hidden"
          >
            {/* Ambient visual background glow details */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-mint/10 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-brand-coral/10 rounded-full blur-2xl pointer-events-none" />

            <div className="border-b border-white/10 pb-4 mb-6">
              <span className="text-[10px] uppercase font-black text-brand-mint tracking-widest block">Monthly Technical Summary</span>
              <h3 className="font-display font-black text-2xl text-white mt-1">Calculation Results</h3>
            </div>

            <div className="space-y-6">
              {/* Monthly Electricity Units Consumed */}
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-xs text-slate-400 block font-medium">Monthly Energy Units Consumed</span>
                  <span className="text-[10px] text-slate-500 block leading-non">Before solar deduction</span>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-mono font-black text-white">{calculations.monthlyUnits}</span>
                  <span className="text-xs text-brand-mint font-bold block">kWh (Units)</span>
                </div>
              </div>

              {/* Subsidized Solar Units */}
              {solarOffset > 0 && (
                <div className="flex justify-between items-center bg-white/5 p-3 rounded-lg border border-white/5">
                  <div className="flex items-center gap-1.5">
                    <Sun className="w-4 h-4 text-brand-mint shrink-0" />
                    <div>
                      <span className="text-xs text-slate-300 block font-semibold">Subsidized Grid Load</span>
                      <span className="text-[9px] text-slate-400 block font-medium">After {solarOffset}% solar conversion</span>
                    </div>
                  </div>
                  <div className="text-right font-mono font-black">
                    <span className="text-xl text-white block">{calculations.monthlyUnitsSolar}</span>
                    <span className="text-[9px] text-emerald-400 block">kWh Grid Units</span>
                  </div>
                </div>
              )}

              {/* Standard bill vs Solar Bill */}
              <div className="space-y-3 pt-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400 font-medium">Standard Electricity Bill estimate:</span>
                  <span className="font-mono font-bold text-slate-300">Rs. {calculations.standardBill}</span>
                </div>

                <div className="flex justify-between items-center border-t border-white/10 pt-4">
                  <div>
                    <span className="text-sm text-brand-mint font-bold block">Final Estimated Bill:</span>
                    <span className="text-[9px] text-slate-400 block">Calculated at current electrical rate</span>
                  </div>
                  <div className="text-right">
                    <span className="text-3xl font-mono font-black text-brand-mint">
                      Rs. {calculations.subsidizedBill}
                    </span>
                    <span className="text-[9px] text-slate-400 block font-medium">PKR / Month</span>
                  </div>
                </div>
              </div>

              {/* Saved Cash Metrics */}
              {calculations.monthlySavings > 0 && (
                <div className="bg-emerald-500/10 p-4 rounded-xl border border-emerald-500/20 flex gap-3">
                  <TrendingDown className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs font-bold text-emerald-400 block uppercase tracking-wider">Solar Net Monthly Savings</span>
                    <span className="text-xl font-mono font-black text-white block mt-0.5">Rs. {calculations.monthlySavings}</span>
                    <span className="text-[10px] text-emerald-500 block leading-relaxed font-bold mt-1">
                      Save approx. **Rs. {calculations.monthlySavings * 12}** annually!
                    </span>
                  </div>
                </div>
              )}

              {/* If comparing an inverter preset */}
              {selectedPreset.id.includes('inverter') && (
                <div className="bg-brand-coral/10 p-4 rounded-xl border border-brand-coral/20 flex gap-3">
                  <Sparkles className="w-5 h-5 text-brand-coral shrink-0 mt-0.5 animate-pulse" />
                  <div>
                    <span className="text-xs font-bold text-brand-coral block uppercase tracking-wider">Inverter Smart Upgrade Savings</span>
                    <span className="text-slate-300 text-[10px] leading-relaxed block mt-1">
                      Upgrading from an older static compressor baseline saves you **Rs. {calculations.potentialInverterSavings} / Month** on standard bills alone!
                    </span>
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          {/* Featured Inverter model link matching user parameters */}
          <div className="bg-white rounded-2xl border border-slate-100 p-6 space-y-3 shadow-xs">
            <span className="text-[9px] uppercase font-black text-slate-400 tracking-wider block">Recommended models</span>
            <div className="flex items-center gap-3">
              <img
                src="https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=200"
                alt="Product recommend"
                className="w-12 h-12 object-cover rounded-lg border bg-slate-50"
                referrerPolicy="no-referrer"
              />
              <div className="flex-grow">
                <span className="text-xs font-bold text-brand-navy-950 block hover:text-brand-coral transition-colors">
                  Pel Pride Inverter Refrigerator 3300 Pro
                </span>
                <span className="text-[10px] text-brand-mint font-bold block mt-0.5">
                  Rs. 72,000 <span className="text-slate-400 font-normal line-through text-[9px]">Rs. 85,000</span>
                </span>
              </div>
            </div>
            
            <button
              onClick={() => setView('products')}
              className="w-full text-center py-2.5 bg-slate-50 hover:bg-brand-mint hover:text-white border border-slate-150 text-slate-600 rounded-lg text-xs font-bold uppercase transition-all duration-200 cursor-pointer"
            >
              Configure compare sheet
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
