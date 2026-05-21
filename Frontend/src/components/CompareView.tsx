import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, Trash2, ShoppingCart, ArrowRight, Star, Check, X } from 'lucide-react';
import { Product } from '../types';

interface CompareViewProps {
  compareProducts: Product[];
  onRemoveFromCompare: (product: Product) => void;
  onAddToCart: (product: Product, size: 'S' | 'M' | 'L' | 'XL' | 'Unstitched' | 'Default') => void;
  setView: (view: any) => void;
}

export default function CompareView({
  compareProducts,
  onRemoveFromCompare,
  onAddToCart,
  setView
}: CompareViewProps) {
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-brand-navy-900" id="comparison-page">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-brand-navy-900 text-white flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-brand-coral pulse-glow" />
        </div>
        <div>
          <h1 className="font-display font-black text-xl sm:text-2xl text-brand-navy-900">Product Comparison</h1>
          <p className="text-xs text-slate-500 font-medium">Compare premium inverter models, capacities, and cooling specifications</p>
        </div>
      </div>

      {compareProducts.length === 0 ? (
        <div className="text-center py-16 bg-white border border-slate-100 rounded-3xl p-8 shadow-xs max-w-2xl mx-auto space-y-4">
          <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto text-blue-600">
            <Sparkles className="w-8 h-8" />
          </div>
          <h2 className="text-lg font-black text-brand-navy-900">Comparison Table is Empty</h2>
          <p className="text-sm text-slate-500 leading-relaxed max-w-md mx-auto">
            You can add products to compare directly from the Products Directory page to analyze pricing, material ratings, and styling differences.
          </p>
          <button
            onClick={() => setView('products')}
            className="px-6 py-2.5 bg-brand-navy-900 hover:bg-brand-coral text-white font-bold text-xs rounded-xl uppercase tracking-wider transition-all cursor-pointer inline-flex items-center gap-2"
          >
            <span>Browse Products</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-150/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50">
                  <th className="p-5 font-bold text-sm text-slate-500 uppercase tracking-widest w-64 border-r border-slate-100">Specification</th>
                  {compareProducts.map((product) => (
                    <th key={product.id} className="p-5 min-w-[240px] text-center border-r border-slate-100 last:border-r-0 relative group">
                      <button
                        onClick={() => onRemoveFromCompare(product)}
                        className="absolute top-4 right-4 p-1 rounded-full bg-slate-100 hover:bg-rose-100 text-slate-500 hover:text-rose-600 transition-colors cursor-pointer"
                        title="Remove from comparison"
                      >
                        <X className="w-4 h-4" />
                      </button>
                      <div className="flex flex-col items-center">
                        <div className="w-24 h-32 rounded-xl overflow-hidden border bg-white mb-3">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                            onError={(e) => {
                              e.currentTarget.src = 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=600';
                            }}
                          />
                        </div>
                        <h3 className="font-display font-black text-sm text-brand-navy-950 text-center line-clamp-2 px-2 max-w-[200px]">
                          {product.name}
                        </h3>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">
                          {product.category}
                        </p>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                
                {/* Sale Price Column */}
                <tr>
                  <td className="p-5 font-bold text-slate-600 text-xs uppercase tracking-wider border-r border-slate-100 bg-slate-50/20">Price</td>
                  {compareProducts.map((product) => (
                    <td key={product.id} className="p-5 text-center font-serif text-lg font-black text-brand-coral border-r border-slate-100 last:border-r-0">
                      Rs. {product.price.toLocaleString()}
                      {product.originalPrice && (
                        <div className="text-[11px] text-slate-400 line-through font-sans font-medium mt-0.5">
                          Rs. {product.originalPrice.toLocaleString()}
                        </div>
                      )}
                    </td>
                  ))}
                </tr>

                {/* Material Catalog / Brand Row */}
                <tr>
                  <td className="p-5 font-bold text-slate-600 text-xs uppercase tracking-wider border-r border-slate-100 bg-slate-50/20">Collection Brand</td>
                  {compareProducts.map((product) => (
                    <td key={product.id} className="p-5 text-center text-xs font-bold text-slate-500 uppercase tracking-widest border-r border-slate-100 last:border-r-0">
                      {product.brand || 'Official Brand'}
                    </td>
                  ))}
                </tr>

                {/* Rating specs */}
                <tr>
                  <td className="p-5 font-bold text-slate-600 text-xs uppercase tracking-wider border-r border-slate-100 bg-slate-50/20">Rating Average</td>
                  {compareProducts.map((product) => (
                    <td key={product.id} className="p-5 text-center border-r border-slate-100 last:border-r-0">
                      <div className="flex items-center justify-center gap-1">
                        <span className="text-xs font-bold text-slate-700">{product.rating || '4.8'}</span>
                        <div className="flex text-amber-400">
                          <Star className="w-4.5 h-4.5 fill-amber-400 text-amber-400" />
                        </div>
                        <span className="text-[11px] text-slate-400">({product.reviewsCount || 10})</span>
                      </div>
                    </td>
                  ))}
                </tr>

                {/* In Stock column */}
                <tr>
                  <td className="p-5 font-bold text-slate-600 text-xs uppercase tracking-wider border-r border-slate-100 bg-slate-50/20">Inventory Status</td>
                  {compareProducts.map((product) => (
                    <td key={product.id} className="p-5 text-center border-r border-slate-100 last:border-r-0">
                      {product.inStock ? (
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 text-emerald-700 text-[10px] font-bold uppercase rounded-full">
                          <Check className="w-3 h-3" />
                          <span>Ready dispatch</span>
                        </div>
                      ) : (
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-rose-50 text-rose-600 text-[10px] font-bold uppercase rounded-full">
                          <X className="w-3 h-3" />
                          <span>Restocking</span>
                        </div>
                      )}
                    </td>
                  ))}
                </tr>

                {/* Product snapshot descriptive */}
                <tr>
                  <td className="p-5 font-bold text-slate-600 text-xs uppercase tracking-wider border-r border-slate-100 bg-slate-50/20">Description Details</td>
                  {compareProducts.map((product) => (
                    <td key={product.id} className="p-5 text-xs text-slate-500 leading-relaxed border-r border-slate-100 last:border-r-0 max-w-[280px]">
                      <p className="line-clamp-4">{product.description}</p>
                    </td>
                  ))}
                </tr>

                {/* Available Capacities Row */}
                <tr>
                  <td className="p-5 font-bold text-slate-600 text-xs uppercase tracking-wider border-r border-slate-100 bg-slate-50/20">Capacities Available</td>
                  {compareProducts.map((product) => {
                    const sizes = product.category === 'air-conditioner' 
                      ? ['1.0 Ton', '1.5 Ton', '2.0 Ton', '2.5 Ton']
                      : ['12 cu.ft', '15 cu.ft', '18 cu.ft', '22 cu.ft'];
                    return (
                      <td key={product.id} className="p-5 text-center border-r border-slate-100 last:border-r-0">
                        <div className="flex flex-wrap justify-center gap-1">
                          {sizes.map((sz) => (
                            <span key={sz} className="text-[9px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-bold uppercase">
                              {sz}
                            </span>
                          ))}
                        </div>
                      </td>
                    );
                  })}
                </tr>

                {/* Action disptach button */}
                <tr>
                  <td className="p-5 font-bold text-slate-600 text-xs uppercase tracking-wider border-r border-slate-100 bg-slate-50/20">Direct Action</td>
                  {compareProducts.map((product) => (
                    <td key={product.id} className="p-5 text-center border-r border-slate-100 last:border-r-0">
                      <button
                        onClick={() => onAddToCart(product, 'M')}
                        disabled={!product.inStock}
                        className="w-full bg-brand-navy-900 hover:bg-brand-coral disabled:bg-slate-200 text-white py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors inline-flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <ShoppingCart className="w-3.5 h-3.5" />
                        <span>Add To Bag</span>
                      </button>
                    </td>
                  ))}
                </tr>

              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
