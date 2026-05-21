import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Search, ShieldAlert, Truck, CheckCircle2, Navigation, 
  User as UserIcon, Calendar, Clock, MapPin, AlertCircle, XCircle 
} from 'lucide-react';
import { Order } from '../types';
import { api } from '../lib/api';

interface OrderTrackingViewProps {
  onNotify: (msg: string, type: 'success' | 'error' | 'info') => void;
  setView: (view: any) => void;
}

export default function OrderTrackingView({ onNotify, setView }: OrderTrackingViewProps) {
  const [searchId, setSearchId] = useState('');
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);
  const [noOrderFound, setNoOrderFound] = useState(false);

  // Default preset reference if no specific search executed
  useEffect(() => {
    // Try seeking any order from localStorage
    const saved = localStorage.getItem('fringe_order_history');
    if (saved) {
      try {
        const parsed: Order[] = JSON.parse(saved);
        if (parsed.length > 0) {
          setActiveOrder(parsed[0]); // Load latest
          setSearchId(parsed[0].id);
        }
      } catch (e) {
        // ignore
      }
    }

    if (!activeOrder) {
      // Setup standard mock demo tracking reference
      const demoOrder: Order = {
        id: 'FR-92041',
        date: '2026-05-19',
        subtotal: 10350,
        discount: 0,
        shippingFee: 250,
        total: 10600,
        status: 'Shipped',
        deliveryMethod: 'standard',
        paymentMethod: 'cod',
        items: [
          {
            product: {
              id: 'p1',
              name: 'Serene Ivory Chikankari Kurta',
              category: 'pret',
              price: 5450,
              image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=80&w=600',
              description: '',
              rating: 5,
              reviewsCount: 1,
              inStock: true
            },
            quantity: 1,
            size: 'M'
          }
        ],
        shippingAddress: {
          fullName: 'Sajid Mehmood',
          phone: '03129988112',
          city: 'Karachi',
          area: 'DHA Phase 6',
          addressLines: 'Apartment 4-C, Lane 3, Nishat Commercial, DHA'
        }
      };
      setActiveOrder(demoOrder);
      setSearchId(demoOrder.id);
    }
  }, []);

  const handleSearchOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setNoOrderFound(false);

    if (!searchId.trim()) {
      onNotify('Ensure you input an Order ID tracker line.', 'error');
      return;
    }

    try {
      const order = await api.trackOrder(searchId.trim());
      setActiveOrder(order);
      onNotify(`Located tracking details for ${searchId}`, 'success');
      return;
    } catch {
      // Fall through to local cache
    }

    const saved = localStorage.getItem('fringe_order_history');
    if (saved) {
      try {
        const parsed: Order[] = JSON.parse(saved);
        const matched = parsed.find(o => o.id.trim().toUpperCase() === searchId.trim().toUpperCase());
        if (matched) {
          setActiveOrder(matched);
          onNotify(`Located tracking details for ${searchId}`, 'success');
          return;
        }
      } catch {
        // ignore
      }
    }

    // Direct match with default demo
    if (searchId.trim().toUpperCase() === 'FR-92041') {
      const demoOrder: Order = {
        id: 'FR-92041',
        date: '2026-05-19',
        subtotal: 10350,
        discount: 0,
        shippingFee: 250,
        total: 10600,
        status: 'Shipped',
        deliveryMethod: 'standard',
        paymentMethod: 'cod',
        items: [
          {
            product: {
              id: 'p1',
              name: 'Serene Ivory Chikankari Kurta',
              category: 'pret',
              price: 5450,
              image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=80&w=600',
              description: '',
              rating: 5,
              reviewsCount: 1,
              inStock: true
            },
            quantity: 1,
            size: 'M'
          }
        ],
        shippingAddress: {
          fullName: 'Sajid Mehmood',
          phone: '03129988112',
          city: 'Karachi',
          area: 'DHA Phase 6',
          addressLines: 'Apartment 4-C, Lane 3, Nishat Commercial, DHA'
        }
      };
      setActiveOrder(demoOrder);
      return;
    }

    setNoOrderFound(true);
    onNotify(`Could not locate any invoice under sequence ${searchId}`, 'error');
  };

  const handleCancelTrackOrder = () => {
    if (!activeOrder) return;
    if (window.confirm(`Are you sure you would like to terminate order ${activeOrder.id}?`)) {
      const nextOrder = { ...activeOrder, status: 'Cancelled' as any };
      setActiveOrder(nextOrder);

      // Core storage update
      const saved = localStorage.getItem('fringe_order_history');
      if (saved) {
        try {
          const parsed: Order[] = JSON.parse(saved);
          const nextSet = parsed.map(o => o.id === activeOrder.id ? nextOrder : o);
          localStorage.setItem('fringe_order_history', JSON.stringify(nextSet));
        } catch (e) {
          // ignore
        }
      }
      onNotify('Your shipment reservation has been successfully cancelled.', 'success');
    }
  };

  // Status mapping to determine timeline completed indices
  // Placed -> Processing -> Shipped -> Out for Delivery -> Delivered
  const getStepIndex = (status: Order['status']) => {
    switch (status) {
      case 'Order placed': return 1;
      case 'Processing': return 2;
      case 'Shipped': return 3;
      case 'Delivered': return 5; // skip direct or count 5
      case 'Cancelled': return -1;
      default: return 1;
    }
  };

  const stepActive = activeOrder ? getStepIndex(activeOrder.status) : 1;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 text-brand-navy-900" id="live-order-tracking-canvas">
      
      {/* Title block */}
      <div className="text-center space-y-2 mb-8">
        <h1 className="font-display font-black text-xl sm:text-2xl">Leopards Dispatch Timeline Tracker</h1>
        <p className="text-xs text-slate-500 font-semibold leading-none">Inquire status of packages dispatching across Pakistan</p>
      </div>

      {/* SEARCH BAR CONSOLE */}
      <form onSubmit={handleSearchOrder} className="max-w-md mx-auto bg-white border border-slate-100 rounded-2xl p-3 shadow-xs flex gap-2.5 mb-8">
        <div className="flex-grow relative flex items-center">
          <Search className="w-4 h-4 text-slate-400 absolute left-3" />
          <input
            type="text"
            required
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            placeholder="e.g. FR-92041"
            className="w-full text-xs font-semibold pl-10 pr-2 focus:outline-none uppercase text-brand-navy-900"
          />
        </div>
        <button
          type="submit"
          className="bg-brand-navy-900 hover:bg-brand-coral text-white px-5 py-2.5 rounded-xl text-xs font-bold uppercase transition-colors shrink-0 cursor-pointer"
        >
          Track
        </button>
      </form>

      {noOrderFound ? (
        <div className="bg-white border rounded-3xl p-12 text-center max-w-lg mx-auto shadow-xs space-y-4">
          <ShieldAlert className="w-10 h-10 text-rose-500 mx-auto" />
          <div>
            <h3 className="text-sm font-bold text-brand-navy-900">Tracking Reference Not Located</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto leading-normal">
              We couldn't locate details for "{searchId}". Place a fresh order or search "FR-92041" to run verification.
            </p>
          </div>
        </div>
      ) : activeOrder ? (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          
          {/* Timeline Visual Progress tracker */}
          <div className="md:col-span-8 bg-white border border-slate-100 rounded-3xl p-6 md:p-8 shadow-xs space-y-8">
            
            {/* Delivery Date Notification strip banner */}
            <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl flex justify-between items-center flex-wrap gap-2">
              <div className="flex gap-2 items-center">
                <Calendar className="w-5 h-5 text-brand-coral shrink-0" />
                <div>
                  <span className="text-[9px] font-bold text-slate-400 block uppercase">Estimated Arrival Term</span>
                  <span className="text-xs font-bold text-brand-navy-900">Inside 2-4 working days (Nationwide)</span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[9px] font-bold text-slate-400 block uppercase">Transit Method</span>
                <span className="text-xs font-serif font-black text-brand-coral capitalize">{activeOrder.deliveryMethod || 'Standard Ground'}</span>
              </div>
            </div>

            {/* Cancel Check guard */}
            {activeOrder.status === 'Cancelled' ? (
              <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl text-rose-600 text-center flex items-center justify-center gap-2">
                <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
                <span className="text-xs font-bold uppercase tracking-wider">This shipment has been terminated or Cancelled</span>
              </div>
            ) : (
              /* PROGRESS VERTICAL LINES PATH */
              <div className="space-y-6 relative pl-8 before:absolute before:left-[11px] before:top-4 before:bottom-4 before:w-0.5 before:bg-slate-150 select-none">
                
                {[
                  { step: 1, label: 'Order Registered & Paid', desc: 'Secure transaction confirmed at fridge.pk.', time: activeOrder.date },
                  { step: 2, label: 'Processing in Textile Hub', desc: 'Garment collection folded and sealed inside delivery packaging.', time: 'Fulfillment Active' },
                  { step: 3, label: 'Handed over to Leopards Courier', desc: 'Air waybill printed and dispatched via TCS/Leopards logistics.', time: 'In Transit Flight' },
                  { step: 4, label: 'Out for Local Courier Delivery', desc: 'Local logistics agent dispatched rider packet to door destination.', time: 'Expected Today' },
                  { step: 5, label: 'Delivered Doorstep', desc: 'Successfully collected and signed with COD verification.', time: 'Completed' }
                ].map(item => {
                  const isDone = stepActive >= item.step;
                  const isCurrent = stepActive === item.step;
                  return (
                    <div key={item.step} className="relative space-y-1">
                      
                      {/* Indicator point overlay */}
                      <div className={`absolute -left-[37px] w-6 h-6 rounded-full flex items-center justify-center border text-[9px] transition-all ${
                        isDone 
                          ? 'bg-brand-coral border-brand-coral text-white ring-4 ring-brand-coral-light/20' 
                          : 'bg-white border-slate-200 text-slate-400'
                      }`}>
                        {isDone ? '✓' : item.step}
                      </div>

                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1">
                        <h4 className={`text-xs font-bold uppercase tracking-wider ${
                          isCurrent ? 'text-brand-coral font-black' : isDone ? 'text-brand-navy-900' : 'text-slate-400'
                        }`}>
                          {item.label}
                        </h4>
                        <span className="text-[10px] text-slate-400 font-semibold">{item.time}</span>
                      </div>
                      <p className="text-[11px] text-slate-500 font-medium leading-relaxed">{item.desc}</p>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Cancel shipment active check button if applicable */}
            {activeOrder.status !== 'Cancelled' && activeOrder.status !== 'Shipped' && activeOrder.status !== 'Delivered' && (
              <div className="pt-4 border-t border-slate-100 flex justify-end">
                <button
                  onClick={handleCancelTrackOrder}
                  className="px-5 py-2.5 bg-rose-50 hover:bg-rose-150 text-rose-600 rounded-xl text-xs font-bold uppercase transition-colors cursor-pointer flex items-center gap-1.5 border border-rose-200"
                >
                  <XCircle className="w-4 h-4" />
                  <span>Cancel Entire Shipment Booking</span>
                </button>
              </div>
            )}

          </div>

          {/* Right column delivery agent and destination card */}
          <div className="md:col-span-4 space-y-6">
            
            {/* Delivery Courier Plate cards */}
            {activeOrder.status !== 'Cancelled' && (
              <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-xs space-y-4">
                <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest pb-1 border-b">Courier Logistics</h3>
                
                <div className="flex gap-4 items-center">
                  <div className="w-10 h-10 rounded-full bg-brand-navy-900 text-white font-serif font-black flex items-center justify-center text-xs shrink-0">
                    LA
                  </div>
                  <div className="space-y-1">
                    <span className="text-[9px] font-bold text-slate-400 uppercase leading-none block">Assigned Rider Agent</span>
                    <h4 className="text-xs font-bold text-brand-navy-900 leading-none">Liaqat Ali</h4>
                    <span className="text-[10px] text-brand-coral font-bold uppercase tracking-wider block">Leopards Cargo Pakistan</span>
                  </div>
                </div>

                <div className="text-[11px] text-slate-500 font-semibold space-y-1 border-t pt-2.5">
                  <p>ID Card: KP-92401-Karachi</p>
                  <p>Contact No: +92-300-8819203</p>
                </div>
              </div>
            )}

            {/* Ship Destination details */}
            <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-xs space-y-4">
              <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest pb-1 border-b">Buyer Destination</h3>
              
              <div className="space-y-2 text-xs font-semibold text-slate-700 leading-relaxed">
                <div>
                  <span className="text-[9px] font-bold text-slate-450 uppercase leading-none block">Recipient Name</span>
                  <p className="font-bold text-brand-navy-950">{activeOrder.shippingAddress?.fullName || 'Sajid Mehmood'}</p>
                </div>
                <div>
                  <span className="text-[9px] font-bold text-slate-450 uppercase leading-none block">Dispatch Coordinates</span>
                  <p className="font-medium">"{activeOrder.shippingAddress?.addressLines || 'Apartment 4-C, Lane 3'}"</p>
                  <p className="text-[11px] text-slate-500">{activeOrder.shippingAddress?.area}, {activeOrder.shippingAddress?.city}</p>
                </div>
                <div>
                  <span className="text-[9px] font-bold text-slate-450 uppercase leading-none block">Recipient Contact Phone</span>
                  <p className="font-bold text-slate-600">{activeOrder.shippingAddress?.phone || '03129988112'}</p>
                </div>
              </div>
            </div>

          </div>

        </div>
      ) : (
        <div className="py-12 text-center text-slate-400 font-bold col-span-12 text-xs uppercase">
          Input an Order ID above and click on Track to initiate Leopards dispatches status inspection.
        </div>
      )}

    </div>
  );
}
