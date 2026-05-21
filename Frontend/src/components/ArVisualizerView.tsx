import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { 
  Maximize2, RotateCw, Smartphone, Eye, Layout, Home, CheckCircle, Info, ChevronRight, Sparkles, HelpCircle, ArrowLeft, RefreshCw
} from 'lucide-react';
import { Product } from '../types';

interface ArVisualizerViewProps {
  products: Product[];
  onNotify: (msg: string, type: 'success' | 'error' | 'info') => void;
  setView: (view: string) => void;
  initialProductId?: string;
}

export default function ArVisualizerView({ products = [], onNotify, setView, initialProductId }: ArVisualizerViewProps) {
  // Filters to find appliance list
  const activeAppliances = useMemo(() => {
    return products.length > 0 ? products : [
      {
        id: 'dd1',
        name: 'Pel Pride Inverter Refrigerator 3300 Pro',
        category: 'double-door',
        price: 72000,
        image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=600',
        brand: 'PEL',
        stock: 9,
        description: 'Frost-free refrigerator with low voltage operation down to 140V.'
      },
      {
        id: 'sb1',
        name: 'Haier Digital Quad-Inverter Luxury Four-Door Refrigerator',
        category: 'side-by-side',
        price: 245000,
        image: 'https://images.unsplash.com/photo-1571175487739-4ad331ee0cc1?auto=format&fit=crop&q=80&w=600',
        brand: 'Haier',
        stock: 5,
        description: 'Elite four-door dynamic cooling matrix.'
      },
      {
        id: 'ac1',
        name: 'Gree Pular 1.5-Ton Heat & Cool Inverter (GS-18PITH11W)',
        category: 'air-conditioner',
        price: 138000,
        image: 'https://images.unsplash.com/photo-1585338107529-13afc5f02586?auto=format&fit=crop&q=80&w=600',
        brand: 'Gree',
        stock: 18,
        description: 'High efficiency split inverter system.'
      }
    ];
  }, [products]);

  const [selectedProd, setSelectedProd] = useState<any>(
    activeAppliances.find(p => p.id === initialProductId) || activeAppliances[0]
  );

  // AR Settings Controls
  const [panelFinish, setPanelFinish] = useState<'steel' | 'black' | 'gold' | 'mint'>('steel');
  const [doorOpenAngle, setDoorOpenAngle] = useState(0); // 0 to 120 degrees
  const [placementZone, setPlacementZone] = useState<'kitchen-corner' | 'lounge-lobby' | 'wall-mount'>('kitchen-corner');
  const [simulatorScale, setSimulatorScale] = useState(1.0); // 0.8x to 1.3x zoom
  const [isMeasuring, setIsMeasuring] = useState(true);
  const [showHelperLines, setShowHelperLines] = useState(true);

  // Dynamic dimension metrics of selected item
  const productSpecs = useMemo(() => {
    switch (selectedProd?.category) {
      case 'side-by-side':
        return { height: '185 cm', width: '91 cm', depth: '73 cm', weight: '110 kg', recommendedGap: '10 cm' };
      case 'deep-freezer':
        return { height: '94 cm', width: '120 cm', depth: '65 cm', weight: '58 kg', recommendedGap: '8 cm' };
      case 'air-conditioner':
        return { height: '32 cm (Indoor)', width: '101 cm', depth: '23 cm', weight: '14 kg', recommendedGap: '15 cm (Top)' };
      case 'single-door':
        return { height: '125 cm', width: '55 cm', depth: '58 cm', weight: '36 kg', recommendedGap: '5 cm' };
      default: // double door
        return { height: '165 cm', width: '66 cm', depth: '68 cm', weight: '76 kg', recommendedGap: '8 cm' };
    }
  }, [selectedProd]);

  // Color options representation
  const finishColors = {
    steel: 'bg-slate-300 border-slate-400',
    black: 'bg-stone-900 border-stone-950',
    gold: 'bg-amber-100 border-amber-300',
    mint: 'bg-emerald-50 border-emerald-200'
  };

  const currentFinishColorClass = useMemo(() => {
    switch (panelFinish) {
      case 'black': return 'bg-stone-900 text-slate-300';
      case 'gold': return 'bg-amber-50/90 text-amber-950';
      case 'mint': return 'bg-emerald-50/50 text-emerald-950';
      default: return 'bg-slate-100 text-slate-800';
    }
  }, [panelFinish]);

  const toggleScan = () => {
    onNotify('Initiating simulated camera scanner... Calibrated environment depth!', 'success');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" id="ar-visualizer-page">
      {/* Page Header */}
      <div className="mb-8 flex md:flex-row flex-col justify-between items-start md:items-center gap-4 border-b border-slate-100 pb-5">
        <div>
          <button
            onClick={() => setView('products')}
            className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-brand-coral uppercase tracking-wider mb-2 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Products</span>
          </button>
          <div className="flex items-center gap-2 mb-1 text-brand-mint font-bold text-xs uppercase tracking-widest">
            <Smartphone className="w-4 h-4 animate-pulse" />
            <span>AR Camera & Space Visualizer</span>
          </div>
          <h1 className="text-3xl font-display font-black text-brand-navy-900 tracking-tight">
            AR Dimension & <span className="text-brand-coral text-transparent bg-clip-text bg-gradient-to-r from-brand-coral via-rose-500 to-amber-500">Kitchen Simulator</span>
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Simulate cabinet fits, check door clearance swings in 3D perspective, and view colors directly!
          </p>
        </div>

        <button
          onClick={toggleScan}
          className="px-5 py-2.5 bg-brand-coral hover:bg-brand-coral-hover text-white text-xs font-bold uppercase tracking-widest rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer shrink-0"
        >
          <Maximize2 className="w-4 h-4" />
          <span>Launch Phone Camera AR</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Panel: 3D Render Canvas & Floorplan Scene */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-slate-900 rounded-3xl overflow-hidden relative border border-slate-850 h-[480px] flex flex-col justify-between p-6 shadow-inner text-white">
            
            {/* Background Simulated Grid Canvas */}
            <div className="absolute inset-0 z-0 bg-image opacity-15 pointer-events-none" 
                 style={{ backgroundImage: `radial-gradient(circle, #ffffff 1.5px, transparent 1.5px)`, backgroundSize: '24px 24px' }} />
            
            {/* Perspective Isometric Floor Plate */}
            <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none overflow-hidden">
              <div 
                className="w-[500px] h-[300px] bg-slate-800/40 border border-slate-700 rounded-full blur-2xl opacity-40 transform rotate-x-60 scale-125"
                style={{ transform: `rotateX(60deg) rotateZ(-25deg) scale(${simulatorScale})` }}
              />
            </div>

            {/* Dashboard Camera Information Header Overlay */}
            <div className="relative z-10 flex justify-between items-start">
              <div className="space-y-1 bg-slate-950/70 backdrop-blur-md px-4 py-2.5 rounded-xl border border-white/10 text-xs">
                <span className="text-[9px] uppercase font-bold text-brand-mint block">Calibration Mode</span>
                <div className="flex items-center gap-1.5 font-bold">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
                  <span>Interactive Kitchen Space Matrix</span>
                </div>
                {isMeasuring && (
                  <span className="text-[10px] text-slate-400 block pt-0.5 font-medium font-mono">
                    Floor Delta: 0.00m • Depth Ref: {productSpecs.recommendedGap} gap lock
                  </span>
                )}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setIsMeasuring(!isMeasuring)}
                  className={`p-2.5 rounded-xl text-xs font-semibold cursor-pointer transition-colors ${
                    isMeasuring ? 'bg-brand-mint text-white border border-brand-mint' : 'bg-slate-850/80 text-slate-400 hover:bg-slate-800'
                  }`}
                  title="Toggle Measure Indicators"
                >
                  Measure Rules
                </button>
                <button
                  onClick={() => setShowHelperLines(!showHelperLines)}
                  className={`p-2.5 rounded-xl text-xs font-semibold cursor-pointer transition-colors ${
                    showHelperLines ? 'bg-brand-coral text-white border border-brand-coral' : 'bg-slate-850/80 text-slate-400 hover:bg-slate-800'
                  }`}
                  title="Toggle Dimension Box"
                >
                  Outline Box
                </button>
              </div>
            </div>

            {/* Simulated 3D Appliance Object inside Space */}
            <div className="relative z-10 flex-grow flex items-center justify-center">
              <motion.div
                animate={{
                  scale: simulatorScale,
                  rotateY: doorOpenAngle * 0.1, // mock pseudo pivot
                }}
                className="relative flex flex-col items-center justify-center transition-all duration-300"
              >
                {/* Simulated physical shadow of appliance */}
                <div className="absolute -bottom-8 w-44 h-8 bg-black/60 rounded-full filter blur-md transform scale-110" />

                {/* Simulated Wall Mounted AC vs Standing Fridge */}
                {selectedProd?.category === 'air-conditioner' ? (
                  <div className="w-80 h-24 rounded-lg bg-slate-100 border-4 border-slate-400 flex flex-col justify-between p-3 text-slate-800 relative shadow-2xl overflow-hidden animate-pulse">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">GREE INVERTER</span>
                      <span className="text-[9px] bg-brand-mint/20 text-brand-mint font-bold px-1 py-0.5 rounded">1.5 Ton</span>
                    </div>
                    {/* Glowing digital screen */}
                    <div className="flex justify-between items-end">
                      <span className="text-[8px] text-slate-400 font-mono">Auto Filter Clean active</span>
                      <span className="text-xl font-mono font-black text-brand-mint">16°C</span>
                    </div>
                    {/* Animated air wave particles */}
                    <div className="absolute -bottom-1 left-2 right-2 h-4 flex justify-around opacity-40">
                      <div className="w-0.5 h-3 bg-cyan-300 rounded animate-bounce delay-100" />
                      <div className="w-0.5 h-3 bg-cyan-300 rounded animate-bounce delay-200" />
                      <div className="w-0.5 h-3 bg-cyan-300 rounded animate-bounce delay-300" />
                    </div>
                  </div>
                ) : (
                  // Refrigerator or chest deep freezer
                  <div 
                    className={`w-44 h-72 rounded-2xl border-2 shadow-2xl relative overflow-hidden transition-all duration-350 ${currentFinishColorClass} border-white/20`}
                  >
                    {/* Fridge Branding line badge */}
                    <div className="p-3 border-b border-white/10 flex justify-between items-center">
                      <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">
                        {selectedProd?.brand || 'Premium'}
                      </span>
                      <div className="w-2.5 h-2.5 rounded-full bg-brand-mint shadow-md" />
                    </div>

                    {/* Handle and door divisions */}
                    {selectedProd?.category === 'special' || selectedProd?.category === 'side-by-side' ? (
                      // Side by side dual door
                      <div className="absolute inset-0 top-10 flex">
                        <div className="w-1/2 border-r border-white/10 p-2 flex flex-col justify-start">
                          <div className="w-1 h-12 bg-white/40 rounded-full ml-auto mt-6" />
                        </div>
                        <div className="w-1/2 p-2">
                          <div className="w-1 h-12 bg-white/40 rounded-full mr-auto mt-6" />
                        </div>
                      </div>
                    ) : (
                      // Top freezer / bottom fridge divisions
                      <div className="flex flex-col h-full">
                        {/* Top Compartment */}
                        <div className="h-[35%] border-b border-white/10 p-3 relative flex items-end">
                          <div className="w-1.5 h-8 bg-white/20 rounded-full absolute bottom-2 right-3" />
                          <span className="text-[8px] text-slate-500 font-mono">FREEZER ZONE</span>
                        </div>
                        {/* Bottom compartment */}
                        <div className="h-[65%] p-3 relative flex flex-col justify-between">
                          <div className="w-1.5 h-14 bg-white/20 rounded-full absolute top-4 right-3" />
                          <span className="text-[8px] text-slate-500 font-mono mt-2">COOLING ZONE</span>
                          
                          {/* Simulated Digital Thermostat screen */}
                          <div className="bg-slate-950/80 px-2 py-1 rounded w-12 text-center text-brand-mint font-mono text-[8px] border border-white/5 mx-auto">
                            03°C
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Swing Indicator of door clearance limit */}
                    {doorOpenAngle > 10 && (
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.8 }}
                        className="absolute inset-y-0 left-0 bg-brand-mint/20 border-r border-brand-mint/40 origin-left"
                        style={{ width: `${doorOpenAngle/2}px` }}
                      >
                        <span className="absolute bottom-4 left-2 text-[8px] font-bold text-brand-mint uppercase tracking-wide whitespace-nowrap">
                          {doorOpenAngle}° Swing clearance OK
                        </span>
                      </motion.div>
                    )}
                  </div>
                )}

                {/* Superimposed measurement lines */}
                {showHelperLines && (
                  <div className="absolute -inset-4 border-2 border-dashed border-slate-500/30 rounded-2xl pointer-events-none flex flex-col justify-between p-2">
                    <span className="text-[9px] font-mono text-slate-400 bg-slate-950/80 px-1 py-0.5 rounded self-center">
                      Width: {productSpecs.width}
                    </span>
                    <div className="flex justify-between w-full">
                      <span className="text-[9px] font-mono text-slate-400 bg-slate-950/80 px-1 py-0.5 rounded self-center">
                        Depth: {productSpecs.depth}
                      </span>
                      <span className="text-[9px] font-mono text-brand-coral bg-slate-950/80 px-1 py-0.5 rounded self-center font-bold">
                        Clearance lock
                      </span>
                    </div>
                  </div>
                )}
              </motion.div>
            </div>

            {/* Bottom visual overlay footer details */}
            <div className="relative z-10 flex justify-between items-end flex-wrap gap-3 pt-6 border-t border-white/5 bg-slate-900/60 p-3 rounded-2xl">
              <div className="text-left">
                <span className="text-[9px] text-slate-400 block font-bold uppercase tracking-wide">Configued appliance</span>
                <span className="text-xs font-bold text-white block truncate max-w-[200px] sm:max-w-xs">
                  {selectedProd?.name}
                </span>
                <span className="text-xs text-brand-mint font-bold block mt-0.5">
                  Rs. {selectedProd?.price?.toLocaleString() || 'N/A'}
                </span>
              </div>

              {/* Estimated Delivery Date on Page */}
              <div className="text-right">
                <span className="text-[9px] text-slate-400 block font-semibold uppercase tracking-wider">Estimated Dispatch</span>
                <span className="text-[11px] font-bold text-emerald-400 block font-sans">
                  🚚 Delivery by Monday, May 25!
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap justify-between items-center text-xs text-slate-500 bg-slate-50 rounded-2xl border p-4">
            <div className="flex items-center gap-1.5 font-medium">
              <Info className="w-4 h-4 text-brand-coral" />
              <span>Recommended rear ventilation gap space required: <strong>{productSpecs.recommendedGap}</strong> for optimal compressor heat release.</span>
            </div>
            <button
              onClick={() => onNotify('Measurements aligned perfectly and locked to checkout profile!', 'success')}
              className="text-brand-coral hover:underline font-bold"
            >
              Confirm dimensions space fit
            </button>
          </div>
        </div>

        {/* Right Panel: Calibration Control forms */}
        <div className="lg:col-span-4 space-y-6">
          <motion.div 
            initial={{ opacity: 0, x: 15 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-2xl border border-slate-100 p-6 shadow-xs space-y-6"
          >
            <h3 className="font-display font-bold text-base text-brand-navy-900 border-b border-slate-100 pb-3">
              1. Choose Product to Place
            </h3>

            <div>
              <label className="text-xs font-bold text-slate-500 uppercase block mb-1.5 font-sans">
                Appliance Model
              </label>
              <select
                value={selectedProd?.id}
                onChange={(e) => {
                  const found = activeAppliances.find(p => p.id === e.target.value);
                  if (found) setSelectedProd(found);
                }}
                className="w-full text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-brand-navy-900 focus:outline-none"
              >
                {activeAppliances.map(p => (
                  <option key={p.id} value={p.id}>{p.brand} - {p.name}</option>
                ))}
              </select>
            </div>

            {/* Simulated target room location preset */}
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase block mb-1.5">
                Simulator Target Zone
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'kitchen-corner', label: 'Kitchen Corner' },
                  { id: 'lounge-lobby', label: 'Lobby / Lounge' },
                  { id: 'wall-mount', label: 'Wall Mounting' }
                ].map(col => (
                  <button
                    key={col.id}
                    onClick={() => {
                      setPlacementZone(col.id as any);
                      onNotify(`Calibrated perspective to secondary ${col.label} background!`, 'info');
                    }}
                    className={`px-3 py-2 border rounded-xl text-[10px] font-black uppercase text-center cursor-pointer transition-all ${
                      placementZone === col.id
                        ? 'bg-brand-navy-900 border-brand-navy-900 text-white'
                        : 'bg-slate-50 border-slate-100 text-slate-600 hover:border-slate-250'
                    }`}
                  >
                    {col.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom slider color selector panel finish */}
            {selectedProd?.category !== 'air-conditioner' && (
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase block mb-2 font-sans">
                  Simulator Pearl Colors & Finish
                </label>
                <div className="flex gap-3">
                  {(['steel', 'black', 'gold', 'mint'] as const).map(color => (
                    <button
                      key={color}
                      onClick={() => {
                        setPanelFinish(color);
                        onNotify(`Preset color locked to ${color.toUpperCase()}!`, 'success');
                      }}
                      className={`w-8 h-8 rounded-full border-2 cursor-pointer transition-all ${
                        panelFinish === color ? 'ring-2 ring-brand-coral' : ''
                      } ${finishColors[color]}`}
                      title={`${color.toUpperCase()} Finish`}
                    />
                  ))}
                </div>
                <span className="text-[10px] text-slate-400 block mt-2">
                  *Matte paint finishes represent Pakistan rustproof safety coating layers.
                </span>
              </div>
            )}

            {/* Clearance door swing angle slider */}
            {selectedProd?.category !== 'air-conditioner' && (
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase block">
                    Simulator Door Swing Angle
                  </label>
                  <span className="text-xs font-mono font-black text-brand-navy-900 bg-slate-100 px-2 py-0.5 rounded-md">
                    {doorOpenAngle}°
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="120"
                  step="5"
                  value={doorOpenAngle}
                  onChange={(e) => setDoorOpenAngle(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-brand-mint"
                />
              </div>
            )}

            {/* Clearance Simulator Scale zoom */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase block">
                  3D Placement Size Scale
                </label>
                <span className="text-xs font-mono font-black text-brand-navy-900 bg-slate-100 px-2 py-0.5 rounded-md">
                  {Math.round(simulatorScale * 100)}%
                </span>
              </div>
              <input
                type="range"
                min="0.7"
                max="1.4"
                step="0.05"
                value={simulatorScale}
                onChange={(e) => setSimulatorScale(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-brand-coral"
              />
            </div>

            <div className="border-t border-slate-100 pt-4 space-y-3 font-mono text-[11px] text-slate-500 select-all leading-normal">
              <div className="flex justify-between">
                <span>Height Offset:</span>
                <span className="font-bold text-brand-navy-900">{productSpecs.height}</span>
              </div>
              <div className="flex justify-between">
                <span>Clearance Width:</span>
                <span className="font-bold text-brand-navy-900">{productSpecs.width}</span>
              </div>
              <div className="flex justify-between">
                <span>Depth Depth:</span>
                <span className="font-bold text-brand-navy-900">{productSpecs.depth}</span>
              </div>
              <div className="flex justify-between text-brand-coral font-bold font-sans">
                <span>In Stock units:</span>
                <span>🔥 Only {selectedProd?.stock || 4} units remains in dispatch</span>
              </div>
            </div>

            <button
              onClick={() => {
                onNotify('Adding matched configuration item to shopping cart...', 'success');
                setView('cart');
              }}
              className="w-full bg-slate-900 hover:bg-brand-coral text-white font-bold text-xs uppercase tracking-wider py-3.5 rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-2 mt-2 shadow-md"
            >
              <span>Add Locked Config to Bag</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
