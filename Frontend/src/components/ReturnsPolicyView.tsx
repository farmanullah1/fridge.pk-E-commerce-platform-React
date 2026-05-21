import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  ShieldAlert, RefreshCcw, CheckCircle, HelpCircle, Truck, Clock, ShieldCheck, Mail, ArrowRight, BookOpen
} from 'lucide-react';

interface ReturnsPolicyViewProps {
  onNotify: (msg: string, type: 'success' | 'error' | 'info') => void;
  setView: (view: string) => void;
}

export default function ReturnsPolicyView({ onNotify, setView }: ReturnsPolicyViewProps) {
  const [ticketId, setTicketId] = useState('');
  const [returnReason, setReturnReason] = useState('');
  const [submittingTicket, setSubmittingTicket] = useState(false);

  const steps = [
    {
      id: '01',
      title: '7-Day Return Request Period',
      desc: 'If the cooling device has cooling performance errors, physical transit surface dents, or does not match your kitchen cavity, report the damage within 7 days of package delivery.',
      icon: Clock,
      color: 'bg-emerald-50 text-emerald-600 border-emerald-100'
    },
    {
      id: '02',
      title: 'Free Home Inspection',
      desc: 'Our authorized manufacturer brand service representative will visit your home within 24–48 hours for a safe technical review of internal voltages, cooling coils, and transit marks.',
      icon: ShieldAlert,
      color: 'bg-amber-50 text-amber-600 border-amber-100'
    },
    {
      id: '03',
      title: 'Hassle-Free Free Pick-Up',
      desc: 'Once approved, our heavy parcel dispatch couriers will safely de-install and pick up the appliance from your door at no additional cost! No packaging box required.',
      icon: Truck,
      color: 'bg-rose-50 text-rose-600 border-rose-100'
    },
    {
      id: '04',
      title: 'Instant Refund Transfer',
      desc: 'Receive your 100% full cash refund back within 3–5 working days into your Easypaisa wallet, JazzCash or direct Bank transfer. No hidden deductions.',
      icon: RefreshCcw,
      color: 'bg-sky-50 text-sky-600 border-sky-100'
    }
  ];

  const handleTicketSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketId || !returnReason) {
      onNotify('Please describe your damage and insert a valid order ID!', 'error');
      return;
    }
    setSubmittingTicket(true);
    setTimeout(() => {
      onNotify(`Damage report token registered for Order #${ticketId}! Tech engineer will contact you!`, 'success');
      setTicketId('');
      setReturnReason('');
      setSubmittingTicket(false);
    }, 1500);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8" id="returns-policy-page">
      
      {/* Policy Hero branding */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand-coral/15 rounded-md text-brand-coral text-[9px] font-black uppercase tracking-widest mb-4">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Verified Safe Assurance Guarantee</span>
        </div>
        <h1 className="text-3xl font-display font-black text-brand-navy-900 tracking-tight">
          7-Day Hassle-Free <span className="text-brand-coral">Return & Refund Policy</span>
        </h1>
        <p className="text-xs text-slate-500 mt-2 max-w-xl mx-auto leading-normal">
          Learn how we safeguard your heavy cooling appliance purchase on fridge.pk. Get complete replacements, free technician inspections, or full cash refunds.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Step progress lists */}
        <div className="lg:col-span-8 space-y-8">
          <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-xs space-y-6">
            <h3 className="font-display font-bold text-base text-brand-navy-900 border-b border-slate-100 pb-3 block">
              Step-by-Step Return Process
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {steps.map((st) => {
                const IconVar = st.icon;
                return (
                  <div 
                    key={st.id}
                    className="p-4 bg-slate-50 rounded-2xl border flex gap-3 text-left hover:border-slate-300 transition-colors"
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border uppercase font-display font-black ${st.color}`}>
                      <IconVar className="w-5 h-5" />
                    </div>
                    <div className="space-y-1">
                      <span className="text-[9px] text-slate-400 block font-mono font-bold uppercase">Step {st.id}</span>
                      <h4 className="text-xs font-bold text-brand-navy-950 block">{st.title}</h4>
                      <p className="text-[11px] text-slate-500 leading-normal font-medium">{st.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-xs space-y-4">
            <h3 className="font-display font-bold text-sm text-brand-navy-100 block">Critical Policy Highlights</h3>
            <ul className="space-y-3 pl-1 font-medium text-xs text-slate-500 leading-normal">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span><strong>No Restocking Fees:</strong> We never charge administrative or repackaging fees. You receive exactly the amount you spent.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span><strong>10-Year Compressor Warranty Protection:</strong> Handled directly by PEL / Dawlance / Waves authorized networks. We facilitate prompt technician assistance.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span><strong>Physical Damage Transit Coverage:</strong> Any surface dents, structural glass cracks happened during delivery must be reported within 24 hours of package reception.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Right side form: Lodge Return Ticket */}
        <div className="lg:col-span-4 gap-6">
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl border border-slate-100 p-6 shadow-xs space-y-4 text-left"
          >
            <div className="space-y-1">
              <h3 className="font-display font-bold text-base text-brand-navy-900 block">File Damage Ticket</h3>
              <p className="text-[11px] text-slate-500 leading-normal block">Are you experiencing issues? Fill out this direct form to schedule a free brand technician pickup inspection.</p>
            </div>

            <form onSubmit={handleTicketSubmit} className="space-y-4 mt-2">
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
                  Order ID or Receipt Code
                </label>
                <input
                  type="text"
                  required
                  value={ticketId}
                  onChange={(e) => setTicketId(e.target.value)}
                  placeholder="e.g. ORD-10928"
                  className="w-full text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-brand-navy-950 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
                  Describe Cooling Issue or Dent
                </label>
                <textarea
                  required
                  rows={4}
                  value={returnReason}
                  onChange={(e) => setReturnReason(e.target.value)}
                  placeholder="e.g. Double-door freezer works, but lower door partition has low cold retention. No physical dent."
                  className="w-full text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-brand-navy-950 focus:outline-none resize-none leading-relaxed"
                />
              </div>

              <button
                type="submit"
                disabled={submittingTicket}
                className="w-full bg-slate-900 hover:bg-brand-coral text-white font-bold text-xs uppercase tracking-wider py-3.5 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1 shadow-md"
              >
                <span>{submittingTicket ? 'Submitting ticket...' : 'Submit Damage Report'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <div className="border-t border-slate-100 pt-4 text-[10px] text-slate-400 font-mono text-center block">
              💡 Support: support@fridge.pk
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
