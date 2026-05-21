import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  HelpCircle, ChevronDown, Sparkles, Search, MessageSquare, ShieldAlert, Zap, Truck, ShieldCheck 
} from 'lucide-react';

interface FaqViewProps {
  onNotify: (msg: string, type: 'success' | 'error' | 'info') => void;
  setView: (view: string) => void;
}

export default function FaqView({ onNotify, setView }: FaqViewProps) {
  const [activeTab, setActiveTab] = useState<'all' | 'inverter' | 'solar' | 'shipping' | 'voltage'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      index: 0,
      tab: 'voltage',
      question: 'Do these inverter refrigerators require an external voltage stabilizer?',
      answer: 'No! All modern PEL, Dawlance, and Haier inverter refrigerators on fridge.pk are built with digital stabilizers. They safely operate on a wide low-voltage dynamic range of 140V to 260V. An external stabilizer is strictly unnecessary and could void the compressor warranty.',
      icon: ShieldCheck
    },
    {
      index: 1,
      tab: 'inverter',
      question: 'What is the practical difference between Direct Cool and No Frost?',
      answer: 'Direct Cool units utilize natural convection channels for fast cooling retention and are ideal for storing frozen food, but they form frost that requires manual defrosting. No Frost models utilize constant silent air circulation streams, preventing any frost build-up, and are perfect for keeping delicate fruits, vegetables, and pre-cooked items fresh.',
      icon: Zap
    },
    {
      index: 2,
      tab: 'solar',
      question: 'How many solar panels are needed to run a 1.5 Ton Inverter AC?',
      answer: 'A high-efficiency 1.5 Ton T3 Inverter AC (such as Gree or Haier models) draws around 1500 Watts at initial startup, but drops to 400W–650W once room temperature is set in ECO mode. For daytime running, a 3kW solar system with about 6 high-powered panels (540W each) is ideal and runs the AC fully off-grid!',
      icon: Sparkles
    },
    {
      index: 3,
      tab: 'shipping',
      question: 'How long does shipment dispatch take within Pakistan?',
      answer: 'We provide express door delivery across Pakistan! For Karachi, Lahore, and Islamabad, delivery takes 1 to 2 business days. For secondary cities (e.g. Peshawar, Multan, Sialkot, Quetta) dispatches arrive in 3 to 4 business days. You can track your shipment live on our GPS order tracking page!',
      icon: Truck
    },
    {
      index: 4,
      tab: 'voltage',
      question: 'Will these appliances work on sudden power backups like UPS or Generator systems?',
      answer: 'Yes! Because digital inverter compressors start at exceedingly low surge currents (around 0.5–1.5 Amperes), they cause no heavy voltage spikes. This allows them to run safely on home generators, hybrid inverter batteries, and standard 1.5kVA modular UPS systems.',
      icon: MessageSquare
    },
    {
      index: 5,
      tab: 'inverter',
      question: 'What does Vitamin Fresh or Active Ozone technology do?',
      answer: 'Dawlance Vitamin Fresh mimics natural sunlight cycles with specialized LED lighting in the grocery box, preserving Vitamin A and C levels in green vegetables for up to 20 days. PEL Active Ozone runs negative-ion ozone scrubbers silently to scrub potential odors and slow food mold.',
      icon: Zap
    }
  ];

  const filteredFaqs = faqs.filter(f => {
    const tabMatch = activeTab === 'all' || f.tab === activeTab;
    const searchMatch = f.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        f.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return tabMatch && searchMatch;
  });

  const handleToggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8" id="faq-page">
      {/* Page Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand-mint/15 rounded-md text-brand-mint text-[9px] font-black uppercase tracking-widest mb-4">
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Customer Consultation Support</span>
        </div>
        <h1 className="text-3xl font-display font-black text-brand-navy-900 tracking-tight">
          Help Center & <span className="text-brand-coral">Appliance FAQ</span>
        </h1>
        <p className="text-xs text-slate-500 mt-2 max-w-xl mx-auto leading-normal">
          Answers to typical questions about compressor durability, solar battery compatibilities, energy units calculation, and shipment tracking in Pakistan.
        </p>
      </div>

      {/* Modern Search & Autocomplete controls */}
      <div className="mb-8 relative max-w-lg mx-auto">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search voltage, solar panels, shipping dispatches..."
          className="w-full text-xs font-semibold bg-white border border-slate-200 rounded-2xl pl-10 pr-4 py-3.5 focus:outline-none focus:ring-1 focus:ring-brand-mint placeholder-slate-400 text-brand-navy-950"
          id="faq-search-bar"
        />
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-brand-coral"
          >
            Clear
          </button>
        )}
      </div>

      {/* Tabs Filter Bar */}
      <div className="flex justify-center flex-wrap gap-2 mb-8">
        {[
          { id: 'all', label: 'All Questions' },
          { id: 'inverter', label: 'Inverter Tech' },
          { id: 'solar', label: 'Solar & UPS' },
          { id: 'voltage', label: 'Stabilizers & Volt' },
          { id: 'shipping', label: 'Delivery Terms' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id as any);
              setOpenIndex(null);
            }}
            className={`px-4 py-2 border rounded-full text-xs font-bold transition-all cursor-pointer ${
              activeTab === tab.id
                ? 'bg-brand-navy-900 border-brand-navy-900 text-white shadow-sm'
                : 'bg-white border-slate-200 text-slate-600 hover:border-slate-350'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Accordion Questions Lists */}
      <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-xs space-y-4">
        {filteredFaqs.length === 0 ? (
          <div className="text-center py-12 space-y-3">
            <HelpCircle className="w-12 h-12 text-slate-200 mx-auto animate-pulse" />
            <h3 className="text-sm font-semibold text-brand-navy-950">No FAQ match your search</h3>
            <p className="text-xs text-slate-500">Try using simpler keywords like "solar", "stabilizer" or "refrigerator".</p>
          </div>
        ) : (
          filteredFaqs.map((faq) => {
            const IconComp = faq.icon;
            const isOpen = openIndex === faq.index;

            return (
              <div 
                key={faq.index}
                className="border-b border-slate-100 last:border-b-0 pb-4 last:pb-0"
              >
                <button
                  onClick={() => handleToggle(faq.index)}
                  className="w-full flex items-center justify-between text-left py-2 hover:text-brand-coral transition-colors cursor-pointer"
                  aria-expanded={isOpen}
                >
                  <div className="flex gap-3 items-center">
                    <div className="w-8 h-8 rounded-lg bg-slate-105 border flex items-center justify-center shrink-0 text-brand-navy-900">
                      <IconComp className="w-4 h-4" />
                    </div>
                    <span className="text-xs sm:text-sm font-bold text-brand-navy-950 block">
                      {faq.question}
                    </span>
                  </div>

                  <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180 text-brand-coral' : ''}`} />
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <div className="pl-11 pr-4 pt-1 pb-3 text-xs leading-relaxed text-slate-500 font-medium">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })
        )}
      </div>

      {/* Instant Contact Form Banner */}
      <div className="mt-10 bg-slate-105 rounded-2xl border p-6 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="text-left">
          <h4 className="text-xs font-black text-brand-navy-950 block">Still have query question specs?</h4>
          <p className="text-[11px] text-slate-500 block leading-normal mt-0.5">Reach out direct to our live refrigeration experts support team via instant live chat bot.</p>
        </div>
        <button
          onClick={() => {
            setView('ai-assistant');
            onNotify('Direct routed to Live Chatbot Consultation channel.', 'success');
          }}
          className="px-5 py-2.5 bg-brand-navy-900 hover:bg-brand-mint hover:text-white text-white text-xs font-mono font-bold rounded-xl uppercase tracking-wider cursor-pointer shadow-sm transition-colors"
        >
          Speak with Refrigeration AI Agent
        </button>
      </div>
    </div>
  );
}
