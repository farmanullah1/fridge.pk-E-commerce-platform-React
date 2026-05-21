import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  SlidersHorizontal, Star, MapPin, CheckCircle, Plus, Minus, ArrowRight, 
  Sparkles, Clock, Wind, Droplets, Box, Layers, ChevronRight, ShoppingBag, Eye,
  Sun, Zap 
} from 'lucide-react';
import { Product, ProductCategory, CartItem } from '../types';

interface HomeViewProps {
  products: Product[];
  onAddToCart: (product: Product, size: CartItem['size']) => void;
  onProductClick: (product: Product) => void;
  setView: (view: any) => void;
  setCategoryAndGo: (cat: string) => void;
  searchVal: string;
  onSearchChange: (val: string) => void;
  locationCity: string;
  onChangeLocation: (city: string) => void;
}

export default function HomeView({
  products,
  onAddToCart,
  onProductClick,
  setView,
  setCategoryAndGo,
  searchVal,
  onSearchChange,
  locationCity,
  onChangeLocation
}: HomeViewProps) {
  // Banners Carousel slider list
  const [activeBanner, setActiveBanner] = useState(0);
  const banners = [
    {
      id: 1,
      title: 'Smart Inverter Refrigerator Series',
      tagline: 'PREMIUM CHILLING • UP TO 55% POWER SAVINGS',
      desc: 'Shop high-performance Dawlance, PEL, and Haier frost-free refrigerators with active nutrition retention and voltage stabilizers.',
      image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=1200',
      cta: 'Explore Double-Door Series',
      cat: 'double-door'
    },
    {
      id: 2,
      title: 'Whisper-Silent ACs & Coolers',
      tagline: 'RAPID COMPRESSOR CHILL IN MINUTES',
      desc: 'Beat the Pakistan summer waves with award-winning Gree and Haier inverter climate solutions. Free safe installation support.',
      image: 'https://images.unsplash.com/photo-1585338107529-13afc5f02586?auto=format&fit=crop&q=80&w=1200',
      cta: 'Browse Air Conditioners',
      cat: 'air-conditioner'
    },
    {
      id: 3,
      title: 'Heavy Duty Deep Freezers',
      tagline: 'PROLONGED 30-HOUR TEMP PRESERVATION',
      desc: 'Keep raw stocks perfectly frozen during power breakdowns. Built with double dense copper coils by Waves and Dawlance.',
      image: 'https://images.unsplash.com/photo-1582738411706-bfc8e691d1c2?auto=format&fit=crop&q=80&w=1200',
      cta: 'Shop Chest Freezers',
      cat: 'deep-freezer'
    }
  ];

  // Auto-cycle slider every 5 seconds
  useEffect(() => {
    const slideTimer = setInterval(() => {
      setActiveBanner(prev => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(slideTimer);
  }, [banners.length]);

  // Flash Sale Timer Countdown (Counts down in real-time)
  const [timeLeft, setTimeLeft] = useState({ hours: 4, minutes: 12, seconds: 45 });
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else {
          return { hours: 4, minutes: 0, seconds: 0 }; // reset
        }
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Filter lists for sections
  const flashSaleProducts = products.filter(p => p.isFlashSale);
  const recommendedProducts = products.filter(p => !p.isFlashSale);

  const formatNumber = (num: number) => num.toString().padStart(2, '0');

  return (
    <div className="space-y-10 pb-16 text-brand-navy-900" id="daraz-marketplace-home">
      
      {/* Top Location Selector and Navigation Ribbons */}
      <div className="bg-slate-100/80 border-b border-slate-200 py-2.5 text-xs select-none">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center flex-wrap gap-2">
          
          {/* Location selector */}
          <div className="flex items-center gap-1.5 text-brand-navy-950 font-bold">
            <MapPin className="w-4 h-4 text-brand-coral shrink-0" />
            <span>Shipping Hub:</span>
            <select
              value={locationCity}
              onChange={(e) => onChangeLocation(e.target.value)}
              className="bg-transparent font-black text-brand-navy-900 focus:outline-none cursor-pointer hover:underline"
            >
              {['Karachi', 'Lahore', 'Islamabad', 'Faisalabad', 'Peshawar', 'Rawalpindi', 'Multan', 'Sialkot'].map(c => (
                <option key={c} value={c} className="text-brand-navy-900 font-sans font-medium">{c}</option>
              ))}
            </select>
          </div>

          {/* Quick Info alerts */}
          <div className="flex items-center gap-4 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
            <span>🚚 Free National Dispatches Over Rs. 5,000</span>
            <span className="hidden sm:inline">❄️ 100% Genuine Cooling Warranties</span>
            <button onClick={() => setView('seller')} className="text-brand-navy-900 font-bold hover:underline">Seller Hub</button>
          </div>
        </div>
      </div>

      {/* FULL-WIDTH BANNER CAROUSEL SLIDER */}
      <div className="relative bg-brand-navy-900 overflow-hidden min-h-[380px] sm:min-h-[440px] flex items-center shadow-lg w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeBanner}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="absolute inset-0"
          >
            {/* Background image overlay */}
            <div className="absolute inset-0 z-0">
              <img 
                src={banners[activeBanner].image} 
                alt={banners[activeBanner].title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover opacity-35"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-brand-navy-950 via-brand-navy-900/90 to-transparent" />
            </div>

            {/* Banner details */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-center relative z-10 py-12 text-left max-w-xl sm:max-w-4xl">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand-mint/20 border border-brand-mint/40 rounded-md text-brand-mint text-[9px] font-black uppercase tracking-widest mb-4">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{banners[activeBanner].tagline}</span>
              </div>

              <h1 className="font-display font-black text-3xl sm:text-5xl text-white tracking-tight leading-tight max-w-2xl mb-4">
                {banners[activeBanner].title}
              </h1>

              <p className="text-slate-300 text-xs sm:text-sm max-w-lg leading-relaxed mb-6 font-medium">
                {banners[activeBanner].desc}
              </p>

              <div>
                <button
                  onClick={() => setCategoryAndGo(banners[activeBanner].cat)}
                  className="px-6 py-3 bg-brand-mint hover:bg-brand-mint-hover text-white rounded-xl text-xs font-bold tracking-widest uppercase transition-all shadow-md select-none cursor-pointer"
                >
                  {banners[activeBanner].cta}
                </button>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Carousel indicators dots */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-25">
          {banners.map((_, i) => (
            <button
               key={i}
               onClick={() => setActiveBanner(i)}
               className={`w-2.5 h-2.5 rounded-full transition-all ${
                 activeBanner === i ? 'bg-brand-mint w-6' : 'bg-white/40 hover:bg-white'
               }`}
               aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>
      </div>

      {/* CATEGORY ICON GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
        <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-5 text-center sm:text-left">
          Shop Cooling Solutions
        </h2>
        
        <div className="grid grid-cols-2 sm:grid-cols-6 gap-4">
          {[
            { id: 'double-door', name: 'Double Door Fridge', icon: Box, bg: 'bg-emerald-50 text-emerald-600 border-emerald-100' },
            { id: 'single-door', name: 'Single Door Fridge', icon: Box, bg: 'bg-blue-50 text-blue-600 border-blue-100' },
            { id: 'side-by-side', name: 'Premium Side-by-Side', icon: Layers, bg: 'bg-indigo-50 text-indigo-600 border-indigo-100' },
            { id: 'deep-freezer', name: 'Deep Freezer', icon: Layers, bg: 'bg-amber-50 text-amber-600 border-amber-100' },
            { id: 'air-conditioner', name: 'Inverter ACs', icon: Wind, bg: 'bg-sky-50 text-sky-600 border-sky-100' },
            { id: 'water-dispenser', name: 'Water Dispensers', icon: Droplets, bg: 'bg-teal-50 text-teal-600 border-teal-100' }
          ].map((cat) => {
            const IconEl = cat.icon;
            return (
              <div
                key={cat.id}
                onClick={() => setCategoryAndGo(cat.id)}
                className="bg-white border border-slate-100 rounded-2xl p-4 text-center cursor-pointer hover:shadow-md hover:border-brand-navy-600 transition-all space-y-2 flex flex-col items-center justify-center select-none animate-fade-in"
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${cat.bg}`}>
                  <IconEl className="w-5 h-5 flex-shrink-0" />
                </div>
                <span className="text-xs font-bold text-slate-700 leading-tight">
                  {cat.name}
                </span>
              </div>
            );
          })}
        </div>
      </section>

      {/* ENERGY ADVISORY COMPATIBILITY BENTO GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Bento Card 1: Solar Matcher */}
          <div className="rounded-3xl bg-gradient-to-br from-brand-navy-950 to-slate-900 border border-white/10 p-6 sm:p-8 text-white relative overflow-hidden flex flex-col justify-between group shadow-xl">
            <div className="absolute top-0 right-0 w-48 h-48 bg-brand-coral/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />
            
            <div className="space-y-3">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-brand-coral/20 text-brand-coral text-[9px] font-bold uppercase tracking-wider">
                <Sun className="w-3 h-3 text-brand-coral animate-spin" style={{ animationDuration: '4s' }} /> Advanced Solar Matcher
              </span>
              <h3 className="font-display font-black text-xl leading-tight uppercase tracking-tight">
                Calculate Solar Panels & Battery standby ratios
              </h3>
              <p className="text-xs text-slate-350 max-w-sm leading-relaxed font-semibold">
                Estimate deep-cell battery backup hours, UPS voltage compatibility, and optimize your startup loads instantly.
              </p>
            </div>

            <div className="pt-6">
              <button
                onClick={() => setView('appliance-matcher')}
                className="px-5 py-2.5 bg-brand-mint hover:bg-white text-brand-navy-950 font-black text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shadow-md shadow-brand-mint/10 group-hover:scale-[1.03]"
              >
                <span>Diagnostic Setup Matcher</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Bento Card 2: Bill Estimator */}
          <div className="rounded-3xl bg-gradient-to-br from-white to-slate-50 border border-slate-100 p-6 sm:p-8 text-brand-navy-950 relative overflow-hidden flex flex-col justify-between group shadow-xl">
            <div className="absolute top-0 right-0 w-48 h-48 bg-brand-mint/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />
            
            <div className="space-y-3">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-emerald-50 border border-emerald-100 text-emerald-600 text-[9px] font-bold uppercase tracking-wider">
                <Zap className="w-3 h-3 text-emerald-500" /> PKR Electricity Bill Gauge
              </span>
              <h3 className="font-display font-black text-xl leading-tight uppercase tracking-tight text-brand-navy-950">
                WAPDA, K-Electric & NEPRA Bill Estimator
              </h3>
              <p className="text-xs text-slate-500 max-w-sm leading-relaxed font-semibold">
                Input your running hours and tariff metrics to calculate direct monthly bills with built-in inverter discount savings.
              </p>
            </div>

            <div className="pt-6">
              <button
                onClick={() => setView('bill-calculator')}
                className="px-5 py-2.5 bg-brand-navy-900 hover:bg-brand-coral text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shadow-md"
              >
                <span>Calculate Electric Tariff</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FLASH SALE SECTION (カウントダウンタイマー + Discount Tag) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-white">
        <div className="bg-gradient-to-r from-brand-navy-900 to-brand-mint rounded-3xl p-5 sm:p-6 text-white shadow-md flex flex-col md:flex-row justify-between items-start md:items-center gap-5">
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="flex items-center gap-2">
              <Clock className="w-6 h-6 animate-pulse text-brand-coral" />
              <h2 className="font-display font-black text-xl tracking-tight uppercase">Flash sale deals</h2>
            </div>
            
            {/* Countdown layout */}
            <div className="flex items-center gap-1.5 font-mono text-sm uppercase">
              <span className="text-[10px] uppercase font-bold tracking-widest pr-1 select-none text-slate-100">Ends In</span>
              <span className="bg-black/45 px-2.5 py-1 rounded-lg font-bold text-brand-coral">{formatNumber(timeLeft.hours)}</span>
              <span>:</span>
              <span className="bg-black/45 px-2.5 py-1 rounded-lg font-bold text-brand-coral">{formatNumber(timeLeft.minutes)}</span>
              <span>:</span>
              <span className="bg-black/45 px-2.5 py-1 rounded-lg font-bold text-brand-coral">{formatNumber(timeLeft.seconds)}</span>
            </div>
          </div>

          <button
            onClick={() => setCategoryAndGo('all')}
            className="bg-white hover:bg-neutral-50 text-brand-navy-950 px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1"
          >
            <span>View All Sale</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Swipe flash sale items grids */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mt-6">
          {flashSaleProducts.map(product => (
            <div
              key={product.id}
              className="group bg-white border border-slate-100 hover:border-brand-navy-800 rounded-2xl overflow-hidden shadow-3xs hover:shadow-md transition-all flex flex-col justify-between h-full cursor-pointer relative hover:-translate-y-1 duration-300"
              onClick={() => onProductClick(product)}
            >
              {/* Discount Tag Overlay */}
              <div className="absolute top-2.5 left-2.5 z-10 bg-brand-coral text-white text-[9px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider shadow-md">
                -{product.discountPercentage || 25}% OFF
              </div>

              {/* Picture item */}
              <div className="relative aspect-[4/5] bg-slate-50 overflow-hidden">
                <img 
                  src={product.image} 
                  alt={product.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>

              {/* Title & flash tags info */}
              <div className="p-4 space-y-2.5">
                <div className="space-y-0.5">
                  <h3 className="text-xs font-bold text-brand-navy-900 group-hover:text-brand-navy-600 line-clamp-1">
                    {product.name}
                  </h3>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wide">{product.brand}</span>
                </div>

                <div className="flex items-baseline gap-1.5 font-sans">
                  <span className="text-sm font-bold text-brand-coral">Rs. {product.price.toLocaleString()}</span>
                  {product.originalPrice && (
                    <span className="text-[11px] text-slate-400 line-through">Rs. {product.originalPrice.toLocaleString()}</span>
                  )}
                </div>

                {/* Simulated Stock Level Progress bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[8px] font-extrabold text-slate-400 uppercase tracking-widest">
                    <span>Sold {product.ordersCount || 10} units</span>
                    <span>{product.stock || 5} active left</span>
                  </div>
                  <div className="w-full bg-slate-100 h-1 rounded-full overflow-hidden">
                    <div className="bg-brand-mint h-full rounded-full" style={{ width: '65%' }} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* RECOMMENDED PRODUCTS SECTION (Standard Daraz-Style Items) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="font-display font-black text-lg sm:text-xl tracking-tight text-brand-navy-950">Recommended For You</h2>
            <p className="text-xs text-slate-500 leading-normal font-semibold">Highly certified inverter refrigerators, AC units, and dispensers</p>
          </div>
          <button
            onClick={() => setCategoryAndGo('all')}
            className="text-xs font-bold text-brand-navy-900 hover:underline flex items-center gap-1"
          >
            <span>Explore All Appliances</span>
            <ArrowRight className="w-3.5 h-3.5 text-brand-mint" />
          </button>
        </div>

        {/* Core Products Recommended layout */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {recommendedProducts.map(product => (
            <div
              key={product.id}
              className="group bg-white border border-slate-100 hover:border-brand-navy-600 rounded-2xl overflow-hidden shadow-3xs hover:shadow-md transition-all flex flex-col justify-between h-full cursor-pointer relative hover:-translate-y-1 duration-300"
              onClick={() => onProductClick(product)}
            >
              {/* Product Badging */}
              <div className="absolute top-2.5 left-2.5 z-10 flex flex-col gap-1">
                {product.isNew && (
                  <span className="bg-brand-navy-900 border border-white/20 text-white text-[9px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider shadow-sm">
                    NEW DEAL
                  </span>
                )}
                {product.discountPercentage && (
                  <span className="bg-brand-coral text-white text-[9px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider">
                    -{product.discountPercentage}% OFF
                  </span>
                )}
              </div>

              {/* Photo Box */}
              <div className="relative aspect-[3/4] bg-slate-50 overflow-hidden">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                  onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1571175487739-4ad331ee0cc1?auto=format&fit=crop&q=80&w=600'; }}
                />
                
                {/* Micro Actions Overlay */}
                <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onAddToCart(product, 'Default');
                    }}
                    className="p-2.5 bg-brand-mint text-white rounded-full hover:bg-brand-mint-hover shadow-md transition-colors scale-100 hover:scale-110 active:scale-95 duration-200"
                    title="Add to shopping cart"
                  >
                    <ShoppingBag className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); onProductClick(product); }}
                    className="p-2.5 bg-white text-brand-navy-900 rounded-full hover:bg-brand-navy-800 hover:text-white shadow-md transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Product summary metadata details */}
              <div className="p-4 space-y-2 flex-grow flex flex-col justify-between">
                <div className="space-y-0.5">
                  <div className="flex justify-between items-center text-[8px] font-black text-slate-400 uppercase tracking-widest">
                    <span>{product.brand}</span>
                    <span className="text-brand-mint">{product.category}</span>
                  </div>
                  <h3 className="text-xs sm:text-[13px] font-bold text-brand-navy-950 line-clamp-2 leading-snug group-hover:text-brand-navy-600 transition-colors">
                    {product.name}
                  </h3>
                </div>

                <div className="space-y-1.5">
                  {/* Rating stars */}
                  <div className="flex items-center gap-1 text-xs">
                    <Star className="w-3.5 h-3.5 fill-current text-amber-400" />
                    <span className="font-bold text-slate-800">{product.rating}</span>
                    <span className="text-[10px] text-slate-400 font-semibold">• {product.reviewsCount} reviews</span>
                  </div>

                  {/* Pricing */}
                  <div className="flex items-baseline gap-1.5 font-sans border-t border-slate-50 pt-1.5">
                    <span className="text-xs sm:text-sm font-bold text-brand-coral">Rs. {product.price.toLocaleString()}</span>
                    {product.originalPrice && (
                      <span className="text-[10px] text-slate-400 line-through">Rs. {product.originalPrice.toLocaleString()}</span>
                    )}
                  </div>
                </div>
              </div>

            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
