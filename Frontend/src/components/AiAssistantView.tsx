import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Bot, Send, Sparkles, MapPin, Users, HelpCircle, 
  Trash2, ArrowRight, RefreshCcw, Layout, MessageSquare, CheckCircle, Zap
} from 'lucide-react';

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: Date;
}

interface AiAssistantProps {
  onNotify: (msg: string, type: 'success' | 'error' | 'info') => void;
  setView: (view: string) => void;
  locationCity: string;
}

export default function AiAssistantView({ onNotify, setView, locationCity }: AiAssistantProps) {
  // User profile states for cooling calculations
  const [familyMembers, setFamilyMembers] = useState('3-4 members');
  const [roomSize, setRoomSize] = useState('Standard Master Bed (approx 150 sq ft)');
  const [city, setCity] = useState(locationCity || 'Karachi');

  // Chat conversation vector
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'init-msg',
      sender: 'assistant',
      text: `### **Assalamu Alaikum! Welcome to the fridge.pk AI Consultation Specialist!** ❄️\n\nI am here to help you navigate through Pakistan's high-efficiency inverter appliance landscape.\n\nTo give you the most accurate technical calculation, please configure your **Family Size & Room Dimensions** in the panel beside our chat.\n\n*How can I assist you with your cooling needs today?*`,
      timestamp: new Date()
    }
  ]);
  
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Handle message dispatch
  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim()) return;

    const newUserMsg: Message = {
      id: `msg-${Date.now()}-user`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newUserMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      // Package query profile
      const payload = {
        messages: [...messages, newUserMsg].map(m => ({
          sender: m.sender,
          text: m.text
        })),
        userProfile: {
          familyMembers,
          roomSize,
          location: city
        }
      };

      const response = await fetch('/api/ai/consult', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error('Failed to fetch expert system answer.');
      }

      const data = await response.json();
      
      setMessages(prev => [...prev, {
        id: `msg-${Date.now()}-assistant`,
        sender: 'assistant',
        text: data.text,
        timestamp: new Date()
      }]);
    } catch (e: any) {
      console.error(e);
      onNotify('Temporary delay connecting to AI system. Loaded localized technical advice.', 'info');
      // Graceful local reply simulation
      setTimeout(() => {
        setMessages(prev => [...prev, {
          id: `msg-${Date.now()}-assistant`,
          sender: 'assistant',
          text: `#### **Localized Technical Consultation Report** ❄️\n\nThanks for your inquiry. Based on your settings (**${city}**, **${familyMembers}**):\n\n*   **Refrigerator choice**: An inverter Double Door model between **280L to 350L** (such asPEL Inverter or Dawlance Reflex) is ideal. Features thick foaming insulation to retain cold temperature locks for up to **10 hours** during local load shedding.\n*   **Stabilizer-free operation**: These models automatically adjust to voltages spanning **140V to 265V**, protecting your compressor against grid drops.\n\n*Feel free to ask about solar electricity loads or specific refrigerator model reviews!*`,
          timestamp: new Date()
        }]);
      }, 700);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage(`Please recalculate advice for my setup: family size is ${familyMembers}, room dimension is ${roomSize}, location city is ${city}.`);
    onNotify('AI profile recalculated! Generating optimal recommendations...', 'success');
  };

  const clearChat = () => {
    setMessages([
      {
        id: 'init-msg',
        sender: 'assistant',
        text: `### **AI Consultation Reset Completed!** ❄️\n\nPlease select one of the suggested prompts below or ask a specific question regarding refrigerator capacities, low-voltage start-ups, or inverter AC technologies.`,
        timestamp: new Date()
      }
    ]);
    onNotify('Chat session cleared.', 'info');
  };

  const promptSuggestions = [
    { text: "Which refrigerator uses the least power on solar?", label: "Solar-Friendly" },
    { text: "Help me choose an inverter AC for standard master bed", label: "AC Tonnage" },
    { text: "What are safe working voltages for PEL & Dawlance fridges?", label: "Voltage Guide" }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" id="ai-assistant-page">
      {/* Page Header */}
      <div className="mb-8 flex md:flex-row flex-col justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5 text-brand-mint font-bold uppercase tracking-widest text-xs">
            <Sparkles className="w-4 h-4 animate-pulse shrink-0" />
            <span>Smart Appliance Hub</span>
          </div>
          <h1 className="text-3xl font-display font-black text-brand-navy-900 tracking-tight">
            AI Cooling <span className="text-brand-coral">Consultation Assistant</span>
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Get personalized advice about refrigerator capacity (Liters), inverter AC tonnage, and electricity billing savings.
          </p>
        </div>

        <button
          onClick={() => setView('bill-calculator')}
          className="px-5 py-2.5 bg-brand-coral hover:bg-brand-coral-hover text-white text-xs font-bold uppercase tracking-widest rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer shrink-0"
        >
          <Zap className="w-4 h-4" />
          <span>Electricity Bill Calculator</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Side: Parameters Calibration */}
        <div className="lg:col-span-4 space-y-6">
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl border border-slate-100 p-6 shadow-xs"
          >
            <div className="border-b border-slate-100 pb-4 mb-4 flex items-center gap-2">
              <Layout className="w-5 h-5 text-brand-navy-900" />
              <h3 className="font-display font-bold text-base text-brand-navy-900">Configure Your Profile</h3>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              {/* Location Profile */}
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase block mb-1.5">Your City / Region</label>
                <div className="relative">
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-brand-navy-900 focus:outline-none focus:ring-1 focus:ring-brand-mint"
                  >
                    {['Karachi', 'Lahore', 'Islamabad', 'Rawalpindi', 'Peshawar', 'Multan', 'Faisalabad', 'Sialkot', 'Quetta'].map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                  <MapPin className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                </div>
              </div>

              {/* Family Size Profile */}
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase block mb-1.5 font-sans">Family size (Members)</label>
                <div className="relative">
                  <select
                    value={familyMembers}
                    onChange={(e) => setFamilyMembers(e.target.value)}
                    className="w-full text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-brand-navy-900 focus:outline-none focus:ring-1 focus:ring-brand-mint"
                  >
                    <option value="1-2 members">Compact (1-2 persons)</option>
                    <option value="3-4 members">Medium (3-4 persons)</option>
                    <option value="5-7 members">Large (5-7 persons)</option>
                    <option value="8+ members">Joint Family (8+ persons)</option>
                  </select>
                  <Users className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                </div>
              </div>

              {/* Room Size Dimensions */}
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase block mb-1.5">AC target room size</label>
                <div className="relative">
                  <select
                    value={roomSize}
                    onChange={(e) => setRoomSize(e.target.value)}
                    className="w-full text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-brand-navy-900 focus:outline-none focus:ring-1 focus:ring-brand-mint"
                  >
                    <option value="Small study cabin (under 100 sq ft)">Small study cabin (under 100 sq ft)</option>
                    <option value="Standard Master Bed (approx 150 sq ft)">Standard Master Bed (approx 150 sq ft)</option>
                    <option value="Spacious Lounge / Hallway (220 - 300 sq ft)">Spacious Lounge / Hallway (220 - 300 sq ft)</option>
                    <option value="Massive Commercial Shop (over 300 sq ft)">Massive Commercial shop (over 300 sq ft)</option>
                  </select>
                  <HelpCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-brand-navy-900 hover:bg-brand-mint hover:text-white text-white font-bold text-xs uppercase tracking-wider py-3 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 mt-2"
              >
                <RefreshCcw className="w-3.5 h-3.5" />
                <span>Sync Profile to AI</span>
              </button>
            </form>
          </motion.div>

          {/* Quick Info Box */}
          <div className="bg-slate-900 text-slate-300 rounded-2xl p-6 border border-white/5 space-y-4 shadow-sm">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Zap className="text-brand-mint w-4 h-4 animate-pulse shrink-0" />
              <span>Inverter Technology</span>
            </h4>
            <p className="text-xs leading-relaxed text-slate-400">
              Modern Double-Door refrigerators on fridge.pk start silently at as low as **25 Amperes** surge spikes and consume less than **100 Watts** of power. That’s why they’re fully compatible with mini solar batteries and home UPS boxes!
            </p>
            <div className="grid grid-cols-2 gap-3 pt-2 text-center">
              <div className="bg-slate-800/50 p-2.5 rounded-lg border border-white/5">
                <span className="text-xs text-slate-400 block font-medium">Auto Volt protect</span>
                <span className="text-xs font-bold text-brand-mint block mt-0.5">140V - 260V</span>
              </div>
              <div className="bg-slate-800/50 p-2.5 rounded-lg border border-white/5">
                <span className="text-xs text-slate-400 block font-medium">Ice Locking time</span>
                <span className="text-xs font-bold text-brand-coral block mt-0.5">Up to 12 Hrs</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Consultation Interface */}
        <div className="lg:col-span-8 flex flex-col h-[600px] bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden">
          {/* Chat Header */}
          <div className="bg-slate-50 border-b border-secondary-50/50 p-4 shrink-0 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-brand-navy-900 text-white flex items-center justify-center border shadow-xs relative">
                <Bot className="w-5 h-5 text-brand-mint animate-bounce" />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-brand-mint border-2 border-white rounded-full" />
              </div>
              <div>
                <h3 className="font-display font-bold text-sm text-brand-navy-950 flex items-center gap-1.5">
                  <span>fridge.pk AI Technician</span>
                </h3>
                <span className="text-[10px] bg-brand-mint/10 text-brand-mint font-bold uppercase tracking-wider px-2 py-0.5 rounded-md mt-0.5 inline-block">
                  Expert System Live
                </span>
              </div>
            </div>

            <button
              onClick={clearChat}
              className="p-2 text-slate-400 hover:text-rose-500 hover:bg-slate-100 rounded-lg cursor-pointer transition-colors"
              title="Clear entire conversation"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-grow overflow-y-auto p-6 space-y-4 bg-slate-50/50">
            {messages.map(m => (
              <div
                key={m.id}
                className={`flex gap-3 max-w-[85%] ${m.sender === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
              >
                {/* Avatar Icon */}
                <div 
                  className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 border ${
                    m.sender === 'user' 
                      ? 'bg-brand-coral text-white border-brand-coral/25' 
                      : 'bg-brand-navy-900 text-white border-brand-navy-950'
                  }`}
                >
                  {m.sender === 'user' ? 'U' : 'AI'}
                </div>

                {/* Msg text body */}
                <div 
                  className={`p-4 rounded-2xl text-xs leading-relaxed space-y-2 border ${
                    m.sender === 'user'
                      ? 'bg-brand-navy-900 text-white border-brand-navy-950 rounded-tr-none'
                      : 'bg-white text-slate-700 border-slate-100 rounded-tl-none pr-8'
                  }`}
                >
                  <p className="whitespace-pre-line select-text font-medium text-slate-100">
                    {/* Simplified formatting for markdown-style headlines inside chatbot */}
                    {m.text.split('\n').map((line, i) => {
                      if (line.startsWith('###')) {
                        return <span key={i} className={`block text-sm font-bold mt-2 mb-1 uppercase tracking-wide ${m.sender === 'user' ? 'text-brand-coral' : 'text-brand-navy-900'}`}>{line.replace(/###/g, '')}</span>;
                      }
                      if (line.startsWith('*')) {
                        return <span key={i} className="block pl-2 mt-1">✨ {line.replace(/\*/g, '')}</span>;
                      }
                      return <span key={i} className="block mt-1">{line.replace(/\*\*/g, '')}</span>;
                    })}
                  </p>
                  <span className={`block text-[8px] text-right mt-1.5 font-bold uppercase select-none ${m.sender === 'user' ? 'text-slate-400' : 'text-slate-400'}`}>
                    {m.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-3 max-w-[85%]">
                <div className="w-7 h-7 rounded-lg bg-brand-navy-900 text-white flex items-center justify-center shrink-0 border border-brand-navy-950">
                  AI
                </div>
                <div className="p-4 bg-white border border-slate-100 rounded-2xl rounded-tl-none flex items-center gap-2">
                  <div className="flex gap-1">
                    <div className="w-1.5 h-1.5 bg-brand-mint rounded-full animate-bounce delay-100" />
                    <div className="w-1.5 h-1.5 bg-brand-mint rounded-full animate-bounce delay-200" />
                    <div className="w-1.5 h-1.5 bg-brand-mint rounded-full animate-bounce delay-300" />
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Consulting Specs...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Prompt Suggestions footer */}
          <div className="bg-slate-50 p-3 border-t border-slate-100 shrink-0 flex items-center gap-2 overflow-x-auto select-none scrollbar-none">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide shrink-0">Try Asking:</span>
            {promptSuggestions.map((item, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(item.text)}
                className="text-[10px] font-bold bg-white text-slate-600 hover:text-brand-coral border border-slate-200 hover:border-brand-coral rounded-full px-3 py-1 cursor-pointer transition-all shrink-0"
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Search Inputs Bar */}
          <div className="p-4 bg-white border-t border-slate-100 shrink-0">
            <div className="flex gap-2 relative">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSendMessage(inputText);
                }}
                placeholder="Ask about electricity bills, direct cool vs no frost..."
                className="w-full text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl pl-4 pr-12 py-3.5 focus:outline-none focus:ring-1 focus:ring-brand-mint text-brand-navy-950"
                id="ai-user-query-input"
              />
              <button
                onClick={() => handleSendMessage(inputText)}
                disabled={!inputText.trim() || isLoading}
                className="absolute right-1.5 top-1.5 bottom-1.5 px-4 bg-brand-navy-900 text-white rounded-lg hover:bg-brand-coral transition-colors flex items-center justify-center cursor-pointer disabled:bg-slate-100 disabled:text-slate-400"
                id="ai-send-btn"
                aria-label="Send query"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
