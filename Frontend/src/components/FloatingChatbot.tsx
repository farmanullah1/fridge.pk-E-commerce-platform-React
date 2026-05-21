import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Bot, MessageSquare, X, Send, Sparkles, Phone, Mail, HelpCircle, ArrowRight, CornerDownRight, LifeBuoy, CheckCircle2, RefreshCw
} from 'lucide-react';

interface FloatingChatbotProps {
  onNotify: (msg: string, type: 'success' | 'error' | 'info') => void;
  locationCity?: string;
}

export default function FloatingChatbot({ onNotify, locationCity = 'Karachi' }: FloatingChatbotProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputText, setInputText] = useState('');
  const [activeTab, setActiveTab] = useState<'chat' | 'contact' | 'faqs'>('chat');
  const [isLoading, setIsLoading] = useState(false);

  // Chat message array representation
  const [messages, setMessages] = useState<Array<{ id: string; sender: 'user' | 'assistant'; text: string }>>([
    { id: '1', sender: 'assistant', text: "Aoa! I am the fridge.pk Instant AI Specialist. Need instant guidance on stabilizers, solar-loads, or specific compressor warranties? Ask me anything!" }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, isLoading]);

  // Handle support message submission
  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim()) return;

    const userMsg = { id: `msg-${Date.now()}-user`, sender: 'user' as const, text: textToSend };
    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/ai/consult', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMsg].map(m => ({ sender: m.sender, text: m.text })),
          userProfile: { location: locationCity, familyMembers: 'Standard', roomSize: '150 sq ft' }
        })
      });

      if (!response.ok) {
        throw new Error('Failed to fetch expert system answer.');
      }

      const data = await response.json();
      setMessages(prev => [...prev, { id: `msg-${Date.now()}-assistant`, sender: 'assistant', text: data.text }]);
    } catch (e) {
      // Offline fallback simulation based on keywords
      setTimeout(() => {
        let answer = "Thanks for your prompt! All major PEL, Dawlance, and Haier cooling units sold here feature heavy low-voltage protectors working optimally without stabilizers down to 140V. Is there any specific model you want dimension advice on?";
        const lowText = textToSend.toLowerCase();
        if (lowText.includes('warranty')) {
          answer = "Most inverters carry a official 10-year manufacturer compressor warranty + 1-year internal parts replacement warranty from service centers across Pakistan.";
        } else if (lowText.includes('solar') || lowText.includes('panel') || lowText.includes('ups')) {
          answer = "Yes, due to low startup surge currents, they can easily trigger on 1kVA generator models or 3 high-voltage solar panels through modern hybrid battery inverters.";
        } else if (lowText.includes('delivery') || lowText.includes('days') || lowText.includes('shipping')) {
          answer = "We provide free nationwide express shipping on orders over Rs. 5000! Deliveries to major hubs (Karachi, Lahore, Islamabad) take only 1-2 days.";
        }
        setMessages(prev => [...prev, { id: `msg-${Date.now()}-assistant`, sender: 'assistant', text: answer }]);
      }, 700);
    } finally {
      setIsLoading(false);
    }
  };

  // Contact Form States
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMsg, setContactMsg] = useState('');
  const [submittingContact, setSubmittingContact] = useState(false);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName || !contactEmail || !contactMsg) {
      onNotify('Please complete all contact form entries!', 'error');
      return;
    }
    setSubmittingContact(true);
    setTimeout(() => {
      onNotify(`Thanks ${contactName}! Your direct inquiry has been dispatch to support staff.`, 'success');
      setContactName('');
      setContactEmail('');
      setContactMsg('');
      setSubmittingContact(false);
      setActiveTab('chat');
    }, 1200);
  };

  // FAQ Quick Clicks list helper
  const quickFaqs = [
    { q: "Do inverters need a stabilizer?", a: "No! Built-in surge protectors handle voltages down to 140V safely." },
    { q: "Is delivery truly free across Pakistan?", a: "Yes, free shipping on all orders exceeding Rs. 5,000." },
    { q: "What is the return policy?", a: "Hassle-free 7-day return. We arrange technician home visits for free." }
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50 select-none font-sans" id="floating-chatbot-root">
      
      {/* Floating Circle Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-brand-coral hover:bg-brand-coral-hover text-white rounded-full flex items-center justify-center shadow-2xl cursor-pointer relative"
        aria-label="Toggle Support Chatbot"
        id="toggle-chatbot-btn"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <X className="w-6 h-6" key="close-icon" />
          ) : (
            <div className="relative" key="chat-icon">
              <MessageSquare className="w-6 h-6" />
              {/* Unread message state notification dot */}
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-brand-mint border border-white rounded-full animate-pulse" />
            </div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Floating Chat Dashboard Panel Open */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 50, x: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 50, x: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className="absolute bottom-16 right-0 w-80 sm:w-96 bg-white border border-slate-100 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[500px]"
            id="chatbot-drawer-container"
          >
            {/* Header branding */}
            <div className="bg-gradient-to-r from-brand-navy-950 via-slate-900 to-brand-navy-950 border-b border-white/10 p-4.5 flex flex-col gap-3 text-white">
              <div className="flex justify-between items-center w-full">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-brand-mint/20 border border-brand-mint/30 flex items-center justify-center text-white shrink-0 relative">
                    <span className="absolute inset-0 rounded-xl bg-brand-mint/10 animate-pulse" />
                    <Bot className="w-5 h-5 text-brand-mint relative z-10" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h3 className="text-xs font-black tracking-wide text-white block">fridge.pk AI Desk</h3>
                      <span className="px-1.5 py-0.5 bg-brand-mint/20 text-brand-mint rounded text-[7px] font-mono font-bold tracking-widest uppercase">PRO</span>
                    </div>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      <span className="text-[9px] text-slate-450 font-bold block">Live Support • 24/7 Response</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Pill tabs list selector with active indicators */}
              <div className="grid grid-cols-3 gap-1.5 h-8 bg-slate-950/40 p-1 rounded-lg border border-white/5">
                {[
                  { id: 'chat', label: 'Consult AI' },
                  { id: 'contact', label: 'Contact Us' },
                  { id: 'faqs', label: 'Quick Q&A' }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`rounded-md text-[9px] font-black tracking-wider uppercase transition-all flex items-center justify-center cursor-pointer ${
                      activeTab === tab.id
                        ? 'bg-brand-mint text-brand-navy-950 shadow-md font-extrabold'
                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* TAB: LIVE CHATBOT WORKBENCH */}
            {activeTab === 'chat' && (
              <>
                {/* Chat Log lists */}
                <div className="flex-grow overflow-y-auto p-4 space-y-4 min-h-[260px] max-h-[290px] bg-gradient-to-b from-slate-50 to-white">
                  {messages.map((m) => (
                    <div
                      key={m.id}
                      className={`flex items-start gap-2.5 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      {m.sender === 'assistant' && (
                        <div className="w-6 h-6 rounded-lg bg-brand-navy-900 border border-brand-mint/20 flex items-center justify-center shrink-0 mt-0.5">
                          <Bot className="w-3.5 h-3.5 text-brand-mint" />
                        </div>
                      )}
                      <div
                        className={`p-3 rounded-2xl text-xs max-w-[78%] leading-relaxed shadow-xs transition-colors ${
                          m.sender === 'user'
                            ? 'bg-gradient-to-br from-brand-coral via-brand-coral/95 to-brand-coral-hover text-white font-semibold rounded-tr-none shadow-md shadow-brand-coral/10'
                            : 'bg-white border border-slate-100 text-slate-700 font-bold rounded-tl-none hover:border-slate-200'
                        }`}
                      >
                        {m.text}
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex justify-start items-center gap-2.5">
                      <div className="w-6 h-6 rounded-lg bg-brand-navy-900 flex items-center justify-center shrink-0">
                        <Bot className="w-3.5 h-3.5 text-brand-mint animate-bounce" />
                      </div>
                      <div className="bg-white border rounded-2xl rounded-tl-none p-3 text-xs text-slate-400 font-medium flex items-center gap-1.5 animate-pulse shadow-xs">
                        <RefreshCw className="w-3.5 h-3.5 animate-spin text-brand-coral" />
                        <span>AI Specialist is calculating stabilizer loads...</span>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Suggested Quick Question chips */}
                <div className="px-4 py-2 bg-slate-50/50 border-t flex flex-wrap gap-1.5 h-[50px] overflow-x-auto items-center">
                  <span className="text-[8px] font-bold text-slate-400 uppercase shrink-0 mr-1 tracking-widest font-mono">Presets:</span>
                  {[
                    "Warranty terms?",
                    "Stabilizer needed?",
                    "Solar panel load?"
                  ].map((chip) => (
                    <button
                      key={chip}
                      onClick={() => handleSendMessage(chip)}
                      className="text-[9px] bg-white hover:bg-brand-mint/15 border border-slate-200 hover:border-brand-mint/40 text-slate-650 hover:text-brand-navy-950 font-bold px-2.5 py-1 rounded-full whitespace-nowrap cursor-pointer transition-all"
                    >
                      {chip}
                    </button>
                  ))}
                </div>

                {/* Input Text box bar */}
                <form
                  onSubmit={(e) => { e.preventDefault(); handleSendMessage(inputText); }}
                  className="p-3.5 border-t border-slate-100 bg-white/90 backdrop-blur-sm flex gap-2 items-center"
                >
                  <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Ask about stabilizers, solar panels, shipping..."
                    className="flex-grow bg-slate-50/50 hover:bg-slate-50 text-xs px-3.5 py-2.5 rounded-xl border border-slate-200/80 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-mint/40 focus:border-brand-mint font-semibold text-brand-navy-950 placeholder:text-slate-400 transition-all"
                    id="chatbot-text-input"
                  />
                  <button
                    type="submit"
                    className="p-2.5 bg-brand-navy-900 hover:bg-brand-coral active:scale-95 text-white rounded-xl transition-all cursor-pointer shadow-md shadow-brand-navy-900/10 shrink-0"
                    aria-label="Send Message"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </>
            )}

            {/* TAB: CONTACT LIVE SUPPORT FORM */}
            {activeTab === 'contact' && (
              <form onSubmit={handleContactSubmit} className="p-4 space-y-3 overflow-y-auto bg-slate-50">
                <div className="space-y-1">
                  <h4 className="text-xs font-black text-brand-navy-900 block">Direct Inquiry Form</h4>
                  <p className="text-[10px] text-slate-450 leading-normal block">Send a message directly to fridge.pk headquarters in Clifton, Karachi.</p>
                </div>

                <div>
                  <label className="text-[9px] font-bold text-slate-500 uppercase block mb-1">Your Full Name</label>
                  <input
                    type="text"
                    required
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    placeholder="e.g. Farman Ansari"
                    className="w-full text-xs font-semibold bg-white border rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-brand-coral"
                  />
                </div>

                <div>
                  <label className="text-[9px] font-bold text-slate-500 uppercase block mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    placeholder="e.g. farman@domain.com"
                    className="w-full text-xs font-semibold bg-white border rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-brand-coral"
                  />
                </div>

                <div>
                  <label className="text-[9px] font-bold text-slate-500 uppercase block mb-1">Message Detail</label>
                  <textarea
                    required
                    rows={2}
                    value={contactMsg}
                    onChange={(e) => setContactMsg(e.target.value)}
                    placeholder="Ask about discount codes, physical pickup locations, bulk school/office order rates..."
                    className="w-full text-xs font-semibold bg-white border rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-brand-coral resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submittingContact}
                  className="w-full py-2 bg-brand-coral hover:bg-brand-coral-hover text-white font-bold text-xs uppercase tracking-wider rounded-lg shadow-sm"
                >
                  {submittingContact ? 'Submitting Form...' : 'Send Inquiry Ticket'}
                </button>
              </form>
            )}

            {/* TAB: INSTANT FAQ ACCORDIONS */}
            {activeTab === 'faqs' && (
              <div className="p-4 bg-slate-50 space-y-4 overflow-y-auto max-h-[360px]">
                <div className="space-y-1">
                  <h4 className="text-xs font-black text-brand-navy-900 block animate-pulse">Quick Questions Answers</h4>
                  <p className="text-[10px] text-slate-500 leading-normal block">Tap on a quick question below to read official policy details instantly.</p>
                </div>

                <div className="space-y-2.5">
                  {quickFaqs.map((fq, i) => (
                    <div key={i} className="bg-white p-3 rounded-xl border hover:border-slate-350 transition-colors">
                      <div className="flex gap-1 items-start text-brand-coral font-bold text-xs mb-1">
                        <CornerDownRight className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                        <span>{fq.q}</span>
                      </div>
                      <p className="text-[11px] leading-relaxed text-slate-500 font-medium pl-4">
                        {fq.a}
                      </p>
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
