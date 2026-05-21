import React from 'react';
import { motion } from 'motion/react';
import { Heart, Trash2, ShoppingCart, ArrowRight, ShieldCheck } from 'lucide-react';
import { Product } from '../types';

interface WishlistViewProps {
  wishlist: Product[];
  onRemoveFromWishlist: (product: Product) => void;
  onAddToCart: (product: Product, size: 'S' | 'M' | 'L' | 'XL' | 'Unstitched' | 'Default') => void;
  setView: (view: any) => void;
  onNotify: (msg: string, type: 'success' | 'error' | 'info') => void;
}

export default function WishlistView({
  wishlist,
  onRemoveFromWishlist,
  onAddToCart,
  setView,
  onNotify
}: WishlistViewProps) {
  
  const handleMoveToCart = (product: Product) => {
    // default size
    onAddToCart(product, 'M');
    onRemoveFromWishlist(product);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-brand-navy-900" id="wishlist-page">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-brand-navy-900 text-white flex items-center justify-center">
          <Heart className="w-5 h-5 text-brand-coral fill-brand-coral" />
        </div>
        <div>
          <h1 className="font-display font-black text-xl sm:text-2xl text-brand-navy-900">My Wishlist</h1>
          <p className="text-xs text-slate-500 font-medium">Your personalized collection of premium cooling devices</p>
        </div>
      </div>

      {wishlist.length === 0 ? (
        <div className="text-center py-16 bg-white border border-slate-100 rounded-3xl p-8 shadow-xs max-w-2xl mx-auto space-y-4">
          <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center mx-auto text-brand-coral">
            <Heart className="w-8 h-8" />
          </div>
          <h2 className="text-lg font-black text-brand-navy-900">Your Wishlist is Empty</h2>
          <p className="text-sm text-slate-500 leading-relaxed max-w-md mx-auto">
            Discover our premium smart inverter refrigerators, copper-core chest freezers, and luxury split AC lines, and save your absolute favorites here.
          </p>
          <button
            onClick={() => setView('products')}
            className="px-6 py-2.5 bg-brand-navy-900 hover:bg-brand-coral text-white font-bold text-xs rounded-xl uppercase tracking-wider transition-all cursor-pointer inline-flex items-center gap-2"
          >
            <span>Explore Collection</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {wishlist.map((product) => (
            <motion.div
              layout
              key={product.id}
              className="bg-white rounded-2xl border border-slate-150/80 overflow-hidden shadow-xs hover:shadow-md transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="relative aspect-[3/4] bg-slate-50 overflow-hidden border-b border-slate-100">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=600';
                    }}
                  />
                  
                  {/* Category Tag */}
                  <span className="absolute top-3 left-3 bg-brand-navy-900/90 text-white text-[9px] font-black uppercase tracking-wider px-2 py-1 rounded">
                    {product.category}
                  </span>

                  {/* Remove Button Overlay */}
                  <button
                    onClick={() => {
                      onRemoveFromWishlist(product);
                      onNotify(`Removed "${product.name}" from your wishlist.`, 'info');
                    }}
                    className="absolute top-3 right-3 p-1.5 bg-white/90 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-full cursor-pointer shadow-xs transition-colors"
                    title="Remove from wishlist"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="p-4 space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    <span>{product.brand || 'fridge.pk'}</span>
                    <span className={product.inStock ? 'text-emerald-600' : 'text-rose-500'}>
                      {product.inStock ? 'In Stock' : 'Out of Stock'}
                    </span>
                  </div>

                  <h3 className="font-display font-bold text-sm text-brand-navy-950 group-hover:text-brand-coral transition-colors line-clamp-1">
                    {product.name}
                  </h3>

                  <div className="flex items-baseline gap-1 py-1">
                    <span className="text-base font-black text-brand-navy-900 font-serif">
                      Rs. {product.price.toLocaleString()}
                    </span>
                    {product.originalPrice && (
                      <span className="text-xs text-slate-400 line-through font-serif">
                        Rs. {product.originalPrice.toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="p-4 pt-0">
                <button
                  onClick={() => handleMoveToCart(product)}
                  disabled={!product.inStock}
                  className="w-full bg-brand-navy-900 hover:bg-brand-coral disabled:bg-slate-200 text-white py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors duration-200 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>Move to Bag</span>
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
