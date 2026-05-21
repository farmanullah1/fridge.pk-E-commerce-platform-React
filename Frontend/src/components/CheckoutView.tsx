import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MapPin, Truck, CreditCard, ShoppingBag, CheckCircle, Smartphone, 
  ChevronRight, ArrowLeft, ShieldCheck, Mail, Phone, Calendar, User as UserIcon
} from 'lucide-react';
import { Product, CartItem, Order, User } from '../types';
import { api } from '../lib/api';

interface CheckoutViewProps {
  cart: CartItem[];
  user: User | null;
  onClearCart: () => void;
  onNotify: (msg: string, type: 'success' | 'error' | 'info') => void;
  setView: (view: any) => void;
}

export default function CheckoutView({
  cart,
  user,
  onClearCart,
  onNotify,
  setView
}: CheckoutViewProps) {
  // Stepper active index: 1 = Address, 2 = Delivery, 3 = Payment, 4 = Confirmation
  const [step, setStep] = useState(1);

  // Form Fields - Step 1: Address
  const [fullName, setFullName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [city, setCity] = useState('');
  const [area, setArea] = useState('');
  const [addressLines, setAddressLines] = useState('');
  const [saveAsDefault, setSaveAsDefault] = useState(true);

  // Form Fields - Step 2: Delivery Method
  const [deliveryMethod, setDeliveryMethod] = useState<'standard' | 'express'>('standard');

  // Form Fields - Step 3: Payment Method
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'cod' | 'easypaisa'>('cod');
  
  // Credit card details if selected
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCVV, setCardCVV] = useState('');
  const [easypaisaNumber, setEasypaisaNumber] = useState('');

  // Finished transaction details
  const [placedOrderId, setPlacedOrderId] = useState('');

  // Form errors
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Pre-populate if previous addresses exist
  useEffect(() => {
    if (user) {
      setFullName(user.name);
      if (user.phone) setPhone(user.phone);
    }
    const savedAddr = localStorage.getItem('fringe_shipping_address');
    if (savedAddr) setAddressLines(savedAddr);
    const savedCity = localStorage.getItem('fringe_shipping_city');
    if (savedCity) setCity(savedCity);
    const savedArea = localStorage.getItem('fringe_shipping_area') || 'DHA Phase 5';
    setArea(savedArea);
  }, [user]);

  const cartSubtotal = cart.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
  
  // Flat shipping is free above Rs. 5000, standard Rs. 250, express is + Rs. 400
  const baseShipping = cartSubtotal >= 5000 ? 0 : 250;
  const deliveryCharge = deliveryMethod === 'express' ? baseShipping + 400 : baseShipping;
  
  const discountAmount = 0; // standard cart calculations handled separately, or can take dynamic deductions
  const activeTotal = cartSubtotal + deliveryCharge;

  // Validate step navigation
  const handleNextStep = () => {
    const nextErrors: Record<string, string> = {};

    if (step === 1) {
      if (!fullName.trim()) nextErrors.fullName = 'Please specify recipient full name.';
      if (!phone.trim() || phone.length < 7) nextErrors.phone = 'Valid smartphone sequence required.';
      if (!city) nextErrors.city = 'Please highlight your destination city.';
      if (!area.trim()) nextErrors.area = 'Please mention the home area/neighborhood.';
      if (!addressLines.trim()) nextErrors.addressLines = 'Precise door/street details required.';

      if (Object.keys(nextErrors).length > 0) {
        setErrors(nextErrors);
        onNotify('Please complete all required fields on this step.', 'error');
        return;
      }
      setErrors({});

      // Cache as default if ticked
      if (saveAsDefault) {
        localStorage.setItem('fringe_shipping_address', addressLines);
        localStorage.setItem('fringe_shipping_city', city);
        localStorage.setItem('fringe_shipping_area', area);
      }
    }

    if (step === 3) {
      if (paymentMethod === 'card') {
        if (cardNumber.length < 16) nextErrors.card = 'Please present standard 16 digit card lines.';
        if (!cardExpiry) nextErrors.cardExpiry = 'Fill card expiry dates.';
        if (cardCVV.length < 3) nextErrors.cardCVV = 'Secure code required.';
      } else if (paymentMethod === 'easypaisa') {
        if (easypaisaNumber.length < 10) nextErrors.easypaisa = 'Easypaisa wallet coordinates required.';
      }

      if (Object.keys(nextErrors).length > 0) {
        setErrors(nextErrors);
        onNotify('Payment input parameters need adjustments.', 'error');
        return;
      }
      setErrors({});
      // Proceed to submission directly from step 3
      handlePlaceFinalOrder();
      return;
    }

    setStep(prev => prev + 1);
  };

  const handlePlaceFinalOrder = async () => {
    setIsSubmitting(true);

    const payloadOrder: Order = {
      id: `FR-${Math.floor(10000 + Math.random() * 90000)}`,
      date: new Date().toISOString().split('T')[0],
      items: [...cart],
      subtotal: cartSubtotal,
      discount: discountAmount,
      shippingFee: deliveryCharge,
      total: activeTotal,
      status: 'Order placed',
      deliveryMethod,
      paymentMethod,
      shippingAddress: {
        fullName,
        phone,
        city,
        area,
        addressLines,
      },
    };

    try {
      const { order } = await api.placeOrder(payloadOrder);
      setPlacedOrderId(order.id);

      const prevOrdersRaw = localStorage.getItem('fringe_order_history');
      let currentRecords: Order[] = [];
      if (prevOrdersRaw) {
        try {
          currentRecords = JSON.parse(prevOrdersRaw);
        } catch {
          currentRecords = [];
        }
      }
      currentRecords.unshift(order);
      localStorage.setItem('fringe_order_history', JSON.stringify(currentRecords));

      onNotify(`Order ${order.id} successfully registered!`, 'success');
      onClearCart();
      setStep(4);
    } catch (err) {
      onNotify(err instanceof Error ? err.message : 'Order placement failed', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 text-brand-navy-900" id="checkout-stepper-view">
      
      {/* Dynamic Stepper progress lines */}
      {step < 4 && (
        <div className="mb-10 select-none">
          <div className="flex justify-between items-center max-w-xl mx-auto relative px-2">
            
            {/* Background connection bar */}
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-200 -translate-y-1/2 z-0" />
            <div 
              className="absolute top-1/2 left-0 h-0.5 bg-brand-coral -translate-y-1/2 z-0 transition-all duration-300"
              style={{ width: `${((step - 1) / 2) * 100}%` }}
            />

            {[
              { num: 1, label: 'Shipping', icon: MapPin },
              { num: 2, label: 'Delivery', icon: Truck },
              { num: 3, label: 'Payment', icon: CreditCard }
            ].map(st => {
              const IconComp = st.icon;
              const isCompleted = step > st.num;
              const isActive = step === st.num;
              return (
                <div key={st.num} className="relative z-10 flex flex-col items-center gap-1">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center border transition-all text-xs font-bold font-mono ${
                    isCompleted 
                      ? 'bg-brand-coral border-brand-coral text-white' 
                      : isActive 
                        ? 'bg-brand-navy-900 border-brand-navy-900 text-white ring-4 ring-brand-coral-light/40' 
                        : 'bg-white border-slate-200 text-slate-400'
                  }`}>
                    {isCompleted ? '✓' : st.num}
                  </div>
                  <span className={`text-[10px] font-bold tracking-wider uppercase ${
                    isActive ? 'text-brand-navy-900 font-extrabold' : 'text-slate-400'
                  }`}>
                    {st.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* STEP CONTEXTS SCREEN ROUTER */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        
        {/* Main form input col */}
        <div className={step < 4 ? 'md:col-span-7 bg-white border border-slate-100 rounded-3xl p-6 md:p-8 shadow-xs' : 'md:col-span-12'}>
          <AnimatePresence mode="wait">
            
            {/* STEP 1: ADDRESS */}
            {step === 1 && (
              <motion.div
                key="step-1"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="space-y-5"
              >
                <div>
                  <h2 className="text-base font-bold text-brand-navy-900 uppercase tracking-widest">Recipient Shipping details</h2>
                  <p className="text-xs text-slate-500 mt-1">Provide accurate delivery details across Pakistan</p>
                </div>

                <div className="space-y-4">
                  {/* Name */}
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-brand-navy-800 tracking-wide">Full Name</label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Farman Ansari"
                      className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-brand-navy-900 focus:outline-none"
                    />
                    {errors.fullName && <p className="text-rose-600 text-[10px] uppercase font-bold">{errors.fullName}</p>}
                  </div>

                  {/* Phone */}
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-brand-navy-800 tracking-wide">Contact Phone Number (For Courier dispatches Alert)</label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="e.g. 03001234567"
                      className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-brand-navy-900 focus:outline-none"
                    />
                    {errors.phone && <p className="text-rose-600 text-[10px] uppercase font-bold">{errors.phone}</p>}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {/* City Select */}
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-brand-navy-800 tracking-wide">City</label>
                      <select
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-brand-navy-900 focus:outline-none"
                      >
                        <option value="">Choose City...</option>
                        {['Karachi', 'Lahore', 'Islamabad', 'Faisalabad', 'Rawalpindi', 'Multan', 'Peshawar', 'Quetta', 'Sialkot', 'Gujranwala'].map(c => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                      {errors.city && <p className="text-rose-600 text-[10px] uppercase font-bold">{errors.city}</p>}
                    </div>

                    {/* Area */}
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-brand-navy-800 tracking-wide">Area / Sector</label>
                      <input
                        type="text"
                        value={area}
                        onChange={(e) => setArea(e.target.value)}
                        placeholder="e.g. Clifton / Gulberg / F-8"
                        className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-brand-navy-900 focus:outline-none"
                      />
                      {errors.area && <p className="text-rose-600 text-[10px] uppercase font-bold">{errors.area}</p>}
                    </div>
                  </div>

                  {/* Address Lines */}
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-brand-navy-800 tracking-wide">Full Residence Address</label>
                    <textarea
                      rows={2}
                      value={addressLines}
                      onChange={(e) => setAddressLines(e.target.value)}
                      placeholder="Street number, house code, landmark details"
                      className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-3 text-brand-navy-900 focus:outline-none"
                    />
                    {errors.addressLines && <p className="text-rose-600 text-[10px] uppercase font-bold">{errors.addressLines}</p>}
                  </div>

                  {/* Save as default address checkbox */}
                  <label className="flex items-start gap-2 pt-2 cursor-pointer select-none text-xs text-slate-500">
                    <input
                      type="checkbox"
                      checked={saveAsDefault}
                      onChange={(e) => setSaveAsDefault(e.target.checked)}
                      className="rounded border-slate-300 text-brand-coral focus:ring-brand-coral h-4.5 w-4.5 mt-0.5"
                    />
                    <span>Save coordinates as default shipping address book</span>
                  </label>
                </div>

                <div className="pt-4 border-t border-slate-50 flex justify-between items-center">
                  <button
                    onClick={() => setView('cart')}
                    className="text-xs font-bold text-slate-500 hover:text-brand-coral flex items-center gap-1"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back to Cart</span>
                  </button>
                  <button
                    onClick={handleNextStep}
                    className="px-6 py-3 bg-brand-navy-900 hover:bg-brand-coral text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    Review Dispatches
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 2: DELIVERY METHOD */}
            {step === 2 && (
              <motion.div
                key="step-2"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="space-y-5"
              >
                <div>
                  <h2 className="text-base font-bold text-brand-navy-900 uppercase tracking-widest">Select Delivery Speed</h2>
                  <p className="text-xs text-slate-500 mt-1">Configure logistics and transit options</p>
                </div>

                <div className="space-y-4">
                  
                  {/* Standard Delivery (3-5 days) */}
                  <label className={`block border p-4 rounded-2xl cursor-pointer transition-all select-none ${
                    deliveryMethod === 'standard' 
                      ? 'border-brand-navy-900 bg-brand-navy-900/5 ring-1 ring-brand-navy-900 shadow-3xs' 
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}>
                    <div className="flex justify-between items-start">
                      <div className="flex items-start gap-3">
                        <input
                          type="radio"
                          name="deliveryType"
                          checked={deliveryMethod === 'standard'}
                          onChange={() => setDeliveryMethod('standard')}
                          className="mt-1 text-brand-coral focus:ring-brand-coral"
                        />
                        <div>
                          <h3 className="text-xs sm:text-sm font-bold text-brand-navy-900">Standard Delivery Nationwide</h3>
                          <p className="text-[11px] text-slate-500 mt-0.5 font-medium">Takes 3-5 working days via Leopard Courier dispatches</p>
                          <span className="text-[10px] text-brand-coral font-bold uppercase tracking-wide block mt-1.5">Expected ETA: Mon-Thu</span>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-brand-navy-900">
                        {cartSubtotal >= 5000 ? 'FREE' : 'Rs. 250'}
                      </span>
                    </div>
                  </label>

                  {/* Express Delivery (1-2 days, extra fee) */}
                  <label className={`block border p-4 rounded-2xl cursor-pointer transition-all select-none ${
                    deliveryMethod === 'express' 
                      ? 'border-brand-navy-900 bg-brand-navy-900/5 ring-1 ring-brand-navy-900 shadow-3xs' 
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}>
                    <div className="flex justify-between items-start">
                      <div className="flex items-start gap-3">
                        <input
                          type="radio"
                          name="deliveryType"
                          checked={deliveryMethod === 'express'}
                          onChange={() => setDeliveryMethod('express')}
                          className="mt-1 text-brand-coral focus:ring-brand-coral"
                        />
                        <div>
                          <h3 className="text-xs sm:text-sm font-bold text-brand-navy-900">Express Delivery (Urgent Flight Service)</h3>
                          <p className="text-[11px] text-slate-500 mt-0.5 font-medium">Takes 1-2 working days directly to major airport hubs (TCS Envoy)</p>
                          <span className="text-[10px] text-orange-600 font-bold uppercase tracking-wide block mt-1.5">Expected ETA: 24-48 Hours</span>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-brand-navy-900">
                        Rs. {(baseShipping + 400).toLocaleString()}
                      </span>
                    </div>
                  </label>
                </div>

                <div className="pt-4 border-t border-slate-50 flex justify-between items-center">
                  <button
                    onClick={() => setStep(1)}
                    className="text-xs font-bold text-slate-500 hover:text-brand-coral flex items-center gap-1"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back to Senders</span>
                  </button>
                  <button
                    onClick={handleNextStep}
                    className="px-6 py-3 bg-brand-navy-900 hover:bg-brand-coral text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    Choose Payment
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 3: PAYMENT METHOD */}
            {step === 3 && (
              <motion.div
                key="step-3"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="space-y-5"
              >
                <div>
                  <h2 className="text-base font-bold text-brand-navy-900 uppercase tracking-widest">Select Payment gateway</h2>
                  <p className="text-xs text-slate-500 mt-1">Select secure transaction options</p>
                </div>

                <div className="space-y-4">
                  {/* Option 1: Cash on Delivery (COD) */}
                  <label className={`block border p-4 rounded-2xl cursor-pointer transition-all select-none ${
                    paymentMethod === 'cod' 
                      ? 'border-brand-navy-900 bg-brand-navy-900/5 ring-1 ring-brand-navy-900' 
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}>
                    <div className="flex gap-3">
                      <input
                        type="radio"
                        name="paymentType"
                        checked={paymentMethod === 'cod'}
                        onChange={() => setPaymentMethod('cod')}
                        className="mt-1 text-brand-coral focus:ring-brand-coral"
                      />
                      <div>
                        <h3 className="text-xs sm:text-sm font-bold text-brand-navy-900">Cash On Delivery (COD)</h3>
                        <p className="text-[11px] text-slate-500 mt-0.5">Pay in cash directly to Leopard/TCS courier agent upon doorstep receipt.</p>
                      </div>
                    </div>
                  </label>

                  {/* Option 2: Easypaisa / JazzCash Mobile Wallet */}
                  <label className={`block border p-4 rounded-2xl cursor-pointer transition-all select-none ${
                    paymentMethod === 'easypaisa' 
                      ? 'border-brand-navy-900 bg-brand-navy-900/5 ring-1 ring-brand-navy-900' 
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}>
                    <div className="flex gap-3 items-start">
                      <input
                        type="radio"
                        name="paymentType"
                        checked={paymentMethod === 'easypaisa'}
                        onChange={() => setPaymentMethod('easypaisa')}
                        className="mt-1 text-brand-coral focus:ring-brand-coral"
                      />
                      <div className="flex-grow">
                        <h3 className="text-xs sm:text-sm font-bold text-brand-navy-900">Mobile Wallet (EasyPaisa/JazzCash)</h3>
                        <p className="text-[11px] text-slate-500 mt-0.5">Receive prompt checkout request popup notifications on your phone.</p>
                        
                        {/* Interactive EasyPaisa Field input */}
                        {paymentMethod === 'easypaisa' && (
                          <div className="mt-3 max-w-xs space-y-2">
                            <label className="text-[10px] font-bold text-slate-400 block uppercase">Enter EasyPaisa Registered Mobile No:</label>
                            <div className="relative">
                              <input
                                type="tel"
                                required
                                value={easypaisaNumber}
                                onChange={(e) => setEasypaisaNumber(e.target.value)}
                                placeholder="03XXXXXXXXX"
                                className="w-full text-xs bg-white border border-slate-200 rounded-lg pl-8 pr-4 py-2 text-brand-navy-900 focus:outline-none focus:border-brand-coral"
                              />
                              <Smartphone className="w-4 h-4 text-slate-405 absolute left-2.5 top-1/2 -translate-y-1/2" />
                            </div>
                            {errors.easypaisa && <p className="text-rose-650 text-[10px] uppercase font-bold">{errors.easypaisa}</p>}
                          </div>
                        )}
                      </div>
                    </div>
                  </label>

                  {/* Option 3: Credit/Debit Cards */}
                  <label className={`block border p-4 rounded-2xl cursor-pointer transition-all select-none ${
                    paymentMethod === 'card' 
                      ? 'border-brand-navy-900 bg-brand-navy-900/5 ring-1 ring-brand-navy-900' 
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}>
                    <div className="flex gap-3 items-start">
                      <input
                        type="radio"
                        name="paymentType"
                        checked={paymentMethod === 'card'}
                        onChange={() => setPaymentMethod('card')}
                        className="mt-1 text-brand-coral focus:ring-brand-coral"
                      />
                      <div className="flex-grow">
                        <h3 className="text-xs sm:text-sm font-bold text-brand-navy-900">Credit / Debit Card (Visa/Mastercard)</h3>
                        <p className="text-[11px] text-slate-500 mt-0.5">Encrypted payment gateway powered by fridge.pk secure checkout.</p>
                        
                        {paymentMethod === 'card' && (
                          <div className="mt-4 space-y-3 max-w-sm">
                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-slate-400 block uppercase">16 Digit Card Line</label>
                              <input
                                type="text"
                                required
                                maxLength={16}
                                value={cardNumber}
                                onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, ''))}
                                placeholder="4123 5678 9012 3456"
                                className="w-full text-xs bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none"
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                              <div className="space-y-1">
                                <label className="text-[10px] font-bold text-slate-400 block uppercase">Expiry date</label>
                                <input
                                  type="text"
                                  maxLength={5}
                                  required
                                  value={cardExpiry}
                                  onChange={(e) => setCardExpiry(e.target.value)}
                                  placeholder="MM/YY"
                                  className="w-full text-xs bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none text-center"
                                />
                              </div>
                              <div className="space-y-1">
                                <label className="text-[10px] font-bold text-slate-400 block uppercase">Secure CVV</label>
                                <input
                                  type="password"
                                  maxLength={4}
                                  required
                                  value={cardCVV}
                                  onChange={(e) => setCardCVV(e.target.value.replace(/\D/g, ''))}
                                  placeholder="•••"
                                  className="w-full text-xs bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none text-center"
                                />
                              </div>
                            </div>
                            {errors.card && <p className="text-rose-600 text-[10px] font-bold uppercase">{errors.card}</p>}
                          </div>
                        )}
                      </div>
                    </div>
                  </label>
                </div>

                <div className="pt-4 border-t border-slate-50 flex justify-between items-center">
                  <button
                    onClick={() => setStep(2)}
                    className="text-xs font-bold text-slate-500 hover:text-brand-coral flex items-center gap-1"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back to Transit</span>
                  </button>

                  <button
                    onClick={handleNextStep}
                    disabled={isSubmitting}
                    className="px-6 py-3 bg-brand-coral hover:bg-brand-coral-hover text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <span>Place Secure Order</span>
                    )}
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 4: CONFIRMATION SUCCESS */}
            {step === 4 && (
              <motion.div
                key="step-4"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-10 space-y-6 max-w-xl mx-auto"
              >
                <div className="w-20 h-20 bg-emerald-50 border-2 border-emerald-300 rounded-full flex items-center justify-center mx-auto text-emerald-600 shadow-sm animate-bounce">
                  <CheckCircle className="w-10 h-10" />
                </div>

                <div className="space-y-2">
                  <h1 className="font-display font-black text-2xl sm:text-3xl text-brand-navy-900">Order Placed Successfully!</h1>
                  <span className="bg-brand-coral/10 text-brand-coral text-xs font-bold font-mono px-3.5 py-1.5 rounded-full inline-block">
                    Reference ID: {placedOrderId}
                  </span>
                  <p className="text-xs text-slate-500 leading-relaxed max-w-sm mx-auto font-medium">
                    Mubarak! Your order has been registered. A mock invoice details packet has been dispatched to <span className="font-bold text-brand-navy-900">{fullName}</span> at <span className="font-bold text-brand-navy-900">{phone}</span>!
                  </p>
                </div>

                {/* Simulated SMS Alert Banner */}
                <div className="bg-brand-coral-light/20 border border-brand-coral/25 rounded-2xl p-4 text-left max-w-md mx-auto space-y-2">
                  <span className="text-[9px] font-bold bg-white text-brand-coral px-2 py-0.5 rounded border uppercase tracking-widest inline-block">
                    💬 Live SMS Dispatch Track
                  </span>
                  <p className="text-[11px] text-brand-navy-800 font-semibold italic">
                    "fridge.pk alert: Order {placedOrderId} for Rs. {activeTotal.toLocaleString()} successfully received on COD. ETA via Leopard Courier is 3-4 working days. Thank you!"
                  </p>
                  <span className="text-[9px] text-slate-400 block font-medium">Sent instantly to {phone}</span>
                </div>

                {/* Delivery Rider Assignment Block */}
                <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 max-w-md mx-auto text-left flex gap-4 items-center">
                  <div className="w-12 h-12 rounded-full bg-brand-navy-900 overflow-hidden shrink-0 flex items-center justify-center text-white text-sm font-bold font-serif border border-brand-coral">
                    LA
                  </div>
                  <div className="space-y-1.5">
                    <h4 className="text-xs font-bold text-brand-navy-900 leading-none">Your Leopards Courier Agent</h4>
                    <p className="text-[11px] text-slate-500 font-semibold leading-none">Agent: Liaqat Ali (Karachi-South)</p>
                    <p className="text-[9px] text-slate-400 font-semibold leading-none">Contact: +92-300-9988112</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap items-center justify-center gap-3 pt-4 select-none">
                  <button
                    onClick={() => {
                      if (user) {
                        setView('dashboard');
                      } else {
                        setView('home');
                      }
                    }}
                    className="px-6 py-2.5 bg-brand-navy-900 hover:bg-brand-coral text-white rounded-xl text-xs font-bold tracking-wider uppercase transition-colors"
                  >
                    Track Orders Dashboard
                  </button>
                  <button
                    onClick={() => setView('home')}
                    className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-xs font-bold tracking-wider uppercase transition-colors"
                  >
                    Keep Shopping
                  </button>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>

        {/* Right bill block check summary (Desktop) */}
        {step < 4 && (
          <div className="md:col-span-5 bg-white border border-slate-100 rounded-3xl p-5 shadow-xs space-y-6">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest pb-2 border-b border-slate-50 flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-brand-coral" />
              <span>Checkout Order Manifest</span>
            </h3>

            {/* list of mini items */}
            <div className="space-y-3.5 max-h-56 overflow-y-auto pr-1">
              {cart.map((it, i) => (
                <div key={i} className="flex gap-3 justify-between items-center text-xs">
                  <div className="flex gap-2.5 col-span-2 items-center">
                    <div className="w-10 h-12 bg-slate-50 rounded-lg overflow-hidden shrink-0">
                      <img src={it.product.image} alt={it.product.name} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h4 className="font-bold text-brand-navy-950 line-clamp-1">{it.product.name}</h4>
                      <p className="text-[10px] text-slate-400 font-semibold">Qty {it.quantity} • Size {it.size}</p>
                    </div>
                  </div>
                  <span className="font-bold shrink-0 font-serif">Rs. {(it.product.price * it.quantity).toLocaleString()}</span>
                </div>
              ))}
            </div>

            <hr className="border-slate-100" />

            {/* Sum breakdown lists */}
            <div className="space-y-2 text-xs font-semibold text-slate-600">
              <div className="flex justify-between">
                <span>Drapes Subtotal</span>
                <span>Rs. {cartSubtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping charge ({deliveryMethod})</span>
                <span>{deliveryCharge === 0 ? 'FREE' : `Rs. ${deliveryCharge}`}</span>
              </div>
              
              <hr className="border-slate-100" />
              
              <div className="flex justify-between text-sm font-black text-brand-navy-900">
                <span>Order Total</span>
                <span className="font-serif text-brand-coral text-base">Rs. {activeTotal.toLocaleString()}</span>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-2xl flex items-start gap-2 text-[10px] text-slate-400 leading-relaxed font-semibold">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <p>fridge.pk guarantees secure dispatch with genuine brand warranty and certified inverter appliances.</p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
