import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Star, ShoppingCart, Info, Eye } from 'lucide-react';
import { Product, CartItem } from '../types';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product, size: CartItem['size']) => void;
  onQuickView: (product: Product) => void;
  key?: any;
}

export default function ProductCard({ product, onAddToCart, onQuickView }: ProductCardProps) {
  const [selectedSize, setSelectedSize] = useState<CartItem['size']>('M');
  const [isHovered, setIsHovered] = useState(false);

  // Available sizes based on category
  const sizes: CartItem['size'][] = product.category === 'water-dispenser' 
    ? ['Default'] 
    : ['S', 'M', 'L', 'XL'];

  // Helper to translate apparel sizes to appliance capacities
  const translateCapacity = (sz: string, cat: string) => {
    if (sz === 'Unstitched') return 'Eco-Inverter';
    if (sz === 'Default') return 'Standard';
    if (cat === 'air-conditioner') {
      if (sz === 'S') return '1.0 Ton';
      if (sz === 'M') return '1.5 Ton';
      if (sz === 'L') return '2.0 Ton';
      if (sz === 'XL') return '2.5 Ton';
    } else {
      if (sz === 'S') return '12 cu.ft';
      if (sz === 'M') return '15 cu.ft';
      if (sz === 'L') return '18 cu.ft';
      if (sz === 'XL') return '22 cu.ft';
    }
    return sz;
  };

  const handleAddClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!product.inStock) return;
    onAddToCart(product, selectedSize);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.35 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col h-full group"
      id={`product-card-${product.id}`}
    >
      {/* Product Image Stage */}
      <div className="relative aspect-[3/4] bg-slate-50 overflow-hidden shrink-0">
        <img
          src={product.image}
          alt={product.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          onError={(e) => {
            // Fallback image in case Unsplash fails
            e.currentTarget.src = 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=600';
          }}
        />

        {/* Dynamic Coral Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {product.isNew && (
            <span className="bg-brand-coral text-white text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-full shadow-xs">
              New Drop
            </span>
          )}
          {product.isTrending && (
            <span className="bg-brand-navy-900 text-white text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-full shadow-xs">
              Trending
            </span>
          )}
          {!product.inStock && (
            <span className="bg-slate-500 text-white text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-full shadow-xs">
              Sold Out
            </span>
          )}
        </div>

        {/* Quick actions overlay */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/10 backdrop-blur-[1px] flex items-center justify-center gap-2"
            >
              <button
                onClick={() => onQuickView(product)}
                className="p-3 bg-white hover:bg-brand-coral hover:text-white text-brand-navy-900 rounded-full shadow-lg transition-colors cursor-pointer"
                title="Quick View"
              >
                <Eye className="w-4.5 h-4.5" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Product Info */}
      <div className="p-4 flex-grow flex flex-col justify-between">
        <div className="space-y-1.5">
          {/* Category Tag */}
          <span className="text-[10px] font-bold text-brand-coral tracking-widest uppercase block">
            {product.category}
          </span>

          {/* Product Title */}
          <h3 className="text-sm font-semibold text-brand-navy-800 tracking-tight line-clamp-1 group-hover:text-brand-coral transition-colors">
            {product.name}
          </h3>

          {/* Star review tracker */}
          <div className="flex items-center gap-1">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-3 h-3 ${
                    i < Math.floor(product.rating) ? 'text-amber-400 fill-amber-400' : 'text-slate-200'
                  }`}
                />
              ))}
            </div>
            <span className="text-[10px] font-medium text-slate-400">({product.reviewsCount})</span>
          </div>

          {/* Product description brief */}
          <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Pricing, Sizes & Action Drawer */}
        <div className="mt-4 pt-3 border-t border-slate-50 space-y-3">
          <div className="flex items-baseline justify-between">
            <span className="text-xs text-slate-400 font-medium">Price</span>
            <span className="text-base font-bold text-brand-navy-900 font-serif">
              Rs. {product.price.toLocaleString()}
            </span>
          </div>

          {/* Select Sizes Row - ONLY show if product is inStock */}
          {product.inStock && (
            <div className="space-y-1">
              <span className="text-[10px] text-slate-400 font-medium block">Select Variant / Capacity</span>
              <div className="flex gap-1.5 flex-wrap">
                {sizes.map((sz) => (
                  <button
                    key={sz}
                    onClick={() => setSelectedSize(sz)}
                    className={`text-[9px] font-bold h-6 px-2 rounded border flex items-center justify-center transition-all ${
                      selectedSize === sz
                        ? 'border-brand-coral bg-brand-coral-light text-brand-coral font-black'
                        : 'border-slate-200 text-slate-600 hover:border-slate-400 bg-white'
                    }`}
                  >
                    {translateCapacity(sz, product.category)}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* CTA Add to Bag button */}
          <button
            onClick={handleAddClick}
            disabled={!product.inStock}
            className={`w-full py-2 rounded-xl text-xs font-bold tracking-wider uppercase transition-all flex items-center justify-center gap-2 cursor-pointer ${
              product.inStock
                ? 'bg-brand-navy-900 text-white hover:bg-brand-coral hover:shadow-xs'
                : 'bg-slate-100 text-slate-400 cursor-not-allowed'
            }`}
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            <span>{product.inStock ? 'Add to Bag' : 'Sold Out'}</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
}
