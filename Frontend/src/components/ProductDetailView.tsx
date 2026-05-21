import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Star, ShoppingCart, Heart, Plus, Minus, ArrowLeft, Send, CheckCircle2, ShieldCheck, HelpCircle, Sparkles } from 'lucide-react';
import { Product, CartItem, User, Review } from '../types';
import { api } from '../lib/api';

interface ProductDetailViewProps {
  product: Product;
  user: User | null;
  onAddToCart: (product: Product, size: CartItem['size']) => void;
  onBuyNow: (product: Product, size: CartItem['size'], qty: number) => void;
  onBack: () => void;
  onNotify: (msg: string, type: 'success' | 'error' | 'info') => void;
  onAddToWishlist: (product: Product) => void;
  onRemoveFromWishlist: (product: Product) => void;
  isInWishlist: boolean;
  onAddToCompare: (product: Product) => void;
  isInCompare: boolean;
}

export default function ProductDetailView({
  product: initialProduct,
  user,
  onAddToCart,
  onBuyNow,
  onBack,
  onNotify,
  onAddToWishlist,
  onRemoveFromWishlist,
  isInWishlist,
  onAddToCompare,
  isInCompare
}: ProductDetailViewProps) {
  const [product, setProduct] = useState(initialProduct);
  const [selectedImage, setSelectedImage] = useState<string>(initialProduct.image);
  const [activeTab, setActiveTab] = useState<'desc' | 'specs' | 'reviews'>('desc');
  const [selectedSize, setSelectedSize] = useState<CartItem['size']>(
    initialProduct.category === 'water-dispenser' ? 'Default' : 'M'
  );
  const [quantity, setQuantity] = useState(1);
  const [isSavedForLater, setIsSavedForLater] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [newRating, setNewRating] = useState(5);
  const [localReviews, setLocalReviews] = useState<Review[]>(initialProduct.reviews || []);

  useEffect(() => {
    setProduct(initialProduct);
    setSelectedImage(initialProduct.image);
    setLocalReviews(initialProduct.reviews || []);
    api.getProduct(initialProduct.id).then((p) => {
      setProduct(p);
      setLocalReviews(p.reviews || []);
    }).catch(() => {});
  }, [initialProduct.id]);

  const sizeOptions: CartItem['size'][] = product.category === 'water-dispenser' 
    ? ['Default'] 
    : ['S', 'M', 'L', 'XL'];

  const discountAmount = product.originalPrice ? product.originalPrice - product.price : 0;

  // Static product specifications based on category
  const specifications = useMemo(() => {
    if (product.category === 'mobiles' || product.category === 'laptops') {
      return [
        { label: 'Brand & Model', value: `${product.brand} flagship` },
        { label: 'Processor / Core', value: product.category === 'laptops' ? 'M3 Neural Engine' : 'Octa-Core premium' },
        { label: 'Primary Network', value: 'PTA-Approved High Speed Dual LTE / 5G' },
        { label: 'Packaged Box Contains', value: '1 Device, 1 Supercharging cable, user guide leaflets' },
        { label: 'Warranty Terms', value: '1 Year official manufacturer warranty' }
      ];
    } else {
      return [
        { label: 'Compressor Warranty', value: '10 Years Official Brand Compressor Shield' },
        { label: 'Cooling Retention', value: 'Up to 30 Hours during extensive load shedding' },
        { label: 'Inverter Technology', value: 'Latest G-10 / Twin-Rotary Variable Inverter' },
        { label: 'Operational Voltage', value: 'Low Voltage Startup guaranteed down to 135V' },
        { label: 'Condenser Coil Type', value: '100% Pure Inner-Grooved Copper Condenser' }
      ];
    }
  }, [product]);

  // Submit dynamic review handler
  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      onNotify('Please sign in to write an honest review.', 'error');
      return;
    }
    if (!newComment.trim()) {
      onNotify('Write a comment before submitting!', 'error');
      return;
    }

    try {
      const { product: updated } = await api.addReview(product.id, {
        comment: newComment,
        rating: newRating,
        city: localStorage.getItem('fringe_shipping_city') || 'Pakistan',
      });
      setProduct(updated);
      setLocalReviews(updated.reviews || []);
      setNewComment('');
      onNotify('Your review was submitted successfully!', 'success');
    } catch (err) {
      onNotify(err instanceof Error ? err.message : 'Review submission failed', 'error');
    }
  };

  const handleQtyChange = (delta: number) => {
    const limit = product.stock || 20;
    const nextVal = quantity + delta;
    if (nextVal > 0 && nextVal <= limit) {
      setQuantity(nextVal);
    } else if (nextVal > limit) {
      onNotify(`Apologies! Maximum stock is limited to ${limit} units.`, 'info');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-brand-navy-900" id="product-detail-layout">
      {/* Back button */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-brand-coral transition-colors mb-6 cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>BACK TO CATALOG</span>
      </button>

      {/* Main product card sections */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 bg-white border border-slate-100 rounded-3xl p-6 md:p-8 shadow-xs">
        
        {/* LEFT COLUMN: Gallery */}
        <div className="lg:col-span-6 space-y-4">
          <div className="relative aspect-[4/5] bg-slate-50 border border-slate-100 rounded-2xl overflow-hidden shadow-2xs">
            <img
              src={selectedImage}
              alt={product.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover transition-all"
              onError={(e) => {
                e.currentTarget.src = product.image;
              }}
            />
            {product.discountPercentage && (
              <span className="absolute top-4 left-4 bg-brand-coral text-white text-xs font-bold px-3 py-1 rounded-lg uppercase tracking-wider shadow-xs z-10">
                {product.discountPercentage}% OFF
              </span>
            )}
          </div>

          {/* Thumbnail strip list below main image */}
          {product.images && product.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto py-1">
              {product.images.map((imgUrl, i) => (
                <button
                  key={imgUrl + i}
                  onClick={() => setSelectedImage(imgUrl)}
                  className={`w-16 h-20 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${
                    selectedImage === imgUrl ? 'border-brand-coral ring-2 ring-brand-coral/10' : 'border-slate-100'
                  }`}
                  aria-label={`View thumbnail ${i + 1}`}
                >
                  <img
                    src={imgUrl}
                    alt={`${product.name} thumbnail`}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: Metadata and Purchase */}
        <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            
            {/* Seller profile information strip */}
            <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-widest pb-1">
              <span>BRAND: {product.brand || 'Official Brand'}</span>
              <span className="text-brand-coral bg-brand-coral/5 px-2.5 py-1 rounded-full text-[10px] border border-brand-coral-light/20">
                {product.sellerType === 'official' ? 'Official Mall Partner' : 'Individual Seller'}
              </span>
            </div>

            {/* Title */}
            <h1 className="font-display font-bold text-xl sm:text-2xl text-brand-navy-900 leading-tight">
              {product.name}
            </h1>

            {/* Star experience and reviews count */}
            <div className="flex items-center gap-3">
              <div className="flex items-center text-amber-400">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${i < Math.round(product.rating) ? 'fill-current' : 'text-slate-200'}`}
                  />
                ))}
              </div>
              <span className="text-sm font-bold text-slate-700">{product.rating} / 5.0</span>
              <span className="text-slate-300">|</span>
              <span className="text-xs font-semibold text-slate-500 underline decoration-dotted cursor-pointer hover:text-brand-coral" onClick={() => { setActiveTab('reviews'); }}>
                {localReviews.length} Honest Reviews
              </span>
            </div>

            <hr className="border-slate-100" />

            {/* Price section containing discounts */}
            <div className="bg-slate-50 rounded-2xl p-4 flex justify-between items-center">
              <div>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider select-none">Actual price at fridge.pk</p>
                <div className="flex items-baseline gap-2.5 mt-1 font-serif">
                  <span className="text-2xl font-black text-brand-coral">
                    Rs. {product.price.toLocaleString()}
                  </span>
                  {product.originalPrice && (
                    <span className="text-sm text-slate-400 line-through">
                      Rs. {product.originalPrice.toLocaleString()}
                    </span>
                  )}
                </div>
              </div>
              {product.originalPrice && (
                <div className="text-right">
                  <span className="bg-brand-coral text-white text-[11px] font-bold px-2.5 py-1 rounded-lg uppercase tracking-wider shadow-3xs inline-block">
                    Save Rs. {discountAmount.toLocaleString()}
                  </span>
                </div>
              )}
            </div>

            {/* Sizing selection selector box */}
            <div className="space-y-2.5">
              <div className="flex justify-between items-center text-xs font-bold text-slate-500 uppercase">
                <span>Select Cooling Capacity:</span>
                <span className="text-brand-coral font-medium uppercase font-sans">Capacity Guide</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {sizeOptions.map(sz => {
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
                  return (
                    <button
                      key={sz}
                      onClick={() => setSelectedSize(sz)}
                      className={`px-4 h-10 rounded-xl font-bold text-xs border uppercase cursor-pointer select-none transition-all ${
                        selectedSize === sz
                          ? 'border-brand-navy-900 bg-brand-navy-900 text-white'
                          : 'border-slate-200 bg-white text-brand-navy-800 hover:bg-slate-100'
                      }`}
                    >
                      {translateCapacity(sz, product.category)}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Stock meter level warning alerts */}
            <div className="space-y-1">
              <span className="text-xs font-bold text-slate-500 uppercase">Quantity order limits:</span>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 bg-slate-100 border border-slate-200 rounded-xl h-10 px-2.5">
                  <button
                    onClick={() => handleQtyChange(-1)}
                    className="p-1 text-slate-600 hover:text-brand-coral transition-colors cursor-pointer"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-8 text-center text-sm font-bold text-brand-navy-900 leading-none">{quantity}</span>
                  <button
                    onClick={() => handleQtyChange(1)}
                    className="p-1 text-slate-600 hover:text-brand-coral transition-colors cursor-pointer"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="text-xs font-semibold text-slate-500">
                  {product.inStock ? (
                    <span className="text-emerald-600 font-bold uppercase tracking-wider flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{product.stock || 24} Units Left In Stock</span>
                    </span>
                  ) : (
                    <span className="text-rose-600 font-bold uppercase tracking-wider">Out of Stock currently</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* CTA Add to buttons */}
          <div className="space-y-3 pt-4">
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Buy Now button (corals) */}
              <button
                onClick={() => onBuyNow(product, selectedSize, quantity)}
                disabled={!product.inStock}
                className={`flex-1 py-3.5 rounded-xl font-serif text-sm font-bold uppercase tracking-widest transition-all shadow-sm shadow-brand-coral/20 hover:shadow-md cursor-pointer ${
                  product.inStock 
                    ? 'bg-brand-coral hover:bg-brand-coral-hover text-white' 
                    : 'bg-slate-300 text-slate-500 cursor-not-allowed'
                }`}
              >
                Buy Now
              </button>

              {/* Add to Cart button (outline) */}
              <button
                onClick={() => {
                  for (let i = 0; i < quantity; i++) {
                    onAddToCart(product, selectedSize);
                  }
                }}
                disabled={!product.inStock}
                className="flex-1 py-3.5 border-2 border-brand-navy-900 bg-white hover:bg-slate-50 text-brand-navy-900 rounded-xl font-sans text-xs font-bold tracking-widest uppercase transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <ShoppingCart className="w-4 h-4" />
                <span>Add to Cart</span>
              </button>

              {/* Wishlist toggle button */}
              <button
                onClick={() => {
                  if (isInWishlist) {
                    onRemoveFromWishlist(product);
                    onNotify(`Removed "${product.name}" from your wishlist.`, 'info');
                  } else {
                    onAddToWishlist(product);
                  }
                }}
                className={`p-3.5 border rounded-xl transition-colors shrink-0 cursor-pointer ${
                  isInWishlist ? 'bg-rose-50 text-brand-coral border-rose-200' : 'bg-white text-slate-400 border-slate-200 hover:text-brand-coral'
                }`}
                title={isInWishlist ? "Remove from Wishlist" : "Save to Wishlist"}
              >
                <Heart className={`w-5 h-5 ${isInWishlist ? 'fill-current' : ''}`} />
              </button>

              {/* Add to Compare toggle button */}
              <button
                onClick={() => {
                  onAddToCompare(product);
                }}
                className={`p-3.5 border rounded-xl transition-colors shrink-0 cursor-pointer ${
                  isInCompare ? 'bg-blue-50 text-blue-600 border-blue-200' : 'bg-white text-slate-400 border-slate-200 hover:text-blue-600'
                }`}
                title="Compare with other products"
              >
                <Sparkles className={`w-5 h-5 ${isInCompare ? 'fill-current' : ''}`} />
              </button>
            </div>

            <div className="flex items-center justify-center gap-1.5 text-[10px] text-slate-400 font-bold uppercase tracking-widest">
              <ShieldCheck className="w-4 h-4 text-brand-coral" />
              <span>PTA compliant electronic dispatches & premium luxury fabrics</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs description below */}
      <div className="mt-12 bg-white border border-slate-100 rounded-3xl p-6 md:p-8 shadow-3xs" id="product-detail-reviews-tabs">
        <div className="flex border-b border-slate-100">
          <button
            onClick={() => setActiveTab('desc')}
            className={`px-5 py-3.5 font-bold text-xs uppercase tracking-wider relative cursor-pointer ${
              activeTab === 'desc' ? 'text-brand-coral' : 'text-slate-400 hover:text-brand-navy-900'
            }`}
          >
            <span>Product Description</span>
            {activeTab === 'desc' && (
              <motion.div layoutId="detail-tab-bar" className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-coral" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('specs')}
            className={`px-5 py-3.5 font-bold text-xs uppercase tracking-wider relative cursor-pointer ${
              activeTab === 'specs' ? 'text-brand-coral' : 'text-slate-400 hover:text-brand-navy-900'
            }`}
          >
            <span>Specifications</span>
            {activeTab === 'specs' && (
              <motion.div layoutId="detail-tab-bar" className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-coral" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`px-5 py-3.5 font-bold text-xs uppercase tracking-wider relative cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'reviews' ? 'text-brand-coral' : 'text-slate-400 hover:text-brand-navy-900'
            }`}
          >
            <span>Customer Reviews ({localReviews.length})</span>
            {activeTab === 'reviews' && (
              <motion.div layoutId="detail-tab-bar" className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-coral" />
            )}
          </button>
        </div>

        {/* Tab content rendered with animation */}
        <div className="py-6 min-h-[220px]">
          <AnimatePresence mode="wait">
            {activeTab === 'desc' && (
              <motion.div
                key="desc-content"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="space-y-4 text-slate-600 leading-relaxed text-sm max-w-3xl"
              >
                <p>{product.description}</p>
                <p>
                  Built to ensure optimum longevity under rigorous daily use. fridge.pk and its network of certified partners process dispatches nationwide in 2-4 working days (via TCS or Leopard Courier). All packages are sealed at dispatch terminals for secure shipment.
                </p>
              </motion.div>
            )}

            {activeTab === 'specs' && (
              <motion.div
                key="specs-content"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="max-w-2xl border border-slate-100 rounded-2xl overflow-hidden divide-y divide-slate-100"
              >
                {specifications.map((spec, i) => (
                  <div key={i} className="grid grid-cols-3 p-4 text-xs">
                    <span className="font-bold text-slate-500 uppercase tracking-widest shrink-0 col-span-1">{spec.label}</span>
                    <span className="font-semibold text-brand-navy-900 col-span-2">{spec.value}</span>
                  </div>
                ))}
              </motion.div>
            )}

            {activeTab === 'reviews' && (
              <motion.div
                key="reviews-content"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
              >
                {/* Left side: Review List */}
                <div className="lg:col-span-7 space-y-4">
                  {localReviews.length === 0 ? (
                    <div className="py-8 text-center text-slate-400 text-xs font-semibold">
                      Be the first to leave an honest review for this item!
                    </div>
                  ) : (
                    localReviews.map((rev) => (
                      <div key={rev.id} className="bg-slate-50 border border-slate-100/60 rounded-2xl p-5 space-y-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="text-xs font-bold text-brand-navy-900">{rev.user}</h4>
                            <span className="text-[10px] text-slate-400 font-medium">Verified buyer, {rev.city} • {rev.date}</span>
                          </div>
                          <div className="flex text-amber-400">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star key={i} className={`w-3 h-3 ${i < rev.rating ? 'fill-current' : 'text-slate-200'}`} />
                            ))}
                          </div>
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed font-medium">"{rev.comment}"</p>
                      </div>
                    ))
                  )}
                </div>

                {/* Right side: Leave review form */}
                <div className="lg:col-span-5 bg-slate-50/50 border border-slate-150 rounded-2xl p-5 space-y-4">
                  <h3 className="text-xs font-bold text-brand-navy-900 uppercase tracking-widest">Share Your Experience</h3>
                  
                  {user ? (
                    <form onSubmit={handleReviewSubmit} className="space-y-4">
                      {/* Interactive Rating selector */}
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Star Rating Value:</label>
                        <div className="flex gap-1.5 text-amber-400">
                          {[1, 2, 3, 4, 5].map(st => (
                            <button
                              key={st}
                              type="button"
                              onClick={() => setNewRating(st)}
                              className="p-1 hover:scale-110 transition-transform"
                            >
                              <Star className={`w-5 h-5 ${st <= newRating ? 'fill-current' : 'text-slate-200'}`} />
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Comment text area */}
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Your Review Detail:</label>
                        <textarea
                          rows={3}
                          required
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                          placeholder="What did you like or dislike? How was the fit or device quality?"
                          className="w-full text-xs bg-white border border-slate-200 rounded-xl p-3 focus:outline-none focus:ring-1 focus:ring-brand-coral text-brand-navy-900 placeholder:text-slate-400"
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full py-2.5 bg-brand-navy-900 hover:bg-brand-coral text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Submit Public Review</span>
                      </button>
                    </form>
                  ) : (
                    <div className="text-center py-6 space-y-3">
                      <HelpCircle className="w-8 h-8 text-slate-300 mx-auto" />
                      <p className="text-xs text-slate-500 leading-normal font-semibold max-w-[240px] mx-auto">
                        Only signed-in fridge.pk members can write reviews.
                      </p>
                      <button
                        type="button"
                        onClick={onBack} // Send back or suggest signing in on navbar
                        className="text-[10px] bg-white text-brand-navy-900 font-bold hover:text-brand-coral border border-slate-200 px-4 py-2 rounded-lg inline-block transition-colors"
                      >
                        Browse more product details
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
