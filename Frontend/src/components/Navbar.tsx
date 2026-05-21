import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Menu, X, Search, ShoppingBag, User as UserIcon, LogOut, ArrowRight, BookOpen, Sparkles, Heart, Mic, Moon, Sun, ShieldCheck
} from 'lucide-react';
import { ActiveView, User, CartItem, Product } from '../types';
import { mockProducts } from '../mockData';

interface NavbarProps {
  user: User | null;
  activeView: ActiveView;
  setView: (view: ActiveView) => void;
  cart: CartItem[];
  cartCount: number;
  openCart: () => void;
  onLogout: () => void;
  onSearchChange: (val: string) => void;
  searchVal: string;
  wishlistCount?: number;
  compareCount?: number;
  products?: Product[];
  onProductSelect?: (p: Product) => void;
  isDark?: boolean;
  setIsDark?: (isDark: boolean) => void;
}

export default function Navbar({
  user,
  activeView,
  setView,
  cart,
  cartCount,
  openCart,
  onLogout,
  onSearchChange,
  searchVal,
  wishlistCount = 0,
  compareCount = 0,
  products = mockProducts,
  onProductSelect,
  isDark = false,
  setIsDark
}: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [isVoiceOpen, setIsVoiceOpen] = useState(false);
  const [voiceText, setVoiceText] = useState('Listening to your speech...');
  const [showAutocomplete, setShowAutocomplete] = useState(false);
  const [currentPromoIndex, setCurrentPromoIndex] = useState(0);

  const promoMessages = [
    { text: "Free Shipping Across Pakistan on Orders Over Rs. 5,000! • 10-Year Compressor Warranties", isLink: false, view: null },
    { text: "Designed & Engineered by Farmanullah Ansari • View Full Stack Portfolio Profile Details", isLink: true, view: 'developer-profile' }
  ];

  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPromoIndex((prev) => (prev + 1) % promoMessages.length);
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  const matchedSuggestions = useMemo(() => {
    if (!searchVal.trim()) return [];
    const q = searchVal.trim().toLowerCase();
    return products.filter(p => 
      p.name.toLowerCase().includes(q) || 
      (p.brand && p.brand.toLowerCase().includes(q)) ||
      p.category.toLowerCase().includes(q)
    ).slice(0, 5); // Limit output to top 5 hits
  }, [searchVal, products]);

  const handleNavClick = (view: ActiveView) => {
    setView(view);
    setMobileMenuOpen(false);
    setShowAutocomplete(false);
  };

  const startVoiceSearchSimulation = () => {
    setIsVoiceOpen(true);
    setVoiceText('Listening for appliance specs (e.g., PEL, Dawlance)...');

    // Web Speech API check
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-US';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setVoiceText('Microphone active. Speak appliance model now...');
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error', event.error);
        setVoiceText('Web mic error. Select one of the presets below to simulate:');
      };

      recognition.onresult = (event: any) => {
        const resultText = event.results[0][0].transcript;
        onSearchChange(resultText);
        setVoiceText(`Heard clearly: "${resultText}"`);
        setTimeout(() => {
          setIsVoiceOpen(false);
          setView('products');
        }, 1500);
      };

      recognition.start();
    } else {
      // Fallback fallback simulated speaking options
      setTimeout(() => {
        setVoiceText('Synthesizing audio... Choose a suggested option below:');
      }, 1000);
    }
  };

  return (
    <nav className={`sticky top-0 z-40 w-full border-b transition-colors ${isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-100 text-brand-navy-900'}`} id="main-navbar">
      {/* Promo Bar */}
      <div 
        className="w-full bg-brand-navy-900 text-white py-1.5 px-4 text-center text-[10px] sm:text-[11px] font-mono tracking-wider uppercase flex justify-center items-center gap-2 overflow-hidden h-9 select-none"
        style={{ contentVisibility: 'auto' }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPromoIndex}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="flex items-center justify-center gap-2"
          >
            <Sparkles className="w-3.5 h-3.5 text-brand-coral shrink-0 pulse-glow animate-pulse" />
            {promoMessages[currentPromoIndex].isLink ? (
              <button 
                onClick={() => handleNavClick('developer-profile')}
                className="hover:text-brand-mint text-white font-bold flex items-center gap-1 cursor-pointer transition-colors"
              >
                <span>{promoMessages[currentPromoIndex].text}</span>
                <ArrowRight className="w-3 h-3 text-brand-mint" />
              </button>
            ) : (
              <span className="font-medium text-slate-200">{promoMessages[currentPromoIndex].text}</span>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Brand Logo with 3D Perspective Hover rotation */}
          <div className="flex items-center gap-6">
            <button
              onClick={() => handleNavClick('home')}
              className="flex items-center gap-2 group cursor-pointer text-left focus:outline-none"
              id="brand-logo-btn"
              style={{ perspective: '1000px' }}
            >
              <div 
                className="w-9 h-9 rounded-lg bg-brand-navy-900 flex items-center justify-center text-white font-sans font-black text-xl relative overflow-hidden transition-all duration-500 group-hover:bg-brand-mint"
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
                <span className={`font-display text-xl font-black leading-none tracking-tight transition-colors duration-300 group-hover:text-brand-mint ${isDark ? 'text-white' : 'text-brand-navy-900'}`}>
                  fridge<span className="text-brand-coral">.pk</span>
                </span>
                <span className="text-[8px] font-mono tracking-widest font-bold uppercase text-slate-400 mt-0.5">
                  Verified Energy Hub
                </span>
              </div>
            </button>

            {/* Desktop Navigation Link Targets (Pruned and packed elegantly) */}
            <div className="hidden xl:flex items-center gap-5">
              {[
                { id: 'home', label: 'Deals' },
                { id: 'products', label: 'Catalog' },
                { id: 'ar-visualizer', label: '3D AR' },
                { id: 'appliance-matcher', label: 'Solar Advisor' },
                { id: 'faq', label: 'FAQs' },
                { id: 'returns-policy', label: 'Returns' },
                { id: 'track-order', label: 'Track' },
                { id: 'seller', label: 'Merchant' },
                { id: 'ai-assistant', label: 'AI Advisor' },
                { id: 'bill-calculator', label: 'Bill Estimator' },
                { id: 'developer-profile', label: 'Developer' }
              ].map(link => (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.id as any)}
                  className={`text-xs font-bold transition-colors hover:text-brand-mint cursor-pointer py-1 ${
                    activeView === link.id ? 'text-brand-mint border-b-2 border-brand-mint' : 'text-slate-500'
                  }`}
                >
                  {link.label}
                </button>
              ))}
            </div>

            {/* Secondary fallback row for smaller laptops */}
            <div className="hidden lg:flex xl:hidden items-center gap-3">
              {[
                { id: 'home', label: 'Deals' },
                { id: 'products', label: 'Catalog' },
                { id: 'ar-visualizer', label: '3D AR' },
                { id: 'appliance-matcher', label: 'Solar Advisor' },
                { id: 'faq', label: 'FAQs' },
                { id: 'ai-assistant', label: 'AI Advisor' },
                { id: 'developer-profile', label: 'Developer' }
              ].map(link => (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.id as any)}
                  className={`text-xs font-bold transition-all hover:text-brand-mint cursor-pointer py-1 ${
                    activeView === link.id ? 'text-brand-mint border-b border-brand-mint font-black' : 'text-slate-500'
                  }`}
                >
                  {link.label}
                </button>
              ))}
            </div>

          </div>

          {/* Nav Controls & User Options */}
          <div className="flex items-center gap-3">
            
            {/* Search Box with Autocomplete suggestions and Voice Search */}
            <div className="hidden md:flex items-center relative w-64" id="nav-search-container">
              <input
                type="text"
                value={searchVal}
                onFocus={() => setShowAutocomplete(true)}
                onChange={(e) => {
                  onSearchChange(e.target.value);
                  setShowAutocomplete(true);
                }}
                placeholder="Search specs, Haier, Dawlance..."
                className={`w-full text-xs font-semibold rounded-full pl-8 pr-16 py-2 focus:outline-none focus:ring-1 focus:ring-brand-mint focus:border-brand-mint ${
                  isDark 
                    ? 'bg-slate-800 text-white border-slate-700 placeholder-slate-500' 
                    : 'bg-slate-50 text-brand-navy-900 border-slate-200 placeholder-slate-400'
                }`}
                id="search-input"
              />
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
              
              <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
                {searchVal && (
                  <button
                    onClick={() => {
                      onSearchChange('');
                      setShowAutocomplete(false);
                    }}
                    className="text-slate-400 hover:text-brand-coral text-[10px] uppercase font-bold"
                  >
                    Clear
                  </button>
                )}
                
                <button
                  onClick={startVoiceSearchSimulation}
                  className="p-1 rounded-full text-slate-400 hover:text-brand-coral hover:bg-slate-100 transition-colors"
                  title="Voice Speech Search"
                  type="button"
                >
                  <Mic className="w-3.5 h-3.5 animate-pulse" />
                </button>
              </div>

              {/* Autocomplete Suggestions Box dropdown */}
              <AnimatePresence>
                {showAutocomplete && matchedSuggestions.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className={`absolute top-full left-0 right-0 mt-2 rounded-2xl border p-2 shadow-2xl z-50 overflow-hidden text-left max-h-80 overflow-y-auto ${
                      isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'
                    }`}
                  >
                    <div className="p-1.5 text-[9px] text-slate-400 uppercase font-bold border-b border-white/5 tracking-wider">
                      Matches Autocomplete Product Suggestions
                    </div>
                    <div className="space-y-1 mt-1">
                      {matchedSuggestions.map(p => (
                        <button
                          key={p.id}
                          onClick={() => {
                            if (onProductSelect) {
                              onProductSelect(p);
                            }
                            setShowAutocomplete(false);
                          }}
                          className={`w-full flex items-center gap-2.5 p-2 rounded-xl text-left transition-colors ${
                            isDark ? 'hover:bg-slate-700' : 'hover:bg-slate-50'
                          }`}
                        >
                          <img
                            src={p.image}
                            alt=""
                            referrerPolicy="no-referrer"
                            className="w-8 h-8 rounded-md object-cover bg-slate-100"
                            onError={(e) => {
                              e.currentTarget.src = 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=150';
                            }}
                          />
                          <div className="flex-grow min-w-0">
                            <span className="block text-[11px] font-bold truncate text-brand-navy-950 dark:text-white leading-normal">
                              {p.name}
                            </span>
                            <span className="block text-[9px] text-slate-400 font-mono">
                              {p.brand} • Rs. {p.price.toLocaleString()}
                            </span>
                          </div>
                          <ArrowRight className="w-3 h-3 text-brand-coral shrink-0" />
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Mobile search toggle */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="md:hidden p-1.5 rounded-lg text-slate-500 hover:text-brand-coral hover:bg-slate-50"
              id="mobile-search-toggle"
              aria-label="Toggle Search"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Dynamic Sun/Moon Theme Custom Toggler */}
            {setIsDark && (
              <button
                onClick={() => setIsDark(!isDark)}
                className={`p-2 rounded-lg cursor-pointer hover:bg-slate-55 transition-colors ${isDark ? 'text-amber-400 hover:bg-slate-800' : 'text-slate-600 hover:bg-slate-50'}`}
                id="theme-toggler-btn"
                title={isDark ? 'Activate Standard Light Mode' : 'Activate Eye-Care Dark Mode'}
                aria-label="Theme Mode Switcher"
              >
                {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
            )}

            {/* Wishlist Button */}
            <button
              onClick={() => handleNavClick('wishlist')}
              className={`p-2 relative rounded-lg hover:text-brand-coral hover:bg-slate-50 cursor-pointer ${
                activeView === 'wishlist' ? 'text-brand-coral bg-slate-50' : 'text-slate-600'
              }`}
              id="wishlist-toggle-btn"
              aria-label="Open Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute top-1.5 right-1.5 bg-brand-coral text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Compare Button */}
            <button
              onClick={() => handleNavClick('compare')}
              className={`p-2 relative rounded-lg hover:text-brand-coral hover:bg-slate-50 cursor-pointer ${
                activeView === 'compare' ? 'text-brand-coral bg-slate-50' : 'text-slate-600'
              }`}
              id="compare-toggle-btn"
              aria-label="Open Compare"
            >
              <Sparkles className="w-5 h-5" />
              {compareCount > 0 && (
                <span className="absolute top-1.5 right-1.5 bg-brand-navy-900 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {compareCount}
                </span>
              )}
            </button>

            {/* Shopping Bag Button */}
            <button
              onClick={openCart}
              className="p-2 relative rounded-lg text-slate-600 hover:text-brand-coral hover:bg-slate-50 cursor-pointer"
              id="cart-toggle-btn"
              aria-label="Open Shopping Bag"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute top-1.5 right-1.5 bg-brand-coral text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Dynamic User Interface Actions */}
            {user ? (
              <div className="hidden sm:flex items-center gap-2">
                <button
                  onClick={() => handleNavClick('dashboard')}
                  className="flex items-center gap-1.5 px-3 py-1 bg-slate-100 rounded-full border text-brand-navy-800 text-[11px] font-bold hover:border-brand-coral cursor-pointer"
                  id="dashboard-user-btn"
                >
                  <div className="w-5 h-5 rounded-full bg-brand-navy-900 text-white font-bold text-[10px] flex items-center justify-center shrink-0">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="max-w-[80px] truncate">{user.name}</span>
                </button>

                <button
                  onClick={onLogout}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-slate-100 cursor-pointer"
                  title="Logout"
                  id="logout-btn"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-1">
                <button
                  onClick={() => handleNavClick('login')}
                  className={`px-3 py-1.5 text-xs font-bold hover:text-brand-coral cursor-pointer ${isDark ? 'text-slate-300' : 'text-slate-700'}`}
                  id="navbar-login-btn"
                >
                  Sign In
                </button>
                <button
                  onClick={() => handleNavClick('signup')}
                  className="px-4 py-1.5 text-sm font-medium bg-brand-navy-900 hover:bg-brand-coral text-white rounded-full shadow-xs cursor-pointer transition-colors duration-200"
                  id="navbar-signup-btn"
                >
                  Sign Up
                </button>
              </div>
            )}

            {/* Hamburger Menu (Mobile Screens) */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-1.5 rounded-lg text-slate-600 hover:text-brand-coral hover:bg-slate-50 cursor-pointer"
              id="mobile-menu-hamburger"
              aria-label="Toggle Mobile Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Expandable Mobile Search */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className={`md:hidden px-4 py-3 border-b ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'}`}
            id="mobile-search-bar"
          >
            <div className="relative">
              <input
                type="text"
                value={searchVal}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search ACs, chest freezers, PEL..."
                className={`w-full text-xs rounded-lg pl-9 pr-14 py-2 focus:outline-none focus:ring-1 focus:ring-brand-coral ${
                  isDark ? 'bg-slate-900 border border-slate-700 text-white' : 'bg-white border border-slate-300 text-brand-navy-900'
                }`}
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <button
                onClick={startVoiceSearchSimulation}
                className="absolute right-9 top-1/2 -translate-y-1/2 text-brand-coral"
                type="button"
              >
                <Mic className="w-3.5 h-3.5" />
              </button>
              {searchVal && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-brand-coral text-xs"
                >
                  Clear
                </button>
              )}
            </div>
            {/* Quick-links for mobile */}
            <div className="flex gap-2 flex-wrap mt-2">
              <span className="text-[10px] font-semibold text-slate-400 uppercase mt-1">Pop:</span>
              {['AC', 'Haier', 'PEL', 'Inverter', 'Solar'].map((term) => (
                <button
                  key={term}
                  onClick={() => { onSearchChange(term.toLowerCase()); setSearchOpen(false); setView('products'); }}
                  className={`text-[10px] rounded-full px-2.5 py-0.5 font-bold transition-colors ${
                    isDark ? 'bg-slate-700 text-slate-300 hover:bg-slate-65' : 'bg-white border text-slate-600 hover:text-brand-coral'
                  }`}
                >
                  {term}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Drawer menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className={`lg:hidden px-4 py-4 space-y-3 border-b ${
              isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-800'
            }`}
            id="mobile-drawer-menu"
          >
            <div className="flex flex-col gap-1">
              {[
                { id: 'home', label: 'Home Deals' },
                { id: 'products', label: 'Appliance Catalog' },
                { id: 'ar-visualizer', label: '3D AR placement planner' },
                { id: 'appliance-matcher', label: 'Interactive Solar Matcher' },
                { id: 'faq', label: 'Help & FAQs' },
                { id: 'returns-policy', label: 'Returns and Replacement Policy' },
                { id: 'track-order', label: 'Track Shipment' },
                { id: 'seller', label: 'Merchant Console' },
                { id: 'ai-assistant', label: 'AI Advisor Specialist' },
                { id: 'bill-calculator', label: 'Voltage & Bill Estimator' },
                { id: 'developer-profile', label: 'Developer Professional Credentials' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => handleNavClick(tab.id as any)}
                  className={`text-left py-2 px-3 rounded-xl font-bold text-xs transition-colors ${
                    activeView === tab.id ? 'bg-brand-mint text-brand-navy-950 font-black' : 'hover:bg-slate-100 text-slate-500'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <hr className="border-slate-100/10" />

            {/* Mobile User Panel state */}
            {user ? (
              <div className="p-3 bg-slate-100 dark:bg-slate-700 rounded-xl space-y-3 text-brand-navy-950">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-brand-navy-900 text-white font-bold flex items-center justify-center">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-brand-navy-900 dark:text-white block">{user.name}</p>
                    <p className="text-xs text-slate-550 block">{user.email}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleNavClick('dashboard')}
                    className="w-full text-center py-2 bg-white dark:bg-slate-800 text-slate-700 dark:text-white font-bold text-xs rounded-lg border hover:border-brand-coral"
                  >
                    My Account
                  </button>
                  <button
                    onClick={() => { onLogout(); setMobileMenuOpen(false); }}
                    className="w-full text-center py-2 bg-slate-100 text-rose-600 font-bold text-xs rounded-lg hover:bg-rose-50"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 pb-2">
                <button
                  onClick={() => handleNavClick('login')}
                  className="w-full py-2.5 text-center text-xs font-black text-slate-700 border border-slate-200 rounded-xl hover:bg-slate-50 cursor-pointer"
                >
                  Sign In
                </button>
                <button
                  onClick={() => handleNavClick('signup')}
                  className="w-full py-2.5 text-center text-xs font-black bg-brand-navy-900 hover:bg-brand-coral text-white rounded-xl cursor-pointer"
                >
                  Sign Up
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Voice Recognition Simulator Overlay Modal */}
      <AnimatePresence>
        {isVoiceOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className={`rounded-3xl max-w-sm w-full p-6 text-center space-y-6 shadow-2xl border ${
                isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-100 text-slate-800'
              }`}
            >
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <span className="text-[10px] font-black uppercase text-brand-coral tracking-widest block font-mono">Voice Recognition Active</span>
                <button onClick={() => setIsVoiceOpen(false)} className="p-1 rounded-full text-slate-400 hover:text-slate-600">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-4 py-3">
                {/* Glowing mic visual loops */}
                <div className="relative w-16 h-16 rounded-full bg-brand-coral/10 mx-auto flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full border border-brand-coral/30 animate-ping" />
                  <Mic className="w-8 h-8 text-brand-coral animate-pulse" />
                </div>
                
                <p className="text-xs font-bold text-slate-750 leading-normal block px-2">
                  {voiceText}
                </p>
              </div>

              {/* Suggestions quick chips */}
              <div className="space-y-1.5 text-left border-t border-slate-100 pt-4">
                <span className="text-[8px] font-mono font-bold uppercase text-slate-400 block tracking-widest pl-1 mb-1">Click a preset to speak:</span>
                {[
                  "PEL Inverter Refrigerator",
                  "Gree 1.5Ton split AC",
                  "Waves Frost-free freezer"
                ].map(txt => (
                  <button
                    key={txt}
                    onClick={() => {
                      onSearchChange(txt);
                      setVoiceText(`Successfully detected: "${txt}"`);
                      setTimeout(() => {
                        setIsVoiceOpen(false);
                        setView('products');
                      }, 1000);
                    }}
                    className="w-full text-xs font-bold bg-slate-50 hover:bg-brand-mint/15 border border-slate-200 text-slate-600 hover:text-brand-navy-950 p-2 rounded-xl text-left transition-colors flex items-center gap-1.5"
                  >
                    <Mic className="w-3 h-3 text-brand-coral shrink-0" />
                    <span>"{txt}"</span>
                  </button>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </nav>
  );
}
