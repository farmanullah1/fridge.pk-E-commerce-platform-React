import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ShoppingCart, Plus, Minus, Trash2, Tag, ArrowRight, ShieldCheck, HelpCircle, Heart } from 'lucide-react';
import { CartItem, Product } from '../types';

interface CartViewProps {
  cart: CartItem[];
  onUpdateQty: (index: number, delta: number) => void;
  onRemoveItem: (index: number) => void;
  onProceedToCheckout: () => void;
  setView: (view: any) => void;
  onNotify: (msg: string, type: 'success' | 'error' | 'info') => void;
}

export default function CartView({
  cart,
  onUpdateQty,
  onRemoveItem,
  onProceedToCheckout,
  setView,
  onNotify
}: CartViewProps) {
  const translateCapacity = (val: string, cat: string) => {
    if (val === 'Unstitched') return 'Eco-Inverter';
    if (val === 'Default') return 'Standard';
    if (cat === 'air-conditioner') {
      if (val === 'S') return '1.0 Ton';
      if (val === 'M') return '1.5 Ton';
      if (val === 'L') return '2.0 Ton';
      if (val === 'XL') return '2.5 Ton';
    } else {
      if (val === 'S') return '12 cu.ft';
      if (val === 'M') return '15 cu.ft';
      if (val === 'L') return '18 cu.ft';
      if (val === 'XL') return '22 cu.ft';
    }
    return val;
  };

  const [promoCode, setPromoCode] = useState('');
  const [appliedDiscountPercent, setAppliedDiscountPercent] = useState(0);
  const [isPromoApplied, setIsPromoApplied] = useState(false);

  const cartSubtotal = cart.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
  
  // Free shipping nationwide if order >= 5000, else flat Rs. 250
  const shippingFee = cartSubtotal >= 5000 || cartSubtotal === 0 ? 0 : 250;
  
  const discountAmount = Math.floor((cartSubtotal * appliedDiscountPercent) / 100);
  const totalAmount = cartSubtotal - discountAmount + shippingFee;

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (promoCode.trim().toUpperCase() === 'FRINGE10') {
      setAppliedDiscountPercent(10);
      setIsPromoApplied(true);
      onNotify('Mubarak! Promo FRINGE10 successfully applied. You secured 10% off!', 'success');
    } else {
      onNotify('Invalid promo code. Try "FRINGE10" for a 10% discount!', 'error');
    }
  };

  const handleMoveToWishlist = (itemName: string, idx: number) => {
    onRemoveItem(idx);
    onNotify(`Saved "${itemName}" to your wishlist.`, 'success');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-brand-navy-900" id="shopping-cart-page">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-brand-navy-900 text-white flex items-center justify-center">
          <ShoppingCart className="w-5 h-5 text-brand-coral" />
        </div>
        <div>
          <h1 className="font-display font-black text-xl sm:text-2xl text-brand-navy-900">Your Shopping Cart</h1>
          <p className="text-xs text-slate-500 font-medium">Review your items before proceeding to checkout</p>
        </div>
      </div>

      {cart.length === 0 ? (
        <div className="bg-white border border-slate-100 rounded-3xl p-16 text-center shadow-xs max-w-xl mx-auto space-y-6">
          <div className="w-16 h-16 bg-slate-50 border border-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-300">
            <ShoppingCart className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h2 className="text-base font-bold text-brand-navy-900">Shopping Cart is Empty</h2>
            <p className="text-xs text-slate-500 leading-normal max-w-sm mx-auto">
              Your cart has no active items. Browse our high-performance smart inverters and deep refrigerators to begin checkout processes!
            </p>
          </div>
          <button
            onClick={() => setView('home')}
            className="px-8 py-3.5 bg-brand-navy-900 hover:bg-brand-coral text-white font-bold text-xs rounded-xl uppercase tracking-widest transition-colors cursor-pointer"
          >
            Shop Now
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT COLUMN: Items List */}
          <div className="lg:col-span-8 bg-white border border-slate-100 rounded-2xl p-6 shadow-xs space-y-6">
            <h2 className="text-sm font-bold text-brand-navy-900 uppercase tracking-wider pb-2 border-b border-slate-50">
              Selected Item Manifest ({cart.length})
            </h2>

            <div className="divide-y divide-slate-100">
              {cart.map((item, idx) => (
                <div key={`${item.product.id}-${item.size}-${idx}`} className="flex flex-col sm:flex-row gap-5 py-5 first:pt-0 last:pb-0">
                  
                  {/* Image space */}
                  <div className="w-24 h-32 rounded-xl bg-slate-50 overflow-hidden shrink-0 border border-slate-100">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=600';
                      }}
                    />
                  </div>

                  {/* Info columns */}
                  <div className="flex-grow flex flex-col justify-between">
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-start gap-4">
                        <h3 className="text-sm font-bold text-brand-navy-900 hover:text-brand-coral cursor-pointer transition-colors" onClick={() => { setView('products'); }}>
                          {item.product.name}
                        </h3>
                        <button
                          onClick={() => onRemoveItem(idx)}
                          className="text-slate-400 hover:text-rose-600 p-1 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                          title="Delete design"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      
                      <div className="flex flex-wrap gap-2 items-center text-[10px] font-bold">
                        <span className="bg-slate-50 border border-slate-200 text-slate-700 px-2 py-0.5 rounded uppercase">
                          Capacity: {translateCapacity(item.size, item.product.category)}
                        </span>
                        <span className="text-slate-300">|</span>
                        <span className="text-slate-500 capitalize">{item.product.category} category</span>
                      </div>
                    </div>

                    <div className="flex justify-between items-end mt-4">
                      {/* Quantity operations block */}
                      <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl h-9 px-1.5 select-none">
                        <button
                          onClick={() => onUpdateQty(idx, -1)}
                          className="p-1 text-slate-500 hover:text-brand-coral cursor-pointer"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-6 text-center text-xs font-bold text-brand-navy-900">{item.quantity}</span>
                        <button
                          onClick={() => onUpdateQty(idx, 1)}
                          className="p-1 text-slate-500 hover:text-brand-coral cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Moving and pricing */}
                      <div className="flex items-center gap-4 text-right">
                        <button
                          onClick={() => handleMoveToWishlist(item.product.name, idx)}
                          className="text-[11px] font-bold text-slate-400 hover:text-brand-coral flex items-center gap-1 cursor-pointer"
                        >
                          <Heart className="w-3.5 h-3.5" />
                          <span>Move to Wishlist</span>
                        </button>

                        <span className="text-sm font-black text-brand-navy-900 font-serif">
                          Rs. {(item.product.price * item.quantity).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>

                </div>
              ))}
            </div>
          </div>

          {/* RIGHT COLUMN: Bill and Coupon details */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Promo Code Input panel */}
            <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs space-y-3.5">
              <h3 className="text-xs font-bold text-brand-navy-900 uppercase tracking-widest flex items-center gap-1.5">
                <Tag className="w-4 h-4 text-brand-coral" />
                <span>Apply Voucher Discount</span>
              </h3>
              
              <form onSubmit={handleApplyPromo} className="flex gap-2">
                <input
                  type="text"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  disabled={isPromoApplied}
                  placeholder="e.g. FRINGE10"
                  className="flex-grow text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-brand-navy-900 focus:outline-none focus:ring-1 focus:ring-brand-coral uppercase placeholder:text-slate-450"
                />
                <button
                  type="submit"
                  disabled={isPromoApplied}
                  className="px-4 py-2.5 bg-brand-navy-900 hover:bg-brand-coral text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors disabled:bg-slate-200 disabled:text-slate-400 cursor-pointer"
                >
                  Apply
                </button>
              </form>

              {isPromoApplied ? (
                <p className="text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 p-2 rounded-lg flex items-center gap-1 justify-center">
                  🔐 FRINGE10 code active. Secure 10% subtotal deductions.
                </p>
              ) : (
                <p className="text-[10px] text-slate-400 font-semibold select-none">
                  💡 Hint: Enter <span className="text-brand-coral font-bold">FRINGE10</span> for standard 10% cash concessions on any checkout list.
                </p>
              )}
            </div>

            {/* Bill summary ledger card */}
            <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs space-y-4">
              <h3 className="text-xs font-bold text-brand-navy-900 uppercase tracking-widest">
                Order Value Breakdown
              </h3>

              <div className="space-y-2.5 text-xs font-medium text-slate-600">
                <div className="flex justify-between">
                  <span>Cart Subtotal</span>
                  <span>Rs. {cartSubtotal.toLocaleString()}</span>
                </div>
                
                {isPromoApplied && (
                  <div className="flex justify-between text-emerald-600 font-bold">
                    <span>10% Coupon Deduction</span>
                    <span>-Rs. {discountAmount.toLocaleString()}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Shipping Dispatches Fee</span>
                  <span>{shippingFee === 0 ? 'FREE' : `Rs. ${shippingFee}`}</span>
                </div>

                {shippingFee > 0 && (
                  <div className="text-[10px] bg-brand-coral-light/50 border border-brand-coral/10 p-2.5 rounded-lg text-brand-navy-900 font-semibold leading-relaxed">
                    Spend <span className="font-bold underline text-brand-coral">Rs. {(5000 - cartSubtotal).toLocaleString()}</span> more to secure <span className="font-bold uppercase text-brand-coral">FREE Shipping</span> nationwide!
                  </div>
                )}

                <hr className="border-slate-100" />

                <div className="flex justify-between text-sm font-black text-brand-navy-900">
                  <span>Payable Summary</span>
                  <span className="font-serif text-base text-brand-coral">Rs. {totalAmount.toLocaleString()}</span>
                </div>
              </div>

              <button
                onClick={onProceedToCheckout}
                className="w-full bg-brand-coral hover:bg-brand-coral-hover text-white py-3.5 rounded-xl text-xs font-bold tracking-widest uppercase transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center gap-1.5 text-[9px] text-slate-400 font-bold uppercase tracking-widest py-1 select-none">
                <ShieldCheck className="w-4 h-4 text-brand-coral" />
                <span>Certified encrypted order procedures</span>
              </div>
            </div>

          </div>

        </div>
      )}
    </div>
  );
}
